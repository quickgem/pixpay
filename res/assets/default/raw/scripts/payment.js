var saveStudentInfo = require("mod_global_config").saveStudentInfo;
var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("payment", {
  data: {
    addmissionNumber:true,
    confirmChild:false,
    confirmSchool:false, // confirm_school confirm_child
    fetchStudentDetailsRequest:{"admissionNo":""},
    isLoading:false,
    result:"",
    student:"",
    studentFullName:"",
    error:"",
    isError:false,
    fetchStudentTotalPendingFee: {
      admissionNo:"",
      schoolId:""
    }
    
  },

  methods: {
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
              if(this.addmissionNumber){
                this.handleFetchStudentDetails()
              }
              else if(this.confirmSchool){
                return;
              }else{
                console.log("key down----->>>>:", args)
                this.handleFetchStudentTotalPendingFees()
                // navigateReplace({
                //   close_current: true,
                //   target: "makeTransfer" 
                // })
              }
              break;
          default:
              break;
      }
  },

  handleCancel:function (){
    if(this.addmissionNumber){
      navigateReplace({
        close_current: true,
        target: "getStarted" 
      })
      return;
    }
    if(this.confirmSchool){
      this.confirmSchool = false
      this.addmissionNumber = true
      this.notifyPropsChanged()
      return;
    }
    if(this.confirmChild){
      this.confirmSchool = true
      this.confirmChild = false
      this.notifyPropsChanged()
      return;
    }
    
  },

  handleBack:function (args){
    let key=args
    switch (key) {
      case "confrim_school":
          this.addmissionNumber = false;
          this.confirmSchool = true
          this.confirmChild = false
          this.notifyPropsChanged()
          break;
      case "confirm_child":
          break;
      case "addmission_number":
        this.addmissionNumber = true;
        this.confirmSchool = false
        this.confirmChild = false
        this.notifyPropsChanged()
        break;
      default:
          break;
  }
   
  },

  handleFetchStudentDetails:function(){
    const that = this
    that.isLoading = true;
    that.isError = false
    that.notifyPropsChanged()

    function onSuccess(data){
      that.isLoading = false
      that.result = data.Data.students
      that.confirmSchool = true;
      that.addmissionNumber = false
      that.notifyPropsChanged()
      console.log('student ===>', JSON.stringify(that.result))
    }

    function onError(data){
      that.isLoading = false
      that.error = data.Message
      that.isError = true
      console.log(data)
      that.notifyPropsChanged()
    }

    Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.FETCH_STUDENT_DETAILS,this.fetchStudentDetailsRequest, onSuccess,onError)
  },


  handleFetchStudentTotalPendingFees: function(){
    const that = this;
    that.isLoading = true;
    that.isError = false;
    that.notifyPropsChanged()

    function onSuccess(data){
      that.isLoading = false;
      that.notifyPropsChanged()
      GLOBAL_JUMP("", data.Data.totalPendingFees)
      console.log('PendingFee ===>', JSON.stringify(data))
    }
    function onError(data){
      that.isLoading = false;
      that.notifyPropsChanged()
      console.log('Error ===>', JSON.stringify(data))
    }

    Tos.GLOBAL_API.callApi(Tos.GLOBAL_API.FETCH_STUDENT_TOTAL_PENDING_FEE, this.fetchStudentTotalPendingFee, onSuccess, onError)

  },

  selectSchool(args){
    saveStudentInfo(args)
    this.student = args
    let addmissionNumber = args.AdmissionNo
    let schoolId = args.SchoolId
    this.studentFullName = args.FirstName + ' ' + args.MiddleName + ' ' + args.Surname
    this.confirmSchool = false
    this.confirmChild = true
    this.fetchStudentTotalPendingFee.admissionNo = addmissionNumber
    this.fetchStudentTotalPendingFee.schoolId = parseFloat(schoolId)
    this.notifyPropsChanged()
    console.log('school ===>', JSON.stringify(args))
    console.log('school ===>', args)
  }

  },

  onWillMount: function (req) {
    console.log("onWillMount  begin  ============>");
   
  },

  onMount: function (data) {},

  onWillUnmount: function () {}

});
