var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;

ViewModel ("subSettings", {
    data : {
        isSubSettings: false,
        timeOutShow: "120s",
        timeOut:"120",
        isEsign: false,
        isExit:false,
        supportEsign: true,
        pageLevel:1, //页面层级
        subSettingsList_2:[], //二级页面列表
        subSettingsList: [  //一级页面列表
            {
                text: "Terminal Param",
                //true:number,false: soft keyboard(with letters)
                type: true,
                page_index : "1"
            },
            {
                text: "Trans Param",
                type: true,
                page_index : "1"
            },
            {
                text: "Communication Param",
                type: true,
                page_index : "1"
            }
        ],
        master_list: [
            {
                text: "Terminal Param",
                type: true,
                page_index : "1"
            },
            {
                text: "Trans Param",
                type: true,
                page_index : "1"
            },
            {
                text: "Communication Param",
                type: true,
                page_index : "1"
            }
        ],
        Terminal_Param : [
            {
                text: "Merchant ID",
                type: false,
                page_index : "1"
            },
            {
                text: "Terminal ID",
                type: true,
                page_index : "1"
            },
            {
                text: "Merchant Name",
                type: false,
                page_index : "1"
            },
            {
                text: "Time Out",
                type: true,
                page_index : "1"
            },
            {
                text: "printCount",
                type: true,
                page_index : "1"
            },
            {
                text: "printGray",
                type: true,
                page_index : "1"
            },
            {
                text: "ESign Support",
                type: true,
                page_index : "1"
            }],
        Trans_Param : [
            {
                text: "Voucher NO",
                type: true,
                page_index : "2"
            },
            {
                text: "Batch No",
                type: true,
                page_index : "2"
            },
            {
                text: "Max Trans Num",
                type: true,
                page_index : "2"
            },
            {
                text: "Max Resend Times",
                type: true,
                page_index : "2"
            },
            {
                text: "Max Refund Amount",
                type: true,
                page_index : "2"
            },
            {
                text: "Country Code",
                type: true,
                page_index : "2"
            },
        ],
        Communication_Param : [
            {
                text: "IP",
                type: false ,
                page_index : "3"
            },
            {
                text: "PORT",
                type: true,
                page_index : "3"
            },
            {
                text: "TPDU",
                type: true,
                page_index : "3"
            },
            {
                text: "HEAD",
                type: true,
                page_index : "3"
            }
        ]
    },
    methods : {
        backSettings: function () {
            if (!this.isSubSettings) {
                this.subSettingsList = this.subSettings_itemList;
                this.notifyPropsChanged();
                this.notifyItemsChanged(this.subSettingsList);
            }
            if(this.pageLevel==1){
            navigateTo({
                target: "pay",
                close_current: true,
            });
            }else{
                //一级页面列表
               this.subSettingsList= this.master_list;
                   this.notifyItemsChanged(this.subSettingsList);
                this.notifyPropsChanged();
                this.pageLevel = 1
            }
        },
        navigateTo: function (args) {
            if (this.pageLevel == 2) {
                console.log("args.type " , JSON.stringify(args))
                if (args.text == "ESign Support") return;
                navigateReplace({
                    target: "inputConfig",
                    title : args.text,
                    type : args.type,
                    page_index : args.page_index,
                    close_current: true,
                    openWindow: false,
                    // close_current : true,
                    from: "subSettings"
                });
            }
            this.pageLevel = 2;
            if (args.text == 'Terminal Param') {
                this.subSettingsList = this.Terminal_Param;
                console.log('this.subSettingsList', this.subSettingsList)
                // this.subSettingsList = JSON.parse(JSON.stringify((this.Terminal_Param))); //深拷贝
                this.isEsign = true;
                this.notifyItemsChanged(this.subSettingsList);
                this.notifyPropsChanged();
            } else if (args.text == 'Trans Param') {
                this.subSettingsList = this.Trans_Param;
                console.log('this.subSettingsList', this.subSettingsList)
                this.notifyItemsChanged(this.subSettingsList);
                this.notifyPropsChanged();
            } else if (args.text == 'Communication Param') {
                this.subSettingsList = this.Communication_Param;
                console.log('this.subSettingsList', this.subSettingsList)
                this.notifyItemsChanged(this.subSettingsList);
                this.notifyPropsChanged();
            }
            console.log("this.subSettings_itemList ", JSON.stringify(this.subSettings_itemList));
            console.log("this.subSettingsList start", JSON.stringify(this.subSettingsList));
            console.log("this.subSettingsList end", JSON.stringify(this.subSettingsList));
            this.isSubSettings = false;
            this.notifyPropsChanged();
            this.notifyItemsChanged(this.subSettingsList);
        }
    },



    checkPageList : function (page_index) {
        console.log(" this.checkPageList====>", "start", page_index);
      if (page_index == "0") {
          console.log(" this.checkPageList====>", "0");
          this.subSettingsList = this.master_list;
          this.pageLevel = 1;
      } else if (page_index == "1") {
          console.log(" this.checkPageList====>", "1");
          this.subSettingsList = this.Terminal_Param;
          this.pageLevel = 2;
      }else if (page_index == "2") {
          console.log(" this.checkPageList====>", "2");
          this.subSettingsList = this.Trans_Param;
          this.pageLevel = 2;
      }else if (page_index == "3") {
          console.log(" this.checkPageList====>", "3");
          this.subSettingsList = this.Communication_Param;
          this.pageLevel = 2;
      }
        console.log(" this.checkPageList====>", "end");
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
        console.log("inputConfig jumpError type" + type);
        navigateReplace({
            target: "result",
            type: type || "cancel",
            close_current: true
        });
    },

    closeEsign : function () {
        this.supportEsign = false;
        Tos.GLOBAL_CONFIG.eSignSupport = false;
        this.notifyPropsChanged();
    },

    openEsign : function () {
        this.supportEsign = true;
        Tos.GLOBAL_CONFIG.eSignSupport = true;
        this.notifyPropsChanged();
    },

    onWillMount: function (req){
        console.log("SubSettings onWillMount", JSON.stringify(req));
        console.log("GLOBAL_CONFIG.timeout: ", Tos.GLOBAL_CONFIG.timeout);
        console.log("GLOBAL_CONFIG.timeout * 2: ", Tos.GLOBAL_CONFIG.timeout * 2 + "");
        this.timeout = Tos.GLOBAL_CONFIG.timeout * 2 + "";
        this.timeOutShow = Tos.GLOBAL_CONFIG.timeout * 2 + "s";
        this.checkPageList(req.page_index);
        this.supportEsign = Tos.GLOBAL_CONFIG.eSignSupport;
        console.log("GLOBAL_CONFIG.eSignSupport: ", Tos.GLOBAL_CONFIG.eSignSupport, this.eSignSupport);
        this.notifyPropsChanged();
        this.notifyItemsChanged(this.subSettingsList);
        console.log(" this.subSettingsList====>", this.subSettingsList);
        this.isSubSettings = true;
    },

    onMount: function () {
        this.setScreenTimer();
    },
    onUnmount : function () {
        this.isExit = true;
    }
})