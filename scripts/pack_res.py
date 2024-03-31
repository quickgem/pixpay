#!/usr/bin/python3

################################################################################
#
#   Resource Packaging Tool
#
#   Usage
#    1. Update resources: python .\scripts\update_res.py all
#    2. Run this tool: python .\scripts\pack_res.py
#    3. Find output file: appname.bin
#
#   Requirements (Windows)
#    1. Python >= 3.0 (tested >= 3.8)
#    (REMOVED) 2. MSVC. cl.exe must be on the path.
#    (REMOVED) 3. objcopy.exe, must be on the path.
#
################################################################################

import sys
import os
import platform
import glob
import shutil
import struct
import re
import datetime

if sys.version_info[0] > 2:
   import configparser

# Configure: set resource dir and resource type
RES_DIRS = {
   "data": "data",
   "fonts": "res",
   "images": "res",
   "styles": "data",
   "ui": "data",
   "scripts": "res",    # byte-code mode shoud set to "snap"
   "strings": "data",
   "xml": "data"
}

# Globals
WD = "res/assets/default/inc/"
OUT = "out/"
TO_TOP = "../../../../" # relative path from wd to top
OUTF = ""               # to be set by load_config().
CFGF = "config.ini"

# Dict holding INI file options
CONFIGS = {}
# Array of dict {'name': xx, 'size': xx, 'asize': xx }
BIN_LIST = []
# Array of dict {'offset': xx, 'size': xx, 'name': xx, 'type': xx}
RES_LIST = []
TOTAL_SIZE = 0
TOTAL_ITEMS = 0

################################################################################
# Generate snapshots from design/default/scripts/*.js
# This must happen before usual resource packing procedure.
def generate_snap():
   print("Generating byte code from .js files...")
   if sys.platform == "win32":
      cmd = "scripts\\snapgen.exe"
   else:
      cmd = "scripts/snapgen"

   js_files = glob.glob("design/default/scripts/*.js")
   for jsf in js_files:
      fnbase, _ = os.path.splitext(os.path.basename(jsf))
      if fnbase.startswith("mod_"):
         os.system(cmd + ' -m ' + jsf + ' ' + WD + 'scripts/' + fnbase + '.snap')
      else:
         os.system(cmd + ' ' + jsf + ' ' + WD + 'scripts/' + fnbase + '.snap')

################################################################################
# Change to work directory; clean & create output directory.
def prepare_dir():
   #print(os.getcwd())
   try:
      os.chdir(WD)
   except Exception:
      print("Error: can't chdir to", WD)
      exit(-1)
   shutil.rmtree(OUT, ignore_errors = True)
   try:
      os.mkdir(OUT)
   except Exception:
      print("Error: can't mkdir", os.getcwd() + '/' + OUT)
      exit(-1)

################################################################################
# Use gcc and objcopy to produce binary files.
# Now obsoleted by direct conversion.
def compile_file(fdir, fname):
   print("Compiling " + fdir + '/' + fname)
   fnbase, _ = os.path.splitext(fname)
   cfn = fdir + '_' + fnbase + '.c'
   cf = open(cfn, "w")
   # Assumes MSVC on win32
   if sys.platform == "win32":
      cf.write("#define TK_CONST_DATA_ALIGN(v) __declspec(align(8)) v\n")
   else:
      cf.write("#define TK_CONST_DATA_ALIGN(v) v __attribute__((aligned(8)))\n")
   cf.write("#include \"" + fdir + "/" + fname + "\"\n")
   cf.close()

   ofn = OUT + fdir + '_' + fnbase + '.o'
   if sys.platform == "cygwin":
      os.system("gcc -Os -c -o " + ofn + ' ' + cfn)
      os.system("objcopy -j .rdata -O binary " + ofn)
   elif sys.platform == "win32":
      os.system("cl /nologo /c /Fo:" + ofn + ' ' + cfn)
      os.system("objcopy -j .rdata -O binary " + ofn)
   else: # linux etc.
      os.system("gcc -Os -c -o " + ofn + ' ' + cfn)
      os.system("objcopy -j .rodata -O binary " + ofn)

   os.remove(cfn)

