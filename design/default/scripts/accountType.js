var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("accountType", {
    data: {
        user:"",
        accountType:"Default",
        isSaving:"#FFFFFF",
        isCurrent:"#FFFFFF",
        isDefault:"#FFFFFF",
        trans:{},
    },

    methods: {

        selectAccountType:function (arg){
            const that = this;
            that.accountType = arg;
            switch (that.accountType) {
                case "Default":
                    that.isDefault = '#FFC002';
                    that.isCurrent = '#FFFFFF';
                    that.isSaving = '#FFFFFF';
                    that.trans.accountType="00"
                    break;
                case "Savings":
                    that.isDefault = '#FFFFFF';
                    that.isCurrent = '#FFFFFF';
                    that.isSaving = '#FFC002';
                    that.trans.accountType="10"
                    break;
                case "Current":
                    that.isDefault = '#FFFFFF';
                    that.isCurrent = '#FFC002';
                    that.isSaving = '#FFFFFF';
                    that.trans.accountType="20"
                    break;
                default:
                    break;
            }

            that.notifyPropsChanged()

            GLOBAL_JUMP('') //TODO check here for refactoring

        },

        handleCancel:function(){
            navigateReplace({
                target: "pay",
                type: "cancel",
                close_current:true
                //data:this.user
            });
        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    //TODO PERFORM CANCEL ACTION HERE
                    this.handleCancel();
                    break;
                case "return":

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
        this.trans =Tos.GLOBAL_TRANSACTION.trans;
        console.log('req===>', JSON.stringify(req));
        this.user = Tos.GLOBAL_CONFIG.userInfo

    },

    onMount: function () {

    },

    onWillUnmount: function () {}
})