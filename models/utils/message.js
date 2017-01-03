/**
 * Created by Chance on 16/12/06.
 */

var varLogin = {
    "msgid": "abcdef0123456789",
    "msgtype": "request",
    "processid": "login",
    "request": {
        "loginid": "ZJPecker",
        "masterkey": "abcdef0123456789",
        "mastercode": "abcdef0123456789",
        "mackey": "abcdef0123456789",
        "maccode": "abcdef0123456789"
    }
};

var click = {
    "head": {
        "cmdCode": "010001",
        "requestId": "1000010101010101010",
        "tranTime": "2016-08-30 14:36:20"
    },
    "body": {
        "type": "1",
        "fromId": "aa",
        "destination": "atmclient",
        "action": "click",
        "clickName": "确认"
    }
};
var getHtml = {
    "head": {
        "cmdCode": "010001",
        "requestId": "1000010101010101010",
        "tranTime": "2016-08-30 14:36:20"
    },
    "body": {
        "type": "1",
        "fromId": "aa",
        "destination": "atmclient",
        "action": "getHtml"
    }
};
var capture = {
    "head": {
        "cmdCode": "910001",
        "requestId": "1000010101010101010",
        "tranTime": "2016-08-30 14:36:20"
    },
    "body": {
        "type": "1",
        "captureId": "atmclient",
        "filePath": "case-01\\image\\",
        "fileName": "case-01.jpg"
    }
};
var copy = {
    "head": {
        "cmdCode": "910002",
        "requestId": "1000010101010101010",
        "tranTime": "2016-08-30 14:36:20"
    },
    "body": {
        "type": "1",
        "fileType": "0",
        "filePath": "case-01\\"
    }
};
var upload = {
    "head": {
        "cmdCode": "910003",
        "requestId": "1000010101010101010",
        "tranTime": "2016-08-30 14:36:20"
    },
    "body": {
        "type": "1",
        "fileType": "0",
        "filePath": "case-01\\"
    }
};

var InsertCardByType = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "InsertCardByType",
        "actiondata": {
            "cardtype": "VisaCard"
        }
    }
};
var InsertCardWithData = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "InsertCardWithData",
        "actiondata": {
            "track1": "abcdef0123456789",
            "track2": "abcdef0123456789",
            "track3": "abcdef0123456789",
            "chip": "abcdef0123456789"
        }
    }
};
var TakeCard = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "TakeCard",
        "actiondata": {}
    }
};
var SetModuleStatus_IDC = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "SetModuleStatus",
        "actiondata": {
            "modulename": "IDC",
            "statusdata": {
                "fwDevice": "WFS_IDC_DEVONLINE",
                "fwMedia": "WFS_IDC_MEDIAPRESENT",
                "fwRetainBin": "WFS_IDC_RETAINBINOK",
                "fwSecurity": "WFS_IDC_SECOPEN",
                "usCards": 0,
                "fwChipPower": "WFS_IDC_CHIPONLINE"
            }
        }
    }
};
var SetModuleCapabilities_IDC = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "SetModuleCapabilities",
        "actiondata": {
            "modulename": "IDC",
            "capdata": {
                "fwType": "WFS_IDC_TYPEMOTOR",
                "bCompound": "TRUE",
                "fwReadTracks": "WFS_IDC_TRACK1",
                "fwWriteTracks": "WFS_IDC_TRACK1",
                "fwChipProtocols": "WFS_IDC_CHIPT15",
                "usCards": 66,
                "fwSecType": "WFS_IDC_SECCIM86",
                "fwPowerOnOption": "WFS_IDC_RETAIN",
                "fwPowerOffOption": "WFS_IDC_RETAIN",
                "fwWriteMode": "WFS_IDC_AUTO",
                "fwChipPower": "WFS_IDC_CHIPPOWERWARM"
            }
        }
    }
};

var InputPassword = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "InputPassword",
        "actiondata": {
            "encdata": "7|5|9|4|F2|3|4"
        }
    }
};
var SetModuleStatus_PIN = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "SetModuleStatus",
        "actiondata": {
            "modulename": "PIN",
            "statusdata": {
                "fwDevice": "WFS_PIN_DEVONLINE",
                "fwEncStat": "WFS_PIN_ENCREADY"
            }
        }
    }
};
var SetModuleCapabilities_PIN = {
    "head": {
        "appid": "ZJPecker",
        "cmdcode": "010001",
        "requestid": " FE09875DCA453345FE09875DCA453345"
    },
    "cmddata": {
        "actionname": "SetModuleCapabilities",
        "actiondata": {
            "modulename": "PIN",
            "capdata": {
                "fwType": "WFS_PIN_TYPEEPP",
                "bCompound": "TRUE",
                "usKeyNum": 6,
                "fwAlgorithms": "WFS_PIN_CRYPTDESECB",
                "fwValidationAlgorithms": "WFS_PIN_DES",
                "fwKeyCheckModes": "WFS_PIN_BANKSYS"
            }
        }
    }
};