################################################################################
# Direct conversion, from resource to .o
def compile_file_direct(fdir, fname):
   fsrc_name = fdir + '/' + fname
   fnbase, _ = os.path.splitext(fname)
   fbin_name = OUT + fdir + '_' + fnbase + '.o'
   fsrc = open(fsrc_name, "rt", encoding="utf-8")
   fbin = open(fbin_name, "wb")
   # The first line makes a convenient file identifier
   line = fsrc.readline()
   if not line.strip().startswith("TK_CONST_DATA_ALIGN"):
      print ("Invalid resource file, exit.")
      exit(-1)
   binsize = 0
   # Line by line conversion.
   while True:
      line = fsrc.readline()
      if line == "":
         break
      hex_strs = line.split(",")
      line_bytes = bytearray()
      for hx in hex_strs:
         try:
            line_bytes.append(int(hx, base=16))
         except ValueError:
            # Don't bother with error
            continue
      binsize += len(line_bytes)
      fbin.write(line_bytes)
   fsrc.close()
   fbin.close()
   print("Compiling", fsrc_name, "-->", fbin_name, "(%d bytes)"%binsize)

################################################################################
# Different resource types may have optional data formats. E.g. images may use
# *.res for PNG or *.data for decompressed raw pixel. That's why we have to do
# it per-directory instead of in a single recursion.
def compile_dir(dir, ext):
   #print("Processing ", dir)
   flist = glob.glob(os.path.join(dir, "*."+ ext))
   flist = list(map(lambda x: os.path.basename(x), flist))
   #print(flist)
   for fn in flist:
      compile_file_direct(dir, fn)

################################################################################
def load_config():
   global OUTF
   config = configparser.ConfigParser()
   # This will not raise an exception
   config.read(CFGF)
   # Check required section (name case-sensitive)
   if "JSApp" not in config.sections():
      print("config.ini does not exist or lacks the JSApp section.")
      exit(-1)

   options = config.options("JSApp")
   for opt in options:
      CONFIGS[opt] = config.get("JSApp", opt)

   # Check required options (name case-insensitive).
   for opt in {"appname", "packagename", "versioncode", "versionname", "icon",
      "entry"}:
      if opt not in CONFIGS:
         print("Required option", '"'+opt+'"', "does not exist in INI file.")
         exit(-1)

   # versionCode is converted to binary (u32) upon loading
   try:
      CONFIGS["versioncode"] = int(CONFIGS["versioncode"])
   except ValueError:
      print("versionCode must be a valid integer.")
      exit(-1)

   # isHome is treated as optional and has a numeric value
   if "ishome" not in CONFIGS:
      CONFIGS["ishome"] = 0
   else:
      ishome = int(CONFIGS["ishome"])
      if ishome != 0:
         ishome = 1
      CONFIGS["ishome"] = ishome

   OUTF = CONFIGS["appname"].lower().replace(' ', '_') + '.bin'

   print("Configuration:\n===============")
   for key, val in CONFIGS.items():
      print("  ", key, ":", val)
   print()

'''
   Package File Format

   <I> AppResInfo: 428B
      char[32]    appName        # ini: appName
      u32         fileLen        # full length in bytes
      char[4]     type           # "JS"
      u32         versionCode    # ini: versionCode
      char[16]    entry          # ini: entry
      char[16]    iconName       # ini: icon
      u8          isHome         # ini: ishome (0|1)
      char[15]    reserve
      char[256]   SIG
      char[32]    packageName    # ini: packageName
      char[16]    versionName    # ini: versionName
      char[32]    date           # '2023-09-19'

   <II> ResourceInfo: 4+n*64 bytes
      u32         nitems
      Array of:
         u32      offset
         u32      size           # padded size
         char[32] name
         u16      type
         u8       reserve[24-2]

   <III> ResourceContent:
      All resource contents concatenated together, with each item pre-padded to
      align on 8-byte boundaries.
'''
# XXX check: size of fixed header = size of AppResInfo plus the nitems counter.
HEADER_SIZE = 428 + 4

