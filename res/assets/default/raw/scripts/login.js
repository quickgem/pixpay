var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
let APP_LOGIN_URL = "https://biz.corestepbank.com/authentication/login";
var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG

ViewModel("login", {
    data:{
        deviceSN: "",
        deviceModel: "M3P",
        isEmpty: true,
        TipsText: "Loading...",
        timeout: 30,
        promise: null,
        downloadBuffer: [],
        saveBuffer: [],
        httpCB: null,
        loading:false,
        user:null,
        currentIndex: 0,
        isShowScrollbar: false,
        isShowExit: false,
        noticeText:"Exit The Application?",
        isShowToast:false,
        toastTip:"",
        showTip:"Loading...",
        title:"",
        loginRequest:{
            username: "chiwuezegeorge@gmail.com",
            password: "123456",
            source: "POS_TERMINAL"
        },
        error:"",
        isError:false
    },


    methods: {
        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },
        numberAndLetter : function (args){
            console.log("key down----->>>>:", args);
            let arr = []; //按键字符数组
            switch (args) {
                case "0":
                    arr = ["0", "#", "@", "_", "-", "?", "!"];
                    break;
                case "1":
                    arr = ["1", "Q", "q", "Z", "z", "."];
                    break;
                case "2":
                    arr = ["2", "A", "a", "B", "b", "C", "c"];
                    break;
                case "3":
                    arr = ["3", "D", "d", "E", "e", "F", "f"];
                    break;
                case "4":
                    arr = ["4", "G", "g", "H", "h", "I", "i"];
                    break;
                case "5":
                    arr = ["5", "J", "j", "K", "k", "L", "l"];
                    break;
                case "6":
                    arr = ["6", "M", "m", "N", "n", "O", "o"];
                    break;
                case "7":
                    arr = ["7", "P", "p", "R", "r", "S", "s"];
                    break;
                case "8":
                    arr = ["8", "T", "t", "U", "u", "V", "v"];
                    break;
                case "9":
                    arr = ["9", "W", "w", "X", "x", "Y", "y"];
                    break;
            }

            let res = Tos.SysGetCurTime(); //当前时间戳
            console.log(
                "SysGetCurTime_res===========>",
                JSON.stringify(res),
                this.timeStamp,
                res.code - this.timeStamp
            );
            if (res.code - this.timeStamp < 2 && this.lastNum == args) {
                //两次同键输入间隔在1s内，连续输入
                this.valueStr = this.valueStr.slice(0, -1); //删去未确定的字符
                this.valueStr += arr[this.numIndex];
                this.numIndex++;
                if (this.numIndex == arr.length) this.numIndex = 0; // 循环字符
            } else {
                //两次同键输入间隔超过1s或两次输入数字不同
                this.valueStr += args; //正常向后输入
                this.numIndex = 0; //重置字符下标，重新开始循环
            }
            this.timeStamp = res.code; //存储当前时间戳
            this.notifyPropsChanged();
            this.lastNum = args; //记录上次输入，判断下次是否为连续输入
        },

        onKeyDown: function(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    if (this.isShowToast) {
                        this.hideToast();
                        return;
                    }
                    if (this.isShowExit) {
                        this.handleCancel();
                        return;
                    }
                    this.showExit();
                    break;
                case "return":
                    if (this.isShowToast) {
                        this.hideToast();
                        return;
                    }
                    if (this.isShowExit) {
                        this.handleConfirm();
                        return;
                    }
                    this.loginAction()
                    break;
                default:
                    break;
            }
        },

        setTimer: function () {
            let that = this;
            let time = 0;
            timerAdd(function () {
                console.log("system upgrade timer =========>", time);
                if (!that.isLoading) return RET_REMOVE;
                time++;
                if (time >= that.timeout) {
                    that.isLoading = true;
                    that.tipsText = "Network timeout";
                    that.notifyPropsChanged();
                    return RET_REMOVE;
                }
                return RET_REPEAT;
            }, 1000);
        },


        GLOBAL_CHOOSE_NETWORKs: function () {
            let type = 1; // WIFI : 1 ,GPRS : 0
            let ret = Tos.WifiCheck();
            console.log("WifiCheck =========>", ret.code);
            if (ret.code < 0) {
                ret = Tos.MobileDataAvailable();
                console.log("MobileDataAvailable =========>", ret.code);
                if (ret.code <= 0) {
                    return false;
                } else {
                    type = 0;
                }
            } else {
                type = 1;
            }
            ret = Tos.SocSetProperty(type);
            console.log("selecNetwork =========>", ret.code);
            ret = Tos.SocGetProperty(0);
            console.log("selecNetwork get =========>", ret.code, ret.data);
            return true;
        },

        loginAction: function () {
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.loading = true
            that.notifyPropsChanged();
            let head = {
                // params: send parameters by request header
                // "headerTest1:aaa\r\nheaderTest2:bbb\r\nemail:ndubisijnr@gmail.com" + "\r\npassword:123456\r\nsource:POS_TERMINAL" +
                //username:${this.loginRequest.username}" + "\r\npassword:${this.loginRequest.password}\r\nsource:POS_TERMINAL` +"\r\n
                params:`Accept: */*\r\n`,
                //method: 0 get ,1 post
                method: 1,
                //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
                ContentType: "application/json"
            };
            let body = this.loginRequest;
            body = JSON.stringify(body) + "\r\n";
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "","", 30, 1, that.httpCB);

            console.log("666666666:====>", JSON.stringify(httpret));
        },


        parseData: function (data) {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
            if (decodeStr) {
                this.loading = false
                this.notifyPropsChanged();
                let data = JSON.parse(decodeStr);
                if (data) {
                    if(data.responseCode === "00"){
                        navigateTo({
                            target: "pay",
                            close_current: true,
                            data: data,
                        });
                    }else {
                        this.isError = true
                        this.error = data.responseMessage
                        this.notifyPropsChanged();
                    }
                } else {
                    this.isError = true
                    this.error = data
                    this.notifyPropsChanged();
                    // this.isLoading = false;
                    // this.TipsText = "Nothing here";
                    // this.notifyPropsChanged();
                }
            }
            else {
                this.loading = false
                this.isError = true
                this.error = data
                this.notifyPropsChanged();
            }
        },

        showExit: function () {
            this.isShowExit =true;
            this.notifyPropsChanged();
        },

        reduceNum: function () {
            if(this.valueStr.length>0) {
                this.valueStr = this.valueStr.substring(0, this.valueStr.length - 1);
                this.notifyPropsChanged();
            }
        },

        clickEnter : function () {
            // confirm button
            if (this.valueStr.length == 0) return;
            this.confirmInput();
            navigateTo({
                target: "subSettings",
                page_index : this.page_index,
                close_current: true
                // close_current : true,
            });
        },

        clickCancel : function () {
            navigateTo({
                target: "subSettings",
                page_index : this.page_index,
                close_current: true
                // close_current : true,
            });
        },

        goBack: function () {
            this.isReboot = 2;
            navigateTo({
                target: "settings",
                close_current: true,
            });
            /*if (this.isUpdate === 0) {
              navigateTo({
                target: "settings",
                close_current: true,
              });
            } else {
              console.log("Updating... =========>", time);
            }*/
        },


        onCheckStatus: function () {
            let that = this;
            timerAdd(function () {
                let ret = Tos.HttpclientStatus();
                console.log(JSON.stringify(ret))
                console.log("onCheckStatus ==============>", ret.code);
                if (ret.code > 0) {
                    that.onReceiveData();
                    return RET_REMOVE;
                } else if (ret.code === 0) {
                    that.onReceiveData();
                    return RET_REPEAT;
                } else {
                    that.handleError();
                    return RET_REMOVE;
                }
            }, 50);
        },

        onReceiveData: function () {
            console.log(this.loginRequest)
            let that = this;
            let ret = Tos.HttpclientRecv();
            console.log("onReceiveData ==============>", ret.code);
            console.log("http_ret.data ==============>", JSON.stringify(ret.data));
            console.log("http_ret.data.code ==============>", ret.data.response_code);
            navigateTo({
                target: "pay",
                close_current: true,
            });

            console.log("-----------------------------------------------------------------")
            if (ret.code >= 0) {
                console.log("http_ret.data ==============>", JSON.stringify(ret.data));
                console.log("http_ret.data.code ==============>", ret.data.response_code);
                // switch (this.httpClientType) {
                //     case _GET_TASK_DATA: {
                //
                //         let dataBuf = ret.data.response_buf;
                //         let u8Arr = new Uint8Array(dataBuf);
                //         let codeStr = String.fromCharCode.apply(null, u8Arr);
                //         let taskInfo = JSON.parse(codeStr);
                //         if (taskInfo && taskInfo.result === "20000") {
                //             console.log("http_ret.data ==============>", JSON.stringify(taskInfo));
                //             this.tmsUrl = taskInfo.data.downloadUrl || "null";
                //             console.log("downloadUrl ==============>", this.tmsUrl);
                //
                //             let sysInfo = new GLOBAL_GET_SYS_INFO();
                //
                //             console.log("packageName ==============>", taskInfo.data.packageName);
                //             console.log("newVersion ==============>", taskInfo.data.version);
                //
                //             //APP
                //             if (taskInfo.data.type === TASK_APP) {
                //                 let appName = sysInfo.getAppName();
                //                 let appVersion = sysInfo.getAppVersion();
                //                 console.log("appName ==============>", appName);
                //                 if (taskInfo.data.packageName !== appName) {
                //                     that.onUploadResult(INSTALL_FAILED_INVALID_APK);
                //                     return;
                //                 }
                //                 let checkUpdateRes = Tos.TmsCheckIsUpdate(TASK_APP, appVersion, appVersion.length,
                //                     taskInfo.data.version, taskInfo.data.version.length).code;
                //                 console.log("appVersion ==============>", appVersion);
                //                 if (taskInfo.data.version === appVersion) {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.saveTaskFlag(1);
                //                     that.onUploadResult(TASK_SUCCESS);
                //                     return;
                //                 } else if (checkUpdateRes === 1) {
                //                     console.log("allow to update ==============>");
                //                     that.saveTaskInfo(taskInfo);
                //                 } else {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.onUploadResult(INSTALL_FAILED_OLDER_SDK);
                //                     return;
                //                 }
                //             }
                //             //EMV
                //             else if (taskInfo.data.type === TASK_EMV) {
                //                 if (taskInfo.data.packageName !== "EMV") {
                //                     that.onUploadResult(INSTALL_FAILED_INVALID_APK);
                //                     return;
                //                 }
                //                 let emvVersion = sysInfo.getEmvVersion();
                //                 let checkUpdateRes = Tos.TmsCheckIsUpdate(TASK_EMV, emvVersion, emvVersion.length,
                //                     taskInfo.data.version, taskInfo.data.version.length).code;
                //                 console.log("emvVersion ==============>", emvVersion);
                //                 if (taskInfo.data.version === emvVersion) {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.saveTaskFlag(1);
                //                     that.onUploadResult(TASK_SUCCESS);
                //                     return;
                //                 } else if (checkUpdateRes === 1) {
                //                     console.log("allow to update ==============>");
                //                     that.saveTaskInfo(taskInfo);
                //                 } else {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.onUploadResult(INSTALL_FAILED_OLDER_SDK);
                //                     return;
                //                 }
                //             }
                //             //KERNEL
                //             else if (taskInfo.data.type === TASK_KERNEL) {
                //                 let kernelVersion = sysInfo.getKernelVersion();
                //                 let checkUpdateRes = Tos.TmsCheckIsUpdate(TASK_KERNEL, kernelVersion, kernelVersion.length,
                //                     taskInfo.data.version, taskInfo.data.version.length).code;
                //                 console.log("kernelVersion ==============>", kernelVersion);
                //                 if (taskInfo.data.version === kernelVersion) {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.saveTaskFlag(1);
                //                     that.onUploadResult(TASK_SUCCESS);
                //                     return;
                //                 } else if (checkUpdateRes === 1) {
                //                     console.log("allow to update ==============>");
                //                     that.saveTaskInfo(taskInfo);
                //                 }  else if (checkUpdateRes === 2) {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.onUploadResult(SYSTEM_UPGRADE_FAIL_WRONG_VERSION);
                //                 } else {
                //                     that.saveTaskInfo(taskInfo);
                //                     that.onUploadResult(INSTALL_FAILED_OLDER_SDK);
                //                     return;
                //                 }
                //             }
                //
                //             that.onDownloadFile();
                //         }
                //         else if (taskInfo.result === "50016" || taskInfo.result === "30001")
                //         {
                //             console.log("no task, return! ==============>");
                //             that.handleError();
                //             return;
                //         }
                //         else
                //         {
                //             console.log("strcmp version return ==============>");
                //             that.handleError();
                //             return;
                //         }
                //     }
                //         break;
                //     case _DOWNLOAD_DATA: {
                //         let code = ret.data.response_code;
                //         let data = ret.data.response_buf;
                //         let header = {
                //             response_content_len: ret.data.response_content_len,
                //             retrieve_len: ret.data.retrieve_len
                //         };
                //         that.handleReceive(code, data, header);
                //     }
                //         break;
                //     case _UPLOAD_RESULT: {
                //         console.log("http_ret.data ==============>", JSON.stringify(ret.data));
                //         console.log("http_ret.data.code ==============>", ret.data.response_code);
                //         let dataBuf = ret.data.response_buf;
                //         let u8Arr = new Uint8Array(dataBuf);
                //         let codeStr = String.fromCharCode.apply(null, u8Arr);
                //         let taskInfo = JSON.parse(codeStr);
                //         if (taskInfo && taskInfo.result === "20000") {
                //             that.removeTaskFlag();
                //             that.removeTaskInfo();
                //         } else {
                //             that.handleError();
                //         }
                //     }
                //         break;
                //     default:
                //         break;
                // }
            } else {
                that.handleError();
            }
        },

        handleReceive: function (code, data, header) {
            let that = this;
            let u8arr = (data && new Uint8Array(data)) || [];
            if (code < 0) {
                that.handleError();
                console.log("downlaod url error ===============>");
                return;
            } else {
                if (u8arr.length) {
                    this.u8arrRecvLen += u8arr.length;
                    console.log("handleReceive ===============>", u8arr.length);
                    this.downloadBuffer.push(u8arr);
                    console.log("header.retrieve_len ===============>", header.retrieve_len);
                    that.handleFormatBuffer();
                    if (header.retrieve_len === 0) {
                        if (this.u8arrRecvLen < header.response_content_len) {
                            // 丢包，数据出错，走错误流程
                            that.handleError();
                            return;
                        }
                        console.log("download Success =======>");
                        //verify file
                        let binObj = that.giveBinTypeSize();
                        if (JSON.stringify(binObj) === "{}") {
                            that.handleError();
                            return;
                        }
                        let res = that.compareBinVersion(binObj.size, binObj.type);
                        console.log("Tos.TmsCmpBinVersion res =======>", res);
                        if (res !== TMS_CODE_SUCCESS) {
                            //show error tip
                            // send_system_update_message("New version is wrong");
                            that.onUploadResult(SYSTEM_UPGRADE_FAIL_WRONG_VERSION);
                            return;
                        }
                        res = Tos.SysUpdate(_DL_FILE_PATH, 0, binObj.size, binObj.type);
                        console.log("Tos.SysUpdate res =======>", res.code);
                        if (res.code !== 0) {
                            that.handleError();
                            return;
                        }

                        // that.readDownloadUrl();
                        // that.readTaskFlag();
                        // that.readTaskInfo();

                        this.isUpdate = 0;
                        this.isReboot = 1;
                    } else {
                        that.onCheckStatus();
                    }
                }
            }
        },

        handleError: function () {
            let that = this;
            this.downloadBuffer = [];
            this.isLoading = false;
            this.tipsText = "Nothing here";
            this.u8arrRecvLen = 0;
            this.isUpdate = 0;
            this.isReboot = 2;
            this.notifyPropsChanged();
            that.removeDownloadFile();
        },

        handleFormatBuffer: function () {
            let that = this;
            if (!this.downloadBuffer.length) {
                return;
            }
            let dataArr = [];
            for (let b = 0; b < this.downloadBuffer.length; b++) {
                let len = this.downloadBuffer[b].length;
                for (let i = 0; i < len; i++) {
                    dataArr.push(this.downloadBuffer[b][i]);
                }
            }
            console.log("isFileWriting ============>" + dataArr.length + "\r\n");
            that.saveDownloadFile(dataArr);
            this.downloadBuffer = [];
        },

        handleCancel: function () {
            this.isShowExit =false;
            this.notifyPropsChanged();
        },

        hideToast: function () {
            this.isShowToast = false;
            this.notifyPropsChanged();
        },

        handleConfirm: function () {
            this.exitApp();
        },

        exitApp:function () {
            navigateReplace({
                close_current: true,
                target: "home"
            });

        },

        navigateTo: function (args) {
            GLOBAL_JUMP();
        },
    },


    onWillMount:function (){

    },

    onMount:function (){

    },

    onWillUnmount:function (){

    }
})