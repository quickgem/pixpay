var PRINT_TICKET = require("customPrintFunc").PRINT_TICKET;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("transferSuccess",{
    data:{
        showTip:'',
        amount:'0.00',
        name:'',
        loading:false,
        timeOutShow:"5s",
        timeOut:"5",
        isExit:false,
        currPrint:0,
        title:"Make Transfer",
        user:null,
        fundTransferResponse:null,
        error:null,
        isError:false,
        isShowExit:false,
        Notice:"Notice!",
        noticeText:"Cancel Transaction?",
        btnText: "Success (10s)",
        resultCode: 1,
        isTimerActive: false,
        isPrinting: false,
        callback :{
            printNext:this.printNext,
            noPaper:this.noPaper,
            printDone:this.printDone,
            printError:this.printError
        },
        config:{},
        trans:{},
        flow:{},
        transParam:{},
        transferResponse:""
    },

    methods:{

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        handleCancel(){
            this.isShowExit = false
            this.notifyPropsChanged();
        },

        _formatInput: function () {
            this.amount = parseFloat(this.fundTransferResponse.amount).toFixed(2);
            const parts  = this.fundTransferResponse.amount.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            this.amount = parts.join(".")
            this.notifyPropsChanged();
        },

        handleConfirm(){
            this.isShowExit = false
            this.notifyPropsChanged();
            navigateReplace({
                target: "pay",
                close_current: true,
                data:this.user
            });
        },

        navigateTo: function (args) {
            GLOBAL_JUMP("", args);
        },


        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    if(this.isError){
                        this.isError = false
                        this.notifyPropsChanged();
                    }else{
                        this.isShowExit = true
                        this.notifyPropsChanged()
                    }
                    break;
                default:
                    break;
            }
        },

        onRepaint: function () {
            if (this.isPrinting) return;
            this.callPrint();
        },

        onConfirm: function () {
            navigateReplace({
                close_current: true,
                target: "pay",
                data:this.user
            });
        },

        printNext: function (count) {
            this.currPrint = count;
            // PRINT_TICKET(trans,cb,rePrint,count);
        },

        noPaper: function (count) {
            this.currPrint = count;
        },

        printError: function () {},

        onPrint:function () {
            let that  = this;
            timerAdd(function () {
                PRINT_TICKET(that.trans,that.callback,false,that.currPrint,that.user,that.fundTransferResponse);
                return RET_REMOVE;
            }, 100);
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

    onWillMount(req){
        if(req) {
            this.user = Tos.GLOBAL_CONFIG.userInfo
            this.fundTransferResponse = req.data.fundsResponse

            // if (req.type === "success") {
            //     this.resultCode = 1
            //     this.btnText = "Success (10s)";
            //     if (req.cardType === 1) {
            //         GLOBAL_FUNCS.setLEDStatus(0b1011, 0);
            //     } else {
            //         GLOBAL_FUNCS.setLEDStatus(0b1011,1,5);
            //     }
            // }
            // else if (req.type === "error") {
            //     this.resultCode = 0;
            //     GLOBAL_FUNCS.setLEDStatus(0b0100, 0);
            //     this.btnText = "Failure (10s)";
            // }
            // else {
            //     this.resultCode = req.type === "cancel" ? 2 : 3;
            //     GLOBAL_FUNCS.setLEDStatus(0);
            //     this.btnText = req.type === "cancel" ? "Cancel (10s)" : "Timeout (10s)";
            // }
            // this.delayClsPrn();
            this.notifyPropsChanged()
        }
    },

    onMount(){
        this.amount = this.fundTransferResponse.amount
        this.name = this.fundTransferResponse.creditAccountName
        this._formatInput()
        this.onPrint();
    },

    onWillUnmount(){},


})