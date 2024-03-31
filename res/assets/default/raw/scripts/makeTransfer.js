var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
const NameEnquiryUrl = "https://biz.corestepbank.com/transaction/name-enquiry"
const ReadBankUrl = 'https://biz.corestepbank.com/transaction/bank-list'
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GET_BANK_LIST = require("mod_global_bank_list").BANK_LIST

ViewModel("makeTransfer", {
    data: {
        showModel: false,
        searchQy:"",
        transferType:false,
        transferTypeValue:"Transfer to CoreBank",
        accountNumberStr:"",
        amount_and_narration:false,
        transactionSummary:false,
        transactionPin:false,
        searchBank:false,
        user:null,
        otherBanks:false,
        filteredBankList:null,
        isNoBank:true,
        banks:null,
        fundTransferRequest:{
            amount:"",
            bankName:"",
            bankCode:"",
            creditAccountName:"",
            creditAccountNumber:"",
            debitAccountName:"",
            debitAccountNumber:"",
            narration:"",
            sessionId:"",
            reference:"",
            sourceType:"POS_TERMINAL",
            pin:""
        },
        loading:false,
        isShowScrollbar: false,
        nameEnquiryLoading:false,
        isSelectedBank:false,
        selectedBank: {name:"Select bank"},
        nameEnquiry:false,
        nameEnquiryRequest:{
            accountBankCode:null,
            accountNumber:null,
        },
        nameEnquiryResponse: {},
        fundTransferAmount:"₦ 0.00",
        trans:{},
        popUp:false,
        transParam:{},
        flow:{},
        title:"",
        showTip:"Fetching account details",
        loginRequest:{
            username: "chiwuezegeorge@gmail.com",
            password: "",
            source: "POS_TERMINAL"
        },
        isError:false,
        error:""
    },

    methods:{
        resetBank(){
            this.banks = GET_BANK_LIST
            this.isNoBank = true
            this.notifyPropsChanged();
        },

        selectBank(args){
            console.log("selected bank ====> ", args)
            this.selectedBank = args
            this.notifyPropsChanged();
            this.fundTransferRequest.bankName = this.selectedBank.name
            this.fundTransferRequest.bankCode = this.selectedBank.code
            this.nameEnquiryRequest.accountBankCode = this.selectedBank.code
            this.isSelectedBank = true
            this.searchBank = false
            this.notifyPropsChanged();
            console.log("after parsing ====> ", JSON.stringify(this.selectedBank))
        },

        doBankSearch(){
             this.filteredBankList = this.banks.filter(it =>{
                 return it.name.toLowerCase() === this.searchQy.toLowerCase()
            })

            this.isNoBank = true
            this.notifyPropsChanged();
        },

        callBankSearch(){
            if(this.searchQy){
                if(this.doBankSearch().length){
                    this.filteredBankList = this.doBankSearch()
                    this.isNoBank = false
                    this.notifyPropsChanged();
                    console.log(this.filteredBankList)
                }else{
                    this.isNoBank = true
                    this.popUp = true
                    this.notifyPropsChanged();
                }


            }
        },

        closePopUp(){
            this.popUp = false
            this.notifyPropsChanged();
        },

        _formatInput: function () {
            if(this.fundTransferRequest.amount === "") this.fundTransferAmount = "₦ 0.00";
            this.fundTransferRequest.amount = parseFloat(this.fundTransferRequest.amount).toFixed(2);
            const parts  = this.fundTransferRequest.amount.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            this.fundTransferAmount = parts.join(".")
            this.notifyPropsChanged();
        },

        navigator(){
            this.transferType = false
            this.nameEnquiry = false
            this.amount_and_narration = true
            this.notifyPropsChanged()
        },

        enterPin(){
            this.handleNext()
            this.transactionSummary = false
            this.notifyPropsChanged()
        },

        navigatorTransactionSummary(){
            this.fundTransferRequest.narration = `trf to ${this.fundTransferRequest.creditAccountName}`.toLowerCase()
            this._formatInput()
            this.transactionSummary = true
            this.notifyPropsChanged()
        },

        readBankList(){
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.notifyPropsChanged();
            let head = {
                // params: send parameters by request header
                // "headerTest1:aaa\r\nheaderTest2:bbb\r\nemail:ndubisijnr@gmail.com" + "\r\npassword:123456\r\nsource:POS_TERMINAL" +
                params:`Authorization:${that.user.session}\r\nmid:${that.user.mid}\r\nAccept:*/*\r\n`,
                //method: 0 get ,1 post
                method: 1,
                //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
                ContentType: "application/json"
            };
            console.log('head ====>', JSON.stringify(head))
            let body = {};
            body = JSON.stringify(body) + "\r\n";
            console.log("body ====> ", JSON.stringify(body))
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseBankListData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, ReadBankUrl, body, "","", 30, 1, that.httpCB);

            console.log("666666666:====>", JSON.stringify(httpret));
        },

        parseBankListData: function (data) {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 1112:", decodeStr, "\n u8arr:", u8arr);
            if (decodeStr) {
                let data = JSON.parse(decodeStr);
                console.log("data from bankList ====> ", data)

                if (data) {
                    if(data.responseCode === "00"){
                        this.bankList = data
                        this.notifyPropsChanged()
                        console.log("banklist ====> ", JSON.stringify(this.bankList))
                    }else {
                        console.log("data ====>", JSON.stringify(data))
                    }
                } else {
                    console.log('---------> first else:', data)
                    // this.isLoading = false;
                    // this.TipsText = "Nothing here";
                    // this.notifyPropsChanged();
                }
            }
            else {
                console.log('---------> seconds else:', data)
            }
        },

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        notMe(){
            this.nameEnquiry = false;
            this.searchBank = false
            this.nameEnquiryResponse = {};
            this.notifyPropsChanged()
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

        doNameSearch(){
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.nameEnquiryLoading = true
            if(that.transferTypeValue === "Transfer to CoreBank"){
                that.nameEnquiryRequest.accountBankCode = "000000"
                this.fundTransferRequest.bankName = "CoreBank"
                this.fundTransferRequest.bankCode = "000000"
            }

            that.notifyPropsChanged();
            let head = {
                // params: send parameters by request header
                // "headerTest1:aaa\r\nheaderTest2:bbb\r\nemail:ndubisijnr@gmail.com" + "\r\npassword:123456\r\nsource:POS_TERMINAL" +
                params:`Authorization:${that.user.session}\r\nmid:${that.user.mid}\r\nAccept:*/*\r\n`,
                //method: 0 get ,1 post
                method: 1,
                //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
                ContentType: "application/json"
            };
            console.log('head ====>', JSON.stringify(head))
            let body = this.nameEnquiryRequest;
            body = JSON.stringify(body) + "\r\n";
            console.log("body ====> ", JSON.stringify(body))
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, NameEnquiryUrl, body, "","", 30, 1, that.httpCB);

            console.log("666666666:====>", JSON.stringify(httpret));
        },

        parseData: function (data)  {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
            if (decodeStr) {
                this.loading = false
                this.notifyPropsChanged();
                let data = JSON.parse(decodeStr);
                console.log("data from name enquiry ====> ", data)

                if (data) {
                    if(data.responseCode === "00"){
                        this.nameEnquiryLoading = false
                        this.nameEnquiryResponse = data
                        this.fundTransferRequest.sessionId = this.nameEnquiryResponse.sessionId
                        this.fundTransferRequest.creditAccountNumber = this.nameEnquiryResponse.accountNumber
                        this.fundTransferRequest.creditAccountName = this.nameEnquiryResponse.accountName
                        this.fundTransferRequest.debitAccountNumber = this.user.customerOrganisationWallet
                        this.fundTransferRequest.debitAccountName = this.user.customerFirstName + ' ' + this.user.customerLastName
                        this.nameEnquiry = true
                        this.notifyPropsChanged()
                        console.log("response from name enquiry ====> ", JSON.stringify(this.nameEnquiryResponse))
                    }else {
                        this.nameEnquiryLoading = false
                        this.isError = true
                        this.error = data.responseMessage
                        this.notifyPropsChanged()
                        console.log("data ====>", JSON.stringify(data))
                    }
                }
                else {
                    this.nameEnquiryLoading = false
                    this.notifyPropsChanged()
                    this.error = data.responseMessage
                    this.isError = true
                    console.log('---------> first else:', data)
                    // this.isLoading = false;
                    // this.TipsText = "Nothing here";
                    // this.notifyPropsChanged();
                }
            }
            else {
                this.nameEnquiryLoading = false
                this.loading = false
                this.isError = true

                this.error = data
                this.notifyPropsChanged();
                console.log('---------> seconds else:', data)
            }
        },

        handleClick(args){
            this.transferType = true
            this.transferTypeValue = args
            if(this.transferTypeValue === 'Transfer to Other Banks'){
                this.otherBanks = true
                this.banks = GET_BANK_LIST
            }else{
                this.otherBanks = false
            }
            this.notifyPropsChanged();

        },

        onFail: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }
            navigateReplace({
                target: "pay",
                type: "cancel",
                data:this.user
            });
        },

        hideModel: function () {
            this.showModel = false;
            this.selectedBank = null
            this.otherBanks = false
            this.notifyPropsChanged();
        },

        handleCancel: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }else if(this.transferType) {
                this.transferType = false;
                this.isSelectedBank = false
                this.otherBanks = false
                this.notifyPropsChanged();
                return;
            }else if(this.transferType && this.otherBanks){
                this.otherBanks = false
                this.searchBank = false
                this.transferType = true;
                this.isSelectedBank = false
                this.notifyPropsChanged();
                return;
            }
            this.onFail();
        },

        navigateTo: function (args) {
            GLOBAL_JUMP("", args);
        },

        openBankList(){
            this.searchBank = true
            this.banks = GET_BANK_LIST
            this.notifyPropsChanged()
        },

        handleNext: function () {
            console.log('accountNumber ===> ', this.accountNumberStr)
            if(this.transferType && this.transferTypeValue === 'Transfer to Other Banks'){
                if(this.isSelectedBank){
                    this.navigateTo({user:this.user, fundRequest:this.fundTransferRequest})
                }else{
                    this.searchBank = true;
                    this.isSelectedBank =true
                    this.otherBanks = true;
                    this.notifyPropsChanged()
                }

            }else{
                this.navigateTo({user:this.user, fundRequest:this.fundTransferRequest})
            }
        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "0":
                    if(!this.value) break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    if (this.showModel) break;
                    if(this.value.length>12) break;
                    this.value += key;
                    this._formatInput();
                    break;
                case "cancel":
                    if(this.transactionSummary){
                        this.transferType = true
                        this.nameEnquiry = true
                        this.transactionSummary = false
                        this.notifyPropsChanged()
                    }
                    else if(this.transactionPin) {
                        this.transactionSummary = true
                        this.transactionPin = false
                        this.notifyPropsChanged()
                    }
                    else{
                        this.isError = false
                        this.notifyPropsChanged();
                        this.handleCancel();
                        this.notMe()
                    }
                    break;
                case "backspace":
                    if (this.showModel) {
                        this.hideModel();
                        return;
                    }
                    this.reduceNum();
                    break;
                case "return":
                    if (this.showModel || this.isError) {
                        this.isError = false
                        this.notifyPropsChanged();
                        this.hideModel();
                        return;
                    }
                    else if(!this.nameEnquiry){
                        this.nameEnquiryRequest.accountNumber = this.accountNumberStr
                        if(this.transferTypeValue === 'Transfer to Other Banks' && !this.isSelectedBank){
                            this.searchBank = true
                            this.notifyPropsChanged();
                        }else{
                            this.notifyPropsChanged();
                            this.doNameSearch()
                        }
                    }
                    else{
                        if(this.transferType) this.navigatorTransactionSummary();
                        if(this.transactionSummary)this.enterPin();
                        if(this.transactionPin) this.doTransfer();
                    }
                    break;
                default:
                    break;
            }
        },
    },




    onWillMount: function (req) {
        this.flow =Tos.GLOBAL_TRANSACTION.flow;
        this.trans =Tos.GLOBAL_TRANSACTION.trans;
        this.title =  this.trans.transName;
        this.banks = GET_BANK_LIST

        if(req){
            this.user = req.data
        }

        this.notifyPropsChanged()
    },

    onMount: function () {
        this.fundTransferRequest.amount = GET_SHOW_AMOUNT(this.trans.amount)
        this.banks = GET_BANK_LIST
    },

    onWillUnmount: function () {
        Tos.PrnClose();
    }
})