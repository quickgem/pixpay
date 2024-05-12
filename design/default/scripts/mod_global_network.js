var GLOBAL_HEXARR_2_STRING = require("mod_global_funcs").GLOBAL_HEXARR_2_STRING;
var doReversal = require("mod_global_reversal").doReversal;
var GLOBAL_PACK_8583 = require("mod_global_iso8583").GLOBAL_PACK_8583;
var GLOBAL_UNPACK_8583 = require("mod_global_iso8583").GLOBAL_UNPACK_8583;
var incVouchNo = require("mod_global_config").incVouchNo;

function GLOBAL_NETWORK_SOCKET(param,cb,data) {
  console.log("GLOBAL_NETWORK_SOCKET===================>>");

  if (!cb) {
    console.log(" cb error ===================>>");
    return;
  }
  if(!param){
    console.log(" param error ===================>>");
    cb.error("param error !");
    return;
  }
  if(!data ){
    console.log(" data error ===================>>");
    cb.error("data error !");
    return;
  }
  data = new Uint8Array(data);
  console.log("GLOBAL_NETWORK_SOCKET data len  ===================>>",data.length );
  //console.log("GLOBAL_NETWORK_SOCKET data ===================>>",GLOBAL_HEXARR_2_STRING(data));

  let SocketCls = function (){
    console.log("SocketCls 0000000 ===================>>");
    this.socHandler = null;
    this.socTimerCount = 60;
    this.cancelTime = false;

  } ;
  SocketCls.prototype.CreateNew= function () {
    console.log("SocketCls CreateNew ===================>>");
    let isConnect = GLOBAL_CHOOSE_NETWORK();

    if (!isConnect) {
      console.log("Network Unavailable ===================>>",isConnect);
      cb.error("Network Unavailable");
      return;
    }
    this.SocCreate();
  };
  SocketCls.prototype.setTimer= function () {
    console.log("SocketCls 55555 ===================>>");
    let that = this;
    this.cancelTime =false;
    timerAdd(function () {
      console.log("SocketCls ttttttt ===================>>");
      that.socTimerCount --;
      if(that.cancelTime) {
        return RET_REMOVE;
      }
      if(that.socTimerCount <=0) {
        that.handleErr("timeOut");
        return RET_REMOVE;
      }
      cb.timeTick(that.socTimerCount);
      return RET_REPEAT;
    }, 1000)
  };
  SocketCls.prototype.SocCreate= function () {
    console.log("SocketCls SocCreate ===================>>");
    let socHandler = Tos.SocCreate();
    if(socHandler.code<0){
      console.log("Create Socket Fail===================>>");
      this.handleErr("Create Socket Fail");
      return;
    }
    console.log("Create Socket OK ===================>>");
    this.socHandler = socHandler.code;
    this.setTimer()
    this.SocConnect();
  };
  SocketCls.prototype.SocConnect = function () {
    cb.showPrompt("Connect ...");
    console.log("SocConnect ===================>>");
    Tos.SocConnect(this.socHandler,param);
    this.SocStatus();
  };
  SocketCls.prototype.SocStatus = function () {
    console.log("SocketCls 777777 ===================>>");
    let that = this;
    timerAdd(function () {
      if (that.socTimerCount <=0 ) return RET_REMOVE;
      let res = Tos.SocStatus(that.socHandler);
      console.log("SocStatus ===================>> ",res.code);
      switch (res.code) {
        case 3: // connect success
          that.SocSend();
          return RET_REMOVE;
        case 4: //connect error
          that.handleErr("connect error ")
          return RET_REMOVE;
        case 7: //send error
          that.handleErr("send error ")
          return RET_REMOVE;
        case 6:
          that.SocCheckAndRecv();
          return RET_REMOVE;
        case 8:
          that.SocRecv();
          return RET_REMOVE;
      }
      return RET_REPEAT;
    }, 100);
  };
  SocketCls.prototype.SocSend = function () {
    console.log("SocketCls 8888888 ===================>>");
    cb.showPrompt("Socket Send ...");
    console.log("Socket Send ===================>>");
    Tos.SocSend(this.socHandler, data, data.length);
    incVouchNo();
    this.SocStatus();
  };
  SocketCls.prototype.SocRecv = function () {
    console.log("SocketCls SocRecv ===================>>");
    cb.showPrompt("Socket Receive ...");
    /******receive buf len 1<<11 =2048 ********/
    let recvRet = Tos.SocRecv(this.socHandler, 1<<11);
    if (recvRet.code > 0 && recvRet.data) {
      console.log("SocRecv OK ===================>>",recvRet.data.length);

      console.log("SocRecv data  ===================>> ",GLOBAL_HEXARR_2_STRING(recvRet.data));
      this.SocClose();
      cb.success(recvRet.data);
    } else {
      console.log("SocRecv Receive error===================>>",recvRet.code);
      this.handleErr("receive error");
    }
  };
  SocketCls.prototype.SocCheckAndRecv = function () {
    console.log("SocketCls SocCheckAndRecv ===================>>");
    this.SocStatus();
  };
  SocketCls.prototype.SocClose = function () {
    console.log("SocketCls SocClose ===================>>");
    this.cancelTime =true;
    this.socHandler && Tos.SocClose(this.socHandler);
  };
  SocketCls.prototype.handleErr = function (type) {
    console.log("SocketCls SocClose ===================>>");
    cb.error(type);
    this.socHandler && Tos.SocClose(this.socHandler);
  };
  return SocketCls;
}

