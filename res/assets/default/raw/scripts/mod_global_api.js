// const clearUserInfo = require("./mod_global_config").clearUserInfo;

function GLOBAL_API() {
    this.STAGE = "prod"
    this.BASE_URL2= `https://tms-api-prod.corestepbank.com/${this.STAGE}`
    this.BASE_URL = "https://portal.pixpay.ng/api/payment"
    this.GET_STUDENT_PENDING_FEES = `${this.BASE_URL}/GetStudentPendingFees`
    this.GET_STUDENT_BILLS = `${this.BASE_URL}/GetStudentBills`
    this.GET_TRANSACTION_HISTORY = `${this.BASE_URL}/GetTransactionHistory`
    this.FETCH_STUDENT_DETAILS = `${this.BASE_URL}/FetchStudentDetails`
    this.FETCH_STUDENT_TOTAL_PENDING_FEE = `${this.BASE_URL}/GetStudentTotalPendingFees`
    this.START_POS_PAYMENT =  `${this.BASE_URL}/StartPosPayment`
    this.NOTIFY_PAYMENT = `${this.BASE_URL}/NotifyPayment`
    this.VERIFY_TRANSACTION =  `${this.BASE_URL}/VerifyTransaction`
    this.TERMINAL_LOGIN = `${this.BASE_URL2}/authentication/terminal-login`
    this.TMS_PURCHASE = `${this.BASE_URL2}/payment/card`;


    // this.TMS_PURCHASE = `${this.BASE_URL2}/tms/purchase`;
    this.TMS_PURCHASE = `${this.BASE_URL2}/payment/card`;

    this.callApi = function (url,request,onSuccess, onError) {
        this.globalChooseNetworks();

        try{
            if(this.globalChooseNetworks()){
                let head = {
                    params:`pxp-key:PXP-SLnLTAAJt0XNWZZvnMkI7SIATOA5L1iTrAHBD0p4RhqlJdN4FR\r\nAccept:*/*\r\n`,
                    method: 1,
                    ContentType: "application/json"
                };
                let requestString = JSON.stringify(request) + "\r\n";
                console.log("REQUEST:====>", requestString);
                let that = this
                this.httpCB = function (ret) {
                    console.log('ret ====>', JSON.stringify(ret));
                    let data = ret.data && ret.data.response_buf || [];
                    if(ret.code < 0) that.parseData(data,onSuccess,onError);
                    else that.parseData(data,onSuccess,onError);
                };
                let httpret = Tos.HttpclientCommon(head, url, requestString, "","", 30, 1, that.httpCB);
                console.log('httpret:====>', JSON.stringify(httpret));
            }
            else{
                onError('network Error')
                console.log('network Error')
            }
        }catch(err){
            onError('network Error')
            console.log("Error ===>", err)
        }

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
        console.log("selectNetwork =========>", ret.code);
        ret = Tos.SocGetProperty(0);
        console.log("selectNetwork get =========>", ret.code, ret.data);
        return true;
    }

    this.parseData = function (data,onSuccess,onError) {
        let SeparSize = 1<<12;
        try{
            let u8arr = new Uint8Array(data);
            console.log('u8arr', u8arr)

            let len = Math.ceil(u8arr.length / SeparSize) || 1;
            console.log('len:====>', len);
            let decodeStr = "";
            let idx = 0;
            while (len) {
                let arr = [];
                if (len === 1) {
                    arr = u8arr;
                } else {
                    arr = u8arr.slice(idx * SeparSize, SeparSize);
                }
                --len;
                ++idx;
                let str = String.fromCharCode.apply(null, arr);
                decodeStr += str;
                console.log('decodeStr AAAAAA:====>', JSON.stringify(str));
            }
            if (decodeStr) {
                let parsedData = JSON.parse(decodeStr);
                console.log('RESPONSE RT:====>', JSON.stringify(parsedData))
                
                if(parsedData.Status === "success" || parsedData.responseCode === "00"){
                    // console.log('returned responseCode =========>', parsedData.responseCode?parsedDatadData.responseCode:parsedData.isoResponseCode)
                    onSuccess(parsedData)
                }
                else {
                    onError(parsedData)
                    console.log('parsedData', JSON.stringify(parsedData))
                }
            }
            else {
                onError('something went wrong. u8arr')
            }
        }catch(err){
            onError(err)
            console.log('catched: ===>', err)
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
