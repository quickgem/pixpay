ViewModel("profile", {
    data: {
        showModel: false,
        nameSummary:"",
        user:null,
        fullName:"",
        isSupport:false,
        isChangePassword:false,
        isCloseBusiness:false,
        loading:false,
        isError:false,
        error:"",
        showTip:"",
        isNext:false,
        changePassword:{
            customerPassword:"",
            customerPasswordConfirmation:"",
            customerOldPassword:"",
            customerEmail:"",
        }
    },

    methods:{

        navigate(args){
            if(args==='support') {this.isSupport = true}
            if(args==='password'){this.isChangePassword = true}
            if(args==='close'){this.isCloseBusiness = true}
            this.notifyPropsChanged();
        },

        passwordNext(){
            if(this.isChangePassword){
                this.isNext=true
                this.notifyPropsChanged();
            }
        },

        closePopUp(){
            this.isCloseBusiness = false;
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
            if(this.isChangePassword && this.isNext){
                this.isNext = false
                this.notifyPropsChanged();
            }else{
                if(this.isSupport || this.isChangePassword){
                    this.isSupport = false;
                    this.isChangePassword = false;
                    this.notifyPropsChanged();
                }
                else{
                    navigateReplace({
                        target: "pay",
                        close_current:true
                        //data:this.user
                    });
                }
            }


        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    this.handleCancel();
                    break;
                case "backspace":
                    break;
                case "return":
                    break;
                default:
                    break;
            }
        },
    },

    onWillMount: function (req) {
        if(req){
            this.user = Tos.GLOBAL_CONFIG.userInfo
            this.nameSummary = Tos.GLOBAL_CONFIG.userInfo.organisation.organisationName[0]
            this.fullName = Tos.GLOBAL_CONFIG.userInfo.organisation.organisationName

            this.notifyPropsChanged()
        }

    },
    onMount: function () {
    },
    onWillUnmount: function () {
    }
})