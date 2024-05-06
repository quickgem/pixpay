
function GLOBAL_TRANSACTION() {
  this.trans = {
        id:-1,
        voucherNo : 1,
        batchNo : 0,
        origBatchNo:0,
        origVoucherNo:0,
        amount : 0,
        tipAmt:0,
        balance:0,
        transType:0,
        origTransType:"",
        transName:"",
        origTransName:"",
        transState:0,
        track1:"",
        track2:"",
        track3:"",
        random:"",
        pan:"",
        cardHolderName:"",
        expDate:"",
        serviceCode :"",
        cardSerialNo:"",
        enterMode:3,
        response:"",
        sendIccData:"",
        receiveIccData:"",

        isOnlineTrans:true,
        refNo:"",
        origRefNo:"",
        authCode:"",
        origAuthCode:0,
        tc:"",
        arqc:"",
        arpc:"",
        tvr:0,
        aid:"",
        emvAppLabel:"",
        emvAppName:"",
        tsi:"",
        atc:"",
        kernelType:0,
        eSignature:"",
        transTime: {},
        origTransTime:{}
  };
  this.flow={
          navIndex: 0,
          entry:[],
          hasPin:false,
          pin:"",
  };

  this.transParam={};
  this.init = function (){
    this.trans.transTime =this.getTime();
    if(!Tos.GLOBAL_TRANSACTION) {
      Tos.GLOBAL_TRANSACTION = {};
    }
    Tos.GLOBAL_TRANSACTION.trans = this.trans;
    console.log("init trans ===================> ");

    Tos.GLOBAL_TRANSACTION.flow = this.flow;
    Tos.GLOBAL_TRANSACTION.transParam = this.transParam;


    console.log("init flow===================> ");

  };


  this.getTime =function (){
    let ret = Tos.SysGetTime();
    if (ret.code === 0 && ret.data) {
      let year = ret.data.substring(0, 4);
      let mo = ret.data.substring(4, 6);
      let date = ret.data.substring(6, 8);
      let h = ret.data.substring(8, 10);
      let m = ret.data.substring(10, 12);
      let s = ret.data.substring(12, 14);
      return {
        year: year,
        month: mo,
        date: date,
        h: h,
        m: m,
        s: s
      };
    }
return  {};
  };

}


