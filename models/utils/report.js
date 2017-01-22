/**
 * Created by Chance on 16/12/20.
 */

// var testData = {
//     projectName: "",
//     projectName: "",
//     projectName: "",
//     projectName: "",
//     projectName: "",
// };

var fs = require('fs');
var path = require('path');
var officegen = require('officegen');

var docx = officegen('docx');

console.log('exportWord-------------');
docx.on('finalize', function (written) {
    console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
});
docx.on('error', function (err) {
    console.log(err);
});

/**
 * Cover
 */

var pObj = docx.createP();
pObj.addImage("logo.png", {cx: 220, cy: 60});
addLineBreak(5);

addDocData([
    "平安银行自助设备测试报告",
    "设备型号[CASH80AWG]"
], {align: 'center'}, {bold: true, font_face: 'Arial', font_size: 18});
addLineBreak(5);

var tableData = [
    ["作者", "", "编写时间", ""],
    ["审核", "", "审核日期", ""],
    ["批准", "", "批准日期", ""]
];
var tableStyle = {
    tableColWidth: 6666,
    // tableSize: "16",
    // tableColor: "#aaaaaa",
    // sz: "16",
    tableAlign: "left",
    borders: true
};
docx.createTable(tableData, tableStyle);
addLineBreak(7);

var pObj = docx.createP();
pObj.addImage("logol.png", {cx: 550, cy: 60});

docx.putPageBreak();

/**
 * Chapter1
 */
addDocData("1 引言", null, {bold: true, font_size: 16});
addDocData("1.1 编写目的", null, {bold: true, font_size: 14});
addDocData("在完成XX行“XXX补丁升级包”/“XXX全量安装包”/“XX系统”的测试任务后，对此测试项目的工作进行总结。（性能测试不适用，见性能测试报告模板）");
addDocData("1.2 项目背景", null, {bold: true, font_size: 14});
addDocData("项目背景简述。");
addDocData("1.3 定义", null, {bold: true, font_size: 14});
addDocData("简称定义");
addDocData("1.4 参考资料", null, {bold: true, font_size: 14});
addDocData(["XXX_标准版案例设计.xls"]);

/**
 * Chapter2
 */
addDocData("2 测试执行", null, {bold: true, font_size: 16});

