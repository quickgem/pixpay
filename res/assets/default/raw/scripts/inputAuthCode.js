var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel ("inputAuthCode", {
    data:{
        title:"",
        timeOutShow: "60s",
        timeOut:"60",
        isExit:false,
        tip_text : "Please enter the auth code",
        exceptLen : 6,
        trans:{},
        flow:{},
        valueStr:"",
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
                //Input interval within 1 second
                this.valueStr = this.valueStr.slice(0, -1); //删去未确定的字符
                this.valueStr += arr[this.numIndex];
                this.numIndex++;
                if (this.numIndex == arr.length) this.numIndex = 0; // 循环字符
            } else {
                this.valueStr += args; //
                this.numIndex = 0; //
            }
            this.timeStamp = res.code; //save current time
            this.notifyPropsChanged();
            this.lastNum = args; //record lastest input
        },

        reduceNum: function () {
            if(this.valueStr.length>0) {
                this.valueStr = this.valueStr.substring(0, this.valueStr.length - 1);
                this.notifyPropsChanged();
            }
        },
        clickEnter : function () {
            console.log("clickEnter",this.valueStr);
            if (!this.valueStr || this.valueStr.length!= this.exceptLen) {
                return;
            }
            this.trans.authCode =this.valueStr;
            GLOBAL_JUMP();
        },
        clickCancel : function () {
            this.jumpError("cancel")
        },
        onKeyDown(args) {
            console.log("onkeydown", args);
            this.numberAndLetter(args);
            console.log("numberAndLetter end");
            this.notifyPropsChanged();
        },

        setScreenTimer: function () {
            let that = this;
            timerAdd(function () {
                that.timeOut--;
                if (that.isExit ) return RET_REMOVE; //
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
    onWillMount : function () {
        this.flow =Tos.GLOBAL_TRANSACTION.flow;
        this.trans =Tos.GLOBAL_TRANSACTION.trans;
        this.title =  this.trans.transName;
        this.timeout = Tos.GLOBAL_CONFIG.timeout + "";
        this.timeOutShow = Tos.GLOBAL_CONFIG.timeout + "s";
        this.notifyPropsChanged();
    },
    onMount : function () {
        this.setScreenTimer();
    },
    onUnmount : function () {
        this.isExit = true;
    }
})