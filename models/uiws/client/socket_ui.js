/**
 * Created by Chance on 16/11/14.
 */

var io = require("socket.io-client");

var ui = io.connect("http://localhost:8080/ui");
//var ui = io.connect("http://10.34.10.245:8080/ui");
ui.on("connect", function () {
    console.log("connect");
});
ui.on('message', function (data) {
    console.log(data.toString());
});
ui.on('disconnect', function () {
    console.log("disconnect");
});

function QueryCaseLib() {
    ui.emit("QueryCaseLib", {
        "head": {
            "action": "QueryCaseLib"
        },
        "body": {
            "caseLibId": "51f7be1cd6189a56c399d3bf"
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
            caseLibName: "test0",
            pageSize: 100,
            pageNum: 1
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCaseLibP");
        console.log(result);
    });
}
function QueryCaseLibGroup() {
    ui.emit("QueryCaseLibGroup", {
        "head": {
            "action": "QueryCaseLibGroup"
        },
        "body": {
            //"caseLibId": "51f7be1cd6189a56c399d3bf",
            //caseLibId: "test0"
            caseLibId: ".*test.*"
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
            "caseLibId": "test0",
            "groupName": ["test0","test1","test2"]
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
            "caseLibId": "582559b0bbc3b00564141d2c"
            // caseLibId: "test0"
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryCases");
        console.log(result);
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
function createTestProject() {
    ui.emit("createTestProject", {
        "head": {
            "action": "createTestProject"
        },
        "body": {
            //"caseId": "test0"
            projectName:"projectName0",
            "cases" : [{"caseId":"test0"},{"caseId":"test1"},{"caseId":"test2"},{"caseId":"test3"}]
        }
    }, function (result) {
        console.log("--------------------------------------------------createTestProject");
        console.log(result);
    });
}

var id;
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
        console.log(id);
        console.log(result);
    });
}
function QueryTestProjectDetail() {
    ui.emit("QueryTestProjectDetail", {
        "head": {
            "action": "QueryTestProjectDetail"
        },
        "body": {
            projectId: id
        }
    }, function (result) {
        console.log("--------------------------------------------------QueryTestProjectDetail");
        console.log(result);
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
//console.log("00");
//setTimeout(function(){ui.disconnect()}, 10000);
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
                QueryCaseLibGroup();
                break;
            case "3":
                QueryCaseLibDetail();
                break;
            case "4":
                QueryCases();
                break;
            case "5":
                QueryCaseDetail();
                break;
            case "6":
                createTestProject();
                break;
            case "7":
                QueryTestProject();
                break;
            case "8":
                QueryTestProjectDetail();
                break;
            case "9":
                Login();
                break;
            default:
                console.log("default");
        }
    }
});
