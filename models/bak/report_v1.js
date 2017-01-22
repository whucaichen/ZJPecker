/**
 * Created by Chance on 16/12/20.
 */
var Tester;
var deviceType;
var testSite;

var fs = require('fs');
var path = require('path');
var charts = require("./node-echarts");
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
addDocData("文件编号：");
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

docx.putPageBreak();

/**
 * Chapter1
 */
addDocData("1 引言", null, {bold: true, font_size: 16});

addDocData("1.1 名词定义", null, {bold: true, font_size: 12});
addDocData([
    "ATM：自助设备，包含取款机、存款机、循环机、存取款一体机。",
    "ATMC：ATM控制系统，用于驱动自助设备的软件，实现与ATMP，ATMV的信息交换。",
    "WSAP：紫金公司的跨平台ATMC应用平台。",
    "SP：Service Provider，在本文中特指由各设备厂商提供的符合WOSA/XFS国际标准的硬件驱动。",
    "OK：表示测试结果符合要求",
    "NG：表示测试结果不符合要求",
    "NT：表示测试案例在本次测试中不需要进行的测试或未完成的测试。"
]);

/**
 * Chapter2
 */
addDocData("2 测试流程", null, {bold: true, font_size: 16});

addDocData("2.1 设备模块XFS自测", null, {bold: true, font_size: 12});
addDocData([
    "设备模块XFS自测是由设备生产厂商按照我行提出的设备模块技术要求进行自测试，以满足向我行提交设备测试的基本技术条件。",
    "在进行ATM选型测试之前，项目组发给各厂商XFS测试标准案例，由厂商根据XFS测试标准案例负责SP的测试。" +
    "厂商测试完成后，将测试结论、机器配置说明、设备操作手册及设备特性说明等提交给项目组，由项目组审核，" +
    "自测结果满足测试要求，才能进行技术测试；如不满足测试要求，则通知厂商停止本次测试。"
]);
addDocData("2.2 项目组XFS测试", null, {bold: true, font_size: 12});
addDocData([
    "项目组XFS测试是我行对厂商提交设备的技术基本条件审核性测试，测试案例、标准与设备模块XFS自测一致，以验证厂商自测的结果是否正确。",
    "设备模块XFS自测结束，由项目组负责对XFS案例进行全量测试，项目组XFS测试通过后，开始应用测试；若测试不通过，则通知厂商停止本次测试。"
]);
addDocData("2.3 应用测试", null, {bold: true, font_size: 12});
addDocData([
    "应用测试是在设备符合技术基本条件的基础上，安装跨平台ATMC软件，测试设备是否满足生产运行要求。",
    "XFS测试通过后，在设备上安装ATMC软件，使用模拟ATMP软件，测试人员根据测试计划的要求，按照应用测试案例进行应用测试。" +
    "应用测试中若发现存在较严重问题从而造成应用测试无法进行的，项目组可以根据具体情况通知厂商停止本次测试。应用测试结束后，" +
    "测试人员将测试结果提交项目组与厂商，项目组审核所存在问题，提出测试意见。如果建议继续测试，厂商对应用测试发现的问题进行修改，" +
    "回归测试通过后，再进行异常交易测试；如存在严重问题不宜继续测试，则通知厂商结束测试。"
]);
addDocData("2.4 性能及压力测试", null, {bold: true, font_size: 12});
addDocData([
    "性能及压力测试是测试设备在连续大交易量情况下的交易速度、资源消耗等的性能，以验证设备在实际生产情况下的稳定交易处理能力。",
    "性能及压力测试是在应用测试完成之后进行的，性能和压力测试目的是测试目标机器在长时间交易情况下对于系统资源的损耗情况以及自身的稳定性。" +
    "性能及压力测试全部完成之后，测试人员按照性能及压力测试数据分析要求对测试数据进行分析统计，提交项目组评核。"
]);
addDocData("2.5 异常交易测试", null, {bold: true, font_size: 12});
addDocData([
    "异常交易测试是通过模拟各种异常交易与故障，以测试设备在异常情况下的处理和恢复能力。",
    "在应用测试通过以后，参照自助设备异常交易测试案例，进行自助设备异常交易的测试。" +
    "本次测试中若发现存在较严重问题从而造成测试无法进行的，项目组可以根据具体情况通知厂商停止本次测试。" +
    "本测试结束后，测试人员将测试结果提交项目组与厂商，项目组审核存在问题，提出测试意见。如果建议继续测试，" +
    "厂商对本次测试中发现的问题进行修改，回归测试通过后，再进行性能压力测试；如存在严重问题不宜继续测试，则通知厂商结束测试。"
]);

