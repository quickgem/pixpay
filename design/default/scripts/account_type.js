var GLOBAL_JUMP = require("mod_global_trans").GLOBAL_JUMP;

ViewModel("account_type", {
    data: {

    },

    methods: {


        initHTTPCB: function () {
            Tos.HttpclientCbEvent();
        },

    },

    onWillMount: function (req) {
        this.user = Tos.GLOBAL_CONFIG.userInfo

    },

    onMount: function () {

    },

    onWillUnmount: function () {}
})