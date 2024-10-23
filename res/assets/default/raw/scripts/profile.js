var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("profile", {
    data: {
        student:"",
        studentFullName:"",
        trans:{},
        getStudentBillsRequest:{
            admissionNo:"",
            schoolId:""
        },
        isLoading:false,
        studentTotalBillAmount:""
    },

    methods:{

        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
      
        },

        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "cancel":
                    this.handleCancel();
                    break;
                case "backspace":
                    break;
                case "return":
                    break;
                default:
                    break;
            }
        },

        handleCancel:function(){
            if(this.isLoading){
                this.isLoading = false;
                this.notifyPropsChanged()
                return;
            }
            else{
                navigateReplace({
                    close_current:true,
                    target: "payment",
                })
            }
        },

        navigateToTransaction:function(){
            navigateReplace({
                    close_current: true,
                    target: "transactionPage",
                    data:this.studentTotalBillAmount 
                }) 
        },

       handleGetNewStudentBills:function(){
        this.trans.amount = parseInt(this.student.totalPendingFees);
        // console.log('global_jump', JSON.stringify(this.student))
        // GLOBAL_JUMP("", this.student);
       
        const that = this
        that.isLoading = true
        that.notifyPropsChanged()

        function onSuccess(data){
            that.isLoading = false
            that.notifyPropsChanged()
            // console.log('DATA:===>', JSON.stringify(data))
            // let student = {
            //     s:that.student,
            //     res:data.Data
            // }

            // console.log('student ===>', JSON.stringify(student))
            GLOBAL_JUMP("",data.Data)

            // navigateReplace({
            //     close_current: true,
            //     target: "makeTransfer",
            //     data:student 
            // })
            // navigateReplace({
            //     close_current: true,
            //     target: "makeTransfer",
            //     data:data.Data 
            // })
        }
        function onError(data){
            that.isLoading = false
            that.notifyPropsChanged()
            console.log('DATA:===>', JSON.stringify(data))
        }

        Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.GET_STUDENT_BILLS, that.getStudentBillsRequest, onSuccess, onError)

       }
    },

    onWillMount: function (req) {
        if(req){
            this.student = req.data
            this.studentFullName = Tos.GLOBAL_CONFIG.studentInfo.FirstName + ' ' + Tos.GLOBAL_CONFIG.studentInfo.MiddleName + ' ' + Tos.GLOBAL_CONFIG.studentInfo.Surname
            this.getStudentBillsRequest.admissionNo = Tos.GLOBAL_CONFIG.studentInfo.AdmissionNo;
            this.studentTotalBillAmount = parseFloat(req.data).toFixed(2)
            this.getStudentBillsRequest.schoolId = parseFloat(Tos.GLOBAL_CONFIG.studentInfo.SchoolId);
            this.notifyPropsChanged()
        }

    },
    onMount: function () {
    },
    onWillUnmount: function () {
    }
})