/**
 * Chapter3
 */
addDocData("3 测试概况", null, {bold: true, font_size: 16});

addDocData("3.1 测试人员", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["测试人员", "李清泉"],
    ["厂商支持人员", "谢志杰"],
    ["银行支持人员", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("3.2 测试环境", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["测试银行", "平安银行"],
    ["测试地点", "平安银行科技开发中心"]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("3.3 测试时间", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["测试开始时间", "2015/11/02 10:46:19"],
    ["测试完成时间", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("3.4 测试设备", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["设备厂商", "恒银"],
    ["设备型号", "CASH80AWG"]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("3.5 测试平台信息", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["系统版本", "Microsoft Windows XP [Service Pack 3]"],
    ["CPU", "Intel(R) Core(TM)2 Duo CPU E8400@3.00GHz"],
    ["物理内存", "2GB"],
    ["虚拟内存", "2GB"],
    ["硬盘空间", "465.753441 GB"]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("3.7 设备逻辑模块映射", null, {bold: true, font_size: 12});
addDocData("3.6 设备模块属性", null, {bold: true, font_size: 12});
addDocData("3.8 设备特性配置", null, {bold: true, font_size: 12});

/**
 * Chapter4
 */
addDocData("4 测试过程", null, {bold: true, font_size: 16});

addDocData("4.1 测试任务CIM", null, {bold: true, font_size: 14});
addDocData("4.1.1 测试结果统计表", null, {bold: true, font_size: 12});
docx.createTable([
    [{opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}},
        {opts: {shd: {fill: "#aaaaaa"}}}, {opts: {shd: {fill: "#aaaaaa"}}}],
    ["通过案例数(OK)", 300, "所占比例(%)", "50%"],
    ["未通过案例数(NG)", 200, "所占比例(%)", "33.33%"],
    ["未测试案例数(NT)", 100, "所占比例(%)", "16.67%"],
    ["案例总数", "600", "", ""]
], {tableColWidth: 6666, tableAlign: "left", borders: true});
addDocData("4.1.2 未通过案例统计表", null, {bold: true, font_size: 12});
addDocData("4.1.3 测试结果统计图", null, {bold: true, font_size: 12});
charts.getChart({name: ["OK", "NG", "NT"], value: [300, 200, 100]}, function (result) {
    console.log(result);
    if (result && result.chart) {
        var pObj = docx.createP();
        pObj.addImage(result.chart);
    }
});

addDocData("4.2 测试任务IDC", null, {bold: true, font_size: 14});
addDocData("4.3 测试任务PIN", null, {bold: true, font_size: 14});
addDocData("4.4 测试任务RPR", null, {bold: true, font_size: 14});
addDocData("4.5 测试任务SIU", null, {bold: true, font_size: 14});
addDocData("4.6 测试任务VDM", null, {bold: true, font_size: 14});

var repName = "完整测试报告(" + new Date().toLocaleString() + ")";
var report = path.resolve(__dirname, "../../temp/reports/", repName) + ".docx";
var out = fs.createWriteStream(report);// 文件写入
out.on('close', function () {
    console.log('Finished to create the DOCX file!');
});
out.on('error', function (err) {
    console.log(err);
});
docx.generate(out);// 服务端生成word
var tempChart = path.resolve(__dirname, "../../temp/charts");
// deleteFolderRecursive(tempChart);


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

