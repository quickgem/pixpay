var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("inputPwd", {
  data: {
    flow: {},
    trans: {},
    title: "",
    value: "",
    hint: "",
    valueLen: 0,
    lineX: "",
    password: "12345678",
    timeOut: 60,
    timeOutShow:"60s",
    isExit: false,
  },
  methods: {
    setScreenTimer: function () {
      let that = this;
      timerAdd(function () {
        that.timeOut--;
        console.log("time ===========>", that.timeOut);
        if (that.isExit) {
          return RET_REMOVE;
        }
        if (that.timeOut <= 0) {
          that.jumpError("timeOut");
          return  RET_REMOVE;
        }
        that.timeOutShow = that.timeOut + "s";
        that.notifyPropsChanged();
        return RET_REPEAT;
      }, 1000);
    },

    jumpError: function (type) {
      navigateReplace ({
        target: "result",
        type: type || "cancel",
        close_current: true
      });
    },

    onKeyDown(args) {
      var key = args;
      console.log("KeyCode ===========>" + key);
      switch (key) {
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
          if (this.value.length >= this.password.length) {
            break;
          }
          this.value += key;
          this.valueLen = this.value.length;
          this.lineX = 25 + (this.valueLen - 1) * 22 + "";
          console.log("value ========> " + this.value);
          console.log("valueLen ========> " + this.valueLen);
          console.log("lineX ========> " + this.lineX);
          this.notifyPropsChanged();
          break;
        case "cancel":
          navigateReplace({
            target: "result",
            type: "cancel"
          });
          break;
        case "backspace":
          console.log("delete value ======================>" + this.value);
          if (this.value.length > 0) {
            this.value = this.value.substring(0, this.value.length - 1);
            this.valueLen = this.value.length;
            this.lineX = 25 + (this.valueLen - 1) * 22 + "";
            this.notifyPropsChanged();
          }
          return;
        case "return":
          if (this.value.length >= this.password.length) {
            if (this.value === this.password) {
              GLOBAL_JUMP();
            } else {
              this.jumpError("Password Error");
            }
          }
          break;
        default:
          break;
      }

    }

  },
  onWillMount: function (req) {
    console.log("inputPwd onWillMount ================>");
    this.flow = Tos.GLOBAL_TRANSACTION.flow;
    this.trans = Tos.GLOBAL_TRANSACTION.trans;
    this.title = this.trans.transName;
    this.hint = "Please input user password";
    console.log("flow ============" , JSON.stringify(this.flow));
    console.log("trans ===========" , JSON.stringify(this.trans));
    console.log("title ===========" , JSON.stringify(this.title));

    this.notifyPropsChanged()
  },
  onMount: function () {
    this.setScreenTimer();
  },
  onWillUnmount: function () {
    this.isExit = true;
    Tos.PrnClose();
  }
});
