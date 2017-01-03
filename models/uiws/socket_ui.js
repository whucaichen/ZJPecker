/**
 * Created by Chance on 16/11/14.
 */

var io = require("socket.io-client");

var ui = io.connect("http://localhost:8080/ui");
// var ui = io.connect("http://10.34.10.245:8080/ui");
ui.on("connect", function () {
    console.log("connect");
});
ui.on('message', function (data) {
    console.log(data.toString());
});
ui.on('disconnect', function () {
    console.log("disconnect");
});
ui.on('DataUpdate', function (data) {
    console.log(data);
});


function ImportTestCaseLib() {
    ui.emit("ImportTestCaseLib", {
        "head": {
            "action": "ImportTestCaseLib"
        },
        "body": {
            caseLibFileName: "haha.zip"
        }
    }, function (result) {
        console.log("--------------------------------------------------ImportTestCaseLib");
        console.log(result);
    });
}
function QueryCaseLib() {
    ui.emit("QueryCaseLib", {
        "head": {
            "action": "QueryCaseLib"
        },
        "body": {
            "caseLibId": "582559b0bbc3b00564141d2c"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseLib");
        console.log(result);
    });
}
function QueryCaseLibP() {
    ui.emit("QueryCaseLibP", {
        "head": {
            "action": "QueryCaseLibP"
        },
        "body": {
            caseLibName: "test",
            pageSize: 100,
            pageNum: 1
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseLibP");
        console.log(result);
    });
}
function DeleteCaseLib() {
    ui.emit("DeleteCaseLib", {
        "head": {
            "action": "DeleteCaseLib"
        },
        "body": {
            caseLibId: "586b56305659372d5c9f0ed2"
        }
    }, function (result) {
        console.log("--------------------------------------------------DeleteCaseLib");
        console.log(result);
    });
}
function QueryCaseLibGroup() {
    ui.emit("QueryCaseLibGroup", {
        "head": {
            "action": "QueryCaseLibGroup"
        },
        "body": {
            caseLibId: "582559b0bbc3b00564141d2c"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseLibGroup");
        console.log(result);
    });
}
function QueryCaseLibDetail() {
    ui.emit("QueryCaseLibDetail", {
        "head": {
            "action": "QueryCaseLibDetail"
        },
        "body": {
            "caseLibId": "582559b0bbc3b00564141d2c",
            "groupName": ["test0", "test1", "test2"]
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseLibDetail");
        console.log(JSON.stringify(result));
    });
}
function QueryCases() {
    ui.emit("QueryCases", {
        "head": {
            "action": "QueryCases"
        },
        "body": {
            "caseLibId": "586365fd01edf53968b915fc"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCases");
        console.log(JSON.stringify(result));
    });
}
function QueryCaseDetail() {
    ui.emit("QueryCaseDetail", {
        "head": {
            "action": "QueryCaseDetail"
        },
        "body": {
            "caseId": "58257ff209156a069cd3cf0e"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseDetail");
        console.log(result);
    });
}
function CreateTestProject() {
    ui.emit("CreateTestProject", {
            "head": {
                "action": "CreateTestProject"
            },
            "body": {
                "projectName": "HAHA",
                "deviceType": "Hitachi 2845V",
                "testSite": "20 ,1C ,Software Base ,Nan Shan, ShenZhen,China",
                "tester": "Susan",
                "environment": {
                    "SPVersion": "HT2845A-001",
                    "APVersion": "ATMC-0001",
                    "OSVersion": "Windows 7",
                    "systemPatchVersion": "service pack 3"
                },
                "caseItems": [
                    {"_id": "586365fd01edf53968b915fd"},
                    {"_id": "586365fd01edf53968b915fe"},
                    {"_id": "586365fd01edf53968b915ff"},
                    {"_id": "586365fd01edf53968b91600"}
                ]

            }
        }
        , function (result) {
            console.log("--------------------------------------------------createTestProject");
            console.log(result);
        });
}
function DeleteTestProject() {
    ui.emit("DeleteTestProject", {
        "head": {
            "action": "DeleteTestProject"
        },
        "body": {
            projectId: "5840cd265c146629a027724f"
        }
    }, function (result) {
        console.log("--------------------------------------------------DeleteTestProject");
        console.log(result);
    });
}
function QueryTestProject() {
    ui.emit("QueryTestProject", {
        "head": {
            "action": "QueryTestProject"
        },
        "body": {
            projectName: "projectName0",
            pageSize: 100,
            pageNum: 1
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryTestProject");
        id = result.testProjectList[0]._id;
        console.log(result);
    });
}
function QueryTestProjectDetail() {
    ui.emit("QueryTestProjectDetail", {
        "head": {
            "action": "QueryTestProjectDetail"
        },
        "body": {
            projectId: "582d694b22fbf30768b62636"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryTestProjectDetail");
        console.log(result);
    });
}
function QueryTestProjectLog() {
    ui.emit("QueryTestProjectLog", {
        "head": {
            "action": "QueryTestProjectLog"
        },
        "body": {
            projectId: "582d694b22fbf30768b62636"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryTestProjectLog");
        console.log(JSON.stringify(result));
    });
}
function Login() {
    ui.emit("Login", {
        "head": {
            "action": "Login"
        },
        "body": {
            "username": "test0",
            "password": "test0"
        }
    }, function (result) {
        console.log("--------------------------------------------------Login");
        console.log(result);
    });
}
function StartTest() {
    ui.emit("StartTest", {
        "head": {
            "action": "StartTest"
        },
        "body": {
            "projectId": "582d694b22fbf30768b62636"
            // "projectId": "584013685393e32a48247831"

        }
    }, function (result) {
        console.log("--------------------------------------------------StartTest");
        console.log(result);
    });
}
function SuspendTest() {
    ui.emit("SuspendTest", {
        "head": {
            "action": "SuspendTest"
        },
        "body": {
            "projectId": "582d694b22fbf30768b62636"

        }
    }, function (result) {
        console.log("--------------------------------------------------SuspendTest");
        console.log(result);
    });
}
function ResumeTest() {
    ui.emit("ResumeTest", {
        "head": {
            "action": "ResumeTest"
        },
        "body": {
            "projectId": "582d694b22fbf30768b62636"

        }
    }, function (result) {
        console.log("--------------------------------------------------ResumeTest");
        console.log(result);
    });
}
function StopTest() {
    ui.emit("StopTest", {
        "head": {
            "action": "StopTest"
        },
        "body": {
            "projectId": "582d694b22fbf30768b62636"

        }
    }, function (result) {
        console.log("--------------------------------------------------StopTest");
        console.log(result);
    });
}
function RestartTest() {
    ui.emit("RestartTest", {
        "head": {
            "action": "RestartTest"
        },
        "body": {
            "projectId": "582d694b22fbf30768b62636"

        }
    }, function (result) {
        console.log("--------------------------------------------------RestartTest");
        console.log(result);
    });
}
function TransFile() {
    ui.emit("TransFile", {
        "head": {
            "action": "TransFile"
        },
        "body": {
            "fileName": "appPublicLib-0.0.1.js",
            "data": "hello"

        }
    }, function (result) {
        console.log("--------------------------------------------------TransFile");
        console.log(result);
    });
}

process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        switch (chunk.trim()) {
            case "0":
                process.exit(1);
            case "1":
                //QueryCaseLib();
                QueryCaseLibP();
                break;
            case "2":
                DeleteCaseLib();
                // QueryCaseLibGroup();
                break;
            case "3":
                // QueryCaseLibDetail();
                ImportTestCaseLib();
                break;
            case "4":
                QueryCases();
                break;
            case "5":
                QueryCaseDetail();
                break;
            case "6":
                CreateTestProject();
                break;
            case "7":
                QueryTestProject();
                break;
            case "8":
                QueryTestProjectDetail();
                break;
            case "9":
                QueryTestProjectLog();
                break;
            case "10":
                Login();
                break;
            case "11":
                DeleteTestProject();
                break;
            case "a":
                StartTest();
                break;
            case "b":
                SuspendTest();
                break;
            case "c":
                ResumeTest();
                break;
            case "d":
                StopTest();
                break;
            case "e":
                RestartTest();
                break;
            case "f":
                TransFile();
                break;
            default:
                console.log("default");
        }
    }
});
