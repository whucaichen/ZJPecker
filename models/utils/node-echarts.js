/**
 * Created by Chance on 16/12/19.
 */

var fs = require('fs');
var path = require("path");
var echarts = require("echarts");
var Canvas = require("canvas");

echarts.setCanvasCreator(function () {
    var canvas = new Canvas(128, 128);
    return canvas;
});
var getEChart = function (options, callback) {
    var myEChart = echarts.init(new Canvas(600, 400));
    myEChart.setOption(options);

    var data = myEChart.getDom().toBuffer();
    var uuid = require("./crypt").getUuid(16, 16);
    var chart = path.resolve(__dirname, "../../temp/charts/", uuid) + ".png";
    var folder = chart.substring(0, chart.lastIndexOf("\\"));
    !fs.existsSync(folder) && fs.mkdirSync(folder);
    fs.writeFileSync(chart, data);
    // fs.writeFile(chart, data, function (err) {
    //     if (err) {
    //         callback({retcode: "01", err: err});
    //         console.error(err);
    //         return;
    //     }
    callback({retcode: "00", chart: chart});
    // console.log("EChart:", chart);
    myEChart.dispose();
    // });
};

module.exports.getChart = getChart;
function getChart(data, callback) {
    //data是一个json对象，包含name和value数组，其它可选？
    var name = data.name;
    var value = data.value;
    if (!name && !value && name.length != 0
        && value.length != 0 && name.length != value.length) {
        callback({retcode: "02", err: "data内容不合法"});
        return;
    }
    var options = {
        title: {
            text: "测试结果饼状图",
            top: '5%',
            left: 'left'
        },
        legend: {
            orient: 'vertical',
            top: '25%',
            left: 'left',
            itemGap: 25,
            data: []
        },
        series: [{
            // name: "测试结果",
            type: 'pie',
            radius: '80%',
            center: ['55%', '55%'],
            data: []
        }]
    };
    options.series[0].data = [
        {itemStyle: {normal: {color: 'rgba(0, 255, 0, 0.6)'}}},
        {itemStyle: {normal: {color: 'rgba(0, 0, 255, 0.6)'}}},
        {itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.6)'}}}
    ];
    var total = 0;
    value.forEach(function (name) {
        total += name;
    });
    for (var i = 0; i < value.length; i++) {
        options.series[0].data[i].value = value[i];
        var per = (value[i] * 100 / total);
        per = roundLen(per, 2);
        // var per = (value[i] * 100 / total).toString();
        // if (per.indexOf(".") > 0) {
        //     per = per.substring(0, per.indexOf(".") + 2);
        // }
        // per = formatLen(per, 4, " ");
        options.series[0].data[i].name = name[i] + ":" + per + "%";
        options.legend.data[i] = name[i] + ":" + per + "%";
    }
    // options.legend.data = name;
    getEChart(options, callback);
}

var formatLen = function (num, length, cover) {
    !length && (length = 0);
    !cover && (cover = "0");
    return ('' + num).length < length
        ? ((new Array(length + 1)).join(cover) + num).slice(-length)
        : '' + num;
};
var roundLen = function (num, length) {
    if (typeof num != "number") return;
    var numStr = "" + num;
    if (numStr.indexOf(".") == -1) return num;
    !length && (length = 0);
    var mult = Math.pow(10, length);
    return Math.round(num * mult) / mult;
};

var options = {
    title: {
        text: '测试结果饼状图',
        link: 'http://www.zjft.com/',
        subtext: '副标题',
        top: '5%',
        left: 'left'
    },//
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        top: '20%',
        left: 'left',
        itemGap: 25,
        data: ['OK', 'NT', 'NG']
    },
    series: [
        {
            name: '测试结果',
            type: 'pie',
            radius: '80%',
            center: ['55%', '55%'],
            data: [
                {value: 666, name: 'OK', itemStyle: {normal: {color: 'rgba(0, 255, 0, 0.6)'}}},
                {value: 233, name: 'NT', itemStyle: {normal: {color: 'rgba(0, 0, 255, 0.6)'}}},
                {value: 007, name: 'NG', itemStyle: {normal: {color: 'rgba(255, 0, 0, 0.6)'}}}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 100,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
// getEChart(options, function (result) {
//     console.log(result);
// });
getChart({name: ["通过", "错误", "未测"], value: [30, 20, 10]}, function (result) {
    console.log(result);
});