var PRINT_TICKET = require("mod_global_print_transfer").PRINT_TICKET;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
const  getResponse = require("mod_global_response").getResponse;


ViewModel("transReceipt", {
    data: {
        flow: {},
        trans: {},
        currPrint:0,
        title: "",
        traceNo: "",
        transType: "",
        cardNo: "",
        amount:"",
        dateTime: "",
        timeOut: 60,
        timeOutShow:"60s",
        isExit: false,
        callback :{
            printNext:this.printNext,
            noPaper:this.noPaper,
            printDone:this.printDone,
            printError:this.printError
        },
        extraData:null,
        responseMessage:""
    },
    methods: {
        setScreenTimer: function () {
            let that = this;
            timerAdd(function () {
                that.timeOut--;
                console.log("time ===========>", that.timeOut);
                if (that.isExit) {
                    return RET_REMOVE;
                }
                if (that.timeOut <= 0) {
                    that.jumpError("timeOut");
                    return RET_REMOVE;
                }
                that.timeOutShow = that.timeOut + "s";
                that.notifyPropsChanged();
                return RET_REPEAT;
            }, 1000);
        },

        jumpError: function (type) {
            navigateReplace ({
                target: "result",
                type:type || "cancel",
                close_current:true
            });
        },

        navigateTo: function (args) {

        },

        onKeyDown(args) {
            var key = args;
            console.log("KeyCode ===========>" + key);
            switch (key) {
                case "cancel":
                    navigateReplace({
                        close_current:true,
                        target: "transactionPage",
                    });
                    break;
                case "return":
                    break;
                default:
                    break;
            }
        },

        onPrint:function () {
            let that  = this;
            that.trans.extraData = that.extraData
            that.trans.responseMessage = this.responseMessage
            timerAdd(function () {
                PRINT_TICKET('',that.callback,false,that.currPrint,that.trans);
                return RET_REMOVE;
            }, 100);
        },
        printNext: function (count) {
            this.currPrint = count;
            this.trans.extraData = this.extraData
            this.trans.responseMessage = this.responseMessage
            this.notifyPropsChanged()
            PRINT_TICKET('',this.callback,false,1,this.trans);
        },
        printDone: function () {
            let ret = Tos.PrnClose();
            if (ret.code === 0) {
                this.isPrinting = false;
                return;
            }
            let that = this;
            timerAdd(function () {
                ret = Tos.PrnClose();
                that.isPrinting = false;
                that.delayClsPrn();
                return RET_REMOVE;
            }, 1000);
        },

        getExtraData(){
            let keyValuePairs = this.trans.extraData.split(';');
            let transactionData = {}
            for(let i=0; i < keyValuePairs.length; i++){
                let pair = keyValuePairs[i].split(':');

                let key = pair[0].trim()
                let value = pair[1].trim();

                transactionData[key] = value
            }
            return transactionData
        },

        delayClsPrn: function () {
            if (this.isTimerActive) return;
            this.isTimerActive = true;
            let time = 10;
            let that = this;
            console.log("delayClsPrn 000===========>");
            timerAdd(function () {
                console.log("delayClsPrn 1111===========>", time);
                if (!that.isTimerActive) return RET_REMOVE;
                time--;
                that.btnText =
                    (that.resultCode === 1
                        ? "Success"
                        : that.resultCode === 2
                            ? "Cancel"
                            : that.resultCode === 3
                                ? "Timeout"
                                : "Failure") +
                    " (" +
                    time +
                    "s)";
                that.notifyPropsChanged();
                if (time <= 0) {
                    console.log("confirm quit===========>");
                    that.onConfirm();
                }
                return time > 0 ? RET_REPEAT : RET_REMOVE;
            }, 1000);
        },
    },
    onWillMount: function (req) {
        this.trans = req.data;
        if (this.trans) {
            this.amount = `₦${this.trans.amount}`;
            this.responseMessage = `${this.trans.status === 'SUCCESS' || this.trans.status === 'ACTIVE' ? 'APPROVED' :  this.trans.status === 'FAILED' ? 'DECLINED' : this.trans.status}| ${getResponse(this.trans.responseCode)}`;
            const stingTrans = JSON.stringify(this.trans)
            this.trans = JSON.parse(stingTrans)
            console.log("amount ============", this.amount);
            if(this.trans.extraData){
                this.extraData = this.getExtraData()
            }
        }

        this.notifyPropsChanged()

    },
    onMount: function () {},

    onWillUnmount: function () {
        Tos.PrnClose();
    }
})