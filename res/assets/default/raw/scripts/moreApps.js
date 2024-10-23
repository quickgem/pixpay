var GLOBAL_TRANSACTION = require("mod_global_trans").GLOBAL_TRANSACTION;
var GLOBAL_PREENTRY = require("mod_global_trans").GLOBAL_PREENTRY;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GLOBAL_CHOOSE_NETWORK = require("mod_global_network").GLOBAL_CHOOSE_NETWORK;

ViewModel("moreApps", {
    data: {
        currentIndex: 0,
        isShowScrollbar: false,
        moreList: [],
        theme:""
    },

    methods: {
        onKeyDown: function(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    navigateTo({
                        target: "pay",
                        close_current: true,
                    });
                    break;
                case "return":
                    //
                    break;
                default:
                    break;
            }
        },


        navigateTo: function (args) {
            GLOBAL_JUMP("");
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
                GLOBAL_JUMP("");
            }


        },


    },

    onWillMount: function (req) {
        console.log("onWillMount  begin  ============>");
        this.moreList = new GLOBAL_PREENTRY().getMoreList();

        this.notifyPropsChanged();
    },

    onMount: function (data) {
        let that = this;
        that.isShowScrollbar = that.moreList.length  > 6;


        if(Tos.GLOBAL_CONFIG != null) that.theme = Tos.GLOBAL_CONFIG.theme

        that.notifyPropsChanged();
    },

    onWillUnmount: function () {
        // Tos.SysLed(0b1111, 0, 0);
        this.isShowExit = false;
        this.isShowToast = false;
    }
});
