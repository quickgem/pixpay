function GLOBAL_CONSTANT() {
    this.TRANS_RECORD_LEN = 1800;
    this.TRANS_TYPE ={
        SALE:0,
        SALE_VOID:1,
        REFUND:2,
        PRE_AUTH:3,
        PRE_AUTH_VOID:4,
        AUTH_CMP:5,
        AUTH_CMP_VOID:6,
        BALANCE:7,
        QR_SALE:8,
        QR_LAST_QUERY:9,
        QR_SALE_VOID:10,
    };

    this.ENTRY_MODE ={
     MANUAL:1,
     MAG:2,
     INSERT:3,
     RF:6,
     QR:9
  };

    this.filePath ={
        payRoot:"payRoot",
        recorDir:"payRoot"+"/"+"recorDir",
        eSignDir:"payRoot"+"/"+"eSignDir",

        tranindex: "payRoot"+"/"+"recorDir"+"/"+"tranindx",
        record: "payRoot"+"/"+"recorDir"+"/"+"rd",
        reverse: "payRoot"+"/"+"reverse",
        config:  "payRoot"+"/"+"Payconf",
        esignFile:  "payRoot"+"/"+"eSignDir"+"/"+"sg",

    };

    this.ERROR={

        E00:"APPROVED",
        E01:"DECLINE, CALL ISSUER",
        E02:"DECLINE, CALL ISSUER",
        E03:"INVALID MID, CALL HELP",
        E04:"PICKUP CARD",
        E05:"DO NOT HONOUR",
        E06:"CALL HELP, 06",
        E12:"INVALID TRANSACTION",
        E13:"INVALID AMOUNT",
        E14:"INVALID CARD",
        E15:"BANK NOT SUPPORTED",
        E25:"TRXN NOT FOUND",
        E30:"FORMAT ERROR",
        E33:"EXPIRED CARD, PICKUP",
        E34:"SUSPECTED FRAUD, PICKUP",
        E36:"RESTRICTED CARD, PICKUP",
        E38:"PIN TRIES EXCEEDED",
        E39:"NO CREDIT ACCOUNT",
        E41:"LOST CARD, PICKUP",
        E42:"NO ACCOUNT",
        E43:"STOLEN CARD, PICKUP",
        E51:"INSUFFICIENT FUNDS",
        E52:"NO CHECKING ACCOUNT",
        E53:"NO SAVINGS ACCOUNT",
        E54:"EXPIRED CARD",
        E55:"PIN INCORRECT PIN",
        E57:"TRANSACTION NOT PERMITTED TO CARDHOLDER",
        E58:"TRANSACTION NOT PERMITTED ON TERMINAL",
        E59:"SUSPECTED FRAUD",
        E61:"EXCEEDS LIMIT",
        E62:"RESTRICTED CARD",
        E75:"PIN TRIES EXCEEDED",
        E81:"CRYPTO ERROR",
        E89:"INVALID MID or TID",
        E91:"ISSUER / SWITCH INOPERATIVE",
        E92:"ROUTING ERROR",
        E95:"RECONCILE ERROR",
        E96:"SYSTEM MALFUNCTION",
        E98:"EXCEEDS CASH LIMIT",
        EA0:"MAC ERROR",

        CANCEL:"User Cancel",
        TIMEOUT:"TimeOut",
        EMVERR:"Emv Error",


    };
  this.init = function ()
  {
    if(!Tos.CONSTANT) {
      Tos.CONSTANT = {};
    }
    Tos.CONSTANT = this;
  };

}
exports.GLOBAL_CONSTANT = GLOBAL_CONSTANT;







