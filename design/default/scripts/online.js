var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GLOBAL_NETWORK_SOCKET = require("mod_global_network").GLOBAL_NETWORK_SOCKET;
var GLOBAL_HEXARR_2_STRING = require("mod_global_funcs").GLOBAL_HEXARR_2_STRING;
var GLOBAL_ISO8583 = require("mod_global_iso8583").GLOBAL_ISO8583;
var GLOBAL_PACK_8583 = require("mod_global_iso8583").GLOBAL_PACK_8583;
var GLOBAL_UNPACK_8583 = require("mod_global_iso8583").GLOBAL_UNPACK_8583;
var transOnline = require("mod_global_network").transOnline;


ViewModel("online", {
  data: {
    title:"",
    isSocTimerActive: false,
    valueLen: 0,
    timeOutShow: "60s",
    showTip:"Process ...",
    isLoading: true,
    socketInstance:null,
    trans:{},
    flow:{},
    config:{},

  },

  methods: {
    jumpError: function (type) {
      console.log("jumpTo ============= >", type );
      navigateReplace({
        target: "result",
        type: type,
      });
    },

    jump2Next:function (){
      GLOBAL_JUMP();
    },

    onKeyDown(args) {
      var key = args;
      switch (key) {
        case "cancel":
          if (this.showModel) {
            this.cancel();
          }
          break;
        case "return":
          if (this.showModel) {
            this.cancel();
          }
          break;
        default:
          break;
      }
    },

    netSuccess: function () {

      this.jump2Next();
    },
    netError: function (error ) {
        this.jumpError(error);
    },
    netshowPrompt: function (tip ) {
      this.showTip = tip;
      this.notifyPropsChanged();
    },
    netTimeTick: function (time ) {
      this.timeOutShow = time+"s";
      this.notifyPropsChanged();
    },

  },

  onWillMount: function (req) {
    this.flow =Tos.GLOBAL_TRANSACTION.flow;
    this.trans =Tos.GLOBAL_TRANSACTION.trans;
    this.title =  this.trans.transName;
    this.notifyPropsChanged();
  },
  onMount: function () {
    GLOBAL_FUNCS.setLEDStatus(0);
    let callback = {
      success:this.netSuccess,
      error:this.netError,
      showPrompt: this.netshowPrompt,
      timeTick: this.netTimeTick
    };
    transOnline(Tos.GLOBAL_CONFIG.networkParam,callback,this.trans);
  },
  onWillUnmount: function () {
    this.socketInstance = null;
  }
});
