var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;

var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;

function GLOBAL_CONFIG() {
  this.config = {
        termId : "00000219",
        merchantId : "linjianzhang",
        merchantName:"Topwise",
        tpdu: "6000380000",
        head: "603200322012",
        partner: "CORESTEP",
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
        theme:{
            primary:'#d2d2d3b9',
            primary_bold:'#3F3F3F',
            secondary:'#FF9900FF',
            light:'#FFFFFF',
            dark:'#000000'
        },
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
      },
      transactions:null,
      banks:null
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
    Tos.GLOBAL_CONFIG.userInfo = data
    SAVE_CONFIG();
}

function saveTransactions(data){
    Tos.GLOBAL_CONFIG.transactions = data
    SAVE_CONFIG();
}

function saveBankList(data){
    Tos.GLOBAL_CONFIG.banks = data
    SAVE_CONFIG();

    console.log('banks:', JSON.stringify(Tos.GLOBAL_CONFIG.banks))
}

function GLOBAL_STRING_2_HEXARR (hexStr) {
    if(!hexStr){
        return null;
    }
    if(hexStr.length %2 !==0){
        hexStr="0"+hexStr;
    }
    let pos = 0;
    let len = hexStr.length;
    len /= 2;
    let hexArr = [];
    for (let i = 0; i < len; i++) {
        let data = "0x" + hexStr.substr(pos, 2);
        hexArr.push(parseInt(data));
        pos += 2;
    }
    console.log("GLOBAL_STRING_2_HEXARR  ==========>:", hexArr.length,hexArr);

    return hexArr;
}

function injectKeys (){
    console.log("inject master key");
    // let tmk = [
    //     0x08, 0x8c, 0xae, 0xd6, 0x53, 0xbc, 0xaa, 0xa3,
    //     0x68, 0xfc, 0xc0, 0x11,0x8a, 0xd7, 0xd3, 0x37
    // ];
    let tmk = GLOBAL_STRING_2_HEXARR("31313131313131313131313131313131")
    let tmkObj = {
        src_algo_type: SYMMETRIC_CRYPT_DES,
        src_type: KEYTYPE_TMK,
        src_idx: -1,
        dst_type: KEYTYPE_TMK,
        dst_idx: 1,
        dst_value: tmk,
        dst_len: tmk.length,
        dst_algo_type: SYMMETRIC_CRYPT_DES,
    };
    let res = Tos.PedWriteKey(tmkObj, null);
    console.log("inject master key result ",res.code);

    console.log("inject pinkey key");
    // let pinkey = [
    //     0x07,0x6c,0x5e,0xc6,0x32,0xb4,0xac,0x83,
    //     0x56,0x9c,0xc1,0x21,0x8d,0xd5,0xe6,0x50,
    // ];
    let pinkey = GLOBAL_STRING_2_HEXARR("00000000000000000000000000000000")
    let pinkeyObj = {
        src_algo_type: SYMMETRIC_CRYPT_DES,
        src_type: KEYTYPE_TMK,
        src_idx: 1,
        dst_type: KEYTYPE_PEK,
        dst_idx: 1,
        dst_value: pinkey,
        dst_len: pinkey.length,
        dst_algo_type: SYMMETRIC_CRYPT_DES,
    };
    res = Tos.PedWriteKey(pinkeyObj, null);
    console.log("inject pinkey key result ",res.code);

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
exports.injectKeys = injectKeys;
exports.saveTransactions = saveTransactions;
exports.saveBankList = saveBankList;
