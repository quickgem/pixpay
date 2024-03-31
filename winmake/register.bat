@echo start
copy build2605\winmake\cygwin1.dll %windir%\system32\
regsvr32 %windir%\system32\cygwin1.dll /s
@echo cygwin1.dll success
