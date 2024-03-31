const {GLOBAL_UNPACK_8583} = require("mod_global_iso8583");
const {GLOBAL_HEXARR_2_STRING} = require("mod_global_funcs");
var GLOBAL_PACK_8583 = require("mod_global_iso8583").GLOBAL_PACK_8583;
var GLOBAL_NETWORK_SOCKET = require("mod_global_network").GLOBAL_NETWORK_SOCKET;

var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;
var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;


function doReversal(param,cb){
    let reversalData =  getReversal();
    if(!reversalData){
        cb.success();
        return;
    }
    let count  = 3;


    let reversalCb = {
        success:function(buf) {
            GLOBAL_UNPACK_8583(GLOBAL_HEXARR_2_STRING(buf).substring(4));
            cb.success();
        },
        error:function () {
            cb.success();
        },
        showPrompt:function () {

        },
        timeTick: function (time) {
            cb.timeTick(time);
        }
    };
    let _instance =  GLOBAL_NETWORK_SOCKET(param,reversalCb,GLOBAL_PACK_8583(reversalData));
    let socketInstance = new _instance();
    socketInstance.CreateNew();
}
function saveReversal(trans) {
    if(!trans){
        return;
    }
    let configArr = JSON.stringify(trans).split("");
    let arr = configArr.map(function (v){
        return v.charCodeAt();
    })
    GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.reverse) ;
}
function delReversal() {
    Tos.FileRemove(Tos.CONSTANT.filePath.reverse);
}
function getReversal() {
    let data  =  GLOBAL_GET_FILE(Tos.CONSTANT.filePath.reverse);
    if(!data){
        return null;
    }
    let decodeStr = String.fromCharCode.apply(null, data);
    if (decodeStr) {
        return  JSON.parse(decodeStr);
    }
}
exports.doReversal = doReversal;
exports.saveReversal = saveReversal;
exports.delReversal = delReversal;
exports.getReversal = getReversal;
