var saveTransactions = require("mod_global_config").saveTransactions;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;
var GLOBAL_CONFIG = require("mod_global_config").GLOBAL_CONFIG;
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
        requestDate:""
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

        paginate(arr, currentPage, itemsPerPage){
            let arr_length = arr.length/2
            let start = (currentPage-1)*itemsPerPage
            let end = start+itemsPerPage
            return arr.slice(start ? start : 0, end ? end : arr_length);
        },

        onKeyDown: function(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    navigateReplace({
                        target: "moreApps",
                        close_current:true,
                        //data:this.user
                    });
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


        getTrans(obj){
            const data = obj
            this.navigateTo(data)
        },

        toggleFilter: function (){
            const that = this
            that.filterOn = !that.filterOn;
            that.notifyPropsChanged()
            console.log(that.filterOn)
        },

        toggleCustomFilter: function(){
            const that = this
            that.customDate = !that.customDate;
            that.notifyPropsChanged()
            console.log(that.customDate)
        },

        nextPage(){
            const that = this
            that.currentPage = that.currentPage + 1
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage)
            that.totalPage = `${that.currentPage}/${that.totalPageNum}`;
            that.notifyPropsChanged()
        },

        prevPage(){
            const that = this
            that.currentPage = that.currentPage - 1
            that.transactions  = that.paginate(that.originalData, that.currentPage, that.itemsPerPage)
            that.totalPage = `${that.currentPage}/${that.totalPageNum}`
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
            const newEndDate = this.endDate.replaceAll('/','-')

            this.showTip = 'Loading custom transactions..'

            this.readTransactionRequest.startDate = newStartDate
            this.readTransactionRequest.endDate = newEndDate

            this.notifyPropsChanged()
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
            let that = this
            that.loading = true
            that.customDate = false
            that.filterOn = false

            // console.log('today:===> ',today)
            that.readTransactionRequest.trnTerminalId = Tos.GLOBAL_CONFIG.userInfo.customerOrganisationTerminalId
            that.notifyPropsChanged()
            function onSuccess(data){
                that.loading = false
                that.originalData = data.data
                if(that.originalData.length < 1){
                    that.isTransactions = false
                }else{
                    that.transactions = that.paginate(that.originalData, that.currentPage,that.itemsPerPage)
                    that.totalPageNum = that.originalData.length/that.itemsPerPage
                    that.totalPage = `${that.currentPage}/${that.totalPageNum}`
                    that.isTransactions = true
                }

                that.notifyPropsChanged();
                console.log(that.transactions)
            }
            function onError(data){
                that.loading = false
                that.error = data
                that.notifyPropsChanged();
            }
            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.TRANSACTION_HISTORY,that.readTransactionRequest,onSuccess,onError)
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