addDocData("2.1 测试机构人员", null, {bold: true, font_size: 14});
docx.createTable([[{val: "测试执行人员", opts: {shd: {fill: "#aaaaaa"}}}, ""]],
    {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("2.2 测试环境", null, {bold: true, font_size: 14});
docx.createTable([[{val: "测试执行地点", opts: {shd: {fill: "#aaaaaa"}}}, ""]],
    {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("终端（C端必填）：");
docx.createTable([
    [{val: "应用基础版本", opts: {shd: {fill: "#aaaaaa"}}}, ""],
    [{val: "应用版本", opts: {shd: {fill: "#aaaaaa"}}}, ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("测试机型：");
docx.createTable([
    [{val: "CPU", opts: {shd: {fill: "#aaaaaa"}}}, ""],
    [{val: "内存", opts: {shd: {fill: "#aaaaaa"}}}, ""],
    [{val: "操作系统", opts: {shd: {fill: "#aaaaaa"}}}, ""],
    [{val: "SP版本", opts: {shd: {fill: "#aaaaaa"}}}, ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("服务端（服务端软件必填）：");
docx.createTable([
    [{val: "服务器端软件", opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["操作系统", ""],
    ["数据库", ""],
    ["通讯中间件", ""],
    ["Node.js", ""],
    ["基础版本", ""],
    ["测试版本号", ""],
    [{val: "测试客户端", opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["操作系统", ""],
    ["IE版本", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("测试卡种分析（C\\P必填）：");
docx.createTable([
    [{
        val: "本次测试所需卡种",
        opts: {shd: {fill: "#aaaaaa"}}
    }, {opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["卡种", "卡BIN", "是否具备"],
    ["本行借记卡1（磁条）", "", ""],
    ["本行借记卡2（芯片）", "", ""],
    ["本行借记卡2（复合）", "", ""],
    ["本行贷记卡1", "", ""],
    ["他行卡1", "", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});

addDocData("2.3 测试方法", null, {bold: true, font_size: 14});
addDocData([
    "[例如：",
    "测试工具：采用黑盒测试方法，手工进行功能测试。",
    "测试问题：使用“项目管理软件问题跟踪表”进行BUG的记录，待开发人员将BUG进行处理，且置为Fixed状态后，对新提交的版本进行回归测试。]"
], null, {bold: true, font_size: 14});
addDocData("2.4 测试时间", null, {bold: true, font_size: 14});
docx.createTable([
    [
        {val: "任务", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "时间", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "参与人员", opts: {shd: {fill: "#aaaaaa"}}}
    ],
    ["BETA1测试", "卡BIN", "是否具备"],
    ["BETA2测试", "", ""],
    ["BETA3测试", "", ""],
    ["BETA4测试", "", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});

/**
 * Chapter3
 */
addDocData("3 测试执行情况", null, {bold: true, font_size: 16});

addDocData("3.1功能测试/安装测试/SP测试", null, {bold: true, font_size: 14});
addDocData("本次升级涉及到的测试需求功能如下：");

addDocData("3.2 测试结果统计与分析", null, {bold: true, font_size: 14});
addDocData("3.2.1测试需求覆盖分析", null, {bold: true, font_size: 12});
addDocData([
    "【分析测试案例是否完全覆盖测试需求，把没有覆盖到的测试需求列出并给出原因。】",
    "测试需求包括：测试目标版本的功能需求；测试用例模板约定的其他共性测试需求；",
    "需求覆盖率=(被验证到的需求数量)/(总的需求数量)",
    "需求覆盖率="
]);
addDocData("3.2.2测试执行分析", null, {bold: true, font_size: 12});
addDocData("执行统计");
docx.createTable([
    [
        {val: "轮次", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "案例总数", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "OK案例数", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "NG案例数", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "NT案例数", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "案例执行率", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "测试通过率", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "总体通过率", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "版本质量评价", opts: {shd: {fill: "#aaaaaa"}}}
    ],
    ["BETA1测试", "", "", "", "", "", "", "", ""],
    ["BETA2测试", "", "", "", "", "", "", "", ""],
    ["测试结束总评", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData([
    "【案例执行率】=（案例总数-NT案例数）/案例总数",
    "【测试通过率】=OK案例数/(案例总数-NT案例数)",
    "【总体通过率】=OK案例数/ 案例总数",
    "",
    "【版本质量评价标准】"
]);
docx.createTable([
    [{val: "初始版本beta_1", opts: {shd: {fill: "#aaaaaa"}}}],
    ["", "优秀", "良好", "一般", "差"],
    ["测试案例通过率", ">=95%", "90%-95%", "80%-90%", "<80%"],
    ["备注：通过案例/总有效案例"],
    [{val: "中间版本beta_x", opts: {shd: {fill: "#aaaaaa"}}}],
    ["", "优秀", "良好", "一般", "差"],
    ["bug修复率", ">=95%", "90%-95%", "80%-90%", "<80%"],
    ["备注：bug修复率=本轮关闭缺陷数/(上轮遗留缺陷数+开发新增缺陷数)"],
    [{val: "测试结束总评", opts: {shd: {fill: "#aaaaaa"}}}],
    ["", "优秀", "良好", "一般", "差"],
    ["beta版本数", "1", "2-3", "4-5", ">5"],
    ["需求变更引起的beta数不计，一次需求变更，beta数-1（需求变更和测试问题同时存在的版本，beta数不变）"],
], {tableColWidth: 6666, tableAlign: "left", borders: true});

addDocData("3.3 不符合项报告", null, {bold: true, font_size: 14});
addDocData([
    "将非 closed问题项，整理记录到3.3.1表中：",
    "注：问题级别：",
    "高——导致系统死机或后续部分测试项功能不能实现；或存在重大安全或功能、性能缺陷，严重不合理，核心功能完全违反软件规范或业务规范；",
    "中——影响该部分的测试功能的完整性且需解决；",
    "低——轻度不合理，存在歧义，属于系统中的小bug，或根据测试过程发现的需要调整的部分，但并非急需解决。"
]);

addDocData("3.4 未测试项报告", null, {bold: true, font_size: 14});
addDocData([
    "测试案例中NT数：",
    "NT说明：[xxx环境不具备]"
]);

/**
 * Chapter4
 */
addDocData("4 测试结论", null, {bold: true, font_size: 16});
docx.createTable([
    [
        {val: "", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "检查点", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "结论", opts: {shd: {fill: "#aaaaaa"}}},
        {val: "备注", opts: {shd: {fill: "#aaaaaa"}}}
    ],
    ["1", "测试需求覆盖", "[是]", "[需求覆盖率=100%]"],
    ["1", "案例执行覆盖", "[是]", "[案例执行率=100%]"],
    ["1", "机型覆盖", "[是/否]", "[否：见3.2.3机型覆盖分析]"],
    ["1", "卡种覆盖", "[是/否]", "[否：见3.2.4卡种覆盖分析]"],
    ["1", "测试是否通过", "[是/否]", "[不存在严重缺陷/否：见3.3不符合项报告]"]
], {tableColWidth: 6666, tableAlign: "left", borders: true});

/**
 * Chapter5
 */
addDocData("5 风险评估", null, {bold: true, font_size: 16});
addDocData([
    "案例未覆盖的需求风险：xxxxx",
    "未执行案例的风险：xxxxx",
    "未解决的测试问题风险：xxxxx",
    "未遍历的生产机型的风险：xxxxx",
    "未遍历卡种的风险：xxxxx",
    "其他个人经验总结的风险：xxxxx"
]);

/**
 * Chapter5
 */
addDocData("6 项目经理意见", null, {bold: true, font_size: 16});


// var repName = "完整测试报告(" + new Date().toLocaleTimeString() + ")";
var repName = "完整测试报告.docx";
var report = path.resolve(__dirname, "../../temp/reports/", repName);
var out = fs.createWriteStream(report);// 文件写入
out.on('close', function () {
    console.log('Finished to create the DOCX file!');
});
out.on('error', function (err) {
    console.log(err);
});
docx.generate(out);// 服务端生成word


function addDocData(datas, pOpt, tOpt) {
    if (!datas) return;
    var pObj = docx.createP(pOpt);
    if (typeof datas === "string") {
        pObj.addText(datas, tOpt);
    } else if (Array.isArray(datas)) {
        for (var i = 0; i < datas.length; i++) {
            pObj.addText(datas[i], tOpt);
            pObj.addLineBreak();
        }
    }
}
function addLineBreak(num) {
    if (num > 0) {
        var pObj = docx.createP();
        for (var i = 0; i < num; i++) {
            pObj.addLineBreak();
        }
    }
}

function deleteFolderRecursive(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files && files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

