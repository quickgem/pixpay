var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("accountType", {
    data: {
        user:"",
        accountType:"Default",
        isSaving:"#FFFFFF",
        isCurrent:"#FFFFFF",
        isDefault:"#FFFFFF"
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
                    break;
                case "Saving":
                    that.isDefault = '#FFFFFF';
                    that.isCurrent = '#FFFFFF';
                    that.isSaving = '#FFC002';
                    break;
                case "Current":
                    that.isDefault = '#FFFFFF';
                    that.isCurrent = '#FFC002';
                    that.isSaving = '#FFFFFF';
                    break;
                default:
                    break;
            }

            that.notifyPropsChanged()

            // GLOBAL_JUMP('', that.accountType) //TODO check here for refactoring

        },

        handleCancel:function(){
            navigateReplace({
                target: "inputAmt",
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
                    //TODO PERFORM RETURN ACTION HERE
                    GLOBAL_JUMP('', this.accountType) //TODO check here for refactoring
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