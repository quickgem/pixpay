// const clearUserInfo = require("./mod_global_config").clearUserInfo;

function GLOBAL_API() {
    this.BASE_URL = "https://biz.corestepbank.com"
    this.BALANCE_ENQUIRY = `${this.BASE_URL}/wallet/balance-enquiry`;
    this.NAME_ENQUIRY = `${this.BASE_URL}/transaction/name-enquiry`;
    this.FUND_TRANSFER = `${this.BASE_URL}/transaction/fund-transfer`;
    this.BANK_LIST = `${this.BASE_URL}/transaction/bank-list`;
    this.LOGIN = `${this.BASE_URL}/authentication/login`;
    this.TRANSACTION_HISTORY = `${this.BASE_URL}/wallet/read-mini-by-account-number`;
    this.TMS_PURCHASE = `${this.BASE_URL}/tms/purchase`;

    this.callApi = function (url,request,onSuccess, onError) {
        this.globalChooseNetworks();
        let head = {
            params:`Authorization:${Tos.GLOBAL_CONFIG.userInfo.session}\r\nmid:${Tos.GLOBAL_CONFIG.userInfo.mid}\r\nAccept:*/*\r\n`,
            method: 1,
            ContentType: "application/json"
        };
        let requestString = JSON.stringify(request) + "\r\n";
        console.log("REQUEST:====>", requestString);
        let that = this
        this.httpCB = function (ret) {
            console.log("RESPONSE RT:====>", JSON.stringify(ret));
            let data = ret.data && ret.data.response_buf || [];
            that.parseData(data,onSuccess,onError);
        };
        let httpret = Tos.HttpclientCommon(head, url, requestString, "","", 30, 1, that.httpCB);
        console.log("RESPONSE:====>", JSON.stringify(httpret));
    }

    this.globalChooseNetworks = function () {
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
    }

    this.parseData = function (data,onSuccess,onError) {
        let u8arr = new Uint8Array(data);
        let decodeStr = String.fromCharCode.apply(null, u8arr);
        if (decodeStr) {
            let parsedData = JSON.parse(decodeStr);
            if(parsedData.responseCode === "00"){
                console.log('returned responseCode =========>', JSON.stringify(this.response));
                onSuccess(parsedData)
            }else if (data.responseCode === "115"){
                Tos.GLOBAL_CONFIG.userInfo = {}
                navigateTo({
                    target: "login",
                    close_current: true,
                });
            }else {
                onError(parsedData)
            }
        }
        else {
            onError({})
        }
    }

    this.init = function ()
    {
        if(!Tos.GLOBAL_API) {
            Tos.GLOBAL_API = {};
        }
        Tos.GLOBAL_API = this;
    };




}
exports.GLOBAL_API = GLOBAL_API;







