var GLOBAL_PROPS = require("mod_global_props").GLOBAL_PROPS;
var GLOBAL_FUNCS = require("mod_global_funcs").GLOBAL_FUNCS;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

// tips: 回调函数里面使用this可能会是undefined，注意需要在外部保存this变量
// tips: 回调函数注意需要在外部保存，不然会造成被GC引起crash
ViewModel("inputAmt", {
  data: {
    value: "",
    valueStr: "0.00",
    title:"",
    showModel: false,
    timeOutShow:"60s",
    timeOut:"60",
    isExit:false,
    trans:{},
    flow:{},
    user:null
  },
  methods: {
     onFail: function () {
       if (this.showModel) {
         this.hideModel();
         return;
       }
       navigateReplace({
         target: "pay",
         type: "cancel",
         data:this.user
       });
    },
     showPrompt: function () {
       this.showModel = true;
       this.setPromptTimer();
       this.notifyPropsChanged();
     },

    setPromptTimer: function () {
      let loop = 0;
      let that = this;
      timerAdd(function () {
        if (that.isExit ) return RET_REMOVE; // 已经不在当前页面
        if (!that.showModel) {
          return RET_REMOVE;
        }
        loop++;
        if (loop >= 2) {
          that.hideModel();
          return RET_REMOVE;
        }
        return RET_REPEAT;
      }, 1000);
    },

    setScreenTimer: function () {
      let that = this;
      timerAdd(function () {
        that.timeOut--;
        if (that.isExit ) return RET_REMOVE; // 已经不在当前页面
        if (that.timeOut <= 0) {
          that.jumpError("timeout");
          return RET_REMOVE;
        }
        that.timeOutShow =that.timeOut+"s";
        that.notifyPropsChanged();
        return RET_REPEAT;
      }, 1000);
    },

    jumpError: function (type) {
      navigateReplace({
        target: "pay",
        type: type || "cancel",
        close_current: true,
        data:this.user
      });
    },

    hideModel: function () {
      this.showModel = false;
      this.notifyPropsChanged();
    },

    handleCancel: function () {
      if (this.showModel) {
        this.hideModel();
        return;
      }
      this.onFail();
    },

    navigateTo: function () {
      if (this.value <= 0) {
        this.showPrompt();
        this.notifyPropsChanged();
        return;
      }
      this.trans.amount = parseInt(this.value);
      console.log('global_jump', JSON.stringify(this.user))
      GLOBAL_JUMP("", this.user);
    },

    _formatInput: function () {
      this.valueStr = GET_SHOW_AMOUNT(this.value);
      this.notifyPropsChanged();
    },

    reduceNum: function () {
      if(this.value.length>0) {
        this.value = this.value.substring(0, this.value.length - 1);
        this._formatInput();
      }
    },

    onKeyDown(args) {
      console.log("key down----->>>>:", args);
      var key = args;
      switch (key) {
        case "0":
          if(!this.value) break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          if (this.showModel) break;
          if(this.value.length>12) break;
          this.value += key;
          this._formatInput();
          break;
        case "cancel":
          this.handleCancel();
          break;
        case "backspace":
          if (this.showModel) {
            this.hideModel();
            return;
          }
          this.reduceNum();
          break;
        case "return":
          if (this.showModel) {
            this.hideModel();
            return;
          }
          this.navigateTo();
          break;
        default:
          break;
      }
    },

    handleResetTInfo: function (data) {
      let obj = {
        // \xE0\xF8\xC8
        capability: [0xe0, 0xf8, 0xc8],
        // \xF0\x00\xF0\xF0\x01
        exCapability: [0xf0, 0x00, 0xf0, 0xf0, 0x01],
        termId: "00000000",
        merchId: "mojialiang",
        // \x01\x56
        countryCode: [0x01, 0x56],
        // \x01\x56
        transCurrCode: [0x01, 0x56],
        terminalCurrencyExponent: 0x02,
        //\x08\x40
        referCurrCode: [0x08, 0x40],
        referenceCurrencyExponent: 0x02,
        conversionRatio: 1000,
        //\x00\x01
        merchCateCode: [0x00, 0x01],
        merchName: "YITUOLUANMA",
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

      }
    },


  },
  onWillMount: function (req) {
    console.log("inputAmt============:" );

    this.flow =Tos.GLOBAL_TRANSACTION.flow;
    this.trans =Tos.GLOBAL_TRANSACTION.trans;
    this.title =  this.trans.transName;
    console.log("inputAmt============: transName "+this.trans.transName );

    console.log("title ----->>>>:", this.title);
    if(req){
      this.user = req.data
    }

    this.notifyPropsChanged()
  },

  onMount: function () {
    this.setScreenTimer();
    // this.setPreEmvTimer();
  },

  onWillUnmount: function () {
    // Tos.SysLed(0b1111, 0, 0);
    this.isExit = true;
    Tos.PrnClose();
  }
});
