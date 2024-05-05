var GLOBAL_PROPS = require("mod_global_props").GLOBAL_PROPS;
var GLOBAL_TRANSACTION = require("mod_global_trans").GLOBAL_TRANSACTION;
var GLOBAL_PREENTRY = require("mod_global_trans").GLOBAL_PREENTRY;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP; // navigation
var GLOBAL_CONSTANT = require("mod_global_constant").GLOBAL_CONSTANT;
var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;


ViewModel("authMenu", {
  data: {
    currentIndex: 0,
    isShowScrollbar: false,
    timeOut:60, // sets display timeout
    isExit:false,
    appList: [], // display list of apps
  },

  methods: {
    onKeyDown: function(args) {
      console.log("key down----->>>>:", args);
      var key = args;
      switch (key) {
        case "cancel":
          this.jumpError("cancle")
          break;
        case "return":
          this.navigateTo();
          break;
        default:
          break;
      }
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
        
      console.log("key down-777---->>>>:", args);
        /*that.timeOutShow =that.timeOut+"s";
        that.notifyPropsChanged();*/
        return RET_REPEAT;
      }, 1000);
    },

    navigateTo: function (args) {
      GLOBAL_JUMP();
    },
    appClick: function (item) {

      if (item  && item.entry) {
        new GLOBAL_TRANSACTION().init();
        Tos.GLOBAL_TRANSACTION.flow.entry = item.entry && JSON.parse(item.entry) || [];
        Tos.GLOBAL_TRANSACTION.transParam = item.transParam && JSON.parse(item.transParam) || {};
        Tos.GLOBAL_TRANSACTION.trans.transName = Tos.GLOBAL_TRANSACTION.transParam.appName;
        Tos.GLOBAL_TRANSACTION.trans.transType = Tos.GLOBAL_TRANSACTION.transParam.transType;
        Tos.GLOBAL_TRANSACTION.trans.voucherNo = Tos.GLOBAL_CONFIG.voucherNo;
        console.log("Tos.GLOBAL_TRANSACTION.trans.voucherNo ==============> ", Tos.GLOBAL_TRANSACTION.trans.voucherNo);
        GLOBAL_JUMP();
      }

    },
    jumpError: function (type) {
      navigateReplace({
        target: "result",
        type: type || "cancel",
        close_current: true
      });
    },
  },

  onWillMount: function (req) {
    console.log("authMenu onWillMount  begin  ============>");
    this.appList = new GLOBAL_PREENTRY().getAuthList();
    console.log("authMenu onWillMount end  ============>");

  },
  onMount: function () {
    let that = this;
    this.setScreenTimer();
    this.isShowScrollbar = this.appList.length  > 6;
    this.notifyPropsChanged();
    console.log("authMenu onMount ==== !!!!");

  },
  onWillUnmount: function () {
    this.isExit = true;
  }
});