################################################################################
# Scan all output binaries to collect essential information for output writer.
def stat_binary():
   global TOTAL_SIZE, TOTAL_ITEMS

   # Build list of binary file names and sizes.
   fnames = glob.glob(OUT + "*.o")
   nitems = len(fnames)
   fsizes = list(map(lambda x: os.path.getsize(x), fnames))
   # 8-byte aligned sizes.
   asizes = list(map(lambda x: (x + 7) & (~7), fsizes))
   for i in range(nitems):
      BIN_LIST.append({"name": fnames[i], "size": fsizes[i], "asize": asizes[i]})
   #print(BIN_LIST)

   # Build ResourceInfo list.
   offset = HEADER_SIZE + nitems * 64   # start of first data item
   for i in range(nitems):
      if sys.platform == "win32":
         # On win32, the file name looks like out\\blah.o
         m = re.search(r"\w+\\[a-z]*_(\w+)\.o", BIN_LIST[i]["name"])
      else:
         m = re.search(r"\w+/[a-z]*_(\w+)\.o", BIN_LIST[i]["name"])
      # print(m.group(1))
      # Get the first 2 bytes as type (uint16).
      fout = open(BIN_LIST[i]["name"], "rb")
      fout_hdr = fout.read(2)
      fout_type = struct.unpack("H", fout_hdr)[0]
      fout.close()
      RES_LIST.append({"name": m.group(1), "offset": offset,
         "size": BIN_LIST[i]["asize"], "type": fout_type})
      # print(BIN_LIST[i]["name"], "type:", fout_type)
      offset += BIN_LIST[i]['asize']
   TOTAL_SIZE = offset
   TOTAL_ITEMS = nitems
#   print(RES_LIST)
#   print(offset)

################################################################################
# Append a binary resource item to the output file.
# Output to outf, input path name is from BIN_LIST[i].
def append_item(outf, i):
   itemf = open(BIN_LIST[i]["name"], "rb")
   data = itemf.read()
   outf.write(data)
   # Padding bytes must be added if necessary.
   padding = BIN_LIST[i]["asize"] - BIN_LIST[i]["size"]
   if padding != 0:
      bs = bytes(padding)
      outf.write(bs)
   itemf.close()

################################################################################
# Write output file in one go.
def write_output():
   print("Total size:", TOTAL_SIZE, "bytes.")
   outf = open(TO_TOP + OUTF, "wb")
   # Write APP_RES_INFO
   bs = struct.pack("32sI4sI16s16sB15x256x32s16s32s",
      bytes(CONFIGS["appname"], "UTF-8"),
      TOTAL_SIZE,
      b"JS\x00\x00",
      CONFIGS["versioncode"], # converted to number
      bytes(CONFIGS["entry"], "UTF-8"),
      bytes(CONFIGS["icon"], "UTF-8"),
      CONFIGS["ishome"],      # converted to number
      bytes(CONFIGS["packagename"], "UTF-8"),
      bytes(CONFIGS["versionname"], "UTF-8"),
      bytes(datetime.date.today().strftime("%Y-%m-%d"), "UTF-8")
   )
   outf.write(bs)

   # Write array of ResourceInfo
   bs = struct.pack("I", TOTAL_ITEMS)
   outf.write(bs)
   for i in range(TOTAL_ITEMS):
      bs = struct.pack("II32sH22x", RES_LIST[i]["offset"], RES_LIST[i]["size"],
         bytes(RES_LIST[i]["name"], "UTF-8"), RES_LIST[i]["type"])
      outf.write(bs)

   # Now append all resource contents
   for i in range(TOTAL_ITEMS):
      append_item(outf, i)
   outf.close()
   print("Output done:", os.path.abspath(TO_TOP + OUTF))

################################################################################
# Sign output .bin file
# Expecting winmake/sign.exe exists under top dir.
def sign_output():
   if not os.path.exists('winmake'):
      print("Can not find signing tool.")
      return
   if sys.platform == "win32":
      cmd = ".\\winmake\\sign.exe -s " + OUTF
      print(cmd)
      os.system(cmd)
   elif sys.platform == "cygwin":
      cmd = "./winmake/sign.exe -s " + OUTF
      print(cmd)
      os.system(cmd)
   else:
      print("Signing is not supported on this platform:", sys.platform)

################################################################################
def main():
   if sys.version_info[0] < 3:
      print("Error: this script only supports Python3.")
      exit(-1)

   if HEADER_SIZE % 8 != 0:
      print("Error: file header size is not a multiple of 8.")
      exit(-1)

   load_config()

# Handle the "-b" option: generate SNAP files
   if len(sys.argv) == 2 and sys.argv[1] == '-b':
      RES_DIRS["scripts"] = "snap"
      generate_snap()

   prepare_dir()

   # Following steps run under work directory for convenience.
   for res_dir, res_type in RES_DIRS.items():
      compile_dir(res_dir, res_type)

   stat_binary()
   write_output()

   # Following run under project directory
   os.chdir(TO_TOP)
   sign_output()

if __name__ == "__main__":
   main()

# vim: set syn=python ts=3 et :
