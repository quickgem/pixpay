function close(fd) {
  console.log("FileClose ===============>", fd);
  Tos.FileClose(fd);
}


function GLOBAL_FILE_SAVE(saveData, fileName) {
  //console.log("\n GLOBAL_FILE_SAVE 0000000 =================>", saveData.length, fileName);
  let data = saveData;
  if (!data) return;
  // console.log("\n SAVE 0000000 =================>");
  let ret = Tos.FileAccess(fileName);
//  console.log("\n SAVE 11111111 =================>", JSON.stringify(ret));
  if (ret.code === 0) {
    let fd = Tos.FileOpen(fileName, O_APPEND | O_RDWR);
    //  console.log("\n SAVE 4444444 =================>", JSON.stringify(fd));
    if (fd.code < 0) return false;
    let writeRet = Tos.FileWrite(fd.code, saveData, saveData.length);
    // console.log("\n SAVE 666666 =================>", JSON.stringify(writeRet.code));
    close(fd.code);
    return writeRet.code >= 0;
  }
  let len = data.length;
  //console.log("SAVE 7777777777=============> data:", len);
  let fdRet = Tos.FileOpen(fileName, O_CREAT | O_RDWR);
  // console.log("SAVE 88888888888 =======>", fdRet.code);
  if (fdRet.code < 0) {
    // console.log("SAVE 99999999999 fail========>");
    return false;
  }
  // console.log("SAVE  aaaaaaaaaaaaaa =======>");
  let sret = Tos.FileSeek(fdRet.code, 0, SEEK_SET);
  if (sret.code < 0) {
    close(fdRet.code);
    // console.log("SAVE 99999999999 fail========>");
    return false;
  }
  // console.log("SAVE bbbbbbbbbb =======>", sret.code);
  let writeRet = Tos.FileWrite(fdRet.code, data, data.length);
  // console.log("SAVE ddddddddddddd =======>", writeRet.code);
  if (writeRet.code < 0) {
    //console.log("SAVE eeeeeeeeeeee fail========>", writeRet.code);
    close(fdRet.code);
    return false;
  }
  sret = Tos.FileSeek(fdRet.code, 0, SEEK_SET);
//  console.log("SAVE fffffffff =======>", sret.code);
  close(fdRet.code);
  return true;
}

function GLOBAL_ARRAYBUFFER_FILE_SAVE(saveData, fileName) {
  //console.log("\n GLOBAL_FILE_SAVE 0000000 =================>", saveData.length, fileName);
  let data = saveData;
  if (!data) return;
  // console.log("\n SAVE 0000000 =================>");
  let ret = Tos.FileAccess(fileName);
//  console.log("\n SAVE 11111111 =================>", JSON.stringify(ret));
  if (ret.code === 0) {
    let fd = Tos.FileOpen(fileName, O_APPEND | O_RDWR);
    //  console.log("\n SAVE 4444444 =================>", JSON.stringify(fd));
    if (fd.code < 0) return false;
    let writeRet = Tos.FileWriteExt(fd.code, saveData, saveData.byteLength);
    // console.log("\n SAVE 666666 =================>", JSON.stringify(writeRet.code));
    close(fd.code);
    return writeRet.code >= 0;
  }
  let len = data.length;
  //console.log("SAVE 7777777777=============> data:", len);
  let fdRet = Tos.FileOpen(fileName, O_CREAT | O_RDWR);
  // console.log("SAVE 88888888888 =======>", fdRet.code);
  if (fdRet.code < 0) {
    // console.log("SAVE 99999999999 fail========>");
    return false;
  }
  // console.log("SAVE  aaaaaaaaaaaaaa =======>");
  let sret = Tos.FileSeek(fdRet.code, 0, SEEK_SET);
  if (sret.code < 0) {
    close(fdRet.code);
    // console.log("SAVE 99999999999 fail========>");
    return false;
  }
  // console.log("SAVE bbbbbbbbbb =======>", sret.code);
  let writeRet = Tos.FileWriteExt(fdRet.code, data, data.byteLength);
  // console.log("SAVE ddddddddddddd =======>", writeRet.code);
  if (writeRet.code < 0) {
    //console.log("SAVE eeeeeeeeeeee fail========>", writeRet.code);
    close(fdRet.code);
    return false;
  }
  sret = Tos.FileSeek(fdRet.code, 0, SEEK_SET);
//  console.log("SAVE fffffffff =======>", sret.code);
  close(fdRet.code);
  return true;
}


