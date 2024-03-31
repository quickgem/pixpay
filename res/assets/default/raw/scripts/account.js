var TRANS_REPORT = require("mod_global_report").TRANS_REPORT;
var SHOW_MASK_CARD = require("mod_global_funcs").SHOW_MASK_CARD;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var sprintf = require("mod_global_funcs").sprintf;


ViewModel("account", {
    data: {
        title: "",
        traceNo: "",
        transType: "",
        cardNo: "",
        amount:"",
        dateTime: "",
        timeOut: 180,
        timeOutShow:"60s",
        isExit: false,
        currIndex : 0,
        listCount:0,
        noticeText:"No Transaction !",
        isShowToast:false,
        toastTip:"",
        flow: {},
        trans: {},
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
                    that.exit();
                    return RET_REMOVE;
                }
               // that.timeOutShow = that.timeOut + "s";
                that.notifyPropsChanged();
                return RET_REPEAT;
            }, 1000);
        },

        exit: function () {
            navigateReplace ({
                target: "pay",
                close_current:true
            });
        },

        onKeyDown(args) {
            var key = args;
            console.log("KeyCode ===========>" + key);
            switch (key) {
                case "up":
                    if(this.currIndex===this.listCount-1){
                        break;
                    }
                    this.currIndex ++;
                    this.showDetail(this.currIndex);
                    break;
                case "down":
                    if(this.currIndex===0){
                        break;
                    }
                    this.currIndex --;
                    this.showDetail(this.currIndex);
                    break
                case "cancel":
                case "return":
                    this.exit();
                    break;

                default:
                    break;
            }
        },
        showDetail:function (id) {
           let trans =  TRANS_REPORT.queryByID(id);
            if(!trans){
                return;
            }
            this.title = this.trans.transName+sprintf("(%s)",(this.currIndex+1)+"/"+this.listCount);
            this.voucherNo = sprintf("%06d",trans.voucherNo);
            this.transType = trans.transName;
            this.cardNo = SHOW_MASK_CARD(trans.pan);
            this.amount =GET_SHOW_AMOUNT(trans.amount) ;
            let dateAndTime  = trans.transTime.year+"/"+trans.transTime.month+"/"+trans.transTime.date+" "+
                trans.transTime.h+":"+trans.transTime.m+":"+trans.transTime.s;
            this.dateTime = dateAndTime;
            this.notifyPropsChanged()
        },
        showToast:function (tip){
            this.isShowToast = true;
            this.toastTip =tip;
            this.setToastTimer();
            this.notifyPropsChanged();
        },
        setToastTimer: function () {
            let loop = 0;
            let that = this;
            timerAdd(function () {
                if (!that.isShowToast) {
                    return RET_REMOVE;
                }
                loop++;
                if (loop >= 2) {
                    that.exit();
                    return RET_REMOVE;
                }
                return RET_REPEAT;
            }, 1000);
        },

    },
    onWillMount: function (req) {
        this.flow = Tos.GLOBAL_TRANSACTION.flow;
        this.trans = Tos.GLOBAL_TRANSACTION.trans;
        this.title = this.trans.transName;
        let transList =  TRANS_REPORT.getIndex();
        if(!transList ||transList.isEmpty){
            this.showToast(this.noticeText);
            return ;
        }

        this.listCount = transList.length;
        this.showDetail(this.currIndex);

        this.notifyPropsChanged()
    },
    onMount: function () {
        this.setScreenTimer();
    },
    onWillUnmount: function () {
        this.isExit = true;
    }
})