// const clearUserInfo = require("./mod_global_config").clearUserInfo;

function GLOBAL_API() {
    this.BASE_URL = "https://biz.corestepbank.com"
    this.STAGE = "prod"
    this.BASE_URL2= `https://tms-api-prod.corestepbank.com/${this.STAGE}`
    this.BALANCE_ENQUIRY = `${this.BASE_URL2}/terminal/read-by-terminal-id-post`;
    this.NAME_ENQUIRY = `${this.BASE_URL2}/payment/name-enquiry`;
    this.FUND_TRANSFER = `${this.BASE_URL2}/payment/transfer`;
    this.BANK_LIST = `${this.BASE_URL}/transaction/bank-list`;
    this.LOGIN = `${this.BASE_URL2}/authentication/login`;
    this.TERMINAL_LOGIN = `${this.BASE_URL2}/authentication/terminal-login`
    // this.TRANSACTION_HISTORY = `${this.BASE_URL}/wallet/read-mini-by-account-number`;
    this.TRANSACTION_HISTORY = `${this.BASE_URL2}/transaction/read-by-terminal-id`;
    // this.TERMINAL_TRANSACTIONS = `${this.BASE_URL2}/terminal-transaction/read-by-terminal-transaction-organisation-id/{organisationId}`
    this.TERMINAL_TRANSACTIONS = `${this.BASE_URL2}/terminal-transaction/read-by-terminal-id-post`

    // this.TMS_PURCHASE = `${this.BASE_URL2}/tms/purchase`;
    this.TMS_PURCHASE = `${this.BASE_URL2}/payment/card`;

    this.callApi = function (url, request, onSuccess, onError, method, mid) {
        try {
            this.globalChooseNetworks();

            if (this.globalChooseNetworks()) {
                let head = {
                    params: `Authorization:${Tos.GLOBAL_CONFIG.userInfo.token}\r\nmid:${mid}\r\nAccept:*/*\r\n`,
                    method: method,
                    ContentType: "application/json"
                };
                let requestString = JSON.stringify(request) + "\r\n";
                console.log("REQUEST:====>", requestString);
                console.log("REQUEST HEAD:====>", JSON.stringify(head));
                let that = this;
                this.httpCB = function (ret) {
                    console.log('ret ====>', JSON.stringify(ret));
                    let data = ret.data && ret.data.response_buf || [];
                    try {
                        that.parseData(data, onSuccess, onError);
                    } catch (error) {
                        onError('Error parsing data: ' + error.message);
                        console.error('Error parsing data:', error);
                    }
                };
                let httpret = Tos.HttpclientCommon(head, url, requestString, "", "", 30, method, that.httpCB);
                console.log('httpret:====>', JSON.stringify(httpret));
            } else {
                onError('Network Error');
                console.log('Network Error');
            }
        } catch (error) {
            onError('Error during API call: ' + error);
            console.error('Error during API call:', error);
        }
    }

    this.globalChooseNetworks = function () {
        try {
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
            console.log("selectNetwork =========>", JSON.stringify(ret.code));
            ret = Tos.SocGetProperty(0);
            console.log("selectNetwork get =========>", JSON.stringify(ret.code), JSON.stringify(ret.data));
            return true;
        } catch (error) {
            console.error('Error during network selection:', error);
            return false;
        }
    }

    this.parseData = function (data, onSuccess, onError) {
        try {
            let u8arr = new Uint8Array(data);
            console.log('u8arr', u8arr)
            let decodeStr = String.fromCharCode.apply(null, u8arr);
            if (decodeStr) {
                let parsedData = JSON.parse(decodeStr);
                console.log('RESPONSE RT:====>', JSON.stringify(parsedData));
                if (parsedData.responseCode === "00" || parsedData.isoResponseCode === "00" || parsedData.transactionResponseCode === "00") {
                    console.log('returned responseCode =========>', parsedData.responseCode ? parsedData.responseCode : parsedData.isoResponseCode);
                    onSuccess(parsedData);
                } else if (parsedData.responseCode === "115") {
                    Tos.GLOBAL_CONFIG.userInfo = {};
                    navigateTo({
                        target: "login",
                        close_current: true,
                    });
                } else {
                    onError(parsedData);
                    console.log('parsedData', JSON.stringify(parsedData));
                }
            }
            else {
                onError('Something went wrong.');
            }
        } catch (error) {
            onError('Error parsing response data: ' + error);
            console.error('Error parsing response data:', error);
        }
    }

    this.init = function () {
        try {
            if (!Tos.GLOBAL_API) {
                Tos.GLOBAL_API = {};
            }
            Tos.GLOBAL_API = this;
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    };
}

exports.GLOBAL_API = GLOBAL_API;


// function GLOBAL_API() {
//     this.BASE_URL = "https://biz.corestepbank.com"
//     this.BALANCE_ENQUIRY = `${this.BASE_URL}/wallet/balance-enquiry`;
//     this.NAME_ENQUIRY = `${this.BASE_URL}/transaction/name-enquiry`;
//     this.FUND_TRANSFER = `${this.BASE_URL}/transaction/fund-transfer`;
//     this.BANK_LIST = `${this.BASE_URL}/transaction/bank-list`;
//     this.LOGIN = `${this.BASE_URL}/authentication/login`;
//     // this.TRANSACTION_HISTORY = `${this.BASE_URL}/wallet/read-mini-by-account-number`;
//     this.TRANSACTION_HISTORY = `${this.BASE_URL}/transaction/read-by-terminal-id`;
//     this.TMS_PURCHASE = `${this.BASE_URL}/tms/purchase`;
//
//     this.callApi = function (url,request,onSuccess, onError) {
//         this.globalChooseNetworks();
//
//         if(this.globalChooseNetworks()){
//             let head = {
//                 params:`Authorization:${Tos.GLOBAL_CONFIG.userInfo.session}\r\nmid:${Tos.GLOBAL_CONFIG.userInfo.mid}\r\nAccept:*/*\r\n`,
//                 method: 1,
//                 ContentType: "application/json"
//             };
//             let requestString = JSON.stringify(request) + "\r\n";
//             console.log("REQUEST:====>", requestString);
//             let that = this
//             this.httpCB = function (ret) {
//                 console.log('ret ====>', JSON.stringify(ret));
//                 let data = ret.data && ret.data.response_buf || [];
//                 that.parseData(data,onSuccess,onError);
//             };
//             let httpret = Tos.HttpclientCommon(head, url, requestString, "","", 30, 1, that.httpCB);
//             console.log('httpret:====>', JSON.stringify(httpret));
//         }
//         else{
//             onError('network Error')
//             console.log('network Error')
//         }
//
//     }
//
//     this.globalChooseNetworks = function () {
//         let type = 1; // WIFI : 1 ,GPRS : 0
//         let ret = Tos.WifiCheck();
//         console.log("WifiCheck =========>", ret.code);
//         if (ret.code < 0) {
//             ret = Tos.MobileDataAvailable();
//             console.log("MobileDataAvailable =========>", ret.code);
//             if (ret.code <= 0) {
//                 return false;
//             } else {
//                 type = 0;
//             }
//         } else {
//             type = 1;
//         }
//         ret = Tos.SocSetProperty(type);
//         console.log("selectNetwork =========>", ret.code);
//         ret = Tos.SocGetProperty(0);
//         console.log("selectNetwork get =========>", ret.code, ret.data);
//         return true;
//     }
//
//     this.parseData = function (data,onSuccess,onError) {
//         let u8arr = new Uint8Array(data);
//         let decodeStr = String.fromCharCode.apply(null, u8arr);
//         if (decodeStr) {
//             let parsedData = JSON.parse(decodeStr);
//             console.log('RESPONSE RT:====>', JSON.stringify(parsedData))
//             if(parsedData.responseCode === "00" || parsedData.isoResponseCode  === "00"){
//                 console.log('returned responseCode =========>', parsedData.responseCode?parsedData.responseCode:parsedData.isoResponseCode)
//                 onSuccess(parsedData)
//             }
//             else if (data.responseCode === "115"){
//                 Tos.GLOBAL_CONFIG.userInfo = {}
//                 navigateTo({
//                     target: "login",
//                     close_current: true,
//                 });
//             }
//             else {
//                 onError(parsedData)
//                 console.log('parsedData', JSON.stringify(parsedData))
//             }
//         }
//         else {
//             onError('something went wrong.')
//
//         }
//     }
//
//     this.init = function ()
//     {
//         if(!Tos.GLOBAL_API) {
//             Tos.GLOBAL_API = {};
//         }
//         Tos.GLOBAL_API = this;
//     };
//
//
//
//
// }
// exports.GLOBAL_API = GLOBAL_API;