function GLOBAL_FILE_SAVE_COVER(saveData, fileName) {
  console.log("\n GLOBAL_FILE_SAVE_COVER 0000000 =================>", saveData.length, fileName);
  let data = saveData;
  if (!data) return;

  let len = data.length;
  console.log("GLOBAL_FILE_SAVE_COVER 7777777777=============> data:", len);
  let fdRet = Tos.FileOpen(fileName, O_CREAT | O_RDWR);
  console.log("GLOBAL_FILE_SAVE_COVER 88888888888 =======>", fdRet.code);
  if (fdRet.code < 0) {
    console.log("GLOBAL_FILE_SAVE_COVER 99999999999 fail========>");
    return false;
  }
  console.log("GLOBAL_FILE_SAVE_COVER  aaaaaaaaaaaaaa =======>");
  let seekRet = Tos.FileSeek(fdRet.code, 0, SEEK_SET);
  console.log("seekRet  ========>",JSON.stringify(seekRet));

  if (seekRet.code < 0) {
    console.log("GLOBAL_FILE_SAVE_COVER seek fail========>");
    close(fdRet.code);
    return false;
  }
  console.log("GLOBAL_FILE_SAVE_COVER bbbbbbbbbb =======>");
  let writeRet = Tos.FileWrite(fdRet.code, data, data.length);
  close(fdRet.code);

  console.log("GLOBAL_FILE_SAVE_COVER ddddddddddddd =======>", writeRet.code);
  if (writeRet.code < 0) {
    console.log("GLOBAL_FILE_SAVE_COVER eeeeeeeeeeee fail========>", writeRet.code);
    return false;
  }
  return true;
}

function GLOBAL_GET_FILE(filename) {
  let fd = Tos.FileOpen(filename, O_RDONLY);
  // console.log("FileOpen  ===============>", fd.code);
  if (fd.code < 0) return false;
  let seekRet = Tos.FileSeek(fd.code, 0, SEEK_END);
  // console.log("seekRet  ===============>", seekRet.code);
  if (seekRet.code < 0) {
    close(fd.code);
    return false;
  }
  let seekRet2 =Tos.FileSeek(fd.code, 0, SEEK_SET);
  if (seekRet2.code < 0) {
    close(fd.code);
    return false;
  }
  let readRet = Tos.FileRead(fd.code, seekRet.code);
  // console.log("readRet  ===============>", readRet.code);
  if (readRet.code <= 0){
    close(fd.code);
    return false;
  }
  let dataArr = readRet.data;
  /*console.log("File dataArr ===============>", dataArr);
  let decodeStr = String.fromCharCode.apply(null, dataArr);
  console.log("File decodeStr 0000 ===============>", decodeStr);
  close(fd.code);
  let json = null;
  if (decodeStr) {
    json = JSON.parse(decodeStr);
    console.log("File json 0000 ===============>", JSON.stringify(json));
  }*/
  close(fd.code);
  return dataArr;
}
function GLOBAL_ARRAYBUFFER_GET_FILE(filename) {
  let fd = Tos.FileOpen(filename, O_RDONLY);
  // console.log("FileOpen  ===============>", fd.code);
  if (fd.code < 0) return false;
  let seekRet = Tos.FileSeek(fd.code, 0, SEEK_END);
  // console.log("seekRet  ===============>", seekRet.code);
  if (seekRet.code < 0){
    close(fd.code);
    return false;
  }
  let seekRet2 = Tos.FileSeek(fd.code, 0, SEEK_SET);
  if (seekRet2.code < 0){
    close(fd.code);
    return false;
  }
  let readRet = Tos.FileReadExt(fd.code, seekRet.code);
  // console.log("readRet  ===============>", readRet.code);
  if (readRet.code <= 0){
    close(fd.code);
    return false;
  }
  let dataArr = readRet.data;
  /*console.log("File dataArr ===============>", dataArr);
  let decodeStr = String.fromCharCode.apply(null, dataArr);
  console.log("File decodeStr 0000 ===============>", decodeStr);
  close(fd.code);
  let json = null;
  if (decodeStr) {
    json = JSON.parse(decodeStr);
    console.log("File json 0000 ===============>", JSON.stringify(json));
  }*/
  close(fd.code);
  return dataArr;
}

