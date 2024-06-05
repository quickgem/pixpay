var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;
var PRINT_TICKET = require("mod_global_print_transfer").PRINT_TICKET;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
ViewModel("transactionPage", {
    data: {
        user:null,
        loading:false,
        transactions:null,
        isTransactions:false,
        error:null,
        readTransactionRequest:{
            trnTerminalId:"",
            page:1,
            searchItem:"",
            startDate:"",
            endDate:"",

        },
        showTip:null,
        loading2:false,
        filterOn:false,
        customDate:false,
        currentPage:1,
        itemsPerPage:5,
        totalPage:null,
        totalPageNum:null,
        originalData:null,
        startDate:"2020/01/01",
        endDate:"2020/01/01",
        requestDate:"",
        isShowingReceipt:false,
        trans:null,
        responseMessage:null,
        amount:null,
        extraData:null
    },

    methods: {
        GLOBAL_CHOOSE_NETWORKs: function () {
            let type = 1; // WIFI : 1 ,GPRS : 0
            let ret = Tos.WifiCheck();
            console.log("WifiCheck =========>", ret.code);
            if (ret.code < 0) {
                ret = Tos.MobileDataAvailable();
                console.log("MobileDataAvailable =========>", ret.code);
                if (ret.code <= 0) {
                    return false;
                } else {
                    type = 0;
                }
            } else {
                type = 1;
            }
            ret = Tos.SocSetProperty(type);
            console.log("selecNetwork =========>", ret.code);
            ret = Tos.SocGetProperty(0);
            console.log("selecNetwork get =========>", ret.code, ret.data);
            return true;
        },

        paginate(arr, currentPage, itemsPerPage) {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            return arr.slice(start, end);
        },

        onKeyDown: function(args) {
            const key = args
            switch (key) {
                case "cancel":
                    if(this.customDate) {
                        this.toggleCustomFilter();
                    }else if(this.filterOn){
                        this.toggleFilter();
                    }else if(this.filterOn && this.customDate){
                        this.toggleCustomFilter();
                        this.toggleFilter()
                    }else if(this.isShowingReceipt){
                        this.isShowingReceipt = false;
                        this.notifyPropsChanged()

                        return;
                    }
                    else{
                        navigateReplace({
                            target: "moreApps",
                            close_current:true,
                        });
                    }

                    break;
                case "return":
                    if(this.customDate){
                        this.logCustomDate();
                        this.toggleCustomFilter();
                        return;
                    }
                    break;
                default:
                    break;
            }
        },

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        navigateTo: function (args) {
            GLOBAL_JUMP("", args);
        },

        onPrint:function () {
            let that  = this;
            that.trans.extraData = that.extraData
            that.trans.responseMessage = this.responseMessage
            timerAdd(function () {
                PRINT_TICKET('',that.callback,false,that.currPrint,that.trans);
                return RET_REMOVE;
            }, 100);
        },

        printNext: function (count) {
            this.currPrint = count;
            this.trans.extraData = this.extraData
            this.trans.responseMessage = this.responseMessage
            this.notifyPropsChanged()
            PRINT_TICKET('',this.callback,false,1,this.trans);
        },

        getExtraData(obj){
            let keyValuePairs = obj.split(';');
            let transactionData = {}
            for(let i=0; i < keyValuePairs.length; i++){
                let pair = keyValuePairs[i].split(':');

                let key = pair[0].trim()
                let value = pair[1].trim();

                transactionData[key] = value
            }
            return transactionData
        },

        getTrans(obj){
            this.trans = obj
            this.isShowingReceipt=true;
            if(this.trans){
                this.amount = `₦${this.trans.amount}`;
                this.responseMessage = `${this.trans.status === 'SUCCESS' || this.trans.status === 'ACTIVE' ? 'APPROVED' :  this.trans.status === 'FAILED' ? 'DECLINED' : this.trans.status}| ${this.trans.responseMessage}`;
                console.log("amount ============", this.amount);
                if(this.trans.extraData){
                    this.extraData = this.getExtraData(this.trans.extraData)
                }
            }
            this.notifyPropsChanged()
            console.log('transaction:', JSON.stringify(this.trans))

        },

        toggleFilter: function (){
            const that = this
            that.filterOn = !that.filterOn;
            that.notifyPropsChanged()
        },

        toggleCustomFilter: function(){
            const that = this
            that.customDate = !that.customDate;
            that.notifyPropsChanged()
        },

        nextPage(){
            const that = this
            that.transactions = []
            that.currentPage = that.currentPage + 1
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage)
            that.totalPage = `page: ${that.currentPage}/${Math.ceil(that.totalPageNum)}`;
            that.notifyPropsChanged()
        },

        prevPage(){
            const that = this
            that.transactions = []
            that.currentPage = that.currentPage - 1
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage)
            that.totalPage = `page: ${that.currentPage}/${Math.ceil(that.totalPageNum)}`
            that.notifyPropsChanged()
        },

        getTodayDate(){
            const res = Tos.SysGetTime()
            // Given timestamp
            const timestamp = res.data;

            // Extract components from the timestamp
            const year = timestamp.slice(0, 4);
            const month = timestamp.slice(4, 6);
            const day = timestamp.slice(6, 8);
            const hours = timestamp.slice(8, 10);
            const minutes = timestamp.slice(10, 12);
            const seconds = timestamp.slice(12, 14);

            // Format the date components into a readable string
            this.readTransactionRequest.startDate = `${year}-${month}-${day}`;
            this.readTransactionRequest.endDate = `${year}-${month}-${day}`;
            this.showTip = 'Loading today\'s transactions..'
            this.notifyPropsChanged()
        },

        logCustomDate(){
            const newStartDate = this.startDate.replaceAll('/','-')

            this.showTip = 'Loading custom transactions'

            this.readTransactionRequest.startDate = newStartDate
            this.readTransactionRequest.endDate = newStartDate

            console.log(this.readTransactionRequest)

            this.readTransactions()

        },

        refreshList(){
            this.getTodayDate()
            this.readTransactions()
        },

        getYesterdayDate(){
            const res = Tos.SysGetTime()
            // Given timestamp
            const timestamp = res.data;

            // Extract components from the timestamp
            let year = parseInt(timestamp.slice(0, 4));
            let month = parseInt(timestamp.slice(4, 6));
            let day = parseInt(timestamp.slice(6, 8));
            const hours = timestamp.slice(8, 10);
            const minutes = timestamp.slice(10, 12);
            const seconds = timestamp.slice(12, 14);

            // Calculate the previous day
            day -= 1;
            if (day === 0) {
                month -= 1;
                if (month === 0) {
                    month = 12;
                    year -= 1;
                }
                // Simplified approach: all months have 30 days
                day = 30;
            }

            // Format the components back to strings
            const formattedYear = year.toString();
            const formattedMonth = month < 10 ? '0' + month : month.toString();
            const formattedDay = day < 10 ? '0' + day : day.toString();

            // Construct the readable date string for yesterday
            this.showTip = 'Loading yesterday\'s transactions..'
            this.readTransactionRequest.startDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
            this.readTransactionRequest.endDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
            this.notifyPropsChanged()

            this.readTransactions()
        },

        readTransactions() {
            this.loading = true;
            this.customDate = false;
            this.filterOn = false;
            this.currentPage = 1;
            this.transactions = null


            this.readTransactionRequest.trnTerminalId = Tos.GLOBAL_CONFIG.userInfo.customerOrganisationTerminalId;
            this.notifyPropsChanged();

            const onSuccess = (data) => {
                this.loading = false;
                this.originalData = data.data;

                if (this.originalData.length < 1) {
                    this.isTransactions = false;
                } else {
                    this.transactions = this.paginate(this.originalData, this.currentPage, this.itemsPerPage);
                    this.totalPageNum = Math.ceil(this.originalData.length / this.itemsPerPage);
                    this.totalPage = `page: ${this.currentPage}/${this.totalPageNum}`;
                    this.isTransactions = true;
                }

                this.notifyPropsChanged();
            };

            const onError = (error) => {
                this.loading = false;
                this.error = error;
                this.notifyPropsChanged();
            };

            Tos.GLOBAL_API.callApi(
                Tos.GLOBAL_API.TRANSACTION_HISTORY,
                this.readTransactionRequest,
                onSuccess,
                onError
            );
        }

    },

    onWillMount: function (req) {
        this.user = Tos.GLOBAL_CONFIG.userInfo
        this.getTodayDate()
        this.readTransactions()
    },

    onMount: function () {

    },

    onWillUnmount: function () {}
})