 let APP_LOGIN_URL = "https://biz.corestepbank.com/authentication/login";
//let APP_LOGIN_URL = "http://10.20.31.56:5173/js-post";
ViewModel("calc", {
  data: {
    httpCB: null
  },
  methods: {
    initHTTPCB: function () {
      console.log("HttpclientCbEvent start 0000000===========");
      Tos.HttpclientCbEvent();
    },
    GLOBAL_CHOOSE_NETWORKs: function () {
      let type = 1; // WIFI : 1 ,GPRS : 0
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
    },

    httptest: function () {
      this.GLOBAL_CHOOSE_NETWORKs();
      let that = this;
      let head = {
        // params: send parameters by request header
        // 
        params: "headerTest1:aaa\r\nheaderTest2:bbb\r\nemail:ndubisijnr@gmail.com" + "\r\npassword:123456\r\nsource:POS_TERMINAL" + "\r\nAccept: */*\r\n",
        //method: 0 get ,1 post
        method: 1,
        //  ContentType is important,post method send parameters need to set ContentType correct, otherwise the body will be empty
        ContentType: "application/json"
      };
      let body = { email: "ndubisijnr@gmail.com", password: "123456", source: "POS_TERMINAL" };
      body = JSON.stringify(body) + "\r\n";
      this.httpCB = function (ret) {
        console.log("httpCB 0000 =====>", JSON.stringify(ret));
        let data = ret.data&& ret.data.response_buf || [];
        that.parseData(data);
      };
      // head -- url -- body -- cert -- port  -- timeout -- cb
     // let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "", 5173, 30, 1, that.httpCB);
	  let httpret = Tos.HttpclientCommon(head, APP_LOGIN_URL, body, "","", 30, 1, that.httpCB);

      console.log("666666666:====>", JSON.stringify(httpret));
    },

    parseData: function (data) {
      let u8arr = new Uint8Array(data);
      let decodeStr = String.fromCharCode.apply(null, u8arr);
      console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
    },

    onKeyDown(key) {
      key === "cancel" &&
        navigateTo({
          target: "home",
          close_current: true
        });
      this.httptest();
    }
  }
});
