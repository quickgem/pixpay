var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;

var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;

function GLOBAL_CONFIG() {
  this.config = {
        termId : "00000219", //0000219
        merchantId : "linjianzhang", // linjianzhang
        merchantName:"Topwise",
        tpdu: "6000380000",
        head: "603200322012",
        partner: "PixPay",
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
        studentInfo:{
            AdmissionNo:"",
            Class:"",
            FirstName:"",
            MiddleName:"",
            SchoolId:"",
            SchoolLocation:"",
            SchoolLogo:"",
            SchoolName:"",
            Surname:""
        },
        userInfo:{
            userId: "",
            userRoleId: "",
            userType: "",
            userFirstName: "",
            organisationName: "",
            organisationId: "",
            organisationAddress: "",
            userMiddleName: "",
            userLastName: "",
            userPhone: "",
            userEmail: "",
            userStatus: "",
            userCreatedAt: "",
            userUpdatedAt: "",
            privileges: [],
            token: "",
            responseCode: "",
            responseMessage: "",
            terminal: {
              terminalId: "",
              terminalSerialNumber: "",
              terminalOrganisationId: "",
              terminalAccountNumber: "",
              terminalCallHomeTimeInHours: "",
              terminalCardAcceptorId: "",
              terminalCountryCode: "",
              terminalCurrencyCode: "",
              terminalMcc: "",
              terminalMerchantNameLocation: "",
              terminalTimeOutInSeconds: "",
              terminalPin: "",
              terminalStatus: "",
              terminalCreatedAt: "",
              terminalUpdatedAt:"",
              tid: ""
            },
            organisation: {
              organisationId: "",
              organisationCustomerId: "",
              organisationAccountNumber: "",
              organisationName: "",
              organisationLogo: "",
              organisationRegistrationNumber: "",
              organisationRegistrationDate: "",
              organisationPhone: "",
              organisationEmail: "",
              organisationType: "",
              organisationWebsite: "",
              organisationAddress: "",
              organisationIndustryType: "",
              organisationStage: "",
              organisationReferralCode: "",
              organisationInviteCode: "",
              organisationRoleId: "",
              organisationStatus: "",
              organisationCreatedAt: "",
              organisationUpdatedAt: ""
            }
          },
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
          addr: [203, 124, 15, 248], soc_type: 0
        },
    
      
    transactions:null,
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
    Tos.GLOBAL_CONFIG = config;
  };
}

function SAVE_CONFIG(){
    let configArr = JSON.stringify(Tos.GLOBAL_CONFIG).split("");
    let arr = configArr.map(function (v){
        return v.charCodeAt();
    })
    GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config) ;
}

function incVouchNo(){
  let voucherNo=  Tos.GLOBAL_CONFIG.voucherNo++;
    if(voucherNo>999999){
        Tos.GLOBAL_CONFIG.voucherNo =1;
    }
    SAVE_CONFIG();
}



function saveStudentInfo(data){
    Tos.GLOBAL_CONFIG.studentInfo = data
    console.log('studentInfo ===>, ', JSON.stringify(data))
    SAVE_CONFIG();
}

function saveUserInfo(data){
    Tos.GLOBAL_CONFIG.userInfo = data
    console.log('userInfo ===>, ', JSON.stringify(data))
    SAVE_CONFIG();
}

function saveTransactions(data){
    Tos.GLOBAL_CONFIG.transactions = data
    SAVE_CONFIG();
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
    return hexArr;
}

function injectKeys (){
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
exports.saveStudentInfo = saveStudentInfo;
exports.saveUserInfo = saveUserInfo;
exports.clearUserInfo = clearUserInfo;
exports.injectKeys = injectKeys;
exports.saveTransactions = saveTransactions;
