var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("postbridge", {
    data: {
        showModel:false,
        user:null,
        loading:false,
        showTip:"Fetching account balance",
        balanceEnquiryRequest:{accountNumber:""},
        balance:"0.00",
        trans:{},
        flow:{}
    },

    methods:{
        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
        },
        onSuccess: function () {
            navigateTo({
                target: "result",
                type:  "success",
                close_current: true,
            });
        },
        onError: function () {
            navigateReplace({
                target: "result",
                type: type || "cancel",
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
            function onSuccess(data){
                that.loading = false
                that.notifyPropsChanged();
                console.log("onSuccess ====>  ", JSON.stringify(data))
                //this.netSuccess()
            }
            function onError(data){
                that.loading = false
                that.notifyPropsChanged();
                console.log("onError ====>  ", JSON.stringify(data))
                //this.netError()
            }
            function generateReference(n){
                return Math.floor(Math.pow(10, n-1) + Math.random() * 9*Math.pow(10, n-1)).toString()
            }
            const request = {
                cardAcceptorId:"2CSTLA100000001",
                minorAmount:this.trans.amount,
                track2Data:this.trans.track2,
                pinBlock:this.flow.pin,
                processingCode:"000000",
                emvDataString:this.trans.sendIccData,
                acquiringInstitutionId:"778035",
                terminalId:Tos.GLOBAL_CONFIG.userInfo.customerOrganisationTerminalId,
                pinCaptureCode:"06",
                rrn:generateReference(12),
                expiryDate:this.trans.expDate,
                cardAcceptorLocation:"COREBANK LTD  TMS POS  APP -  LAGOS LANG",
                stan:generateReference(6),
                transactionCurrencyCode:"566",
                merchantType:"6013",
                cardSequenceNumber:this.trans.cardSerialNo,
                mid:Tos.GLOBAL_CONFIG.userInfo.mid,
                name:this.trans.cardHolderName,
                date:currentDateTime,
                aid:this.trans.aid,
                appLab:this.trans.emvAppName,
                dateTime:currentDateTime,
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TMS_PURCHASE,request,onSuccess,onError)
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