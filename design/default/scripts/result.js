var PRINT_TICKET = require("mod_global_print").PRINT_TICKET;
var TRANS_REPORT = require("mod_global_report").TRANS_REPORT;
var GLOBAL_FUNCS = require("mod_global_funcs").GLOBAL_FUNCS;
var getResponse = require("mod_global_response").getResponse;

ViewModel("result", {
  data: {
    amount: "0.00",
    btnText: "Success (60s)",
    resultCode: 1,
    isTimerActive: false,
    isPrinting: false,
    currPrint:0,
    title:"",
    responseCode:"",
    rrn:"",
    callback :{
      printNext:this.printNext,
      noPaper:this.noPaper,
      printDone:this.printDone,
      printError:this.printError
    },
    config:{},
    trans:{},
    flow:{},
    transParam:{},
    user:"",
    transferResponse:""
  },
  methods: {
    onKeyDown(args) {
      console.log("key down----->>>>:", args);
      switch (args) {
        case "cancel":
          this.onConfirm();
          break;
        case "return":
          this.onPrintMerchantCopy();
          break;
        default:
          break;
      }
    },

    onRepaint: function () {
      if (this.isPrinting) return;
      this.callPrint();
    },

    onConfirm: function () {
      navigateReplace({
        close_current: true,
        target: "pay",
        //data:this.user
      });
    },

    printNext: function (count) {
      this.currPrint = count;
      // PRINT_TICKET(trans,cb,rePrint,count);
    },

    noPaper: function (count) {
      this.currPrint = count;
    },

    printError: function () {},

    onPrint:function () {
      let that  = this;
      timerAdd(function () {
        PRINT_TICKET(that.trans,that.callback,false,that.currPrint, {code: that.responseCode, rrn: that.rrn});
        return RET_REMOVE;
      }, 100);
    },

    onPrintMerchantCopy:function () {
      let that  = this;
      that.currPrint=1
      timerAdd(function () {
        PRINT_TICKET(that.trans,that.callback,false,that.currPrint, {code: that.responseCode, rrn: that.rrn});
        return RET_REMOVE;
      }, 100);
    },

    printDone: function () {
      let ret = Tos.PrnClose();
      if (ret.code === 0) {
        this.isPrinting = false;
        return;
      }
      let that = this;
      timerAdd(function () {
        ret = Tos.PrnClose();
        that.isPrinting = false;
        that.delayClsPrn();
        return RET_REMOVE;
      }, 1000);
    },

    delayClsPrn: function () {
      if (this.isTimerActive) return;
      this.isTimerActive = true;
      let time = 60;
      let that = this;
      console.log("delayClsPrn 000===========>");
      timerAdd(function () {
        console.log("delayClsPrn 1111===========>", time);
        if (!that.isTimerActive) return RET_REMOVE;
        time--;
        that.btnText =
            (that.resultCode === 1
                ? "Success"
                : that.resultCode === 2
                    ? "Cancel"
                    : that.resultCode === 3
                        ? "Timeout"
                        : "Failure") +
            " (" +
            time +
            "s)";
        that.notifyPropsChanged();
        if (time <= 0) {
          console.log("confirm quit===========>");
          that.onConfirm();
        }
        return time > 0 ? RET_REPEAT : RET_REMOVE;
      }, 1000);
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
    console.log("result type =============>", JSON.stringify(req));
    this.responseCode = req.code?req.code:""
    this.rrn = req.rrn
    if (req) {
      this.req = req;
      this.user = Tos.GLOBAL_CONFIG.userInfo
      if (req.type === "success") {
        this.resultCode = 1
        this.btnText = "Success (10s)";
        if (req.cardType === 1) {
          GLOBAL_FUNCS.setLEDStatus(0b1011, 0);
        } else {
          GLOBAL_FUNCS.setLEDStatus(0);
        }
      }
      else if (req.type === "error") {
        this.resultCode = 0;
        GLOBAL_FUNCS.setLEDStatus(0b0100, 0);
        let response = getResponse(req.code?req.code:"")
        this.btnText = response.responseMessage?response.responseMessage:"Failure (10s)";
      }
      else {
        this.resultCode = req.type === "cancel" ? 2 : 3;
        GLOBAL_FUNCS.setLEDStatus(0);
        this.btnText = req.type === "cancel" ? "Cancel (10s)" : "Timeout (10s)";
      }
      this.delayClsPrn();
      this.notifyPropsChanged();
    }


  },
  onMount: function () {
    this.flow =Tos.GLOBAL_TRANSACTION.flow;
    this.trans =Tos.GLOBAL_TRANSACTION.trans;
    this.transParam =  Tos.GLOBAL_TRANSACTION.transParam ;


    if (this.resultCode === 1) {
      if( this.transParam.needSave) {
        TRANS_REPORT.saveTrans(this.trans);
      }
      console.log("onMount success ============>", 'flow ====>',JSON.stringify(this.flow));
      console.log("onMount success ============>", 'trans ====>',JSON.stringify(this.trans));
      console.log("onMount success ============>", 'transParam ====>',JSON.stringify(this.transParam));
      this.onPrint();
    }else if (this.resultCode === 1){
      console.log("onMount failure ============>", 'flow ====>',JSON.stringify(this.flow));
      console.log("onMount failure ============>", 'trans ====>',JSON.stringify(this.trans));
      console.log("onMount failure ============>", 'transParam ====>',JSON.stringify(this.transParam));
      this.onPrint();
    }
    // this.title = this.trans.transName;
    this.notifyPropsChanged();
  },

  onWillUnmount: function () {
    this.isTimerActive = false;
    this.closeDetect();
    GLOBAL_FUNCS.setLEDStatus(0);
    Tos.PrnClose();
    console.log("Result unmount ==========>", this.isTimerActive, this.flow, this.trans, this.transParam);
  }
});
