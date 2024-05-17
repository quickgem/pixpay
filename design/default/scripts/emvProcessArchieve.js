var GLOBAL_HEXARR_2_STRING = require("mod_global_funcs").GLOBAL_HEXARR_2_STRING;
var GLOBAL_HEX2ASCII = require("mod_global_funcs").GLOBAL_HEX2ASCII;
var GLOBAL_FUNCS  = require("mod_global_funcs").GLOBAL_FUNCS;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var transOnline = require("mod_global_network").transOnline;

ViewModel("emvProcess", {
  data: {
    user:null,
    title:"",
    showProcess:true,
    noticeText:"",
    noticeTimeOut:"",
    timeOutShow:"",
    timeOut:60,
    amount: "",
    pinTimeExit:false,
    pinCountDown: 60,
    isPinCounting: false,
    CHECK_TIME_OUT: 60,
    PIN_TIME_OUT_CODE: -325,
    PIN_CANCEL_CODE: -324,
    timerValue: "Swap/insert/tap card",
    value: 0,
    isShowModal: false,
    isShowCardTips: false,
    isShowNoticeTips: false,
    modalTitle: "Card num confirm",
    timeCount: 60,
    modalText: "",
    cardNum: "",
    cardDetectState: 0b00,
    pinBlockState: 0,
    isSkipPassword: 0,
    isNetLoading: false,
    socHandler: null,
    errorCode: "",
    valueLen: 0,
    lineX: 0,
    showPin: false,
    isMultiAppSelectModal: false,
    multiAppList: [],
    multiAppState: 1,
    multiAppSelectIndex: -1,
    isPINRetryTimesModal: false,
    isPINRetryState: 1,
    pinRetryTimesText: "Remain 3 times",
    PINretryTimes: -2,
    pinRetryReturn: -1,
    isPlaintextPINModal: false,
    plaintextPINstate: 1,
    plaintextPIN: "",
    passwordStar:"",
    loading: false,
    showTip:"Processing transaction ...",
    trans:{},
    purchaseRequest:{

    },
    flow:{},
  },
  methods: {
    initHTTPCB: function () {
      console.log("HttpclientCbEvent start 0000000===========");
      Tos.HttpclientCbEvent();
    },
    setPinTimer: function () {
      let that = this;
      this.timeOut = 60;
      this.pinTimeExit = false;
      timerAdd(function () {
        that.timeOut--;
        if (that.pinTimeExit) return RET_REMOVE; // 已经不在当前页面
        if (that.timeOut <= 0) {
          that.timeOutShow ="";
          that.notifyPropsChanged();
          return RET_REMOVE;
        }
        that.timeOutShow = that.timeOut + "s";
        that.notifyPropsChanged();
        return RET_REPEAT;
      }, 1000);
    },
    hidePlaintextPIN: function () {
      this.plaintextPINstate = -1;
      this.plaintextPIN = "";
      this.isPlaintextPINModal = false;
      this.notifyPropsChanged();
    },
    handlePlaintextPINConfirm: function () {
      this.plaintextPINstate = 0;
      this.isPlaintextPINModal = false;
      this.notifyPropsChanged();
    },
    // 取消PIN 重试
    cancelRetryPIN: function () {
      this.pinRetryReturn = 0;
      this.isPINRetryState = 0;
      this.isPINRetryTimesModal = false;
      this.notifyPropsChanged();
    },
    // PIN 重试
    retryPIN: function () {
      this.pinRetryReturn = 1;
      this.isPINRetryState = 0;
      this.isPINRetryTimesModal = false;
      this.notifyPropsChanged();
    },
    EMVTimer: function () {
      let that = this;
      timerAdd(function () {
        that.startEMV();
        return RET_REMOVE;
      }, 100);
    },
    jumpError: function (type) {
      navigateReplace({
        target: "result",
        type: type || "cancel",
        close_current: true
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
        console.log("TemvStartEmvProc Fail 5555=========");
        this.jumpError(this.errorCode);
        return;
      }
      if(ret.data.pAcType=== 0x00){
        console.log("pAcType === 0x00  ");
        this.closeDetect();
        this.jumpError(this.errorCode);
        return;
      }

      this.saveCardInfo();
      if(ret.data.pAcType=== 0x01){
        console.log("pAcType === 0x01  ");
        this.closeDetect();
        this.jump2Next();
        return;
      }
      console.log("pAcType ================= ");
      this.closeDetect();
      let callback = {
        success:this.netSuccess,
        error:this.netError,
        showPrompt: this.netshowPrompt,
        timeTick: this.netTimeTick
      }
      //TODO RF MODE
      if(this.trans.enterMode === Tos.CONSTANT.ENTRY_MODE.RF){
        this.startPinBlock();
        while (this.pinBlockState === 0) {
          tkRefreshUi();
        }
        this.handlePinModal(false) ;
        this.notifyPropsChanged();
      }
      this.handleProcess(true,"online ....");
      navigateTo({
        target: "postbridge",
        close_current: true,
        data:{
          trans: this.trans,
          flow: this.flow,
        }
      });
    },
    netSuccess: function () {
      this.loading = false
      let toCardData = {
        onlineResult:0x00 ,     /*Number Terminal online request result code */
        authData : "",       /* String Authorization data, tag 91 */
        authDataLen: 0,     /*Number Authorization data length */
        script: "",     /* String71 and 72 script data */
        scriptLen: 0 ,/* Number 71 and 72 script data length */
        rspCode: "00",  /*String System response code, tag 8A data(2 dight char) */
        authCode: "", /*String System authorization code, tag 89(6 dight char) */
        authCodeLen:  0 /* NumberSystem authorization code length */
      };
      console.log("netSuccess  tip ================= " ,JSON.stringify(this.trans));
      if(this.trans.response !== "00"){
       toCardData.onlineResult =0x01;
      }
      if(this.trans.receiveIccData){

      }
      this.jump2Next();
    },
    netError: function (error ) {
      this.loading = false
      this.jumpError(error);
    },
    netshowPrompt: function (tip ) {
      this.noticeText =tip
      console.log("netshowPrompt  tip ================= " ,tip);
      this.notifyPropsChanged();
    },
    netTimeTick: function (time ) {
      console.log("netTimeTick  time ================= " ,time);
      this.noticeTimeOut = time+"s";
      this.notifyPropsChanged();
    },
    // jump2Next:function (){
    //   GLOBAL_JUMP();
    // },
    jump2Next:function (){
      navigateTo({
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
        console.log("  app name length ==============>", ret.data.length);
        console.log("  app name data ==============>", ret.data);
        cardInfo = GLOBAL_HEX2ASCII(GLOBAL_HEXARR_2_STRING(ret.data));
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
        console.log("  card holder name length ==============>", ret.data.length);
        console.log("  card holder name data ==============>", ret.data);
        cardInfo = GLOBAL_HEX2ASCII(GLOBAL_HEXARR_2_STRING(ret.data));
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
          let cardNum = GLOBAL_HEXARR_2_STRING(pPAN).replace("F","");
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
          that.notifyPropsChanged();
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
            that.handleShowModal("notice", "Input Cancel");
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
          that.isPlaintextPINModal = true;
          that.notifyPropsChanged();
          that.plaintextPINstate = 1;
          that.plaintextPIN = "";
          while (that.plaintextPINstate === 1) {
            tkRefreshUi();
          }
          let res = {};
          if (that.plaintextPINstate === 0) {
            res = Tool.GetClearPINBlock(that.plaintextPIN, that.plaintextPIN.length);
          }
          console.log("\r\nGetClearPINBlock ===========>", JSON.stringify(res));
		  let isByPass = that.plaintextPIN.length ?[0]:[1];

          return {
            code: that.plaintextPINstate === 0 ? 1 : 0,
            data: { pPIN: res.data, pbBypass: isByPass }
          };
          // return {
          //   code: 1,
          //   data: {pPIN: [0x24, 0x43, 0x15, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], pbBypass: [0]}
          // };
        },
        // 暂时不用 start
        cCheckCredentials: function (ret) {
          console.log("cCheckCredentials ===========>", ret);
        },
        cCheckExceptionFile: function (ret) {
          console.log("cCheckExceptionFile ===========>", ret);
        },
        cIssuerReferral: function (ret) {
          console.log("cIssuerReferral ===========>", ret);
        },
        cGetTransLogAmount: function (ret) {
          console.log("cGetTransLogAmount ===========>", ret);
        },

        cDisplayPinVerifyStatus: function (retryTimes) {
          console.log("cDisplayPinVerifyStatus ======>", retryTimes);
          // todo 根据次数弹窗提示次数， 根据用户点击结果判断是否需要继续循环调用
          if (that.PINretryTimes === -2) {
            that.PINretryTimes = retryTimes;
          } else if (that.PINretryTimes === -1) {
            console.log("retryTimes end");
          } else {
            that.PINretryTimes--;
          }
          if (that.PINretryTimes <= 0) {
            navigateReplace({
              target: "result",
              type: "error"
            });
          }
          that.pinRetryTimesText = "Remain " + that.PINretryTimes + " times";
          that.isPINRetryTimesModal = true;
          that.notifyPropsChanged();
          that.isPINRetryState = 1;
          while (that.isPINRetryState === 1) {
            tkRefreshUi();
          }
          return { code: that.pinRetryReturn, data: that.pinRetryReturn };
        },
        cMultiAppSelect: function (Appobj) {
          console.log("\n\r cMultiAppSelect Appobj============>", JSON.stringify(Appobj));
          that.handleMultiAppSelect(Appobj);
          console.log("that.multiAppState 00000000================>", that.multiAppState);
          while (that.multiAppState === 1) {
            console.log("tkRefreshUi 00000000================>");
            tkRefreshUi();
            console.log("tkRefreshUi 11111111================>");
          }
          console.log("cMultiAppSelect 00000000000================>");
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
      console.log("watchPinReturn 00000=========>");
      function cb() {
        console.log("watchPinReturn 11111=========>");
        let ret = Tos.PedGetPinblockRetInfo();
        console.log("watchPinReturn 22222=========>", ret.code);
        if (ret.code >= 0) {
          let len = ret.data.pin_cnt;
          console.log("pinpadCB str 000=========>", len);
          that.valueLen = len;
          console.log("pinpadCB str 111=========>", len);
          that.lineX = 25 + (len - 1) * 22 + "";
          console.log("pinpadCB str 2222=========>", len);
          that.notifyPropsChanged();
          console.log("pinpadCB str 3333=========>", len);
          if (ret.data.is_done > 0) {
            that.showPin = false;
            console.log("pinpadCB str 4444=========>", len);
            that.flow.pin = GLOBAL_HEXARR_2_STRING(ret.data.pinblock);
            console.log("Pinblock  ==============>",that.flow.pin);
            that.flow.hasPin = true;
            that.notifyPropsChanged();
            that.pinBlockState = 1;
            return RET_REMOVE;
          } else {
            console.log("pinpadCB str 5555=========>", len);
            return RET_REPEAT;
          }
        } else {
          // 点击cancel或者其他pinblock错误 退出流程
          console.log("pinpadCB exception =========>");
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

    handleShowModal(type, msg) {
      console.log("handleShowModal:==============>:", type, msg);
      if (this.isShowModal) return;
      this.isNetLoading = false;
      this.showPin = false;
      this.pinCountDown = -1;
      this.isPinCounting = false;
      this.closeDetect();
      if (type === "notice") {
        this.modalTitle = "Notice";
        this.modalText = msg;
        this.isShowNoticeTips = true;
        this.isShowCardTips = false;
      } else {
        this.modalTitle = "CardNum Confirm";
        this.isShowNoticeTips = false;
        this.isShowCardTips = true;
      }
      this.isShowModal = true;
      this.notifyPropsChanged();
    },
    hideModal() {
      console.log("hideModal 000===========>", this.isShowCardTips);
      if (this.errorCode > 0) {
        // 联机网络错误
        navigateReplace({
          target: "result",
          type: "error"
        });
        return;
      }
      if (this.isShowCardTips) {
        console.log("hideModal 111===========>", this.isShowCardTips);
        this.hideCardBox();
        return;
      }
      console.log("hideModal 222===========>", this.isShowCardTips);
      this.isShowModal = false;
      this.isShowCardTips = false;
      this.isShowNoticeTips = false;
      this.timeCount = this.CHECK_TIME_OUT;
      this.notifyPropsChanged();
    },
    handlePinModal: function (flag) {
      this.showPin = flag;
      if (flag) {
        this.setPinTimer();
        this.showProcess =false;
        this.isShowModal = false;
        this.isShowCardTips = false;
        this.isShowNoticeTips = false;
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
    /**
     * 卡号提示窗口 start
     */
    // 卡号确认
    handleConfirmCard: function () {
      if (!this.isShowCardTips) {
        // this.hideCardBox(false);
        this.cancel();
        return;
      } else {
        this.hideCardBox(true);
      }
      this.closeDetect();
      // navigateReplace("password");
      navigateReplace({
        target: "password",
        value: this.value,
        amount: this.req.amount,
        cardNum: this.cardNum
      });
    },
    // 卡号取消
    hideCardBox: function (stopRepeat) {
      this.isShowModal = false;
      this.isShowCardTips = false;
      this.isShowNoticeTips = false;
      this.timeCount = this.CHECK_TIME_OUT;
      this.notifyPropsChanged();
    },
    /**
     * 卡号提示窗口 end
     */
    cancel: function (type) {
      this.closeDetect();
      navigateReplace({
        target: "result",
        type: type || "cancel",
        close_current: true
      });
    },
    showStar:function(len){
            let w = "*";
            this.passwordStar = w.repeat(len);
    },
    onKeyDown(args) {
      console.log("key down----->>>>:", args, this.isShowModal, this.modalText);
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
          if (this.plaintextPINstate === 1) {
            this.plaintextPIN += args;
            this.showStar(this.plaintextPIN.length);
            this.notifyPropsChanged();
          }
          break;
        case "cancel":
          // if (this.isShowModal) {
          //   console.log("keydown hideCardBox 000 ===========");
          //   this.hideCardBox();
          //   console.log("keydown hideCardBox 1111 ===========");
          //   break;
          // }
          console.log("keydown hideCardBox 2222 ===========");
          this.cancel();
          break;
        case "delete":
          if (this.plaintextPINstate === 1) {
            this.plaintextPIN = this.plaintextPIN.substring(0, this.plaintextPIN.length - 1);
            this.showStar(this.plaintextPIN.length);
            this.notifyPropsChanged();
            break;
          }
          break;
        case "return":
          if (this.isShowModal && this.cardNum === "") {
            // console.log("keydown return 0000 ===========");
            // this.hideCardBox();
            // console.log("keydown return 1111 ===========");
            this.cancel();
            break;
          }
          if (this.plaintextPINstate === 1) {
            this.handlePlaintextPINConfirm();
            break;
          }
          if (this.isPINRetryTimesModal) {
            this.retryPIN();
            break;
          }
          console.log("keydown handleConfirmCard 0000 ===========");
          this.handleConfirmCard();
          console.log("keydown handleConfirmCard 1111 ===========");
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
    closeDetect: function (flag) {
      if (!flag) {
        flag = 0b111;
      }
      console.log("closeDetect 0000===========>");
      let ret;
      if (flag & 0b01) {
        ret = Tos.IccClose();
        console.log("closeDetect icc ===========>", ret.code);
      }
      if (flag & 0b10) {
        ret = Tos.MsrClose();
        console.log("closeDetect msr ===========>", ret.code);
      }
      if (flag & 0b100) {
        ret = Tos.PiccClose();
        console.log("closeDetect picc ===========>", ret.code);
      }
    },
  },
  onWillMount: function (req) {
    this.user = Tos.GLOBAL_CONFIG.userInfo;
    this.flow = Tos.GLOBAL_TRANSACTION.flow;
    this.trans = Tos.GLOBAL_TRANSACTION.trans;
    if (this.trans.amount) {
      this.amount = GET_SHOW_AMOUNT(this.trans.amount);
    }

    this.title =  this.trans.transName;
    this.handleProcess(true,"EMV Process ...");
    GLOBAL_FUNCS.setLEDStatus(0b1000, 0);

    console.log("emvProcess onWillMount=======>>>");
  },
  onMount: function () {
    this.EMVTimer();
    console.log("emvProcess onMount=======>>>");
  },
  onWillUnmount: function () {
    console.log(" onWillUnmount 0000 =======>>>");

    this.pinBlockState = 0;
    this.pinCountDown = -1;
    this.pinTimeExit = true ;

    this.closeDetect();
    console.log(" onWillUnmount 1111=======>>>");

  }
});
