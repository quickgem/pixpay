var GLOBAL_TRANSACTION = require("mod_global_trans").GLOBAL_TRANSACTION;
var GLOBAL_PREENTRY = require("mod_global_trans").GLOBAL_PREENTRY;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GLOBAL_CHOOSE_NETWORK = require("mod_global_network").GLOBAL_CHOOSE_NETWORK;
var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;
var injectKeys = require("mod_global_config").injectKeys;
var GLOBAL_CONSTANT = require("mod_global_constant").GLOBAL_CONSTANT;


ViewModel("getStarted", {
    data:{
        appList:[],
    },


    methods: {
        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        toOnboarding:function(){
            navigateReplace({
                close_current: true,
                target: "payment" 
            })
        },

        appClick: function (item) {
            console.log("appClick ===================>", JSON.stringify(item),JSON.stringify(item.entry));
            console.log("appClick ===================>", JSON.stringify(item.transParam));
      
            if (item  && item.entry) {
              new GLOBAL_TRANSACTION().init();
              Tos.GLOBAL_TRANSACTION.flow.entry = item.entry && JSON.parse(item.entry) || [];
              Tos.GLOBAL_TRANSACTION.transParam = item.transParam && JSON.parse(item.transParam) || {};
              Tos.GLOBAL_TRANSACTION.trans.transName = Tos.GLOBAL_TRANSACTION.transParam.appName;
              Tos.GLOBAL_TRANSACTION.trans.transType = Tos.GLOBAL_TRANSACTION.transParam.transType;
              Tos.GLOBAL_TRANSACTION.trans.voucherNo = Tos.GLOBAL_CONFIG.voucherNo;
              console.log("Tos.GLOBAL_TRANSACTION.trans.voucherNo ==============> ", Tos.GLOBAL_TRANSACTION.trans.voucherNo);
      
              if (!GLOBAL_CHOOSE_NETWORK()) {
                this.showToast("Network Invalid !");
                return;
              }
              GLOBAL_JUMP("", "");
          }
      
      
          },


        exitApp:function () {
            navigateReplace({
                close_current: true,
                target: "home"
            });

        },

        initCAPKdata: function () {
            let ret = Tos.TemvCheckEmvParam(OPT_CHECK_CAPK);
            console.log("Tos.TemvCheckEmvParam(OPT_CHECK_CAPK) ==============> ", ret.code);
            if (ret.code === 1) {
              return;
            }
            const capkList = GLOBAL_PROPS.capkList;
            const len = capkList.length;
            Tos.TemvUpdateEmvParam(OPT_DEL_ALL_CAPK);
            for (let i = 0; i < len; i++) {
              console.log("\ncapks[i].length = ", capkList[i].length);
              ret = Tos.TemvUpdateEmvParam(OPT_ADD_ONE_CAPK, capkList[i], capkList[i].length);
              console.log("\nTos.TemvUpdateEmvParam CAPK==============> ", ret.code);
            }
      
            //just for flag
            Tos.GLOBAL_INIT_CAPK_DATA = true;
            console.log("\ninitCAPKdata ==============> end");
          },
      
        initAIDdata: function () {
        let ret = Tos.TemvCheckEmvParam(OPT_CHECK_AID);
        console.log("Tos.TemvCheckEmvParam(OPT_CHECK_AID) ==============> ", ret.code);
        if (ret.code === 1) {
            return;
        }
        const aidList = GLOBAL_PROPS.aidList;
        const len = aidList.length;
        Tos.TemvUpdateEmvParam(OPT_DEL_ALL_AID);
        for (let i = 0; i < len; i++) {
            console.log("\naidList[i].length = ", aidList[i].length);
            ret = Tos.TemvUpdateEmvParam(OPT_ADD_ONE_AID, aidList[i], aidList[i].length);
            console.log("\nTos.TemvUpdateEmvParam AID==============> ", ret.code);
        }
    
        //just for flag
        Tos.GLOBAL_INIT_AID_DATA = true;
        console.log("\ninitAIDdata ==============> end");
        },
    
        initWIFI() {
        if (!Tos.global_wifi.init) return;
        let res = READ_FILE();
        console.log("READ_FILE_res", JSON.stringify(res));
        if (res.wifiOpen) OPEN_WIFI();
        if (res.ssid) CONNECT_WIFI(res.ssid, res.password, res.sec_mode);
        },
    
        createDir:function () {
        console.log("createDir  ============>");
        let filePath =Tos.CONSTANT.filePath;
    
        let rootDir = filePath.payRoot;
        console.log("rootDir  ============>",rootDir);
    
        let exist = Tos.FileAccess(rootDir);
        console.log("rootDir access ============>",JSON.stringify(exist));
    
        let ret ;
        if(exist.code != 0){
            ret =Tos.FileMkdir(rootDir);
            console.log("FileMkdir rootDir  ============>",JSON.stringify(ret));
        }
        let recordDir = filePath.recorDir;
        console.log("recordDir  ============>",recordDir);
    
            exist = Tos.FileAccess(recordDir);
            console.log("recordDir access ============>",JSON.stringify(exist));
    
        if(exist.code != 0){
            ret = Tos.FileMkdir(recordDir);
            console.log("FileMkdir recordDir  ============>",JSON.stringify(ret));
        }
    
        let eSignDir = filePath.eSignDir;
        console.log("eSignDir  ============>",eSignDir);
        exist = Tos.FileAccess(eSignDir);
        console.log("eSignDir access ============>",JSON.stringify(exist));
    
        if(exist.code != 0){
            ret = Tos.FileMkdir(eSignDir);
            console.log("FileMkdir eSignDir  ============>",JSON.stringify(ret));
        }
        },

    },

    onKeyDown(args) {
        console.log("key down----->>>>:", args);
        var key = args;
        switch (key) {
            case "cancel":
                this.exitApp();
                break;
            case "backspace":
                break;
            case "return":
                break;
            default:
                break;
        }
    },


    onWillMount:function (){
        new GLOBAL_CONSTANT().init();
        this.appList = new GLOBAL_PREENTRY().getEntryList();
        if(Tos.GLOBAL_CONFIG == null){
            console.log("Tos.PedWriteKey begin  ============>");
            injectKeys()
            console.log("Tos.PedWriteKey end  ============>");
            this.initCAPKdata();
            this.initAIDdata();
            this.createDir();
            console.log("GLOBAL_CONFIG  init begin  after createDir ==========>");
            new GLOBAL_CONFIG().init();
          }

        if (Tos.GLOBAL_CONFIG != null && Tos.GLOBAL_CONFIG.userInfo != null) this.user = Tos.GLOBAL_CONFIG.userInfo;

        if (Tos.GLOBAL_CONFIG.userInfo.responseCode !== "00"){
            navigateTo({
                target: "login",
                close_current: true,
            });
        }

        

    },

    onMount:function (){

    },

    onWillUnmount:function (){

    }
})