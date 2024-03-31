ViewModel("transferType", {
    data: {
        showModel: false,
        transferType:null,
    },

    methods:{

        handleToOther(){
            this.transferType = 'other';
            console.log(this.transferType)
            this.notifyPropsChanged()

        },

        handleToSelf(){
            this.transferType = 'self';
            console.log(this.transferType)
            this.notifyPropsChanged()
        },

        onFail: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }
            navigateReplace({
                target: "result",
                type: "cancel"
            });
        },

        hideModel: function () {
            this.showModel = false;
            this.notifyPropsChanged();
        },

        handleCancel: function () {
            if (this.showModel) {
                this.hideModel();
                return;
            }
            this.onFail();
        },
        onKeyDown(args) {
            console.log("key down----->>>>:", args);
            var key = args;
            switch (key) {
                case "0":
                    if(!this.value) break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    if (this.showModel) break;
                    if(this.value.length>12) break;
                    this.value += key;
                    this._formatInput();
                    break;
                case "cancel":
                    this.handleCancel();
                    break;
                case "backspace":
                    if (this.showModel) {
                        this.hideModel();
                        return;
                    }
                    this.reduceNum();
                    break;
                case "return":
                    if (this.showModel) {
                        this.hideModel();
                        return;
                    }
                    this.navigateTo();
                    break;
                default:
                    break;
            }
        },
    },

    onWillMount: function (req) {

    },
    onMount: function () {
    },
    onWillUnmount: function () {
    }
})