function GLOBAL_PREENTRY(){
    let TRANS_TYPE = Tos.CONSTANT.TRANS_TYPE;
    this.getEntryList =function (){
        this.entryList = [
            {
                appName: "Card", icon: "paywithcard",
                transParam:{appName:"Pay with Card",transType: TRANS_TYPE.SALE, msgType:"0200",procCode:"000000",serviceCode:"00",needSave:true,nReversal:true},
                // entry: ["inputAmt", "searchCard",[["inputPinblock","online","eSign","result"],["emvProcess",'eSign', "result"]]], // checking if this is the entry flow
                entry: ["inputAmt", "searchCard",[["inputPinblock","online","eSign","result"],["inputPinblock","online","eSign","result"],["inputPinblock","online","eSign","result"]]], // checking if this is the entry flow
            },
            // FILE INDEX 1
            {
                appName: "Transfer",
                icon: "maketransfer",
                transParam:{appName:"Make Transfer",transType: TRANS_TYPE.SALE_VOID, msgType:"0200",procCode:"000000",serviceCode:"00",needSave:true,nReversal:true},
                entry: ["inputAmt", "makeTransfer","transferLoading","transferSuccess"]
            },

            {
                appName: "Balance",
                icon: "balance",
                transParam:{appName:"Balance",transType: TRANS_TYPE.REFUND, msgType:"0200",procCode:"000000",serviceCode:"00"},
                entry: ["balance"]
            },
            {
                appName: "Transactions", icon: "transactionhistory",
                transParam:{appName:"Transactions"},
                entry: ["transactionPage"],
            },

            {
                appName: "Profile",
                icon: "profile",
                transParam:{appName:"Profile"},
                entry: ["profile"]
            },
            {
                appName: "More",
                icon: "more_background",
                transParam:{appName:"More"},
                entry: ["pay"]
            }
        ];
        let list = this.entryList.map(function (v) {
            return {
                appName: v.appName,
                icon: v.icon,
                entry: JSON.stringify(v.entry),
                transParam: JSON.stringify(v.transParam)
            }
        })
       return list;
    };

    this.getAuthList =function (){
        let TRANS_TYPE = Tos.CONSTANT.TRANS_TYPE;
        this.authList = [
            {
                appName: "Authorization", icon: "pre_auth",
                transParam:{appName:"Authorization",transType:TRANS_TYPE.PRE_AUTH, msgType:"0100",procCode:"030000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]],
            },
            {
                appName: "Auth Void",
                icon: "auth_void",
                transParam:{appName:"Auth Void",transType:TRANS_TYPE.PRE_AUTH_VOID, msgType:"0100",procCode:"200000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputPwd","inputTransDate","inputAuthCode","inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]]
            },
            {
                appName: "Auth Com",
                icon: "auth_com",
                transParam:{appName:"Auth Com",transType:TRANS_TYPE.AUTH_CMP, msgType:"0200",procCode:"000000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputTransDate","inputAuthCode","inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]]
            }
        ];
        let list = this.authList.map(function (v) {
            return {
                appName: v.appName,
                icon: v.icon,
                entry: JSON.stringify(v.entry),
                transParam: JSON.stringify(v.transParam)
            }
        })
        return list;
    };

    this.getMoreList = function (){
        let TRANS_TYPE = Tos.CONSTANT.TRANS_TYPE;
        this.billsList = [
            {
                appName: "Authorization", icon: "pre_auth",
                transParam:{appName:"Authorization",transType:TRANS_TYPE.PRE_AUTH, msgType:"0100",procCode:"030000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]],
            },
            {
                appName: "Auth Void",
                icon: "auth_void",
                transParam:{appName:"Auth Void",transType:TRANS_TYPE.PRE_AUTH_VOID, msgType:"0100",procCode:"200000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputPwd","inputTransDate","inputAuthCode","inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]]
            },
            {
                appName: "Auth Com",
                icon: "auth_com",
                transParam:{appName:"Auth Com",transType:TRANS_TYPE.AUTH_CMP, msgType:"0200",procCode:"000000",serviceCode:"06",needSave:true,nReversal:true},
                entry: ["inputTransDate","inputAuthCode","inputAmt","searchCard",[["inputPinblock","online","eSign","result"],["emvProcess","eSign","result"]]]
            }
        ]
    };

}
function  GLOBAL_JUMP (index, args){
    console.log("GLOBAL_JUMP index=================>", index);
    // console.log("User args ======>", args)
    if(index !== undefined &&index !== null && index !== ""){
        Tos.GLOBAL_TRANSACTION.flow.entry = Tos.GLOBAL_TRANSACTION.flow.entry[Tos.GLOBAL_TRANSACTION.flow.navIndex][index];
        Tos.GLOBAL_TRANSACTION.flow.navIndex = 0;
    }
    console.log("GLOBAL_JUMP =================>", JSON.stringify(Tos.GLOBAL_TRANSACTION.flow));
    console.log("GLOBAL_JUMP 0000=================>", Tos.GLOBAL_TRANSACTION.flow.entry[Tos.GLOBAL_TRANSACTION.flow.navIndex]);
    navigateReplace({
        target: Tos.GLOBAL_TRANSACTION.flow.entry[Tos.GLOBAL_TRANSACTION.flow.navIndex++],
        close_current: true,
        data:args
    });
}




exports.GLOBAL_TRANSACTION = GLOBAL_TRANSACTION;
exports.GLOBAL_PREENTRY = GLOBAL_PREENTRY;
exports.GLOBAL_JUMP = GLOBAL_JUMP;
