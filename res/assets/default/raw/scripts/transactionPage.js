var PRINT_TICKET = require("mod_global_print_transfer").PRINT_TICKET;

ViewModel("transactionPage", {
    data: {
        studentTotalBillAmount:"",
        printReceipt:false,
        showPrintReceipt:false,
        loading:false,
        transactions:null,
        isTransactions:false,
        error:null,
        readTransactionHistoryRequest:{
          admissionNo:"",
          schoolId:""
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
        extraData:null,
        trnTypeColor:null,
        trnStatus:null,
        approvePag:false,
        updatePage:null,
        printData:""
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
                    if(this.showPrintReceipt){
                        this.showPrintReceipt = false;
                        this.notifyPropsChanged()
                    }else{
                        navigateReplace({
                            close_current: true,
                            target: "profile",
                            data:this.studentTotalBillAmount 
                        })
                    }
                   
                    break;
                case "return":
                   
                    break;
                default:
                    break;
            }
        },

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
        },

        onPrint:function (args) {
            timerAdd(function () {
                PRINT_TICKET('',this.callback,false,this.currPrint,args);
                this.showPrintReceipt = false
                this.notifyPropsChanged()
                return RET_REMOVE;
            }, 100);            
        },
      
        readTransactions() {
            this.loading = true;
            this.readTransactionHistoryRequest.admissionNo = Tos.GLOBAL_CONFIG.studentInfo.AdmissionNo
            this.readTransactionHistoryRequest.schoolId = parseFloat(Tos.GLOBAL_CONFIG.studentInfo.SchoolId)

            this.notifyPropsChanged();
            const onSuccess = (data) => {
                this.loading = false;
                if(data.Data.transactions.length > 0){
                    this.isTransactions = true
                }
                this.transactions = data.Data.transactions
                console.log('transaction data',  JSON.stringify(this.transactions))
                this.notifyPropsChanged();
            };

            const onError = (error) => {
                this.loading = false;
                this.error = error;
                this.notifyPropsChanged();
            };

            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.GET_TRANSACTION_HISTORY, this.readTransactionHistoryRequest, onSuccess, onError);
        }

    },

    onWillMount: function (req) {
        if(req){
            this.studentTotalBillAmount = req.data
            this.readTransactions()  
        }
    

    },

    onMount: function () {
       
    },

    onWillUnmount: function () {}
})