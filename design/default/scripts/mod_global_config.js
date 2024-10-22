    var GLOBAL_FILE_SAVE_COVER = require("mod_global_app_manage").GLOBAL_FILE_SAVE_COVER;
    
    var GLOBAL_GET_FILE = require("mod_global_app_manage").GLOBAL_GET_FILE;
    
    function GLOBAL_CONFIG() {
      this.config = {
            termId : "00000219", //0000219
            merchantId : "linjianzhang", // linjianzhang
            merchantName:"Topwise",
            tpdu: "6000380000",
            head: "603200322012",
            partner: "CORESTEP",
            timeout:60,
            resendTime:3,
            voucherNo:1,
            batchNO:1,
            maxTransNum:500,
            maxRefundAmt:50000000,
            securityPwd:"88888888",
            operatorPwd:"888888",
            printCount : 2,
            printGray:4,
            eSignSupport:true,
            reverselTime:3,
            reverselType:0 ,//0:reversel  next time ,1: at once
            countryCode:"156",
            theme:{
                primary:'#d2d2d3b9',
                primary_bold:'#3F3F3F',
                secondary:'#FF9900FF',
                light:'#FFFFFF',
                dark:'#000000'
            },
            networkParam:{
              addr_len: 4,
              port: 8889,
              addr: [203, 124, 15, 248], soc_type: 0
            },
            userInfo:{
            userId: "",
            userRoleId: "",
            userType: "",
            userFirstName: "",
            organisationName: "",
            organisationId: "",
            organisationAddress: "",
            userMiddleName: "",
            userLastName: "",
            userPhone: "",
            userEmail: "",
            userStatus: "",
            userCreatedAt: "",
            userUpdatedAt: "",
            privileges: [],
            token: "",
            responseCode: "",
            responseMessage: "",
            terminal: {
              terminalId: "",
              terminalSerialNumber: "",
              terminalOrganisationId: "",
              terminalAccountNumber: "",
              terminalCallHomeTimeInHours: "",
              terminalCardAcceptorId: "",
              terminalCountryCode: "",
              terminalCurrencyCode: "",
              terminalMcc: "",
              terminalMerchantNameLocation: "",
              terminalTimeOutInSeconds: "",
              terminalPin: "",
              terminalStatus: "",
              terminalCreatedAt: "",
              terminalUpdatedAt:"",
              tid: ""
            },
            organisation: {
              organisationId: "",
              organisationCustomerId: "",
              organisationAccountNumber: "",
              organisationName: "",
              organisationLogo: "",
              organisationRegistrationNumber: "",
              organisationRegistrationDate: "",
              organisationPhone: "",
              organisationEmail: "",
              organisationType: "",
              organisationWebsite: "",
              organisationAddress: "",
              organisationIndustryType: "",
              organisationStage: "",
              organisationReferralCode: "",
              organisationInviteCode: "",
              organisationRoleId: "",
              organisationStatus: "",
              organisationCreatedAt: "",
              organisationUpdatedAt: ""
            }
          },
            banks:[
                {
                    "bankCode": "090270",
                    "bankName": "AB MICROFINANCE BANK"
                },
                {
                    "bankCode": "070010",
                    "bankName": "ABBEY MORTGAGE BANK"
                },
                {
                    "bankCode": "090260",
                    "bankName": "ABOVE ONLY MICROFINANCE BANK"
                },
                {
                    "bankCode": "090197",
                    "bankName": "ABU MICROFINANCE BANK"
                },
                {
                    "bankCode": "000014",
                    "bankName": "ACCESS BANK"
                },
                {
                    "bankCode": "000005",
                    "bankName": "ACCESS BANK PLC (DIAMOND)"
                },
                {
                    "bankCode": "100013",
                    "bankName": "ACCESSMONEY"
                },
                {
                    "bankCode": "090134",
                    "bankName": "ACCION MFB"
                },
                {
                    "bankCode": "090160",
                    "bankName": "ADDOSSER MFBB"
                },
                {
                    "bankCode": "090268",
                    "bankName": "ADEYEMI COLLEGE STAFF MICROFINANCE BANK"
                },
                {
                    "bankCode": "090155",
                    "bankName": "ADVANS LA FAYETTE MFB"
                },
                {
                    "bankCode": "100028",
                    "bankName": "AG MORTGAGE BANK PLC"
                },
                {
                    "bankCode": "090371",
                    "bankName": "AGOSASA MICROFINANCE BANK"
                },
                {
                    "bankCode": "090133",
                    "bankName": "AL-BARKAH MFB"
                },
                {
                    "bankCode": "090259",
                    "bankName": "ALEKUN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090297",
                    "bankName": "ALERT MFB"
                },
                {
                    "bankCode": "090277",
                    "bankName": "ALHAYAT MFB"
                },
                {
                    "bankCode": "090131",
                    "bankName": "ALLWORKERS MFB"
                },
                {
                    "bankCode": "090169",
                    "bankName": "ALPHAKAPITAL MFB"
                },
                {
                    "bankCode": "090180",
                    "bankName": "AMJU MFB"
                },
                {
                    "bankCode": "090116",
                    "bankName": "AMML MFB"
                },
                {
                    "bankCode": "090645",
                    "bankName": "AMUCHA MFB"
                },
                {
                    "bankCode": "090143",
                    "bankName": "APEKS MICROFINANCE BANK"
                },
                {
                    "bankCode": "090376",
                    "bankName": "APPLE  MICROFINANCE BANK"
                },
                {
                    "bankCode": "090282",
                    "bankName": "ARISE MFB"
                },
                {
                    "bankCode": "090001",
                    "bankName": "ASOSAVINGS"
                },
                {
                    "bankCode": "090172",
                    "bankName": "ASTRAPOLARIS MFB"
                },
                {
                    "bankCode": "090264",
                    "bankName": "AUCHI MICROFINANCE BANK"
                },
                {
                    "bankCode": "090188",
                    "bankName": "BAINES CREDIT MFB"
                },
                {
                    "bankCode": "090326",
                    "bankName": "BALOGUN GAMBARI MFB"
                },
                {
                    "bankCode": "090316",
                    "bankName": "BAYERO MICROFINANCE BANK"
                },
                {
                    "bankCode": "090127",
                    "bankName": "BC KASH MFB"
                },
                {
                    "bankCode": "100052",
                    "bankName": "BETA-ACCESS YELLO"
                },
                {
                    "bankCode": "090336",
                    "bankName": "BIPC MICROFINANCE BANK"
                },
                {
                    "bankCode": "090117",
                    "bankName": "BOCTRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090176",
                    "bankName": "BOSAK MFB"
                },
                {
                    "bankCode": "090148",
                    "bankName": "BOWEN MFB"
                },
                {
                    "bankCode": "070015",
                    "bankName": "BRENT MORTGAGE BANK"
                },
                {
                    "bankCode": "090293",
                    "bankName": "BRETHREN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090308",
                    "bankName": "BRIGHTWAY MFB"
                },
                {
                    "bankCode": "090360",
                    "bankName": "CASHCONNECT   MICROFINANCE BANK"
                },
                {
                    "bankCode": "100005",
                    "bankName": "CELLULANT"
                },
                {
                    "bankCode": "090154",
                    "bankName": "CEMCS MFB"
                },
                {
                    "bankCode": "090141",
                    "bankName": "CHIKUM MICROFINANCE BANK"
                },
                {
                    "bankCode": "090144",
                    "bankName": "CIT MICROFINANCE BANK"
                },
                {
                    "bankCode": "000009",
                    "bankName": "CITI BANK"
                },
                {
                    "bankCode": "090374",
                    "bankName": "COASTLINE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090130",
                    "bankName": "CONSUMER  MFB"
                },
                {
                    "bankCode": "100032",
                    "bankName": "CONTEC GLOBAL"
                },
                {
                    "bankCode": "090365",
                    "bankName": "CORESTEP MICROFINANCE BANK"
                },
                {
                    "bankCode": "060001",
                    "bankName": "CORONATION"
                },
                {
                    "bankCode": "070006",
                    "bankName": "COVENANT MFB"
                },
                {
                    "bankCode": "090159",
                    "bankName": "CREDIT AFRIQUE MFB"
                },
                {
                    "bankCode": "090167",
                    "bankName": "DAYLIGHT MICROFINANCE BANK"
                },
                {
                    "bankCode": "090294",
                    "bankName": "EAGLE FLIGHT MFB"
                },
                {
                    "bankCode": "100021",
                    "bankName": "EARTHOLEUM"
                },
                {
                    "bankCode": "090156",
                    "bankName": "E-BARCS MFB"
                },
                {
                    "bankCode": "000010",
                    "bankName": "ECOBANK BANK"
                },
                {
                    "bankCode": "100008",
                    "bankName": "ECOBANK XPRESS ACCOUNT"
                },
                {
                    "bankCode": "090310",
                    "bankName": "EDFIN MFB"
                },
                {
                    "bankCode": "090097",
                    "bankName": "EKONDO MFB"
                },
                {
                    "bankCode": "090273",
                    "bankName": "EMERALDS MFB"
                },
                {
                    "bankCode": "090114",
                    "bankName": "EMPIRETRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "000019",
                    "bankName": "ENTERPRISE BANK"
                },
                {
                    "bankCode": "090189",
                    "bankName": "ESAN MFB"
                },
                {
                    "bankCode": "090166",
                    "bankName": "ESO-E MICROFINANCE BANK"
                },
                {
                    "bankCode": "100006",
                    "bankName": "ETRANZACT"
                },
                {
                    "bankCode": "090304",
                    "bankName": "EVANGEL MFB"
                },
                {
                    "bankCode": "090332",
                    "bankName": "EVERGREEN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090328",
                    "bankName": "EYOWO MICROFINANCE BANK"
                },
                {
                    "bankCode": "090551",
                    "bankName": "FAIRMONEY MFB"
                },
                {
                    "bankCode": "090179",
                    "bankName": "FAST MFB"
                },
                {
                    "bankCode": "090107",
                    "bankName": "FBN MORGAGES LIMITED"
                },
                {
                    "bankCode": "060002",
                    "bankName": "FBNQUEST MERCHANT BANK"
                },
                {
                    "bankCode": "000003",
                    "bankName": "FCMB"
                },
                {
                    "bankCode": "100031",
                    "bankName": "FCMB EASY ACCOUNT"
                },
                {
                    "bankCode": "090290",
                    "bankName": "FCT MFB"
                },
                {
                    "bankCode": "090318",
                    "bankName": "FEDERAL UNIVERSITY DUTSE  MICROFINANCE BANK"
                },
                {
                    "bankCode": "090298",
                    "bankName": "FEDERALPOLY NASARAWAMFB"
                },
                {
                    "bankCode": "100001",
                    "bankName": "FETS"
                },
                {
                    "bankCode": "090153",
                    "bankName": "FFS MICROFINANCE BANK"
                },
                {
                    "bankCode": "000007",
                    "bankName": "FIDELITY BANK"
                },
                {
                    "bankCode": "100019",
                    "bankName": "FIDELITY MOBILE"
                },
                {
                    "bankCode": "090126",
                    "bankName": "FIDFUND MFB"
                },
                {
                    "bankCode": "090111",
                    "bankName": "FINATRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090281",
                    "bankName": "FINEX MFB"
                },
                {
                    "bankCode": "000016",
                    "bankName": "FIRST BANK OF NIGERIA"
                },
                {
                    "bankCode": "070014",
                    "bankName": "FIRST GENERATION MORTGAGE BANK"
                },
                {
                    "bankCode": "090163",
                    "bankName": "FIRST MULTIPLE MFB"
                },
                {
                    "bankCode": "090285",
                    "bankName": "FIRST OPTION MFB"
                },
                {
                    "bankCode": "090164",
                    "bankName": "FIRST ROYAL MICROFINANCE BANK"
                },
                {
                    "bankCode": "100014",
                    "bankName": "FIRSTMONIE WALLET"
                },
                {
                    "bankCode": "070002",
                    "bankName": "FORTIS MICROFINANCE BANK"
                },
                {
                    "bankCode": "100016",
                    "bankName": "FORTISMOBILE"
                },
                {
                    "bankCode": "400001",
                    "bankName": "FSDH"
                },
                {
                    "bankCode": "090145",
                    "bankName": "FULL RANGE MFB"
                },
                {
                    "bankCode": "090158",
                    "bankName": "FUTO MFB"
                },
                {
                    "bankCode": "090168",
                    "bankName": "GASHUA MICROFINANCE BANK"
                },
                {
                    "bankCode": "070009",
                    "bankName": "GATEWAY MORTGAGE BANK"
                },
                {
                    "bankCode": "000027",
                    "bankName": "GLOBUS BANK"
                },
                {
                    "bankCode": "090278",
                    "bankName": "GLORY MFB"
                },
                {
                    "bankCode": "100022",
                    "bankName": "GOMONEY"
                },
                {
                    "bankCode": "090122",
                    "bankName": "GOWANS MFB"
                },
                {
                    "bankCode": "090178",
                    "bankName": "GREENBANK MFB"
                },
                {
                    "bankCode": "090269",
                    "bankName": "GREENVILLE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090195",
                    "bankName": "GROOMING MICROFINANCE BANK"
                },
                {
                    "bankCode": "000013",
                    "bankName": "GTBANK PLC"
                },
                {
                    "bankCode": "100009",
                    "bankName": "GTMOBILE"
                },
                {
                    "bankCode": "090147",
                    "bankName": "HACKMAN MICROFINANCE BANK"
                },
                {
                    "bankCode": "070017",
                    "bankName": "HAGGAI MORTGAGE BANK"
                },
                {
                    "bankCode": "090291",
                    "bankName": "HALA MFB"
                },
                {
                    "bankCode": "090121",
                    "bankName": "HASAL MFB"
                },
                {
                    "bankCode": "100017",
                    "bankName": "HEDONMARK"
                },
                {
                    "bankCode": "000020",
                    "bankName": "HERITAGE"
                },
                {
                    "bankCode": "090118",
                    "bankName": "IBILE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090324",
                    "bankName": "IKENNE MFB"
                },
                {
                    "bankCode": "090279",
                    "bankName": "IKIRE MFB"
                },
                {
                    "bankCode": "090370",
                    "bankName": "ILASAN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090258",
                    "bankName": "IMO MICROFINANCE BANK"
                },
                {
                    "bankCode": "100024",
                    "bankName": "IMPERIAL HOMES MORTGAGE BANK"
                },
                {
                    "bankCode": "090157",
                    "bankName": "INFINITY MFB"
                },
                {
                    "bankCode": "070016",
                    "bankName": "INFINITY TRUST  MORTGAGE BANK"
                },
                {
                    "bankCode": "100027",
                    "bankName": "INTELLIFIN"
                },
                {
                    "bankCode": "090149",
                    "bankName": "IRL MICROFINANCE BANK"
                },
                {
                    "bankCode": "090377",
                    "bankName": "ISALEOYO MICROFINANCE BANK"
                },
                {
                    "bankCode": "000006",
                    "bankName": "JAIZ BANK"
                },
                {
                    "bankCode": "090003",
                    "bankName": "JUBILEELIFE"
                },
                {
                    "bankCode": "090320",
                    "bankName": "KADPOLY MICROFINANCE BANK"
                },
                {
                    "bankCode": "090191",
                    "bankName": "KCMB MFB"
                },
                {
                    "bankCode": "100015",
                    "bankName": "KEGOW"
                },
                {
                    "bankCode": "000002",
                    "bankName": "KEYSTONE BANK"
                },
                {
                    "bankCode": "090299",
                    "bankName": "KONTAGORA MFB"
                },
                {
                    "bankCode": "090267",
                    "bankName": "KUDA MICROFINANCE BANK"
                },
                {
                    "bankCode": "090177",
                    "bankName": "LAPO MFB"
                },
                {
                    "bankCode": "090271",
                    "bankName": "LAVENDER MICROFINANCE BANK"
                },
                {
                    "bankCode": "070012",
                    "bankName": "LBIC MORTGAGE BANK"
                },
                {
                    "bankCode": "090372",
                    "bankName": "LEGEND MICROFINANCE BANK"
                },
                {
                    "bankCode": "090265",
                    "bankName": "LOVONUS MICROFINANCE BANK"
                },
                {
                    "bankCode": "090323",
                    "bankName": "MAINLAND MICROFINANCE BANK"
                },
                {
                    "bankCode": "090171",
                    "bankName": "MAINSTREET MFB"
                },
                {
                    "bankCode": "090174",
                    "bankName": "MALACHY MFB"
                },
                {
                    "bankCode": "090321",
                    "bankName": "MAYFAIR  MFB"
                },
                {
                    "bankCode": "0070019",
                    "bankName": "MAYFRESH MORTGAGE BANK"
                },
                {
                    "bankCode": "090280",
                    "bankName": "MEGAPRAISE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090275",
                    "bankName": "MERIDIAN MFB"
                },
                {
                    "bankCode": "090136",
                    "bankName": "MICROCRED MICROFINANCE BANK"
                },
                {
                    "bankCode": "100011",
                    "bankName": "MKUDI"
                },
                {
                    "bankCode": "090362",
                    "bankName": "MOLUSI MICROFINANCE BANK"
                },
                {
                    "bankCode": "100020",
                    "bankName": "MONEYBOX"
                },
                {
                    "bankCode": "090129",
                    "bankName": "MONEYTRUST MFB"
                },
                {
                    "bankCode": "090405",
                    "bankName": "MONIEPOINT MICROFINANCE BANK"
                },
                {
                    "bankCode": "090190",
                    "bankName": "MUTUAL BENEFITS MFB"
                },
                {
                    "bankCode": "090151",
                    "bankName": "MUTUAL TRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090152",
                    "bankName": "NARGATA MFB"
                },
                {
                    "bankCode": "090263",
                    "bankName": "NAVY MICROFINANCE BANK"
                },
                {
                    "bankCode": "090128",
                    "bankName": "NDIORAH MFB"
                },
                {
                    "bankCode": "090329",
                    "bankName": "NEPTUNE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090378",
                    "bankName": "NEW GOLDEN PASTURES MICROFINANCE BANK"
                },
                {
                    "bankCode": "090108",
                    "bankName": "NEW PRUDENTIAL BANK"
                },
                {
                    "bankCode": "090205",
                    "bankName": "NEWDAWN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090194",
                    "bankName": "NIRSAL NATIONAL MICROFINANCE BANK"
                },
                {
                    "bankCode": "090283",
                    "bankName": "NNEW WOMEN MFB"
                },
                {
                    "bankCode": "060003",
                    "bankName": "NOVA MB"
                },
                {
                    "bankCode": "070001",
                    "bankName": "NPF MICROFINANCE BANK"
                },
                {
                    "bankCode": "090364",
                    "bankName": "NUTURE MFB"
                },
                {
                    "bankCode": "090333",
                    "bankName": "OCHE MFB"
                },
                {
                    "bankCode": "090119",
                    "bankName": "OHAFIA MFB"
                },
                {
                    "bankCode": "090161",
                    "bankName": "OKPOGA MFB"
                },
                {
                    "bankCode": "090272",
                    "bankName": "OLABISI ONABANJO UNIVERSITY MICROFINANCE BANK"
                },
                {
                    "bankCode": "090295",
                    "bankName": "OMIYE MFB"
                },
                {
                    "bankCode": "070007",
                    "bankName": "OMOLUABI MORTGAGE BANK PLC"
                },
                {
                    "bankCode": "100026",
                    "bankName": "ONE FINANCE"
                },
                {
                    "bankCode": "100002",
                    "bankName": "PAGA"
                },
                {
                    "bankCode": "070008",
                    "bankName": "PAGE FINANCIALS"
                },
                {
                    "bankCode": "100033",
                    "bankName": "PALMPAY"
                },
                {
                    "bankCode": "100003",
                    "bankName": "PARKWAY-READYCASH"
                },
                {
                    "bankCode": "090004",
                    "bankName": "PARRALEX"
                },
                {
                    "bankCode": "090317",
                    "bankName": "PATRICK GOLD"
                },
                {
                    "bankCode": "110001",
                    "bankName": "PAYATTITUDE ONLINE"
                },
                {
                    "bankCode": "100004",
                    "bankName": "PAYCOM (OPAY)"
                },
                {
                    "bankCode": "090137",
                    "bankName": "PECAN TRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090196",
                    "bankName": "PENNYWISE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090135",
                    "bankName": "PERSONAL TRUST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090165",
                    "bankName": "PETRA MICROFINANCE BANK"
                },
                {
                    "bankCode": "090289",
                    "bankName": "PILLAR MFB"
                },
                {
                    "bankCode": "070013",
                    "bankName": "PLATINUM MORTGAGE BANK"
                },
                {
                    "bankCode": "000008",
                    "bankName": "POLARIS BANK"
                },
                {
                    "bankCode": "090296",
                    "bankName": "POLYUWANNA MFB"
                },
                {
                    "bankCode": "090274",
                    "bankName": "PRESTIGE MICROFINANCE BANK"
                },
                {
                    "bankCode": "000023",
                    "bankName": "PROVIDUS BANK"
                },
                {
                    "bankCode": "090303",
                    "bankName": "PURPLEMONEY MFB"
                },
                {
                    "bankCode": "090261",
                    "bankName": "QUICKFUND MICROFINANCE BANK"
                },
                {
                    "bankCode": "090170",
                    "bankName": "RAHAMA MFB"
                },
                {
                    "bankCode": "000024",
                    "bankName": "RAND MERCHANT BANK"
                },
                {
                    "bankCode": "070011",
                    "bankName": "REFUGE MORTGAGE BANK"
                },
                {
                    "bankCode": "090125",
                    "bankName": "REGENT MFB"
                },
                {
                    "bankCode": "090173",
                    "bankName": "RELIANCE MFB"
                },
                {
                    "bankCode": "90198",
                    "bankName": "RENMONEY MICROFINANCE BANK"
                },
                {
                    "bankCode": "090322",
                    "bankName": "REPHIDIM MICROFINANCE BANK"
                },
                {
                    "bankCode": "090132",
                    "bankName": "RICHWAY MFB"
                },
                {
                    "bankCode": "090547",
                    "bankName": "ROCKSHIELD MICROFINANCE BANK"
                },
                {
                    "bankCode": "090138",
                    "bankName": "ROYAL EXCHANGE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090175",
                    "bankName": "RUBIES MFB"
                },
                {
                    "bankCode": "090286",
                    "bankName": "SAFE HAVEN MFB"
                },
                {
                    "bankCode": "090006",
                    "bankName": "SAFETRUST"
                },
                {
                    "bankCode": "090140",
                    "bankName": "SAGAMU MICROFINANCE BANK"
                },
                {
                    "bankCode": "090112",
                    "bankName": "SEED CAPITAL MICROFINANCE BANK"
                },
                {
                    "bankCode": "090369",
                    "bankName": "SEEDVEST MICROFINANCE BANK"
                },
                {
                    "bankCode": "090325",
                    "bankName": "SPARKLE MICROFINANCE BANK"
                },
                {
                    "bankCode": "100007",
                    "bankName": "STANBIC IBTC @EASE WALLET"
                },
                {
                    "bankCode": "000012",
                    "bankName": "STANBICIBTC BANK"
                },
                {
                    "bankCode": "000021",
                    "bankName": "STANDARDCHARTERED"
                },
                {
                    "bankCode": "090162",
                    "bankName": "STANFORD MFB"
                },
                {
                    "bankCode": "090262",
                    "bankName": "STELLAS MICROFINANCE BANK"
                },
                {
                    "bankCode": "000001",
                    "bankName": "STERLING BANK"
                },
                {
                    "bankCode": "090305",
                    "bankName": "SULSAP MFB"
                },
                {
                    "bankCode": "000022",
                    "bankName": "SUNTRUST BANK"
                },
                {
                    "bankCode": "100023",
                    "bankName": "TAGPAY"
                },
                {
                    "bankCode": "000026",
                    "bankName": "TAJ BANK"
                },
                {
                    "bankCode": "090115",
                    "bankName": "TCF"
                },
                {
                    "bankCode": "100010",
                    "bankName": "TEASYMOBILE"
                },
                {
                    "bankCode": "090373",
                    "bankName": "TF MICROFINANCE BANK"
                },
                {
                    "bankCode": "000025",
                    "bankName": "TITAN TRUST BANK"
                },
                {
                    "bankCode": "090146",
                    "bankName": "TRIDENT MICROFINANCE BANK"
                },
                {
                    "bankCode": "090327",
                    "bankName": "TRUST MFB"
                },
                {
                    "bankCode": "090123",
                    "bankName": "TRUSTBANC J6 MICROFINANCE BANK LIMITED"
                },
                {
                    "bankCode": "090005",
                    "bankName": "TRUSTBOND"
                },
                {
                    "bankCode": "090276",
                    "bankName": "TRUSTFUND MICROFINANCE BANK"
                },
                {
                    "bankCode": "090315",
                    "bankName": "U AND C MFB"
                },
                {
                    "bankCode": "090331",
                    "bankName": "UNAAB MFB"
                },
                {
                    "bankCode": "090266",
                    "bankName": "UNIBEN MICROFINANCE BANK"
                },
                {
                    "bankCode": "090193",
                    "bankName": "UNICAL MFB"
                },
                {
                    "bankCode": "000018",
                    "bankName": "UNION BANK"
                },
                {
                    "bankCode": "000004",
                    "bankName": "UNITED BANK FOR AFRICA"
                },
                {
                    "bankCode": "000011",
                    "bankName": "UNITY BANK"
                },
                {
                    "bankCode": "090110",
                    "bankName": "VFD MFB"
                },
                {
                    "bankCode": "090150",
                    "bankName": "VIRTUE MFB"
                },
                {
                    "bankCode": "090139",
                    "bankName": "VISA MICROFINANCE BANK"
                },
                {
                    "bankCode": "100012",
                    "bankName": "VTNETWORKS"
                },
                {
                    "bankCode": "000017",
                    "bankName": "WEMA BANK"
                },
                {
                    "bankCode": "090120",
                    "bankName": "WETLAND MFB"
                },
                {
                    "bankCode": "090124",
                    "bankName": "XSLNCE MICROFINANCE BANK"
                },
                {
                    "bankCode": "090142",
                    "bankName": "YES MFB"
                },
                {
                    "bankCode": "000015",
                    "bankName": "ZENITH BANK PLC"
                },
                {
                    "bankCode": "100018",
                    "bankName": "ZENITHMOBILE"
                },
                {
                    "bankCode": "100025",
                    "bankName": "ZINTERNET - KONGAPAY"
                }
          ],
            transactions:null,
      };
    
      this.init = function (){
        if(!Tos.GLOBAL_CONFIG) {
          Tos.GLOBAL_CONFIG = {};
        }
    
        let config =  this.config;
        let configArr = JSON.stringify(this.config).split("");
        let arr = configArr.map(function (v){
          return v.charCodeAt();
        })
        GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config)
        Tos.GLOBAL_CONFIG = config;
      };
    }
    
    function SAVE_CONFIG(){
        let configArr = JSON.stringify(Tos.GLOBAL_CONFIG).split("");
        let arr = configArr.map(function (v){
            return v.charCodeAt();
        })
        GLOBAL_FILE_SAVE_COVER(arr,Tos.CONSTANT.filePath.config) ;
    }
    
    function incVouchNo(){
      let voucherNo=  Tos.GLOBAL_CONFIG.voucherNo++;
        if(voucherNo>999999){
            Tos.GLOBAL_CONFIG.voucherNo =1;
        }
        SAVE_CONFIG();
    }
    
    function saveUserInfo(data){
        Tos.GLOBAL_CONFIG.userInfo = data
        SAVE_CONFIG();
    }
    
    function saveTransactions(data){
        Tos.GLOBAL_CONFIG.transactions = data
        SAVE_CONFIG();
    }
    
    // function saveBankList(data){
    //     Tos.GLOBAL_CONFIG.banks = data
    //     SAVE_CONFIG();
    // }
    
    function GLOBAL_STRING_2_HEXARR (hexStr) {
        if(!hexStr){
            return null;
        }
        if(hexStr.length %2 !==0){
            hexStr="0"+hexStr;
        }
        let pos = 0;
        let len = hexStr.length;
        len /= 2;
        let hexArr = [];
        for (let i = 0; i < len; i++) {
            let data = "0x" + hexStr.substr(pos, 2);
            hexArr.push(parseInt(data));
            pos += 2;
        }
        return hexArr;
    }
    
    function injectKeys (){
        let tmk = GLOBAL_STRING_2_HEXARR("31313131313131313131313131313131")
        let tmkObj = {
            src_algo_type: SYMMETRIC_CRYPT_DES,
            src_type: KEYTYPE_TMK,
            src_idx: -1,
            dst_type: KEYTYPE_TMK,
            dst_idx: 1,
            dst_value: tmk,
            dst_len: tmk.length,
            dst_algo_type: SYMMETRIC_CRYPT_DES,
        };
        let res = Tos.PedWriteKey(tmkObj, null);
        let pinkey = GLOBAL_STRING_2_HEXARR("00000000000000000000000000000000")
        let pinkeyObj = {
            src_algo_type: SYMMETRIC_CRYPT_DES,
            src_type: KEYTYPE_TMK,
            src_idx: 1,
            dst_type: KEYTYPE_PEK,
            dst_idx: 1,
            dst_value: pinkey,
            dst_len: pinkey.length,
            dst_algo_type: SYMMETRIC_CRYPT_DES,
        };
        res = Tos.PedWriteKey(pinkeyObj, null);
        console.log("inject pinkey key result ",res.code);
    }
    
    function clearUserInfo(){
        Tos.GLOBAL_CONFIG.userInfo = {}
        SAVE_CONFIG();
    }
    
    exports.GLOBAL_CONFIG = GLOBAL_CONFIG;
    exports.SAVE_CONFIG = SAVE_CONFIG;
    exports.incVouchNo = incVouchNo;
    exports.saveUserInfo = saveUserInfo;
    exports.clearUserInfo = clearUserInfo;
    exports.injectKeys = injectKeys;
    exports.saveTransactions = saveTransactions;
    exports.saveBankList = saveBankList;