function GLOBAL_CHOOSE_NETWORK() {
  let type = 1;
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

function transOnline(urlParam,cb,trans) {
      /********1 Reversal *******/
     let reversalCb = {
          success:function(buf) {
            online();
          },
          error:function (error) {
            online();
          },
          showPrompt: function (tip) {
            cb.showPrompt(tip);
          },
          timeTick: function (time) {
            cb.timeTick(time);
          }
      };

    let onlineCB  = {
          success:function(buf) {
            GLOBAL_UNPACK_8583(GLOBAL_HEXARR_2_STRING(buf).substring(4),trans);
            cb.success();
          },
          error:function (error) {
            cb.error(error);
          },
          showPrompt: function (tip) {
            cb.showPrompt(tip);
          },
          timeTick: function (time) {
            cb.timeTick(time);
          }
  };
     let online=function () {
         let iso8583= GLOBAL_PACK_8583(trans)
         let _instance =  GLOBAL_NETWORK_SOCKET(urlParam,onlineCB,iso8583);
         let onlineCls = new _instance();
             onlineCls.CreateNew();
     }

    doReversal(urlParam,reversalCb);



}

function generateReference(n){
  return Math.floor(Math.pow(10, n-1) + Math.random() * 9*Math.pow(10, n-1)).toString()
}

function dateTime(){
  let transactionTime = Tos.GLOBAL_TRANSACTION.trans.transTime;
  console.log("\ntransactionTime year ==========>", transactionTime.year);
  console.log("\ntransactionTime month ==========>", transactionTime.month);
  console.log("\ntransactionTime date ==========>", transactionTime.date);
  console.log("\ntransactionTime h ==========>", transactionTime.h);
  console.log("\ntransactionTime m ==========>", transactionTime.m);
  console.log("\ntransactionTime s ==========>", transactionTime.s);
  return transactionTime.year+'-'+transactionTime.month+'-'+transactionTime.date+' '+transactionTime.h+':'+transactionTime.m+':'+transactionTime.s
}

function transOnlineTms(callback,trans,flow) {
  const currentDateTime = dateTime()
  console.log('TMS PROCESS STARTED ===>>>> ',JSON.stringify(trans))
  callback.showPrompt("Processing ...")
  callback.timeTick()

  function onSuccess(data){
    console.log("onSuccess ====>  ", JSON.stringify(data))
    callback.success()
  }
  function onError(data){
    console.log("onError ====>  ", JSON.stringify(data))
    callback.error(data)
  }
 const request = {
   cardAcceptorId:"2CSTLA100000001",
   minorAmount:trans.amount,
   track2Data:trans.track2,
   pinBlock:flow.pin,
   processingCode:"000000",
   emvDataString:trans.sendIccData,
   acquiringInstitutionId:"778035",
   terminalId:Tos.GLOBAL_CONFIG.userInfo.customerOrganisationTerminalId,
   pinCaptureCode:"06",
   rrn:generateReference(12),
   expiryDate:trans.expDate,
   cardAcceptorLocation:"COREBANK LTD  TMS POS  APP -  LAGOS LANG",
   stan:generateReference(6),
   transactionCurrencyCode:"566",
   merchantType:"6013",
   cardSequenceNumber:trans.cardSerialNo,
   mid:Tos.GLOBAL_CONFIG.userInfo.mid,
   name:trans.cardHolderName,
   date:currentDateTime,
   aid:trans.aid,
   appLab:trans.emvAppName,
   dateTime:currentDateTime,
 }
  Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TMS_PURCHASE,request,onSuccess,onError)
}




exports.transOnline = transOnline;
exports.transOnlineTms = transOnlineTms;
exports.GLOBAL_CHOOSE_NETWORK = GLOBAL_CHOOSE_NETWORK;
exports.GLOBAL_NETWORK_SOCKET = GLOBAL_NETWORK_SOCKET;

