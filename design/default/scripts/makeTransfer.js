var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("makeTransfer", {
    data: {
        studentBills:"",
        studentTotalBillAmount:"",
        isLoading:false,
        student:"",
        trans:{},
        selectedBill:[],
        isCompusoryBtn:true,
        isOtherBtn:false,
        compulsoryFees:[],
        otherFees:[],
        posPaymentRequest:{
            AdmissionNumber:"",
            SchoolId:"",
            PaymentComponents:""

        },
    
    },

    methods:{
        initHTTPCB: function () {
            console.log("HttpclientCbEvent start 0000000===========");
            Tos.HttpclientCbEvent();
      
        },

        _formatInput: function (num) {
            if(!num) return "₦ 0.00";
            // parseFloat(this.fundTransferRequest.amount).toFixed(2);
            return num.replace(/,/g, '');
            // const parts  = this.fundTransferRequest.amount.toString().split(".");
            // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            // this.fundTransferAmount = parts.join(".")
            this.notifyPropsChanged();
        },

        compusory:function(){
            this.isCompusoryBtn = true
            this.isOtherBtn = false
            this.notifyPropsChanged()
        },

        other:function(){
            this.isCompusoryBtn = false
            this.isOtherBtn = true
            this.notifyPropsChanged()
        },


        // _formatInput: function () {
        //     if(this.studentTotalBillAmount === "") this.fundTransferAmount = "₦ 0.00";
        //     // parseFloat(this.fundTransferRequest.amount).toFixed(2);
        //     this.studentTotalBillAmount = this.fundTransferRequest.amount.replace(/,/g, '');
        //     // const parts  = this.fundTransferRequest.amount.toString().split(".");
        //     // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //     // this.fundTransferAmount = parts.join(".")
        //     this.notifyPropsChanged();
        // },

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
                    this.startPosPayment()
                    break;
                default:
                    break;
            }
        },

        handleCancel:function (){
            navigateReplace({
                close_current: true,
                target: "profile",
                data:this.studentTotalBillAmount
              })
          },

          selectBill:function(args){
            console.log("selectedBill ===>", JSON.stringify(this.selectedBill))
            const isAlreadyAdded = this.selectedBill.find(bill => bill.InvoiceReference === args.reference);
            
            if (!isAlreadyAdded) {
                // Add the amount to the total and push the new item to selectedBill
                let newAmount = this.studentTotalBillAmount + args.amount;
                this.studentTotalBillAmount = parseFloat(newAmount).toFixed(2);
    
                // Add the payment component to the bill
                const paymentComponent = {"InvoiceReference": args.reference};
                this.selectedBill.push(paymentComponent);
    
                this.notifyPropsChanged();
                console.log("selectedBill ===>", JSON.stringify(this.selectedBill));
            }else{
                // Subtract the amount from the total
                let newAmount = this.studentTotalBillAmount - args.amount;
                this.studentTotalBillAmount = parseFloat(newAmount).toFixed(2);
                this.selectedBill = this.selectedBill.filter(item => {
                    console.log("ref ==>", item.InvoiceReference, args.reference);
                    return item.InvoiceReference !== args.reference;
                });
                console.log("selectedBill ===>", JSON.stringify(this.selectedBill));

                this.notifyPropsChanged();
            }
          
          
          },

        startPosPayment:function (){
            const that = this
            that.isLoading = true
            this.trans.amount = this.studentTotalBillAmount
            that.notifyPropsChanged()
            that.posPaymentRequest.AdmissionNumber = Tos.GLOBAL_CONFIG.studentInfo.AdmissionNo
            that.posPaymentRequest.SchoolId = parseFloat(Tos.GLOBAL_CONFIG.studentInfo.SchoolId)
            that.posPaymentRequest.PaymentComponents = this.selectedBill
            function onSuccess(data){
                that.isLoading = false
                that.notifyPropsChanged()
                GLOBAL_JUMP("", {data:data, pendingFees:this.studentTotalBillAmount})

            }

            function onError(data){
                that.isLoading = false
                that.notifyPropsChanged()
                console.log("Err===>", data)
            }

            Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.START_POS_PAYMENT, that.posPaymentRequest, onSuccess, onError)

        }  
    

      
    },




    onWillMount: function (req) {
        console.log('req ===> RES:', JSON.stringify(req.data))

        if(req){
            this.studentBills = req.data.fees
            this.trans = Tos.GLOBAL_TRANSACTION.trans
            this.compulsoryFees =  req.data.fees.filter(fee => fee.FeeType !== "Non Compulsory Fee");
            this.otherFees =  req.data.fees.filter(fee => fee.FeeType === "Non Compulsory Fee");
            // const billAmount = parseFloat(req.data.totalFees).toFixed(2)
            this.studentTotalBillAmount = 0
            this.notifyPropsChanged()

            console.log('compulsory ===> ', JSON.stringify(this.compulsoryFees))
            console.log('others ===> ', JSON.stringify(this.otherFees))
        }
       
    },

    onMount: function (req) {
    
      
    },

    onWillUnmount: function () {
       
    }
})