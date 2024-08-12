var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("balance", {
    data: {
        showModel:false,
        user:null,
        loading:false,
        showTip:"Fetching account balance",
        balanceEnquiryRequest:{accountNumber:""},
        balance:"0.00"
    },

    methods:{
        _formatInput: function (amount) {
            let amountFloat = parseFloat(amount).toFixed(2);
            const parts  = amountFloat.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            return  parts.join(".")
        },


        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
        },

        readBalance: function(){
            const that = this
            console.log('reading balance ===> ')
            that.loading = true
            that.notifyPropsChanged();
            const endpoint = `${Tos.GLOBAL_API.BALANCE_ENQUIRY}/${that.user.terminal.terminalAccountNumber}`
            console.log('endpoint==>', endpoint)
            function onSuccess(data){
                console.log('balance response =====> ',JSON.stringify(data))
                that.loading = false
                console.log('response ===>', JSON.stringify(data))
                // that.balance = that._formatInput(data.accountBalance)
                that.notifyPropsChanged();
            }
            function onError(data){
                that.loading = false
                that.error = data
                that.notifyPropsChanged();
                console.log('response ===>', JSON.stringify(data))
            }
            Tos.GLOBAL_API.callApi(endpoint,"",onSuccess,onError, 0,that.user.organisation.organisationId)
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
        console.log('USER:', JSON.stringify(this.user))
        this.readBalance()
    },

    onMount: function () {

    },

    onWillUnmount: function () {}
})