const MakeTransferUrl = 'https://biz.corestepbank.com/transaction/fund-transfer'

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
                data:this.user
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

        callTransferFundsEndpoint(){
            this.GLOBAL_CHOOSE_NETWORKs();
            let that = this;
            that.loading = true
            that.notifyPropsChanged();
            let head = {
                // params: send parameters by request header
                // "headerTest1:aaa\r\nheaderTest2:bbb\r\nemail:ndubisijnr@gmail.com" + "\r\npassword:123456\r\nsource:POS_TERMINAL" +
                params:`Authorization:${that.user.session}\r\nmid:${that.user.mid}\r\nAccept:*/*\r\n`,
                //method: 0 get ,1 post
                method: 1,
                //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
                ContentType: "application/json"
            };
            console.log('head ====>', JSON.stringify(head))
            let body = that.fundsRequest;
            body = JSON.stringify(body) + "\r\n";
            console.log("body ====> ", JSON.stringify(body))
            this.httpCB = function (ret) {
                console.log("httpCB 0000 =====>", JSON.stringify(ret));
                let data = ret.data&& ret.data.response_buf || [];
                JSON.stringify(that.parseData(data));
            };
            // head -- url -- body -- cert -- port  -- timeout -- cb
            // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
            let httpret = Tos.HttpclientCommon(head, MakeTransferUrl, body, "","", 30, 1, that.httpCB);
            console.log("666666666:====>", JSON.stringify(httpret));
        },

        parseData: function (data) {
            let u8arr = new Uint8Array(data);
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
            this.loading = false
            this.notifyPropsChanged();
            if (decodeStr) {
                let data = JSON.parse(decodeStr);

                if(data.responseCode === "00"){
                    this.fundsRequest = null
                    navigateReplace({
                        target: "transferSuccess",
                        type: "success",
                        close_current: true,
                        data:{user:this.user,fundsResponse:data}
                    });
                }
                else {
                    this.isError = true
                    this.fundsRequest.reference = null
                    this.fundsRequest.narration = null
                    this.error = data.responseMessage
                    this.notifyPropsChanged();
                    console.log("data ====>", JSON.stringify(data))
                    console.log("transferPayload after: =>", JSON.stringify(this.fundsRequest))
                }

            }
            else {
                this.isError = true
                this.fundsRequest.reference = null
                this.fundsRequest.narration = null
                this.error = data.responseMessage
                this.notifyPropsChanged();
                console.log('---------> seconds else:', data)
                console.log("transferPayload after: =>", JSON.stringify(this.fundsRequest))
            }
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