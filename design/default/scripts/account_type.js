var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("account_type", {
    data: {
        user:"",
        accountType:"Default"
    },

    methods: {

        selectAccountType:function (arg){
            const that = this;
            that.accountType = arg;
            that.notifyPropsChanged()

            // GLOBAL_JUMP('', that.accountType) check here for refactoring

        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    //TODO PERFORM CANCEL ACTION HERE
                    break;
                case "return":
                    //TODO PERFORM RETURN ACTION HERE
                    break;
                default:
                    break;
            }
        },


        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
        },

    },

    onWillMount: function (req) {
        console.log('req===>', JSON.stringify(req));
        this.user = Tos.GLOBAL_CONFIG.userInfo

    },

    onMount: function () {

    },

    onWillUnmount: function () {}
})