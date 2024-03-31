
var GLOBAL_FILE_SAVE = require("mod_global_app_manage").GLOBAL_FILE_SAVE;
var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;
var GLOBAL_ARRAYBUFFER_FILE_SAVE = require("mod_global_app_manage").GLOBAL_ARRAYBUFFER_FILE_SAVE;

ViewModel("eSign", {
    data: {
        user:null
    },
    methods: {},
    getSign() {
        console.log("===getSign start111",);
        let trans = Tos.GLOBAL_TRANSACTION.trans;
        console.log("===getSign middle111");
        let transNo = trans.voucherNo;
        console.log("===getSign transNo ", transNo);
        let info = {title:'Sign',feature_code:'   ',timeout_ms:60000, is_enable_exist:1, line_value:2};
        console.log("===getSign middle213 ");
        let ret = Tos.SysGotoEsign(info);


        console.log("Tos.SysGotoEsign_res begin write file");
        if (ret < 0) {
            console.log("===getSign fail")
        } else {
          //  let res1 = GLOBAL_FILE_SAVE(array, transNo + "ujd.txt");
            let fileName = Tos.CONSTANT.filePath.esignFile+transNo;
             GLOBAL_ARRAYBUFFER_FILE_SAVE(ret.data.sign_data, fileName);
            Tos.GLOBAL_TRANSACTION.trans.eSignature = transNo+"";
            console.log(" eSignature ==============> ",fileName);
        }

    },
    onWillMount: function (req) {
        console.log("onWillMount this.getSign() ==========>");
        this.getSign();

        if(req){
            this.user = req.data
        }
        console.log('esign user ====>', JSON.stringify(req))
        navigateReplace({
            target: "result",
            close_current: true,
            type: "success",
            data:this.user
        });
        console.log("emvCBs this.getSign() ==========>");
    },
    onMount: function () {

    },
    onWillUnmount: function () {
    }
});