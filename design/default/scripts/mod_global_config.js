var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;
var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;
function GLOBAL_CONFIG() {
  this.config = {
        termId : "00000219",
        merchantId : "linjianzhang",
        merchantName:"Topwise",
        tpdu: "6000380000",
        head: "603200322012",

        timeout:60,
        resendTime:3,

        voucherNo:1,
        batchNO:1,
        maxTransNum:500,
        maxRefundAmt:50000000,

        securityPwd:"88888888",
        operatorPwd:"888888",
        printCount : 2,
        printGray:4,

        eSignSupport:true,
        reverselTime:3,
        reverselType:0 ,//0:reversel  next time ,1: at once
        countryCode:"156",
        networkParam:{
          addr_len: 4,
          port: 8889,
          addr: [203, 124, 15, 248],
           // addr: [192, 168, 214, 149],
            //   port: 777,
            soc_type: 0
        },
        userInfo: {
          responseCode:"",
          responseMessage:"",
          token:"",
          session:"",
          customerFirstName:"",
          customerLastName:"",
          customerEmail:"",
          customerPhone:"",
          customerCountry:"",
          customerOrganisationTerminalId:"",
          customerOrganisationWallet:"",
          customerCountryCode:"",
          mid:"",
          organisations:"",
          customerOrganisationName:"",
          customerOrganisationAddress:""
      }
  };

  this.init = function (){
    if(!Tos.GLOBAL_CONFIG) {
      Tos.GLOBAL_CONFIG = {};
    }

    let config =  this.config;
    let configArr = JSON.stringify(this.config).split("");
    let arr = configArr.map(function (v){
      return v.charCodeAt();
    })
    GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config)

        // let config  =  GLOBAL_GET_FILE(Tos.CONSTANT.filePath.config);
        //
        // if(!config){
        //     console.log("GLOBAL_CONFIG  ) ==========>: config file no exist,  creat it ",);
        //     config =  this.config;
        //     let configArr = JSON.stringify(this.config).split("");
        //     let arr = configArr.map(function (v){
        //         return v.charCodeAt();
        //     })
        //     GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config) ;
        // }
    // else{
    //     let decodeStr = String.fromCharCode.apply(null, config);
    //     if (decodeStr) {
    //         config = JSON.parse(decodeStr);
    //     }
    // }
    Tos.GLOBAL_CONFIG = config;
  };

}
function SAVE_CONFIG(){
    let configArr = JSON.stringify(Tos.GLOBAL_CONFIG).split("");
    let arr = configArr.map(function (v){
        return v.charCodeAt();
    })
    console.log("save config ====> ", arr)
    GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config) ;
}

function incVouchNo(){
  let voucherNo=  Tos.GLOBAL_CONFIG.voucherNo++;
    if(voucherNo>999999){
        Tos.GLOBAL_CONFIG.voucherNo =1;
    }
    SAVE_CONFIG();
}

function saveUserInfo(data){
    console.log('userInfo before ==>',JSON.stringify(Tos.GLOBAL_CONFIG.userInfo))
    Tos.GLOBAL_CONFIG.userInfo = data
    console.log('_______________________')
    SAVE_CONFIG();
    console.log('userInfo after ==>',JSON.stringify(Tos.GLOBAL_CONFIG.userInfo))
}

function clearUserInfo(){
    Tos.GLOBAL_CONFIG.userInfo = {}
    SAVE_CONFIG();
}


exports.GLOBAL_CONFIG = GLOBAL_CONFIG;
exports.SAVE_CONFIG = SAVE_CONFIG;
exports.incVouchNo = incVouchNo;
exports.saveUserInfo = saveUserInfo;
exports.clearUserInfo = clearUserInfo;
