var GLOBAL_HEXARR_2_STRING = require("mod_global_funcs").GLOBAL_HEXARR_2_STRING;
var GLOBAL_FUNCS  = require("mod_global_funcs").GLOBAL_FUNCS;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GLOBAL_HEXARR2STRING = require("mod_global_funcs").GLOBAL_HEXARR2STRING;
var GLOBAL_STRING_2_HEXARR = require("mod_global_funcs").GLOBAL_STRING_2_HEXARR;
var GLOBAL_STRING_2_ASCARR = require("mod_global_funcs").GLOBAL_STRING_2_ASCARR;
var SHOW_MASK_CARD  = require("mod_global_funcs").SHOW_MASK_CARD;

var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var transOnline = require("mod_global_network").transOnline;

var getTlvByTag = require("mod_tool_tlv").getTlvByTag;
var getValueByTag = require("mod_tool_tlv").getValueByTag;
var GET_MULTI_TEXT = require("mod_global_translation").GET_MULTI_TEXT;


ViewModel("emvProcess", {
  data: {
    title:"",
    showProcess:true,
    noticeText:"",
    noticeTimeOut:"",
    timeOutShow:"",
    timeOut:60,
    amount: "",
    pinTimeExit:false,
    ERR_PED_INPUTPIN_TIMEOUT: -325,
    ERR_PED_INPUTPIN_CANCEL: -324,
    CHECK_TIME_OUT: 60,
    timerValue: GET_MULTI_TEXT("card_tip"),
    value: 0,
    modalTitle: GET_MULTI_TEXT("card_confirm"),
    modalText: "",
    cardNum: "",
    cardDetectState: 0b00,
    pinBlockState: 0,
    offlinePinState:0,
    errorCode: "",
    valueLen: 0,
    showPin: false,
    isMultiAppSelectModal: false,
    multiAppList: [],
    multiAppState: 1,
    multiAppSelectIndex: -1,
    isPINRetryTimesModal: false,
    isPINRetryState: -1,
    pinRetryTimesText: "Remain 3 times",
    plaintextPIN: "",
    isShowCheckCard:false,
    passwordStar:"",
    timer1:null,
    timer2:null,
    trans:{},
    flow:{},
    toCardData:{
      onlineResult:[] ,     /*Number Terminal online request result code */
      authData : [],       /* String Authorization data, tag 91 */
      authDataLen: 0,     /*Number Authorization data length */
      script: [],     /* String71 and 72 script data */
      scriptLen: 0 ,/* Number 71 and 72 script data length */
      rspCode: [0x30,0x30],  /*String System response code, tag 8A data(2 dight char) */
      authCode: [], /*String System authorization code, tag 89(6 dight char) */
      authCodeLen:  0 /* NumberSystem authorization code length */
    }
  },
  methods: {
    setPinTimer: function () {
      let that = this;
      this.timeOut = 60;
      this.pinTimeExit = false;
      this.timer1 && typeof this.timer1 === "number" && timerRemove(this.timer1);
      this.timer1 = timerAdd(function () {
        that.timeOut--;
        console.log("PinTimer =========", that.timeOut);
        if (that.pinTimeExit) return RET_REMOVE; // 已经不在当前页面
        if (that.timeOut <= 0) {
          that.timeOutShow ="";
          that.pinTimeExit = true;
          that.offlinePinState =-1;
          that.notifyPropsChanged();
          return RET_REMOVE;
        }
        that.timeOutShow = that.timeOut + "";
        that.notifyPropsChanged();
        tkRefreshUi();
        return RET_REPEAT;
      }, 1000);
    },


    // 取消PIN 重试
    cancelRetryPIN: function () {
      this.isPINRetryState = 0;
    },
    // PIN 重试
    retryPIN: function () {
      this.isPINRetryState = 1;
    },
    EMVTimer: function () {
      let that = this;
      this.timer2 =timerAdd(function () {
        that.startEMV();
        return RET_REMOVE;
      }, 100);
    },
    jumpError: function (type) {
          navigateTo({
              target: "result",
              type: type || "cancel",
              close_current: true,
          });
    },

    startEMV: function () {
      let tret = Tos.SysGetTime();
      console.log("startEMV start time ==========>", tret.data);
      let emvCBs = this.initEmvCBs();
      ret = Tos.TemvSetCallback(emvCBs);
      tret = Tos.SysGetTime();
      console.log("TemvStartEmvProc start =========", tret.data);
      let cardType ;
      if(this.trans.enterMode=== Tos.CONSTANT.ENTRY_MODE.INSERT){
        cardType =0;
      }else{
        cardType =1;
      }
      ret = Tos.TemvStartEmvProc(cardType);
      console.log("TemvStartEmvProc end ========= ", JSON.stringify(ret));
      if (ret.code !== 0) {
        // 失败
        if(ret.code === -23){
            this.errorCode = "Try Another Interface";
        }
        console.log("TemvStartEmvProc Fail 5555=========");
        this.jumpError(this.errorCode);
        return;
      }
      console.log("pAcType ===   ",ret.data.pAcType);
      if(ret.data.pAcType=== 0x00){
        console.log("pAcType === AAC   ");
        GLOBAL_FUNCS.closeDetect();
        this.jumpError(this.errorCode);
        return;
      }

      this.saveCardInfo();
      if(ret.data.pAcType=== 0x01){
        console.log("pAcType === TC  ");
        GLOBAL_FUNCS.closeDetect();
        this.jump2Next();
        return;
      }
      /****** ICC  goto check card  ********/
      if(cardType === 0){
         this.showCheckCard();
         return;
      }
      /****** RF check whether need input pwd via tag DF8129 ********/
      let clsOutCom = Tos.TemvGetTLVData(0xDF8129);
      if (clsOutCom && (clsOutCom[3] & 0xF0) === 0x20 ) {
          this.pinBlockState = 0;
          this.startPinBlock();
          while(this.pinBlockState === 0) {
             tkRefreshUi();
          }
           this.handlePinModal(false) ;
           this.notifyPropsChanged();
           if(this.pinBlockState === 1) {
               this.startNetProcess();
            }else{
              this.jumpError(this.errorCode);
           }
      }else{
         this.startNetProcess();
      }
    },

    startNetProcess:function(){
          GLOBAL_FUNCS.setRfLed(0b1011, 0b0001);
          console.log("startNetProcess ");
          this.handleProcess(true,GET_MULTI_TEXT("online_tip"));
          tkRefreshUi();
          let callback = {
            success:this.netSuccess,
            error:this.netError,
            showPrompt: this.netshowPrompt,
            timeTick: this.netTimeTick
          };
          let netParam  ={ip:Tos.GLOBAL_CONFIG.ip,port:Tos.GLOBAL_CONFIG.port}
          transOnline(netParam,callback,this.trans);
    },

    netSuccess: function () {

      console.log("netSuccess  ================= " );
      if(this.trans.response === "00"){
        this.toCardData.onlineResult =0x00;
     }
     if(this.trans.receiveIccData){
        this.parseIccData();
        Tos.TemvCompleteEmvProc(this.toCardData);
     }

     this.jump2Next();
    },
    netError: function (error ) {
      this.jumpError(error);
    },
    parseIccData:function () {
      let tlvBuf =GLOBAL_STRING_2_HEXARR(this.trans.receiveIccData);
      console.log("tlvBuf  ================= ",tlvBuf );

      let unit8Buf = new Uint8Array(tlvBuf);
      let authData = getValueByTag(unit8Buf,0x91);
       console.log("authData  ================= ",authData );
      if(authData){
        this.toCardData.authData = authData;
        this.toCardData.authDataLen =  authData.length;
      }
      let authCode = getValueByTag(unit8Buf,0x89);
      console.log("authCode  ================= ",authCode );
      if(authCode){
        this.toCardData.authCode = authCode;
        this.toCardData.authCodeLen =  authCode.length;
      }
      let script = getTlvByTag(unit8Buf,0x71);
      if(script){
         script72 = getTlvByTag(unit8Buf,0x72);
         if(script72){
           script.concat(script72);
         }
      }
      if(script){
        this.toCardData.script = script;
        this.toCardData.scriptLen =  script.length;
      }
      let rspCode = getTlvByTag(unit8Buf,0x8A);
     console.log("this.trans  ================= ",JSON.stringify(this.trans.response));
     console.log("rspCode  from 8a ================= ",rspCode );
     console.log(" this.trans.response ================= ",this.trans.response);
      if(rspCode){
        this.toCardData.rspCode = rspCode;
      }else if(this.trans.response) {
        this.toCardData.rspCode = GLOBAL_STRING_2_ASCARR (this.trans.response);

      }else{
        this.toCardData.rspCode = GLOBAL_STRING_2_ASCARR("Z1");
      }
     console.log("rspCode ====  from 8a ================= ",this.toCardData.rspCode );
    },
    netshowPrompt: function (tip ) {
      this.noticeText =tip
      console.log("netshowPrompt  tip ================= " ,tip);
      this.notifyPropsChanged();
    },
    netTimeTick: function (time ) {
      console.log("netTimeTick  time ================= " ,time);
      this.noticeTimeOut = time+"";
      this.notifyPropsChanged();
    },
    // jump2Next:function (){
    //   GLOBAL_JUMP();
    // },
    jump2Next:function (){
      this.navigateTo({
        target: "result",
        type:  "success",
        close_current: true,
      });
    },
    saveCardInfo:function(){
      let cardInfo = "";

      /************card No**********/
      let ret = Tos.TemvGetTLVData(0x57);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        cardInfo= cardInfo.split("F")[0];
        Tos.GLOBAL_TRANSACTION.trans.track2 = cardInfo;
        console.log("  track2 ==============>", cardInfo);
        cardInfo = cardInfo.split("D")[0];
        Tos.GLOBAL_TRANSACTION.trans.pan = cardInfo;
        this.cardNum  =cardInfo;
        console.log("  pan ==============>", cardInfo);
      }

      /************card expiration  date**********/
      ret = Tos.TemvGetTLVData(0x5f24);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data).substring(0,4);
        Tos.GLOBAL_TRANSACTION.trans.expDate = cardInfo;
        console.log("  expDate ==============>", cardInfo);
      }

      /************card  serail No**********/
      ret = Tos.TemvGetTLVData(0x5f34);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data).substring(0,2);
        Tos.GLOBAL_TRANSACTION.trans.cardSerialNo = cardInfo;
        console.log("  card Serial No ==============>", cardInfo);
      }

      /************ arqc **********/
      ret = Tos.TemvGetTLVData(0x9f26);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.arqc = cardInfo;
        console.log("  arqc ==============>", cardInfo);
      }

      /************ tvr **********/
      ret = Tos.TemvGetTLVData(0x95);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.tvr = cardInfo;
        console.log("  tvr ==============>", cardInfo);
      }

      /************ atc **********/
      ret = Tos.TemvGetTLVData(0x9F36);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.atc = cardInfo;
        console.log("  atc ==============>", cardInfo);
      }

      /************ tsi **********/
      ret = Tos.TemvGetTLVData(0x9B);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.tsi = cardInfo;
        console.log("  tsi ==============>", cardInfo);

      }

      /************ tc **********/
      ret = Tos.TemvGetTLVData(0x9F26);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.tc = cardInfo;
        console.log("  tc ==============>", cardInfo);
      }

      /************ app name **********/
      ret = Tos.TemvGetTLVData(0x9F12);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR2STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.emvAppName = cardInfo;
        console.log("  app name  ==============>", cardInfo);
      }


      /************ aid **********/
      ret = Tos.TemvGetTLVData(0x84);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.aid = cardInfo;
        console.log("  aid  ==============>", cardInfo);
      }

      /************ card holder name **********/
      ret = Tos.TemvGetTLVData(0x5F20);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR2STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.cardHolderName = cardInfo;
        console.log("  card holder name  ==============>", cardInfo);
      }

      /************ 55 filed **********/
      let tlvArr = [
        0x9f, 0x26, 0x9f, 0x27, 0x9f, 0x10, 0x9f, 0x37, 0x9f, 0x36, 0x95, 0x9a, 0x9c, 0x9f, 0x02, 0x5f, 0x2a, 0x82,
        0x9f, 0x1a, 0x9f, 0x03, 0x9f, 0x33, 0x9f, 0x34, 0x9f, 0x35, 0x9f, 0x1e, 0x84, 0x9f, 0x09, 0x9f, 0x41, 0x9f,
        0x63, 0x9f, 0x74
      ];
      ret = Tos.TemvGetTlvList(tlvArr, tlvArr.length);
      if (ret.code === 0) {
        cardInfo = GLOBAL_HEXARR_2_STRING(ret.data);
        Tos.GLOBAL_TRANSACTION.trans.sendIccData = cardInfo;
        console.log("  sendIccData  ==============>", cardInfo);
      }

    },
    initEmvCBs: function () {
      let that = this;
      // 返回值-出参入参都是： {code, data, msg}
      let obj = {
        cGetOnlinePin: function (bAllowBypass, pPAN, uiPAN) {
          let cardNum = GLOBAL_HEXARR_2_STRING(pPAN);
          that.cardNum = cardNum;
          let tret = Tos.SysGetTime();
          console.log("startPinBlock start =========", tret.data);
          that.startPinBlock();
          tret = Tos.SysGetTime();
          console.log("startPinBlock end =========", tret.data);
          while (that.pinBlockState === 0) {
            tkRefreshUi();
          }
          that.handlePinModal(false) ;
          that.handleProcess(true,GET_MULTI_TEXT("emv_process"));
          that.notifyPropsChanged();
          tkRefreshUi();
          if (that.pinBlockState === 1) {
            if (that.valueLen === 0) {
              // 没有输入密码
              return {
                data: [1],
                code: 1
              };
            } else {
              return {
                data: [0],
                code: 1
              };
            }
          } else {
            return {
              code: 0,
              data: [0]
            };
          }
        },
        cGetPlainTextPin: function (ret) {
          console.log("cGetPlainTextPin ===========>", ret);
          //按确认键，code传1， 按取消键，code传0
          //PIN密码界面需要显示明文
          that.offlinePinState = 1;
          that.plaintextPIN = "";
          that.handlePinModal(true)
          that.notifyPropsChanged();
          while (that.offlinePinState === 1) {
            tkRefreshUi();
          }
          that.handlePinModal(false)
          that.handleProcess(true,GET_MULTI_TEXT("emv_process"));
          that.notifyPropsChanged();
          tkRefreshUi();
          let res = {};
          if (that.offlinePinState === 0) {
            res = Tool.GetClearPINBlock(that.plaintextPIN, that.plaintextPIN.length);
          }
          console.log("\r\nGetClearPINBlock ===========>", JSON.stringify(res));
          let isByPass = that.plaintextPIN.length ?[0]:[1];
          return {
            code: that.offlinePinState === 0 ? 1 : 0,
            data: { pPIN: res.data, pbBypass: isByPass }
          };
        },

        cDisplayPinVerifyStatus: function (retryTimes) {

          that.pinRetryTimesText = GET_MULTI_TEXT("remain") + " "+retryTimes +" "+ GET_MULTI_TEXT("times");
          that.isPINRetryTimesModal = true;
          that.notifyPropsChanged();
          that.isPINRetryState = -1;
          while (that.isPINRetryState === -1) {
            tkRefreshUi();
          }
          that.isPINRetryTimesModal = false;
          tkRefreshUi();
          return { code: that.isPINRetryState, data: null };
        },
        cMultiAppSelect: function (Appobj) {
          that.handleMultiAppSelect(Appobj);
          while (that.multiAppState === 1) {
            tkRefreshUi();
          }
          return { code: that.multiAppSelectIndex, data: that.multiAppSelectIndex };
        }
      };
      return obj;
    },
    handleMultiAppSelect: function (Appobj) {
      let cList = Appobj.CandApp || [];
      this.multiAppList = cList;
      this.isMultiAppSelectModal = true;
      this.showProcess = false;
      this.notifyPropsChanged();
      console.log("handleMultiAppSelect done================>");
    },
    onSelectMultiApp: function (obj) {
      console.log("\nonSelectMultiApp ============>", JSON.stringify(obj));
      this.multiAppSelectIndex = obj.index * 1;
      this.multiAppState = 0;
      this.isMultiAppSelectModal = false;
      this.notifyPropsChanged();
    },
    _pinblockCB: function () {
      // 这个函数是用来EMV调用的，不能释放
    },
    startPinBlock: function () {
      this.handlePinModal(true)
      let expectPswLen = "0,4,5,6,7,8,9,10,11,12";
      console.log("startPinBlock  cardNo.=========>",this.cardNum);

      tkRefreshUi();
      Tos.PedSetPinblockCb(this._pinblockCB);
      tkRefreshUi();
      Tos.PedGetPinblock(1, expectPswLen, this.cardNum, ALGEXT_PINBLOCK_0, 60000);
      tkRefreshUi();
      this.watchPinReturn();
      tkRefreshUi();
    },
    watchPinReturn: function () {
      let that = this;
      function cb() {
        let ret = Tos.PedGetPinblockRetInfo();
        if (ret.code >= 0) {
          let len = ret.data.pin_cnt;
           that.valueLen = len;
           that.showStar(len);
           that.notifyPropsChanged();
          if (ret.data.is_done > 0) {
            that.showPin = false;
            that.flow.pin = GLOBAL_HEXARR_2_STRING(ret.data.pinblock);
            that.notifyPropsChanged();
            that.pinBlockState = 1;
            return RET_REMOVE;
          } else {
            return RET_REPEAT;
          }
        } else {
          // 点击cancel或者其他pinblock错误 退出流程
          that.pinBlockState = -1;
          switch (ret.code){
            case ERR_PED_INPUTPIN_TIMEOUT:
              that.errorCode =Tos.CONSTANT.ERROR.TIMEOUT;
              break;
            case ERR_PED_INPUTPIN_CANCEL:
              that.errorCode =Tos.CONSTANT.ERROR.CANCEL;
              break;
          }
          return RET_REMOVE;
        }
      }
      timerAdd(cb, 100);
    },

    showCheckCard() {
      if (this.isShowCheckCard){
         return;
      }
      this.isShowCheckCard = true;
      this.modalTitle = GET_MULTI_TEXT("card_confirm");
      this.modalText =SHOW_MASK_CARD(this.trans.pan);
      this.handleProcess(false);
    },
     handleConfirmCard: function () {
     console.log("handleConfirmCard ----->>>>:");
      console.log("handleConfirmCard ----->>>> :", this.isShowCheckCard);
     if(!this.isShowCheckCard){
         return;
      }
      this.isShowCheckCard = false;
      this.notifyPropsChanged();
      console.log("handleConfirmCard ----->>>> :");

      this.startNetProcess();
     },
    handleCancelCard() {
      if(!this.isShowCheckCard){
        return;
      }
      this.jumpError(GET_MULTI_TEXT("cancel"));
    },
    handlePinModal: function (flag,needTime) {
      this.showPin = flag;
      if (flag) {
        this.setPinTimer();
        this.showProcess =false;
        this.passwordStar = "";
      }else{
        this.pinTimeExit = true;
      }
      this.notifyPropsChanged();
    },
    handleProcess: function (flag,notice) {
      this.showProcess = flag;
      if(notice){
        this.noticeText = notice;
      }
      this.notifyPropsChanged();
    },
    showStar:function(len){
        let w = "*";
        this.passwordStar = w.repeat(len);
    },

    onKeyDown(args) {
      console.log("emvProcess key down----->>>>:", args);
      switch (args) {
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
          if (this.showPin) {
            this.plaintextPIN += args;
            this.showStar(this.plaintextPIN.length);
            this.notifyPropsChanged();
          }
          break;
        case "cancel":
            if(this.isShowCheckCard){
              this.handleCancelCard();
            }else if(this.showPin){
              this.pinBlockState = -1;
            }else if(this.isPINRetryTimesModal){
              this.cancelRetryPIN();
            }
          break;
        case "backspace":
          if (this.showPin) {
            this.plaintextPIN = this.plaintextPIN.substring(0, this.plaintextPIN.length - 1);
            this.showStar(this.plaintextPIN.length);
            this.notifyPropsChanged();
            break;
          }
          break;
        case "return":
          console.log("emvProcess 222----->>>>:");
          if (this.isPINRetryTimesModal) {
            this.retryPIN();
            break;
          }
          if(this.isShowCheckCard){
            this.handleConfirmCard();
            break;
          }
          if (this.showPin) {
            this.offlinePinState = 0;
            break;
          }

          break;
        default:
          break;
      }
    },
    getCAPKdata: function (index) {
      console.log("getCAPKdata 0000===========>", index, Tos.GLOBAL_DATA.capks.length);
      if (index === undefined || index === null) {
        index = -1;
      }
      console.log("getCAPKdata 11111===========>", Tos.GLOBAL_DATA.capks[index]);
      if (Tos.GLOBAL_DATA && Tos.GLOBAL_DATA.capks && Tos.GLOBAL_DATA.capks.length) {
        return { data: Tos.GLOBAL_DATA.capks[index], len: Tos.GLOBAL_DATA.capks.length };
      } else {
        return { data: [], len: 0 };
      }
    },
    getAIDdata: function (index) {
      console.log("getAIDdata index=", index, Tos.GLOBAL_DATA.aids.length);
      if (index === undefined || index === null) {
        index = -1;
      }
      console.log("getCAPKdata 11111===========>", Tos.GLOBAL_DATA.aids[index]);
      if (Tos.GLOBAL_DATA && Tos.GLOBAL_DATA.aids && Tos.GLOBAL_DATA.aids.length) {
        return { data: Tos.GLOBAL_DATA.aids[index], len: Tos.GLOBAL_DATA.aids.length };
      } else {
        return { data: [], len: 0 };
      }
    },


  },
  onWillMount: function (req) {
    this.flow = Tos.GLOBAL_TRANSACTION.flow;
    this.trans = Tos.GLOBAL_TRANSACTION.trans;
    if (this.trans.amount) {
      this.amount = GET_SHOW_AMOUNT(this.trans.amount);
    }

    this.title =  this.trans.transName;
    this.handleProcess(true,GET_MULTI_TEXT("emv_process"));
    GLOBAL_FUNCS.setRfLed(0b1010, 0);

    console.log("emvProcess onWillMount=======>>>");
  },
  onMount: function () {
    this.EMVTimer();
    console.log("emvProcess onMount=======>>>");
  },
  onWillUnmount: function () {
    console.log(" onWillUnmount 0000 =======>>>");
    this.timer1 && typeof this.timer1 === "number" && timerRemove(this.timer1);
    this.timer2 && typeof this.timer2 === "number" && timerRemove(this.timer2);
    this.pinBlockState = 0;
    this.pinTimeExit = true ;
    GLOBAL_FUNCS.closeDetect();
    GLOBAL_FUNCS.setRfLed();
    console.log(" onWillUnmount 1111=======>>>");
  }
});
