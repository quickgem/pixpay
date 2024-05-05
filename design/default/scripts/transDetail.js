var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;

ViewModel("transDetail", {
    data: {
        flow: {},
        trans: {},
        title: "",
        traceNo: "",
        transType: "",
        cardNo: "",
        amount:"",
        dateTime: "",
        timeOut: 60,
        timeOutShow:"60s",
        isExit: false,
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

        onKeyDown(args) {
            var key = args;
            console.log("KeyCode ===========>" + key);
            switch (key) {
                case "cancel":
                    navigateReplace({
                        target: "result",
                        type: "cancel"
                    });
                    break;
                case "return":
                    GLOBAL_JUMP();
                    break;
                default:
                    break;
            }
        }
    },
    onWillMount: function (req) {
        try {
            this.flow = Tos.GLOBAL_TRANSACTION.flow;
            this.trans = Tos.GLOBAL_TRANSACTION.trans;
            this.title = this.trans.transName;
            this.traceNo = "" + this.trans.origVoucherNo;
            this.traceNo = this.traceNo.padStart(6, "0");
            this.transType = this.trans.origTransName;
            this.cardNo = this.trans.pan;
            if (this.trans) {
                this.amount = GET_SHOW_AMOUNT(this.trans.amount);
                console.log("amount ============", this.amount);
            }
            if (this.trans && this.trans.origTransTime) {
                this.dateTime = this.trans.origTransTime.year + "/" + this.trans.origTransTime.month + "/" + this.trans.origTransTime.date + " "
                    + this.trans.origTransTime.h + ":" + this.trans.origTransTime.m + ":" + this.trans.origTransTime.s;
            }
            console.log("flow ============" , JSON.stringify(this.flow));
            console.log("trans ===========" , JSON.stringify(this.trans));
            console.log("title ===========" , JSON.stringify(this.title));
            this.notifyPropsChanged()
        } catch (e){
            console.log("error =============", e);
        }

    },
    onMount: function () {
        this.setScreenTimer();
    },
    onWillUnmount: function () {
        this.isExit = true;
        Tos.PrnClose();
    }
})