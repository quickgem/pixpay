
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
        password:6,
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

        generateSimpleReference(length) {
            let result = '';
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const charactersLength = characters.length;

            // Add a prefix with the current timestamp for additional uniqueness
            const timestamp = Date.now().toString(36);

            // Generate random characters for the reference
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return `${timestamp}-${result}`;
        },


        callTransferFundsEndpoint(){
            let that = this;
            that.loading = true
            const uniqueNumber = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1;
            this.fundsRequest.reference = `corebank-ref-${this.generateSimpleReference(14)}`
            console.log(this.fundsRequest.reference)
            this.fundsRequest.pin = this.value
            that.notifyPropsChanged();
            function onSuccess(data){
                that.loading = false
                that.notifyPropsChanged();
                navigateReplace({
                    target: "transferSuccess",
                    type: "success",
                    close_current: true,
                    data:data,
                    code: data.responseCode?data.responseCode:data.isoResponseCode,
                });
            }
            function onError(data){
                that.loading = false
                that.error = data.responseMessage
                that.isError = true
                that.notifyPropsChanged();
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.FUND_TRANSFER,this.fundsRequest,onSuccess,onError,1,Tos.GLOBAL_CONFIG.userInfo.organisation.organisationId)
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
                    if (this.value.length >= this.password) {
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