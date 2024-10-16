 /**
 *
 * ALIGN
 * ALIGN_DEFAULT 0  current cursor
 * ALIGN_LEFT    1
 * ALIGN_CENTER  2
 * ALIGN_RIGHT   3
 */
// const  getResponse = require("mod_global_response").getResponse;

const  getResponse = require("mod_global_response").getResponse;

function PRINT_TICKET_TRANSFER(trans,cb,rePrint,currIndex,arg) {
    console.log("args ====>, ", JSON.stringify(arg))
    console.log("trans ====>, ", JSON.stringify(trans))


    let  status  = Tos.PrnStatus();
    if(status.code===ERR_PRN_PAPER_LACK){
        Tos.SysBeep();
        Tos.PrnClose();
        cb.noPaper(currIndex);
        return;
    }
    else if(status.code!==0){
        Tos.SysBeep();
        Tos.PrnClose();
        cb.printError(currIndex,getPrintError(result.code));
        return;
    }

    console.log("PRINT_TICKET  filled data ======>>>>>");
    let config =Tos.GLOBAL_CONFIG;
    let  fontSize ={
        SMALL:{ w: 16, h: 16 },
        MIDDLE:{ w: 18, h: 18 },
        LARGE:{ w: 32, h: 32 },
    }
    let TRANS_TYPE = Tos.CONSTANT.TRANS_TYPE;

    let fontSpace ={w:1,h:5};

    let ret = Tos.PrnInit(3000);

    if (ret.code !== 0) {
        //console.log("PrnInit fail ======>>>>>");
        return;
    }

    setSpace(fontSpace);

    //console.log("setSpace ======>>>>>");
    addTextSpace( Tos.GLOBAL_CONFIG.partner,ALIGN_CENTER,fontSize.LARGE);
    addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    //console.log("set data  0000 ======>>>>>");
    addTextSpace(Tos.GLOBAL_CONFIG.userInfo.organisation.organisationName,ALIGN_CENTER,fontSize.MIDDLE);
    addTextSpace(Tos.GLOBAL_CONFIG.userInfo.organisation.organisationAddress,ALIGN_CENTER,fontSize.MIDDLE);
    addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    if(currIndex === 1) {
        addTextSpace("*** MERCHANT COPY ***",ALIGN_CENTER,fontSize.MIDDLE);
        addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);

    }
    else{
        addTextSpace("*** CUSTOMER COPY ***",ALIGN_CENTER,fontSize.MIDDLE);
        addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    }
    if (arg.transactionResponseCode === "00"){
        addTextSpace( 'APPROVED',ALIGN_CENTER,fontSize.LARGE);
    }
    else{
        addTextSpace( 'DECLINED',ALIGN_CENTER,fontSize.LARGE);
    }

    addTextSpace(`RESPONSE CODE: ${arg.transactionResponseCode === ""?"999":arg.transactionResponseCode}`,ALIGN_LEFT,fontSize.MIDDLE);
    addTextSpace(`MESSAGE: ${arg.transactionResponseCode === "00"?"APPROVED":"DECLINED"} | ${getResponse(arg.transactionResponseCode).responseMessage}`,ALIGN_LEFT,fontSize.MIDDLE);
    addTextSpace(`DATE: ${arg.transactionCreatedAt || arg.transactionCreatedAt}`,ALIGN_LEFT,fontSize.MIDDLE);
    if(arg.journalNarration === 'CARD_DEBIT' || arg.journalNarration === 'CARD' || arg.journalNarration === 'FEE/CARD_DEBIT'){
        addTextSpace(`TID.: ${arg.transactionFromAccountIdentification}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`CARD.: ${arg.transactionMaskedPan}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`Name.: ${arg.transactionCardHolderName}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`AID: ${arg.transactionToAccountIdentification}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`STAN: ${arg.transactionStan}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`RRN: ${arg.transactionRetrievalReferenceNumber}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`APPLAB: ${arg.transactionAppLabel}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    }
    else{
        // addTextSpace(`TYPE: ${arg.type === 'DR' ? 'Debit' : arg.creditAccount !== Tos.GLOBAL_CONFIG.userInfo.customerOrganisationWallet ? 'Debit' : 'Credit'}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`BUSINESS ACC.: ${arg.transactionFromAccountType}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`NAME: ${arg.transactionToAccountType}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`ACCOUNT NO.: ${arg.transactionToAccountIdentification}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`REF MSG.: ${arg.journalNarration ? arg.journalNarration : 'NA'}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace(`REF NO.: ${arg.transactionRetrievalReferenceNumber}`,ALIGN_LEFT,fontSize.MIDDLE);
        addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    }
    addText(`AMOUNT:`,ALIGN_LEFT,fontSize.MIDDLE);
    addTextSpace(`₦${arg.journalAmount}`,ALIGN_RIGHT,fontSize.LARGE);
    addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    addTextSpace( `powered by ${Tos.GLOBAL_CONFIG.partner}`,ALIGN_CENTER,fontSize.SMALL);
    addTextSpace( '-----------------------------------------------------',ALIGN_LEFT,fontSize.MIDDLE);
    //setBold(false);
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



exports.PRINT_TICKET_TRANSFER =  PRINT_TICKET_TRANSFER;





