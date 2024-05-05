var SAVE_CONFIG = require("mod_global_config").SAVE_CONFIG;
var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;
var sprintf = require("mod_global_funcs").sprintf;
var GLOBAL_FORMAT_HARDWARE_KEYBOARD = require("mod_global_funcs").GLOBAL_FORMAT_HARDWARE_KEYBOARD;

ViewModel ("inputConfig", {
    data:{
        type: true,
        title:"",
        timeOutShow: "60s",
        timeOut:"60",
        isExit:false,
        tip_text : "Please enter the config",
        maxLen : 12,
        valueStr: "000",
        page_index: "1",
        // 连续输入次数（循环字符）
        numIndex: 0,
        // 上次输入（判断是否连续输入）
        lastNum: null,
        // 当前时间戳（seconds 判断是否在1s内重复输入）
        timeStamp: 0,
    },
    methods:{
        numberAndLetter : function (args) {
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

        onKeyDown(args) {
            console.log("onkeydown", args, this.type);
            console.log("onkeydown", args, typeof this.type);
            console.log("onkeydown2", args, !this.type);
            console.log("onkeydown2", args, typeof !this.type);
            console.log("onkeydown3", args, (!!this.type));
            if (this.type === "false") {
                console.log("numberAndLetter start");
                this.numberAndLetter(args);
                console.log("numberAndLetter end");
                this.notifyPropsChanged();
                return;
            }
            var key = args;
            switch (key) {
                case "0":
                    if(!this.valueStr) break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    if(this.valueStr.length> this.maxLen) break;
                    this.valueStr += key;
                    this.notifyPropsChanged();
                default:
                    break;
            }
        },

        initData : function() {
            if (this.title == "ESign Support") {
                this.maxLen = 1;
                this.tip_text = "Input \'1\' means support Esign,\n\'0\' means not support";
                if (Tos.GLOBAL_CONFIG.eSignSupport) {
                    this.valueStr = '1';
                } else {
                    this.valueStr = '0';
                }
            } else {
                this.tip_text = "Please enter the " + this.title.toLowerCase();
            }
            if (this.title == "Merchant ID") {
                this.valueStr = Tos.GLOBAL_CONFIG.merchantId;
            } else if (this.title == "Terminal ID") {
                this.valueStr = Tos.GLOBAL_CONFIG.termId;
            } else if (this.title == "Merchant Name") {
                this.valueStr = Tos.GLOBAL_CONFIG.merchantName;
            } else if (this.title == "Time Out") {
                this.valueStr = Tos.GLOBAL_CONFIG.timeout + "";
            } else if (this.title == "printCount") {
                this.valueStr = Tos.GLOBAL_CONFIG.printCount + "";
            } else if (this.title == "printGray") {
                this.valueStr = Tos.GLOBAL_CONFIG.printGray + "";
            } else if (this.title == "TPDU") {
                 this.valueStr = Tos.GLOBAL_CONFIG.tpdu;
            } else if (this.title == "HEAD") {
                 this.valueStr = Tos.GLOBAL_CONFIG.head;
            } else if (this.title == "Voucher NO") {
                 this.valueStr = Tos.GLOBAL_CONFIG.voucherNo + "";
            } else if (this.title == "Batch No") {
                this.valueStr = Tos.GLOBAL_CONFIG.batchNO + "";
            } else if (this.title == "Max Trans Num") {
                this.valueStr = Tos.GLOBAL_CONFIG.maxTransNum + "";
            } else if (this.title == "Max Resend Times") {
                this.valueStr = Tos.GLOBAL_CONFIG.resendTime + "";
            } else if (this.title == "Max Refund Amount") {
                this.valueStr = Tos.GLOBAL_CONFIG.maxRefundAmt + "";
            } else if (this.title == "Country Code") {
                this.valueStr = Tos.GLOBAL_CONFIG.countryCode;
            } else if (this.title == "IP") {
                console.log("Tos.GLOBAL_CONFIG.networkParam.addr" + Tos.GLOBAL_CONFIG.networkParam.addr);
                let netAddr = Tos.GLOBAL_CONFIG.networkParam.addr;
                this.valueStr = netAddr[0] + "." + netAddr[1] + "." + netAddr[2] + "." + netAddr[3];
            } else if (this.title == "PORT") {
                this.valueStr = Tos.GLOBAL_CONFIG.networkParam.port + "";
            }
        },

        confirmInput : function () {
            if (this.title == "Merchant ID") {
                //d+""
                Tos.GLOBAL_CONFIG.merchantId = this.valueStr;
            } else if (this.title == "Terminal ID") {
                Tos.GLOBAL_CONFIG.termId = sprintf("%08s", this.valueStr);
            } else if (this.title == "Merchant Name") {
                Tos.GLOBAL_CONFIG.merchantName = this.valueStr;
            } else if (this.title == "Time Out") {
                Tos.GLOBAL_CONFIG.timeout = this.valueStr;
            } else if (this.title == "ESign Support") {
                if (this.valueStr.includes("0")) {
                    Tos.GLOBAL_CONFIG.eSignSupport = false;
                }else {
                    Tos.GLOBAL_CONFIG.eSignSupport = true;
                }
            } else if (this.title == "printCount") {
                Tos.GLOBAL_CONFIG.printCount = this.valueStr;
            } else if (this.title == "printGray") {
                Tos.GLOBAL_CONFIG.printGray = this.valueStr;
            } else if (this.title == "TPDU") {
                Tos.GLOBAL_CONFIG.tpdu = this.valueStr;
            } else if (this.title == "HEAD") {
                Tos.GLOBAL_CONFIG.head = this.valueStr;
            } else if (this.title == "Voucher NO") {
                Tos.GLOBAL_CONFIG.voucherNo = this.valueStr;
            } else if (this.title == "Batch No") {
                Tos.GLOBAL_CONFIG.batchNO = this.valueStr;
            } else if (this.title == "Max Trans Num") {
                Tos.GLOBAL_CONFIG.maxTransNum = this.valueStr;
            } else if (this.title == "Max Resend Times") {
                Tos.GLOBAL_CONFIG.resendTime = this.valueStr;
            } else if (this.title == "Max Refund Amount") {
                Tos.GLOBAL_CONFIG.maxRefundAmt = this.valueStr;
            } else if (this.title == "Country Code") {
                Tos.GLOBAL_CONFIG.countryCode = this.valueStr;
            } else if (this.title == "IP") {
                if (!this.checkFormat()) return;
                let arr = this.valueStr.split(".");
                console.log("arr: " , arr);
                Tos.GLOBAL_CONFIG.networkParam.addr = arr;
            } else if (this.title == "PORT") {
                Tos.GLOBAL_CONFIG.networkParam.port = this.valueStr;
            }
        },

        checkFormat : function () {
            let regex = "^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\." + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
                + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\." + "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$";
            return this.valueStr.match(regex);
        },

        setScreenTimer: function () {
            let that = this;
            timerAdd(function () {
                that.timeOut--;
                if (that.isExit ) return RET_REMOVE; // 已经不在当前页面
                if (that.timeOut <= 0) {
                    that.jumpError("timeout");
                    return RET_REMOVE;
                }
                that.timeOutShow =that.timeOut+"s";
                that.notifyPropsChanged();
                return RET_REPEAT;
            }, 1000);
        },

        jumpError: function (type) {
            console.log("inputConfig jumpError type" + type);
            navigateReplace({
                target: "result",
                type: type || "cancel",
                close_current: true
            });
        },

    },
    onWillMount : function (req) {
        this.req = req;
        console.log("last page comes from :" + req.from);
        console.log("inputConfig_onWillMount=======>>>:", JSON.stringify(req));
        console.log("inputConfig=======>>>:", req.title, req.type, req.page_index);
        console.log("Tos.GLOBAL_CONFIG.networkParam=======>>>:", Tos.GLOBAL_CONFIG.networkParam);
        this.type = req.type;
        this.title = req.title;
        this.page_index = req.page_index;
        this.timeout = Tos.GLOBAL_CONFIG.timeout + "";
        this.timeOutShow = Tos.GLOBAL_CONFIG.timeout + "s";
        this.initData();
        this.notifyPropsChanged();
    },
    onMount : function () {
        this.setScreenTimer();
    },
    onUnmount : function () {
        this.isExit = true;
    }
})