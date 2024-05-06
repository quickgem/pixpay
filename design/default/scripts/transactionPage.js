const transactionUrl = 'https://biz.corestepbank.com/wallet/read-mini-by-account-number'

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
                        data:this.user
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

        readTransactions(){
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.readTransactionRequest.accountNumber = that.user.customerOrganisationWallet
            that.notifyPropsChanged();
            let head = {
                // params: send parameters by request header
                params:`Authorization:${that.user.session}\r\nmid:${that.user.mid}\r\nAccept:*/*\r\n`,
                //method: 0 get ,1 post
                method: 1,
                //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
                ContentType: "application/json"
            };
            console.log('head ====>', JSON.stringify(head))
            let body = that.readTransactionRequest;
            body = JSON.stringify(body) + "\r\n";
            console.log("body ====> ", JSON.stringify(body))
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, transactionUrl, body, "","", 30, 1, that.httpCB);

            console.log("666666666:====>", JSON.stringify(httpret));

        },

        parseData: function (data) {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
            if (decodeStr) {
                this.loading = false
                this.notifyPropsChanged();
                let data = JSON.parse(decodeStr);
                console.log("data from transaction ====> ", data)

                if (data.responseCode === "00") {
                    this.loading = false
                    this.is_notTransactions = false
                    this.transactions = data
                    this.notifyPropsChanged()
                    console.log("response from transactions ====> ", JSON.stringify(this.transactions))
                }
                else {
                    this.loading = false
                    this.error = data
                    this.notifyPropsChanged()
                    console.log('---------> first else:', JSON.stringify(data))
                }
            }
            else {
                this.loading = false
                this.error = data
                this.notifyPropsChanged();
                console.log('---------> seconds else:', JSON.stringify(data))
            }
        },
    },

    onWillMount: function (req) {
        if(req){
            this.user = Tos.GLOBAL_CONFIG.userInfo
        }
    },

    onMount: function () {
        this.loading = true;
        this.notifyPropsChanged();
        this.readTransactions()
    },

    onWillUnmount: function () {}
})