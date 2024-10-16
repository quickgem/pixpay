var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("postbridge", {
    data: {
        showModel:false,
        user:null,
        loading:false,
        showTip:"Processing transaction...",
        balanceEnquiryRequest:{accountNumber:""},
        balance:"0.00",
        trans:{},
        rrn:"",
        flow:{}
    },

    methods:{
        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
        },
        onSuccess: function (data) {
            this.loading = false
            this.notifyPropsChanged();
            if (this.trans.amount === 0) {
                navigateTo({
                    target: "cardBalance",
                    type: "success",
                    rrn: this.rrn,
                    response: data,
                    close_current: true,
                });
            }else{
                navigateTo({
                    target: "result",
                    type: "success",
                    rrn: this.rrn,
                    response: data,
                    close_current: true,
                });
            }
        },
        onError: function (data) {
            this.loading = false
            this.notifyPropsChanged();
            navigateReplace({
                target: "result",
                type: this.trans.amount === 0 ? "cancel" : "error",
                rrn: this.rrn,
                response: data,
                close_current: true
            });
        },
        dateTime: function (){
            let transactionTime = Tos.GLOBAL_TRANSACTION.trans.transTime;
            console.log("\ntransactionTime year ==========>", transactionTime.year);
            console.log("\ntransactionTime month ==========>", transactionTime.month);
            console.log("\ntransactionTime date ==========>", transactionTime.date);
            console.log("\ntransactionTime h ==========>", transactionTime.h);
            console.log("\ntransactionTime m ==========>", transactionTime.m);
            console.log("\ntransactionTime s ==========>", transactionTime.s);
            return transactionTime.year+'-'+transactionTime.month+'-'+transactionTime.date+' '+transactionTime.h+':'+transactionTime.m+':'+transactionTime.s
        },
        transOnlineTms: function() {
            this.loading = true
            const currentDateTime = this.dateTime()
            console.log('TMS PROCESS STARTED ===>>>> ',JSON.stringify(this.trans))
            const that = this
            that.notifyPropsChanged();
            function generateReference(n){
                return Math.floor(Math.pow(10, n-1) + Math.random() * 9*Math.pow(10, n-1)).toString()
            }
            // tid:Tos.GLOBAL_CONFIG.userInfo.customerOrganisationTerminalId, G/CHIWUEZE
            // mid:Tos.GLOBAL_CONFIG.userInfo.mid,

            const request = {
                amt:this.trans.amount,
                t2d:this.trans.track2,
                pbl:this.flow.pin,
                emv:this.trans.sendIccData,
                tid:Tos.GLOBAL_CONFIG.userInfo.terminal.terminalId,
                rrn:generateReference(12),
                // exp:this.trans.expDate,
                csn:this.trans.cardSerialNo,
                // mid:Tos.GLOBAL_CONFIG.userInfo.organisation.organisationId,
                name:`${this.trans.cardHolderName.substring(0, 10)}|${this.trans.emvAppName.toLocaleUpperCase().replace("DEBIT", "").trim().substring(0, 6)}`,
                // date:currentDateTime,
                // aid:this.trans.aid
            }
            this.rrn = request.rrn
            that.notifyPropsChanged();
            if (request.amt === 0){
                Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TMS_CARD_BALANCE,request,this.onSuccess,this.onError)
            }else{
                Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TMS_PURCHASE,request,this.onSuccess,this.onError)
            }

        },
        onFail: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }
            navigateReplace({
                target: "pay",
                type: "cancel",
                //data:this.user
            });
        },

        hideModel: function () {
            this.showModel = false;
            this.notifyPropsChanged();
        },

        handleCancel: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }
            this.onFail();
        },

        navigateTo: function (args) {
            GLOBAL_JUMP("", args);
        },

        handleNext: function () {
            if(this.transferType && this.transferTypeValue === 'Transfer to Other Banks'){
                if(this.searchBank){
                    this.navigateTo()
                }
                this.searchBank = true;
                this.otherBanks = true;
                this.notifyPropsChanged()

            }else{
                this.navigateTo()
            }

        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    this.handleCancel();
                    break;
                default:
                    break;
            }
        },
    },

    onWillMount: function (req) {
        this.user = Tos.GLOBAL_CONFIG.userInfo
        this.trans = req.data.trans
        this.flow = req.data.flow
        this.transOnlineTms()
    },

    onMount: function () {

    },

    onWillUnmount: function () {

    }
})