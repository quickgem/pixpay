ViewModel("transactionPage", {
    data: {
        user:null,
        loading:false,
        transactions:null,
        is_notTransactions:true,
        error:null,
        readTransactionRequest:{
            accountNumber:null,
            page:1
        },
        showTip:'Fetching Transactions'
    },

    methods: {
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

        onKeyDown: function(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    navigateReplace({
                        target: "pay",
                        close_current:true,
                        //data:this.user
                    });
                    break;
                default:
                    break;
            }
        },

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        readTransactions() {
            this.loading = true
            this.notifyPropsChanged()
            function onSuccess(data){
                this.loading = false
                this.notifyPropsChanged();
            }
            function onError(data){
                this.loading = false
                this.error = data
                this.notifyPropsChanged();
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TRANSACTION_HISTORY,this.readTransactionRequest,onSuccess,onError)
        }
    },

    onWillMount: function (req) {
        this.user = Tos.GLOBAL_CONFIG.userInfo
    },

    onMount: function () {
        this.readTransactions()
    },

    onWillUnmount: function () {}
})