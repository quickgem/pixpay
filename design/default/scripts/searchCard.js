 var GLOBAL_FUNCS  = require("mod_global_funcs").GLOBAL_FUNCS;
var GLOBAL_JUMP  = require("mod_global_trans").GLOBAL_JUMP;
var GLOBAL_STRING_2_HEXARR = require("mod_global_funcs").GLOBAL_STRING_2_HEXARR;
var sprintf  = require("mod_global_funcs").sprintf;

ViewModel("searchCard", {

  data: {
    amount: "$ 0.00",
    cardDetectState: 0b00,
    timeCount: 60,
    timeOutShow: "60s",
    CHECK_TIME_OUT: 60,
    isTimerActive: false,
    modalTitle: "",
    modalText: "",
    isShowModal: false,
    trans:{},
    user:null

  },
  methods: {
    onOpenMSR: function () {
      let that = this;
      console.log("onOpenMsr ==> ");
      let res = Tos.MsrOpen();
      if (res.code !== 0) {
        console.log("openMsr fail ");
        return;
      }
      res = Tos.MsrReset();
      if (res.code !== 0) {
        console.log("MsrReset fail ");
        return;
      }
      timerAdd(function () {
        console.log("param: " + that.timeCount+ "  " + that.cardDetectState + "  " + that.isTimerActive);
        if (
            that.timeCount <= 0 ||
            that.cardDetectState & 0b01 ||
            !that.isTimerActive
        ) {
          return RET_REMOVE;
        }
        let res = Tos.MsrSwiped();
        console.log("swwwwwwip=================",   res.code);
        if (res.code === 0) {
          console.log("MsrRead start=================");
          let readRes = Tos.MsrRead();
          console.log("MsrRead end=================", readRes.code);
          if (readRes.code < 0) {
            that.cardDetectState = that.cardDetectState | 0b01;
            that.handleShowModal("notice", "Read MSR failed,try again ?");
            return RET_REMOVE;
          } else {
            console.log("MsrRead trans  000000 =================>", readRes.data,JSON.stringify( readRes.data));
            let track1 = readRes.data.track1;
            if(track1) {
              that.trans.track1 =track1.substring(1,track1.length-2).replaceAll("=","D");
              console.log("MsrRead trans track1 =================>", that.trans.track1);
            }
            console.log("MsrRead trans  11111 =================>");
            let track2 = readRes.data.track2;
            if(track2) {
              track2 =track2.substring(1,track2.length-2);
              track2 =track2.replace("=","D");
              that.trans.track2 =track2;
              console.log("MsrRead trans track2 =================>", that.trans.track2);
              let index = track2.indexOf("D");
              that.trans.pan = track2.substring(0,index);
              console.log("MsrRead trans pan =================>", that.trans.pan);
              that.trans.expDate =  track2.substring(index+1,index+1+4);
              console.log("MsrRead trans expDate =================>", that.trans.expDate);
              that.trans.serviceCode = track2.substring(index+1+4,index+1+4+3);
              console.log("MsrRead trans serviceCode =================>", that.trans.serviceCode);
            }else{
              that.cardDetectState = that.cardDetectState | 0b01;
              that.handleShowModal("notice", "Read MSR failed,try again ?");
              return RET_REMOVE;
            }

            let track3 = readRes.data.track3;
            if(track3){
              that.trans.track3 = track3.substring(1,track3.length-2).replaceAll("=","D");
              console.log("MsrRead trans track3 =================>", that.trans.track3);
            }

            that.trans.enterMode = Tos.CONSTANT.ENTRY_MODE.MAG;
            Tos.SysBeep();
            that.closeDetect(0b101);
            GLOBAL_JUMP(that.chooseTarget(), that.user);
            console.log('onOpenMSR ====>', JSON.stringify(that.user))
            /*navigateReplace({
              target: "inputPwd"
            });*/
            return RET_REMOVE;
          }
        }
        return RET_REPEAT;
      }, 100);
    },

    onOpenICC: function () {
      let that = this;
      console.log("onOpenICC ==> ");

      let res = Tos.IccOpen(0);
      console.log("onOpenICC1111 ==> IIIIIIIIIIII1111", res.code);
      if (res.code !== 0) {
        console.log("open Icc fail");
        return;
      }
      timerAdd(function () {
        if (
            that.timeCount <= 0 ||
            that.cardDetectState & 0b01 ||
            !that.isTimerActive
        ) {
          return RET_REMOVE;
        }
        console.log("onOpenICC000 ==> IIIIIIIIIIII000");
        res = Tos.IccDetect(0);
        console.log("IccDetect================= 0000", res.code);
        // if (res.code !== 0) {
        //   console.log("IccDetect================= 1111", res.code);
        //   return;
        // }
        res = Tos.IccReset(0);
        console.log("IccReset================= 0000", res.code);
        if (res.code === 0) {
          that.closeDetect(0b110);
          Tos.SysBeep();
          that.isTimerActive = false;
          that.trans.enterMode = Tos.CONSTANT.ENTRY_MODE.INSERT;
         /* navigateReplace({
            target: "inputPwd"
          });*/
          console.log("onOpenICC000 ==> enterMode ",that.trans.enterMode);

          GLOBAL_JUMP(that.chooseTarget(), that.user);
          console.log('onOpenIcc ====>', JSON.stringify(that.user))
          return RET_REMOVE;
        }
        return RET_REPEAT;
      }, 100);
    },

    onOpenPICC: function () {
      let that = this;

      let res = Tos.PiccOpen();
      console.log("Tos.PiccOpen()=", res.code);
      if (res.code !== 0) {
        console.log("Tos.PiccOpen() fail");
        return;
      }
      console.log("Tos.PiccOpen() start");
      timerAdd(function () {
        if (that.timeCount <= 0 || that.cardDetectState & 0b01 || !that.isTimerActive) {
          return RET_REMOVE;
        }
        res = Tos.PiccDetect();
        console.log("PPPPPPP Detected =================>>>", res.code);
        if (res.code === 0) {
          Tos.SysBeep();
          that.closeDetect(0b11);
          that.isTimerActive = false;
          that.trans.enterMode = Tos.CONSTANT.ENTRY_MODE.RF;
          /*navigateReplace({
            target: "inputPwd"
          });*/

          GLOBAL_JUMP(that.chooseTarget(), that.user)
          console.log('onOpenMSR ====>', JSON.stringify(that.user))
          return RET_REMOVE;
        }
        return RET_REPEAT;
      }, 100);
    },

    chooseTarget:function (){
      let cardType = this.trans.enterMode;
      if(cardType === Tos.CONSTANT.ENTRY_MODE.MAG){
        return 0;
      }else{
        return 1;
      }
    },

    onKeyDown: function(args) {
      console.log("key down----->>>>:", args);
      var key = args;
      switch (key) {
        case "cancel":

          if (this.isShowModal) {
            this.handleCancel();
            return;
          }
          break;
        case "return":
          if (this.isShowModal) {
            this.handleConfirm();
            return;
          }
          break;
        default:
          break;
      }
    },

    jumpError: function (type) {
      navigateReplace({
        target: "result",
        type: type || "cancel",
        close_current: true,
        data:this.user
      });
    },

    handleShowModal: function (type, msg) {
      console.log("handleShowModal:==============>:", type, msg);
      if (this.isShowModal) return;
      this.closeDetect();
      this.modalTitle = "Notice";
      this.modalText = msg;
      this.isShowModal = true;
      this.notifyPropsChanged();
    },

    handleCancel: function () {
       this.jumpError("Search Card Fail");
    },

    handleConfirm: function () {
      this.isShowModal = false;
      this.notifyPropsChanged();
      this.initTimerAndDetect();
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

    onKeyDown: function(args) {
      console.log("key down----->>>>:", args, this.isShowModal, this.modalText);
      switch (args) {
        case "cancel":
          console.log("keydown hideCardBox 2222 ===========");
          this.closeDetect();
          navigateReplace({
            target: "result",
            type: "error",
            data:this.user
          });
          break;
        default:
          break;
      }
    },

    initTimer: function () {
      console.log("timer count ======>>>>>  ", this.timeCount);
      if (!this.isTimerActive || this.timeCount <= 0) {
        console.log("timer count000 ======>>>>>  done");
        return RET_REMOVE;
      }
      this.timeCount--;
      this.timeOutShow = + this.timeCount + "s";
      if (this.timeCount <= 0) {
        console.log("handleShowModalhandleShowModal 000======>>>>>  ");
        this.isTimerActive = false;
        this.closeDetect();
        navigateReplace({
          target: "result",
          type: "Detect card timeout",
          data:this.user
        });
        console.log("handleShowModalhandleShowModal 111======>>>>>  ");
      }
      console.log("timer count ======>>>>>", this.timeCount);

      this.notifyPropsChanged();
      return RET_REPEAT;
    },

    initTimerAndDetect() {
      this.isTimerActive = true;
      this.timeCount = this.CHECK_TIME_OUT;
      this.cardDetectState = 0b00;
      timerAdd(this.initTimer, 1000);
      let ret = Tos.SysGetTime();
      console.log("onOpenMSR start time ==========>", ret.data);
      this.onOpenMSR();
      ret = Tos.SysGetTime();
      console.log("onOpenMSR end time ==========>", ret.data);
      this.onOpenICC();
      ret = Tos.SysGetTime();
      console.log("onOpenICC start time ==========>", ret.data);
      this.onOpenPICC();
      ret = Tos.SysGetTime();
      console.log("onOpenPICC end time ==========>", ret.data);
    },

    setPreEmvTimer: function () {
      let that = this;
      timerAdd(function () {
        that.emvPreProcess();
        that.initTimerAndDetect();
        let ret = Tos.SysGetTime();
        console.log("setPreEmvTimer end 000 ==========>", ret.data);
        return RET_REMOVE;
      }, 50);
    },

    handleResetTInfo: function (data) {

      let countryCodeArr = sprintf("%04s",Tos.GLOBAL_CONFIG.countryCode);
      let obj = {
        // \xE0\xF8\xC8
        capability: [0xe0, 0xf8, 0xc8],
        // \xF0\x00\xF0\xF0\x01
        exCapability: [0xf0, 0x00, 0xf0, 0xf0, 0x01],
        termId: Tos.GLOBAL_CONFIG.termId,
        merchId:Tos.GLOBAL_CONFIG.merchId,
        // \x01\x56
        countryCode:countryCodeArr,
        // \x01\x56
        transCurrCode:countryCodeArr,
        terminalCurrencyExponent: 0x02,
        //\x08\x40
        referCurrCode: countryCodeArr,
        referenceCurrencyExponent: 0x02,
        conversionRatio: 1000,
        //\x00\x01
        merchCateCode: [0x00, 0x01],
        merchName: Tos.GLOBAL_CONFIG.merchName,
        terminalType: 0x22,
        transType: 0
      };
      return Object.assign({}, data, obj);
    },

    emvPreProcess: function () {
      let ret = Tos.SysGetTime();
      console.log("TemvTransInit start time ==========>", ret.data);
      ret = Tos.TemvTransInit(0);

      if (ret.code !== 0) {
        return;
      }
      // Tos.SysBeep();
      ret = Tos.SysGetTime();
      console.log("TemvGetTerminalInfo start time ==========>", ret.data);
      ret = Tos.TemvGetTerminalInfo();
      ret = Tos.SysGetTime();
      console.log("TemvGetTerminalInfo end time ==========>", ret.data);
      if (ret.code !== 0) {
        console.log("TemvGetTerminalInfo Fail 2222=========");
        return;
      }
      let newTInfo = this.handleResetTInfo(ret.data);
      ret = Tos.SysGetTime();
      console.log("TemvSetTerminalInfo start time ==========>", ret.data);
      ret = Tos.TemvSetTerminalInfo(newTInfo);
      ret = Tos.SysGetTime();
      console.log("TemvSetTerminalInfo end time ==========>", ret.data);
      if (ret.code !== 0) {
        return;
      }

      let transactionTime = Tos.GLOBAL_TRANSACTION.trans.transTime;

      console.log("\ntransactionTime year ==========>", transactionTime.year);
      console.log("\ntransactionTime month ==========>", transactionTime.month);
      console.log("\ntransactionTime date ==========>", transactionTime.date);
      console.log("\ntransactionTime h ==========>", transactionTime.h);
      console.log("\ntransactionTime m ==========>", transactionTime.m);
      console.log("\ntransactionTime s ==========>", transactionTime.s);
      // todo hex
      let transDate = [
        parseInt(transactionTime.year.substring(2), 16),
        parseInt(transactionTime.month, 16),
        parseInt(transactionTime.date, 16)
      ];
      let transTime = [
        parseInt(transactionTime.h, 16),
        parseInt(transactionTime.m, 16),
        parseInt(transactionTime.s, 16)
      ];
      console.log("\ntransData ========>", transDate);
      console.log("\ntransTime ========>", transTime);

      let transParam = {
        transCounter: 1,
        transType: 0,
        transDate: transDate,
        transTime: transTime,
        isForceOnLine: 0,
        amtAuth: [0x00, 0x00, 0x00, 0x00, 0x06, 0x70]
      };
      console.log("\ntransParam transCounter ==========>", transParam.transCounter);
      console.log("\ntransParam transType ==========>", transParam.transType);
      console.log("\ntransParam transDate ==========>", transParam.transDate);
      console.log("\ntransParam transTime ==========>", transParam.transTime);
      console.log("\ntransParam isForceOnLine ==========>", transParam.isForceOnLine);
      console.log("\ntransParam amtAuth ==========>", transParam.amtAuth);

      console.log("\ntransParam ====================>", JSON.stringify(transParam));

      console.log("TemvSetTransParam start =========");
      ret = Tos.TemvSetTransParam(transParam);
      console.log("TemvSetTransParam end =========");
      if (ret.code !== 0) {
        console.log("TemvSetTransParam Fail 4444=========");
        return;
      }
    },
  },

  onWillMount: function (req) {
    console.log("onWillMount0000=======>>>: start");
    GLOBAL_FUNCS.setLEDStatus(0b1000, 0);
    if(req){
      this.user = Tos.GLOBAL_CONFIG.userInfo
    }
    console.log('searchCard ===> ', JSON.stringify(this.user))
  },

  onMount: function () {
    let ret = Tos.SysGetTime();
    console.log("onMount start 000 ==========>", ret.data);
    this.trans =Tos.GLOBAL_TRANSACTION.trans;
    this.setPreEmvTimer();
  },
  onWillUnmount: function () {
    this.isTimerActive = false;

  }
});