function GLOBAL_GET_RECORD(filename,index,length) {
  let fd = Tos.FileOpen(filename, O_RDONLY);
  // console.log("FileOpen  ===============>", fd.code);
  if (fd.code < 0) return false;
  let seekRet = Tos.FileSeek(fd.code, index, SEEK_SET);
  if (seekRet.code < 0) {
    close(fd.code);
    return false
  }
  let readRet = Tos.FileRead(fd.code, length);
  // console.log("readRet  ===============>", readRet.code);
  if (readRet.code <= 0) {
    close(fd.code);
    return false;
  }
  close(fd.code);
  let dataArr = readRet.data;
  let decodeStr = String.fromCharCode.apply(null, dataArr);
  let json = null;
  if (decodeStr) {
    json = JSON.parse(decodeStr);
  }
  return json;
}


function GLOBAL_SAVE_RECORD(trans, fileName,index) {
  console.log(" GLOBAL_SAVE_RECORD  =================> 0000");
  if(!trans){
    console.log(" GLOBAL_SAVE_RECORD !trans =================>");
    return false;
  }

  let transStr = JSON.stringify(trans);
  let tranLen = transStr.length;
  console.log(" GLOBAL_SAVE_RECORD trans =================>", transStr,tranLen);
  console.log(" GLOBAL_SAVE_RECORD =================>", fileName  , index);

  let transArr =  sprintf("%-0"+Tos.CONSTANT.TRANS_RECORD_LEN+"s",transStr).split("");
  let arr = transArr.map(function (v){
    return v.charCodeAt();
  })


  let fd = Tos.FileOpen(fileName,  O_CREAT | O_RDWR);

  //  console.log("\n SAVE 4444444 =================>", JSON.stringify(fd));
  if (fd.code < 0) {
    console.log(" GLOBAL_SAVE_RECORD FileOpen fail =================>");
    return false;
  }

  let seekRet = Tos.FileSeek(fd.code, index, SEEK_CUR);
  if (seekRet.code < 0) {
    console.log(" GLOBAL_SAVE_RECORD FileSeek fail =================>");

    close(fd.code);
    return false
  }


  let writeRet = Tos.FileWrite(fd.code, arr, arr.length);

  if (writeRet.code < 0) {
    console.log(" GLOBAL_SAVE_RECORD FileWrite fail =================>");

    //console.log("SAVE eeeeeeeeeeee fail========>", writeRet.code);
    close(fd.code);
    return false;
  }
  console.log(" GLOBAL_SAVE_RECORD FileWrite transLen =================>",tranLen);
  close(fd.code);
  return  tranLen;
}
exports.GLOBAL_FILE_SAVE = GLOBAL_FILE_SAVE;
exports.GLOBAL_GET_FILE = GLOBAL_GET_FILE;
exports.GLOBAL_ARRAYBUFFER_FILE_SAVE = GLOBAL_ARRAYBUFFER_FILE_SAVE;
exports.GLOBAL_ARRAYBUFFER_GET_FILE = GLOBAL_ARRAYBUFFER_GET_FILE;
exports.GLOBAL_GET_RECORD = GLOBAL_GET_RECORD;
exports.GLOBAL_SAVE_RECORD = GLOBAL_SAVE_RECORD;
exports.GLOBAL_FILE_SAVE_COVER = GLOBAL_FILE_SAVE_COVER;


// tips：导出一个不存在的函数会造成页面白屏或者其他异常
