/**
 * Created by Chance on 17/02/08.
 */

var TAG = function () {
    return "[report.js](" + new Date().toLocaleTimeString() + "): ";
};
var fs = require("fs");
var path = require("path");

module.exports.generateReport = function (data) {
    var testData = {
        "date": new Date().toLocaleDateString(),
        "deviceType": data.deviceType,
        "testSite": data.testSite,
        "projectName": data.projectName,
        "testStartTime": data.testStartTime,
        "testEndTime": data.testEndTime,
        "Tester": data.Tester,
        "APVersion": data.environment && data.environment.APVersion,
        "OSVersion": data.environment && data.environment.OSVersion,
        "SPVersion": data.environment && data.environment.SPVersion,

        "cases": [
            {
                "caseCaption": "caseCaption",
                "groupName": "groupName",
                "caseCaption": "caseCaption",
                "caseDeveloper": "caseDeveloper",
                "description": "description",
                "mediaType": "mediaType",
                "expectation": "expectation",
                "caseStatus": "caseStatus",
                "result": "result"
            }
        ]
    };

    try {
        fs.readFile(path.join(__dirname, "../res/report.json"), function (err, str) {
            if (err) {
                console.error(TAG(), err);
                return;
            }
            str = JSON.parse(str.toString());
            for (var i in str) {
                testData[str[i]] && (str[i] = testData[str[i]]);
            }
            // console.log(str);

            var generateDocx = require('generate-docx');
            var reportDir = path.join(__dirname, "../../temp/caseFiles/" + testData["projectName"]);
            !fs.existsSync(reportDir) && fs.mkdirSync(reportDir);
            var options = {
                template: {
                    filePath: path.join(__dirname, '../res/report.docx'),
                    data: str
                },
                save: {
                    filePath: path.join(reportDir, testData["projectName"] + "-测试报告.docx")
                }
            };
            generateDocx(options, function (error, message) {
                if (error) {
                    console.error(TAG(), error)
                } else {
                    console.log(TAG(), message)
                }
            });
        });
    } catch (e) {
        console.error(TAG(), e.stack);
    }
};
