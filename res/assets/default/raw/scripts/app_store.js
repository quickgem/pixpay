var GLOBAL_CHOOSE_NETWORK = require("mod_Tos_Sys_global_funcs").GLOBAL_CHOOSE_NETWORK;
var GLOBAL_GET_APPS = require("mod_Tos_Sys_global_app_manage").GLOBAL_GET_APPS;
let APP_STORE_APP_LIST_URL ="https://testtms2.topwisesz.com/appmarket/app/home";
ViewModel("app_store", {
  data: {
    deviceSN: "",
    deviceModel: "M3P",
    appList: [],
    isLoading: false,
    isEmpty: true,
    TipsText: "Loading...",
    timeout: 30,
    promise: null,
    downloadBuffer: [],
    saveBuffer: [],
    httpCB: null
  },

  methods: {
    appOperate: function (data) {
      console.log("appOperate 000========>", data.index);
      let item = this.appList[data.index];
      console.log("appOperate 1111========>", JSON.stringify(item));
      navigateTo({
        target: "app_download",
        data: item,
        close_current: true
      });
    },

    getAppList: function () {
      console.log("111111111111:", this.isLoading);
      if (this.isLoading) return;
      console.log("22222222222");
      this.TipsText = "Loading...";
      this.notifyPropsChanged();
      let ret = GLOBAL_CHOOSE_NETWORK();
      console.log("333333333", JSON.stringify(ret));
      if (!ret) {
        this.isLoading = false;
        this.TipsText = "Network error";
        this.notifyPropsChanged();
        return;
      }
      this.isLoading = true;
      this.setTimer();
      this.TipsText = "Loading...";
      this.notifyPropsChanged();

      let APP_STORE_APP_LIST_URL = "https://testtms2.topwisesz.com/appmarket/app/home";
      let head = {
        params:
          "ProductModel:" + this.deviceModel + "\r\npagesize:10\r\nSnNumber:" + this.deviceSN + "\r\nAccept: */*\r\n",
        methods: 1 // 0 get ,1 get
      };
      console.log("444444444", JSON.stringify(head));
      let that = this;
      this.httpCB = function (ret) {
        console.log("httpCB 0000 =====>", JSON.stringify(ret));
        if (!ret || ret.code !== 0) {
          console.log("httpCB 1111 =====>", ret ? JSON.stringify(ret) : "null");
        }
        let data = ret.data.response_buf;
        that.parseData(data);
      };
      console.log("5555555555");
      let data = {
          account:"account1",
          pwd:"1234356"
      }
      let body  = JSON.stringify(data)+"\r\n";
      // head -- url -- body -- cert -- port  -- timeout -- cb
      let httpret = Tos.HttpclientCommon(head, APP_STORE_APP_LIST_URL, body, "", "", that.timeout, 1, that.httpCB);
      console.log("666666666", JSON.stringify(httpret));
    },

    initHTTPCB: function () {
      console.log("HttpclientCbEvent start 0000000===========");
      Tos.HttpclientCbEvent();
    },

    handleError: function () {
      this.downloadBuffer = [];
      this.saveBuffer = [];
      this.isLoading = false;
      this.TipsText = "Nothing here";
      this.notifyPropsChanged();
    },

    parseData: function (data) {
      let u8arr = new Uint8Array(data);
      let decodeStr = String.fromCharCode.apply(null, u8arr);
      console.log("parseData =========》 111:", decodeStr, "\n u8arr:", u8arr);
      if (decodeStr) {
        let data = JSON.parse(decodeStr);
        if (data) {
          this.setAppList(data);
        } else {
          this.isLoading = false;
          this.TipsText = "Nothing here";
          this.notifyPropsChanged();
        }
      } else {
        this.isLoading = false;
        this.TipsText = "Nothing here";
        this.notifyPropsChanged();
      }
    },

    setTimer: function () {
      let time = 0;
      let that = this;
      timerAdd(function () {
        console.log("applist timer =========>", time);
        if (!that.isLoading) return RET_REMOVE;
        time++;
        if (time >= that.timeout) {
          that.isLoading = false;
          that.TipsText = "Network timeout";
          that.notifyPropsChanged();
          return RET_REMOVE;
        }
        return RET_REPEAT;
      }, 1000);
    },

    setAppList: function (data) {
      this.isLoading = false;
      if (data.result === "20000") {
        let installedApps = [];
        let res = GLOBAL_GET_APPS();
        if (res) {
          Object.keys(res).map(function (v) {
            let item = res[v];
            item["is_install"] = 1;
            installedApps.push(item);
          });
        }
        console.log("installedApps 0000=========>", JSON.stringify(installedApps));
        let list = [];

        for (let i = 0; i < data.data.length; i++) {
          let same = false;
          for (let j = 0; j < installedApps.length; j++) {
            if (data.data[i].packageName === installedApps[j].packageName) {
              console.log(
                "packageName same 0000=========>",
                installedApps[j].packageName,
                installedApps[j].versionCode,
                data.data[i].versionCode,
                installedApps[j].versionCode < data.data[i].versionCode
              );
              if (parseInt(installedApps[j].versionCode) < parseInt(data.data[i].versionCode)) {
                installedApps[j]["new_version"] = data.data[i].versionCode;
                installedApps[j]["new_version_name"] = data.data[i].versionName;
                installedApps[j]["new_fileSize"] = data.data[i].fileSize;
                installedApps[j]["new_md5"] = data.data[i].md5;
                installedApps[j]["new_downloadAddress"] = data.data[i].downloadAddress;
                installedApps[j]["new_appId"] = data.data[i].appId;
              }
              same = true;
              break;
            }
          }
          if (!same) {
            data.data[i]["is_install"] = 0;
            list.push(data.data[i]);
          }
        }
        this.appList = installedApps.concat(list);
        this.appList.map(function (v) {
          if (v.appName.length > 10) {
            v.appName = v.appName.substring(0, 10) + "...";
          }
        });
        Tos.APPSTORE_LIST_CACHE = this.appList;
        this.isEmpty = this.appList.length <= 0;
        console.log("data 0000========>", JSON.stringify(this.appList));
        this.TipsText = this.isEmpty ? "Nothing here" : "";
        this.notifyPropsChanged();
      } else {
        // todo  已安装应用但是网络获取失败需要展示已安装的应用
        // let installedApps = Object.keys(Tos.GLOBAL_INSTALLED_APPS).map(function (v) {
        //   let item = Tos.GLOBAL_INSTALLED_APPS[v];
        //   item["is_install"] = 1;
        //   return item;
        // });
        // this.appList = installedApps;
        this.TipsText = "This device was not found in TMS";
      }
      this.notifyPropsChanged();
    },

    onKeyDown(args) {
      console.log("onKeyDown =======>", args);
      switch (args) {
        case "cancel":
          console.log("onKeyDown 000000=======>", args, this.isLoading);
          if (this.isLoading) {
            let ret = Tos.HttpclientCancel();
            console.log("onKeyDown aaaaaa", JSON.stringify(ret));
          }
          this.isLoading = false;
          console.log("onKeyDown 1111111111=======>", args, this.isLoading);
          navigateReplace({
            target: "home"
          });
          break;
        case "return":
          break;
        default:
          break;
      }
    }
  },

  onMount: function () {
    let ret = Tos.SysGetTermInfo();
    if (ret.code >= 0) {
      let d = ret.data[0];
      // 0: M3 1:M3P
      this.deviceModel = d == 0 ? "M3" : "M3P";
    }
    let ret1 = Tos.SysGetTusn();
    if (ret1.code >= 0) {
      this.deviceSN = ret1.data;
    }
    this.TipsText = "Loading...";
    this.notifyPropsChanged();
    console.log("APPSTORE_LIST_CACHE 000 ======", Tos.APPSTORE_LIST_CACHE);
    if (!Tos.APPSTORE_LIST_CACHE || !Tos.APPSTORE_LIST_CACHE.length) {
      this.getAppList();
    }
  },

  onWillMount: function () {
    if (Tos.APPSTORE_LIST_CACHE && Tos.APPSTORE_LIST_CACHE.length) {
      this.isLoading = false;
      this.appList = Tos.APPSTORE_LIST_CACHE;
      this.isEmpty = this.appList.length <= 0;
      this.TipsText = this.isEmpty ? "Nothing here" : "";
      this.notifyItemsChanged(this.appList);
      this.notifyPropsChanged();
    }
  }
});
