var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;

const BalanceEnquiryUrl = "https://biz.corestepbank.com/wallet/balance-enquiry"

ViewModel("balance", {
    data: {
        showModel: false,
        user:null,
        loading:false,
        showTip:"Fetching account balance",
        balanceEnquiryRequest:{accountNumber:""},
        balanceResponse:"0.00",
        balance:""
    },

    methods:{
        _formatInput: function () {
            if(this.balance === "") this.balanceResponse = "0.00";
            this.balance = parseFloat(this.balance).toFixed(2);
            const parts  = this.balance.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            this.balanceResponse = parts.join(".")
            this.notifyPropsChanged();
        },

        toTransaction(){
            navigateReplace({
                target: "transactionPage",
                data:this.user
            });
        },

        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
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

        readBalance(){
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.balanceEnquiryRequest.accountNumber = that.user.customerOrganisationWallet
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

            let body = that.balanceEnquiryRequest;
            body = JSON.stringify(body) + "\r\n";
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, BalanceEnquiryUrl, body, "","", 30, 1, that.httpCB);

            console.log("666666666:====>", JSON.stringify(httpret));


        },

        parseData: function (data) {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
            if (decodeStr) {
                let data = JSON.parse(decodeStr);

                if (data.responseCode === "00") {
                    this.loading = false
                    this.balance = data.accountBalance
                    this._formatInput()
                    this.notifyPropsChanged()
                } else {
                    this.loading = false
                    this.notifyPropsChanged()
                }
            }
            else {
                this.loading = false
                this.notifyPropsChanged();
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
                data:this.user
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
                    this.navigateTo(this.user)
                }
                this.searchBank = true;
                this.otherBanks = true;
                this.notifyPropsChanged()

            }else{
                this.navigateTo(this.user)
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
        if(req){
            this.user = req.data
            this. loading = true;
            this.notifyPropsChanged();
        }
    },

    onMount: function () {
        this.readBalance()

    },
    onWillUnmount: function () {

    }
})