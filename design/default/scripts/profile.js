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
                    this.onFail();
                }
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
                    this.handleCancel();
                    break;
                case "backspace":
                    if (this.showModel) {
                        this.hideModel();
                        return;
                    }
                    this.reduceNum();
                    break;
                case "return":
                    if (this.showModel) {
                        this.hideModel();
                        return;
                    }
                    break;
                default:
                    break;
            }
        },
    },

    onWillMount: function (req) {
        if(req){
            this.user = Tos.GLOBAL_CONFIG.userInfo
            this.nameSummary = req.data.customerFirstName[0] + req.data.customerLastName[0]
            this.fullName = req.data.customerFirstName + req.data.customerLastName
        }

    },
    onMount: function () {
    },
    onWillUnmount: function () {
    }
})