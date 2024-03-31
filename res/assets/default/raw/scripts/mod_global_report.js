var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;
var GLOBAL_GET_RECORD = require("mod_global_app_manage").GLOBAL_GET_RECORD;
var GLOBAL_SAVE_RECORD = require("mod_global_app_manage").GLOBAL_SAVE_RECORD;
var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;




function TRANS_REPORT() {
    this.mIndexList = null;
    this.indexIns = function () {
        return {
            id: 0,
            length: 0,
            voucherNo: 0,
            refNo: "",
        }
    };
    this.getIndex =function (){
        console.log("saveTrans ==============> 1111");
        if(this.mIndexList){
            return  this.mIndexList;
        }

        let transIndexData  =  GLOBAL_GET_FILE(Tos.CONSTANT.filePath.tranindex);

        if(transIndexData){
            let decodeStr = String.fromCharCode.apply(null, transIndexData);
           console.log("saveTrans ==============> 3333  ",decodeStr );

            if (decodeStr) {
                console.log("saveTrans ==============> 4444  ", );
                 this.mIndexList = JSON.parse(decodeStr);
                return  this.mIndexList;
            }
        }
    }


    this.queryByVoucher =function (voucherNo) {
     let  indexList =    this.getIndex();
     let index ;
        for(let i = 0;i<indexList.length;i++){
         if(indexList[i].voucherNo ===voucherNo){
             index = i;
             break;
         }
     }
     if(index === undefined || index ===null){
         return null;
     }
     return GLOBAL_GET_RECORD(this.getIndexFileInfo(index).file, this.getIndexFileInfo(index).index, indexList[index].length);
    }
    this.queryByRefNo =function (refNo) {
        let  indexList =    this.getIndex();
        if(!indexList){
            return null;
        }
        let index ;
        for(let i = 0;i<indexList.length;i++){
            if(indexList[i].refNo ===refNo){
                index = i;
                break;
            }
        }
        if(index === undefined || index ===null){
            return null;
        }
        return GLOBAL_GET_RECORD(this.getIndexFileInfo(index).file, this.getIndexFileInfo(index).index, indexList[index].length);
    }

    this.queryByID =function (id) {
        console.log("queryByID ==============> id ",id);
        if(id === null || id === undefined){
            return ;
        }
        if(id<0){
            console.log("queryByID ==============> id <0 ",);
            return null;
        }
        let  indexList =this.getIndex();
        if(!indexList){
            console.log("queryByID ==============> indexList null ");
            return null;
        }
        console.log("queryByID ==============> indexList.length ",indexList.length);

        if(id>=indexList.length){
            return  null;
        }
        let fileInfo =  this.getIndexFileInfo(id);
        console.log("queryByID ==============> fileInfo",JSON.stringify(fileInfo));

        return GLOBAL_GET_RECORD(fileInfo.file, fileInfo.index, indexList[id].length);

    }

    this.saveTrans =function (trans) {
        console.log("saveTrans ==============> 0000");

        if(!trans){
            return;
        }
        console.log("saveTrans ==============> 1111");

        /********** 1. query index from index list ***************/
        let  indexList =this.getIndex();
        if(!indexList){
            indexList = new Array();
            this.mIndexList = indexList;
        }
        let indexLen =indexList.length;
        console.log("indexList === "+ JSON.stringify(indexList));
        console.log("indexLen  ==============> 1111 "+indexLen);

        let transInDb =  this.queryByID(trans.id);
        if(!transInDb){
              console.log("transInDb null  ==============> 1111");
              trans.id = indexLen;
              let indexIns =   this.indexIns();
              indexIns.id = trans.id;
              indexIns.voucherNo = trans.voucherNo;
              indexIns.refNo = trans.refNo;
              indexList.push(indexIns);
        }
        console.log("query id === "+ trans.id);

        /********** 2. save trans data ***************/
        let fileInfo =  this.getIndexFileInfo(trans.id);

        console.log("fileInfo === "+ JSON.stringify(fileInfo));

        let saveLen = GLOBAL_SAVE_RECORD(trans,fileInfo.file,fileInfo.index);
        console.log("saveLen === "+  saveLen);

        /********** 3. update index list data ***************/
        if(!saveLen){
            return;
        }
        indexList[trans.id].length= saveLen;
        console.log("indexList === "+ JSON.stringify(indexList));

        let indexStr = JSON.stringify(indexList).split("");
        let indexArr = indexStr.map(function (v){
            return v.charCodeAt();
        })
        GLOBAL_FILE_SAVE_COVER(indexArr,Tos.CONSTANT.filePath.tranindex);
    }

    this.getIndexFileInfo =function (id) {
        return  {
            file:Tos.CONSTANT.filePath.record + ((id / 100) | 0),
            index: id % 100 * Tos.CONSTANT.TRANS_RECORD_LEN
        }
    }



}




exports.TRANS_REPORT = new TRANS_REPORT();

