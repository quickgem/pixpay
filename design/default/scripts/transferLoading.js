
ViewModel("transferLoading",{
    data:{
        showTip:'Loading...',
        loading:false,
        timeOutShow:"5s",
        timeOut:"5",
        isExit:false,
        user:null,
        fundsRequest:null,
        error:null,
        isError:false,
        isShowExit:false,
        Notice:"Notice!",
        noticeText:"Cancel Transaction?",
        flow:{},
        trans:{},
        title:"Complete Transaction",
        valueLen: 0,
        lineX: "",
        password:"1234",
        value:""
    },

    methods:{

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        handleCancel(){
            this.isShowExit = false
            this.notifyPropsChanged();
        },

        handleConfirm(){
            this.isShowExit = false
            this.notifyPropsChanged();
            navigateReplace({
                target: "pay",
                close_current: true,
                //data:this.user
            });
        },

        reference(length){
            let result = ""
            let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            let characterLength = characters.length
            for(let i=0; i < length; i++){
                result += characters.charAt(Math.floor(Math.random() * characterLength));
            }
            return result
        },

        doTransfer(){
            this.fundsRequest.reference = `corebank-${this.reference(Math.floor(Math.random() * (30 - 10 + 1)) + 10)}`
            this.fundsRequest.narration = `trf to ${this.creditAccountName}`.toLowerCase()
            this.fundsRequest.pin = this.value
            console.log("transferPayload before: =>", JSON.stringify(this.fundsRequest))
            this.callTransferFundsEndpoint()
        },

        callTransferFundsEndpoint(){
            let that = this;
            that.loading = true
            that.notifyPropsChanged();
            function onSuccess(data){
                this.loading = false
                this.notifyPropsChanged();
                this.fundsRequest = null
                navigateReplace({
                    target: "transferSuccess",
                    type: "success",
                    close_current: true,
                    data:data
                });
            }
            function onError(data){
                this.loading = false
                this.fundsRequest.reference = null
                this.fundsRequest.narration = null
                this.error = data.responseMessage
                this.notifyPropsChanged();
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.FUND_TRANSFER,this.fundsRequest,onSuccess,onError)
        },


        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    if (this.value.length >= this.password.length) {
                        break;
                    }
                    this.value += key;
                    this.valueLen = this.value.length;
                    this.lineX = 25 + (this.valueLen - 1) * 22 + "";
                    console.log("value ========> " + this.value);
                    console.log("valueLen ========> " + this.valueLen);
                    console.log("lineX ========> " + this.lineX);
                    this.notifyPropsChanged();
                    break;
                case "backspace":
                    console.log("delete value ======================>" + this.value);
                    if (this.value.length > 0) {
                        this.value = this.value.substring(0, this.value.length - 1);
                        this.valueLen = this.value.length;
                        this.lineX = 25 + (this.valueLen - 1) * 22 + "";
                        this.notifyPropsChanged();
                    }
                    return;
                case "cancel":
                    if(this.isError){
                        this.isError = false
                        this.notifyPropsChanged();
                    }else{
                        this.isShowExit = true
                        this.notifyPropsChanged()
                    }
                    break;
                default:
                    break;
            }
        },

    },

    onWillMount(req){

        if(req) {
            this.user = Tos.GLOBAL_CONFIG.userInfo
            this.fundsRequest = req.data.fundRequest
            this.notifyPropsChanged()
        }
    },

    onMount(){

    },

    onWillUnmount(){

    },


})