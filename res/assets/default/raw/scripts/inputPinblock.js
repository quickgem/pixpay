var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GLOBAL_HEXARR_2_STRING = require("mod_global_funcs").GLOBAL_HEXARR_2_STRING;

ViewModel("inputPinblock", {
  data: {
    title:"",
    trans:{},
    flow:{},
    valueLen: 0,
    lineX: "25",
    amount: "",
    timeOut: 60,
    timeOutShow: "60s",
    isExit: false,
  },
  methods: {
    jumpError: function (type) {
      console.log("jumpTo ============= >", type );
      navigateReplace({
        target: "result",
        type: type,
        close_current: true
      });
    },
    jump2Next:function (){
      GLOBAL_JUMP();
    },
    pinblockCB: function (str) {},
    startPinBlock: function () {
      Tos.PedSetPinblockCb(this.pinblockCB);
      let expectPswLen = "0,4,5,6,7,8,9,10,11,12";
      Tos.PedGetPinblock(1, expectPswLen, this.trans.pan, ALGEXT_PINBLOCK_0, 60000);
      this.watchPinReturn();
    },
    watchPinReturn: function () {
      let that = this;
      function cb() {
        let ret = Tos.PedGetPinblockRetInfo();
        console.log("watchpinret ==============>", JSON.stringify(ret));
        if (ret.code >= 0) { // made changed here to observe changes
          let len = ret.data.pin_cnt;
          that.valueLen = len;
          that.lineX = 25 + (len - 1) * 22 + "";
          that.notifyPropsChanged();
          if (ret.data.is_done > 0) {
            that.flow.pin = GLOBAL_HEXARR_2_STRING(ret.data.pinblock);
            console.log("Pinblock  ==============>", GLOBAL_HEXARR_2_STRING(that.flow.pin));
            that.flow.hasPin = true;
            that.jump2Next();
            return RET_REMOVE;
          } else {
            return RET_REPEAT;
          }
        } else {
          let errorCode = "error";
          switch (ret.code){
            case ERR_PED_INPUTPIN_TIMEOUT:
              errorCode ="timeout";
              break;
            case ERR_PED_INPUTPIN_CANCEL:
              errorCode ="cancel";
              break;
          }
          that.jumpError(errorCode);
          return RET_REMOVE;
        }
      }
      timerAdd(cb, 100);
    },

    setPinTimer: function () {
      let that = this;
      timerAdd(function () {
        that.timeOut--;
        if (that.isExit) return RET_REMOVE; // 已经不在当前页面
        if (that.timeOut <= 0) {
          return RET_REMOVE;
        }
        that.timeOutShow = that.timeOut + "s";
        that.notifyPropsChanged();
        return RET_REPEAT;
      }, 1000);
    }
  },
  onWillMount: function (req) {
    console.log("inputPinblock onWillMount  ============>");

    console.log("\ntransParam ====================>", JSON.stringify(Tos.GLOBAL_TRANSACTION.trans));
    console.log("\ntransParam ====================>", JSON.stringify(Tos.GLOBAL_TRANSACTION.flow));

    this.trans = Tos.GLOBAL_TRANSACTION.trans;
    this.flow  = Tos.GLOBAL_TRANSACTION.flow;
    this.title = this.trans.transName;
    if(this.trans.amount) {
      this.amount = GET_SHOW_AMOUNT(this.trans.amount);
    }

    console.log("inputPInblock  amount,amount  ============>", this.amount, this.trans.pan);

    this.notifyPropsChanged()
  },
  onMount: function () {
    console.log("pinblock onMount");
    GLOBAL_FUNCS.setLEDStatus(0);
    this.setPinTimer();
    this.startPinBlock();
  },
  onWillUnmount: function () {
    this.isExit = true;
  }
});
