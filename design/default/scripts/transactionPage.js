var PRINT_TICKET_TRANSFER = require("mod_global_print_transfer").PRINT_TICKET_TRANSFER;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var getResponse = require("mod_global_response").getResponse;

ViewModel("transactionPage", {
    data: {
        user:"",
        loadingDetails:false,
        isTransactionCard:false,
        loading:false,
        transactions:"",
        isTransactions:false,
        error:"",
        readTransactionRequest:{
            terminalId: "",
            page: 1,
            pageSize: 100,
            searchParam: "",
            startDate: "",
            endDate:"",
        },
        readTransactionRequestDetails:{
            transactionId: ""
        },
        showTip:"",
        loading2:false,
        filterOn:false,
        customDate:false,
        currentPage:1,
        itemsPerPage:100,
        totalPage:"",
        totalPageNum:"",
        originalData:"",
        startDate:"2020/01/01",
        endDate:"2020/01/01",
        requestDate:"",
        isShowingReceipt:false,
        trans:"",
        responseMessage:"",
        amount:"",
        extraData:"",
        trnTypeColor:"",
        trnStatus:"",
        approvePag:false,
        updatePage:"",
        transactionDetails:{}
    },

    methods: {
       
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
            this.trans.responseMessage = this.responseMessage
            timerAdd(function () {
                PRINT_TICKET_TRANSFER('',this.callback,false,this.currPrint,this.trans);
                return RET_REMOVE;
            }, 100);
        },

        printNext: function (count) {
            this.currPrint = count;
            this.trans.responseMessage = this.responseMessage
            this.notifyPropsChanged()
            PRINT_TICKET_TRANSFER('',this.callback,false,1,this.trans);
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
            console.log('transactionDetails ===>', JSON.stringify(obj))
            this.trans = obj.data
            this.isShowingReceipt=true;
            if(this.trans){
                this.amount = `₦${this.trans.journalAmount}`;
                this.responseMessage = `${this.trans.transactionResponseCode === '00' ? 'APPROVED' : 'DECLINED'}| ${getResponse(this.trans.responseCode || this.trans.transactionResponseCode).responseMessage}`;
                this.extraData = {
                    card:this.trans.transactionMaskedPan,
                    name:this.trans.transactionCardHolderName,
                    appLab:this.trans.transactionAppLabel,
                    stan:this.trans.transactionStan,
                    rrn:this.trans.transactionRetrievalReferenceNumber,
                    aid:this.trans.transactionToAccountIdentification,
                    tid:this.trans.transactionFromAccountIdentification,
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
            that.approvePag = true;
            that.currentPage = that.currentPage + 1 // update page
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage) // paginate data
            that.totalPage = `page: ${that.currentPage}/${Math.ceil(that.totalPageNum)}`;
            that.updatePage = `page updated to: ${that.currentPage}/${Math.ceil(that.totalPageNum)}`;
            that.notifyPropsChanged()
        },

        approvePagFunc(){
            this.approvePag = false;
            this.notifyPropsChanged()
        },

        prevPage(){
            const that = this
            // that.approvePag = true;
            that.currentPage = that.currentPage - 1 // update page
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage) // paginate data
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

            this.customDate = false
            this.filterOn = false;

            this.notifyPropsChanged()
            console.log(this.readTransactionRequest)

            this.readTransactions()

        },

        refreshList(){
            // this.customDate = false
            // this.filterOn = false;
            // this.notifyPropsChanged()
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

        parseExtraData(trans){
            this.originalData = this.originalData.map(transaction => {
                if (transaction.extraData) {
                    transaction.extraData = JSON.parse(transaction.extraData);
                }
                return transaction
            })

    },

        readTransactions() {
            this.loading = true;
            this.customDate = false;
            this.filterOn = false;
            this.currentPage = 1;
            this.notifyPropsChanged();
            this.readTransactionRequest.terminalId = Tos.GLOBAL_CONFIG.userInfo.terminal.terminalId
            const onSuccess = (data) => {
                this.loading = false;
                console.log('transaction data', data)
                this.originalData = data.data;
                console.log('transaction Length', this.originalData.length)
                //
                if (this.originalData.length < 1) {
                    this.isTransactions = false;
                } else {
                    // this.originalData = this.originalData.map(transaction => {
                    //     if (transaction.trnExtraData) {
                    //         transaction.trnExtraData = this.getExtraData(transaction.trnExtraData);
                    //     }
                    //     return transaction
                    // })

                    // console.log('checking:', JSON.stringify(this.originalData.map(transaction => transaction.trnExtraData)))
                    // this.paginate(this.originalData, this.currentPage, this.itemsPerPage);
                    this.transactions = this.originalData
                    // this.totalPageNum = Math.ceil(this.originalData.length / this.itemsPerPage);
                    // this.totalPage = `page: ${this.currentPage}/${this.totalPageNum}`;
                    this.isTransactions = true;
                }

                this.notifyPropsChanged();
            };

            const onError = (error) => {
                console.log('transaction on Error', JSON.stringify(error))
                this.loading = false;
                this.error = error;
                this.notifyPropsChanged();
            };

            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TERMINAL_TRANSACTIONS, this.readTransactionRequest, onSuccess, onError);
        },

        readTransactionsDetails(transactionId) {
            this.isTransactionCard = false
            this.loadingDetails = true;
            this.notifyPropsChanged();
            console.log('transactionId ===>', JSON.stringify(transactionId))
            this.readTransactionRequestDetails.transactionId = parseFloat(transactionId.transactionId)

            console.log('transactionId ===>', JSON.stringify(this.readTransactionRequestDetails))
            const onSuccess = (data) => {
                this.loadingDetails = false;
                if(data.data.journalNarration === 'CARD_DEBIT' || data.data.journalNarration === 'CARD' || data.data.journalNarration === 'FEE/CARD_DEBIT'){
                    this.isTransactionCard = true
                }else{
                    this.isTransactionCard = false
                }
                this.notifyPropsChanged();
                console.log('transaction details', data)
                // this.transactionDetails =;
                this.getTrans(data)
            };

            const onError = (error) => {
                this.loadingDetails = false;
                this.error = error;
                this.notifyPropsChanged();
            };

            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TERMINAL_TRANSACTIONS_DETAILS, this.readTransactionRequestDetails, onSuccess, onError);
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