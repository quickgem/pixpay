
var sprintf = require("mod_global_funcs").sprintf;
var SHOW_MASK_CARD = require("mod_global_funcs").SHOW_MASK_CARD;
var GET_SHOW_AMOUNT = require("mod_global_funcs").GET_SHOW_AMOUNT;
var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;
var GLOBAL_ARRAYBUFFER_GET_FILE = require("mod_global_app_manage").GLOBAL_ARRAYBUFFER_GET_FILE;

function PRINT_TICKET(trans,cb,rePrint,currIndex,user, response) {
    let  status  = Tos.PrnStatus();
    if(status.code===ERR_PRN_PAPER_LACK){
        Tos.SysBeep();
        Tos.PrnClose();
        cb.noPaper(currIndex);
        return;
    }else if(status.code!==0){
        Tos.SysBeep();
        Tos.PrnClose();
        cb.printError(currIndex,getPrintError(result.code));
        return;
    }


    console.log("PRINT_TICKET  filled data ======>>>>>");
    let config =Tos.GLOBAL_CONFIG; // todo reference the user here later

    let  fontSize ={
        SMALL:{ w: 16, h: 16 },
        MIDDLE:{ w: 24, h: 24 },
        LARGE:{ w: 32, h: 32 },
    }
    let TRANS_TYPE = Tos.CONSTANT.TRANS_TYPE;

    let fontSpace ={w:1,h:5};

    let ret = Tos.PrnInit(3000);
    if (ret.code !== 0) {
        console.log("PrnInit fail ======>>>>>");
        return;
    }
    setSpace(fontSpace);
    //console.log("setSpace ======>>>>>");


    addTextSpace( "POS RECEIPT",ALIGN_CENTER,fontSize.LARGE);

    //console.log("set data  0000 ======>>>>>");


    addText("MERCHANT NAME:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace(user.customerOrganisationName.toLowerCase() ,ALIGN_RIGHT,fontSize.SMALL);
    //console.log("set data  1111 ======>>>>>");


    addText("TERMINAL NO.:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace( user.customerOrganisationTerminalId ,ALIGN_RIGHT,fontSize.SMALL);


    addText("OPERATOR:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace("O1" ,ALIGN_RIGHT,fontSize.SMALL);


    //console.log("set data  22222 ======>>>>>");


    setBold(true);

    //console.log("set data  44444444444 ======>>>>>");

    addText("Credit Account Number",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace(response.creditAccount,ALIGN_RIGHT,fontSize.SMALL);



    addText("Credit Account Name:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace(response.creditAccountName ,ALIGN_RIGHT,fontSize.MIDDLE);
    //
    //
    //
    addText("Debit Account Name:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace(response.debitAccountName ,ALIGN_RIGHT,fontSize.SMALL);
    // //console.log("set data  55555 ======>>>>>");
    //
    //
    // addText("DATE/TIME:",ALIGN_LEFT,fontSize.MIDDLE);
    // let dateAndTime  = trans.transTime.year+"/"+trans.transTime.month+"/"+trans.transTime.date+" "+
    //     trans.transTime.h+":"+trans.transTime.m+":"+trans.transTime.s;
    // addTextSpace(dateAndTime ,ALIGN_RIGHT,fontSize.MIDDLE);


    //console.log("set data  6666666666 ======>>>>>");

    setBold(true);
    if(trans.transType ===TRANS_TYPE.BALANCE ){
        trans.amount = 10000;
    }
    addTextSpace(response.amount,ALIGN_CENTER,fontSize.MIDDLE);

    setBold(true);
    addTextSpace(response.responseMessage,ALIGN_CENTER,fontSize.SMALL);

    setBold(true);
    addText("Agent:",ALIGN_LEFT,fontSize.SMALL);
    addTextSpace(user.customerFirstName,ALIGN_RIGHT,fontSize.SMALL);


    //console.log("set data  77777777777 ======>>>>>");

    addTextSpace("--------------------------------------------------",ALIGN_LEFT,fontSize.MIDDLE);
    // if(trans.enterMode === Tos.CONSTANT.ENTRY_MODE.INSERT ||
    //     trans.enterMode === Tos.CONSTANT.ENTRY_MODE.RF ){
    //     setBold(true);
    //     if(trans.aid){
    //         addText("AID:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.aid ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     //console.log("set data  8888888888888888 ======>>>>>");
    //     if(trans.tc){
    //         addText("TC:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.tc ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     if(trans.tvr){
    //         addText("TVR:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.tvr ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     if(trans.tsi){
    //         addText("TSI:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.tsi ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     if(trans.emvAppName){
    //         addText("emvAppName:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.emvAppName ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     if(trans.cardHolderName){
    //         addText("Card Holder:",ALIGN_LEFT,fontSize.SMALL);
    //         addTextSpace(trans.cardHolderName ,ALIGN_DEFAULT,fontSize.SMALL);
    //     }
    //     setBold(false);
    //     addTextSpace("---------------------------------------",ALIGN_LEFT,fontSize.MIDDLE);
    // }
    // if(trans.eSignature){
    //     //console.log("trans.eSignature ======>>>>>",trans.eSignature);
    //     let buf = GLOBAL_ARRAYBUFFER_GET_FILE(Tos.CONSTANT.filePath.esignFile+trans.eSignature);
    //     Tos.PrnBuf(buf, 320, 240, 1);
    // }else{
    //     addLine(2);
    // }

    //console.log("set data  99999999999 ======>>>>>");
    setBold(true);
    addTextSpace(user.customerOrganisationAddress,ALIGN_CENTER,fontSize.SMALL);

    setBold(true);
    addTextSpace("I ACKNOWLEDGE SATISFACTORY RECEIPT OF RELATIVE GOODS/SERVICE",ALIGN_CENTER,fontSize.SMALL);
    if(currIndex === 0) {
        addTextSpace("*** MERCHANT COPY ***",ALIGN_CENTER,fontSize.SMALL);
    }else{
        addTextSpace("*** CARDHOLDER COPY ***",ALIGN_CENTER,fontSize.SMALL);
    }
    if(rePrint){
        addTextSpace("*** Reprint ***",ALIGN_CENTER,fontSize.SMALL);
    }
    setBold(false);
    Tos.PrnStart();
    console.log("PRINT_TICKET  filled data end ======>>>>>");
    timerAdd(function () {
        let  result  = Tos.PrnStatus();
        console.log("Tos.PrnStatus  ======>>>>> ",result.code);
        //console.log("CB  ======>>>>> ",cb,JSON.stringify(cb));
        //console.log("config.printCount  ======>>>>> ",config.printCount);
        //console.log("currIndex  ======>>>>> ",currIndex);

        if(result.code===0){
            if(currIndex<config.printCount-1){
                //console.log("11111111  ======>>>>>" );
                cb.printNext(++currIndex);
            }else{
                cb.printDone();
            }
            Tos.PrnClose();
            return RET_REMOVE;
        }else if (result.code === ERR_PRN_BUSY) {
            return RET_REPEAT;
        }else if(ERR_PRN_PAPER_LACK === result.code  ){
            Tos.SysBeep();
            Tos.PrnClose();
            cb.noPaper(currIndex);
            return RET_REMOVE;
        }else {
            Tos.PrnClose();
            cb.printError(currIndex,getPrintError(result.code));
            return RET_REMOVE;
        }
    }, 200);

}

function getPrintError(errorCode) {
    let errorTip ="";
    switch (errorCode) {
        case ERR_PRN_NOT_OPEN:
            errorTip = "Print is not open";
            break;
        case ERR_PRN_HIGHT_TEMP:
            errorTip = "Temperature is too high";
            break;
        case ERR_PRN_LOW_BATTERY:
            errorTip = "Low battery";
            break;
        case ERR_PRN_WIDTH_OUT_OF_BOUNDS:
            errorTip = "The width out of bounds";
            break;
        case ERR_PRN_HEIGHT_OUT_OF_BOUNDS:
            errorTip = "The height out of bounds";
            break;
        case ERR_PRN_CANVAS_OUT_OF_BOUNDS:
            errorTip = "Canvas (buffer) out of bounds";
            break;
        case ERR_PRN_FONT_NOT_SET:
            errorTip = "Print font is not set";
            break;
        case ERR_PRN_SET_FONT:
            errorTip = "Set print font error";
            break;
        case ERR_PRN_CANVAS_NO_CONTENT:
            errorTip = "Canvas (buffer) has no content";
            break;
        case ERR_PRN_UNKNOW:
        default:
            errorTip = "Unknown error";
            break;
    }
    return errorTip;
}

function getEntryMode(enterMode) {
    let ENTERMODE =  Tos.CONSTANT.ENTRY_MODE;
    let temp ="";
    if (enterMode === ENTERMODE.MANUAL) {
        temp = "(M)";
    } else if (enterMode === ENTERMODE.MAG) {
        temp = "(S)";
    } else if (enterMode === ENTERMODE.INSERT) {
        temp = "(I)";
    } else if (enterMode === ENTERMODE.RF) {
        temp = "(C)";
    }else if (enterMode === ENTERMODE.QR) {
        temp = "(QR)";
    }
    return temp;
}

function setSpace(fontSpace){
    Tos.PrnSpaceSet(fontSpace.w || 1, fontSpace.h || 5);
}


function setBold(isBold) {
    /*  let boldNum =isBold?1:0;
      Tos.PrnBoldSet(boldNum);*/
}
function addText(text,align,fontSize){
    //console.log("PrnFontSizeSet begin ===========>");
    Tos.PrnFontSizeSet(fontSize.w || 24, fontSize.h || 24);
    //console.log("PrnFontSizeSet end ===========>");
    //console.log("PrnStr begin ===========>");
    Tos.PrnStr(text, align >= 0 && align <= 3 ? align : 1);
    //console.log("PrnStr end  ===========>");


}
function addTextSpace(text,align,fontSize){
    addText(text+"\n",align,fontSize);
}
function addLine(lines) {
    let line = lines || 1;
    let spaceLine ="";
    for (let i = 0; i < line; i++) {
        spaceLine +="\n";
    }
    Tos.PrnStr(spaceLine, 1);
}



exports.PRINT_TICKET =  PRINT_TICKET;
