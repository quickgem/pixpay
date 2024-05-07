const {saveUserInfo} = require("./mod_global_config");
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


        readBalance(){
            this.loading = true
            this.balanceEnquiryRequest.accountNumber = this.user.customerOrganisationWallet
            this.notifyPropsChanged();
            function onSuccess(data){
                this.loading = false
                this.notifyPropsChanged();
            }
            function onError(data){
                this.loading = false
                this.error = data
                this.notifyPropsChanged();
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.BALANCE_ENQUIRY,this.balanceEnquiryRequest,onSuccess,onError)
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
        if(req){
            this.user = Tos.GLOBAL_CONFIG.userInfo
        }
    },

    onMount: function () {
        this.readBalance()

    },
    onWillUnmount: function () {

    }
})