/**
 * Created by Chance on 16/12/14.
 */

var fs = require('fs');
// var echarts = require("../bak/node-echarts_v1");
var options = {
    title: {
        text: '测试结果饼状图',
//            link: 'http://www.zjft.com/',
//            subtext: '副标题',
        top: '5%',
        left: 'left'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        top: '20%',
        left: 'left',
        itemGap: 25,
        data: ['OK', 'NT', 'NG'],
//            formatter: '{name}'
    },
    series: [
        {
            name: '测试结果',
            type: 'pie',
            radius: '70%',
            center: ['55%', '50%'],
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

// echarts.render(options, function (err, data) {
//     if (err) {
//         console.log('Error: ' + err);
//     } else {
//         fs.writeFile('./res/chart.png', data, function () {
//             console.log('Written to chart.png');
//         });
//     }
// });

var echarts = require("echarts");
var Canvas = require("canvas");

echarts.setCanvasCreator(function () {
    var canvas = new Canvas(128, 128);
    return canvas;
});

var chart = echarts.init(new Canvas(400, 400));
chart.setOption(options);

var data = chart.getDom().toBuffer();
fs.writeFile('./res/chart.png', data, function (err) {
    err && console.error(err);
    console.log('Written to chart.png');
    chart.dispose();
});

// var fs = require('fs'),
//     highcharts = require('node-highcharts'),
//     options = {
//         chart: {
//             width: 300,
//             height: 300,
//             defaultSeriesType: 'bar'
//         },
//         legend: {
//             enabled: false
//         },
//         title: {
//             text: 'Highcharts rendered by Node!'
//         },
//         series: [{
//             data: [1, 2, 3, 4, 5, 6]
//         }]
//     };
//
// highcharts.render(options, function (err, data) {
//     if (err) {
//         console.log('Error: ' + err);
//     } else {
//         fs.writeFile('./res/chart.png', data, function () {
//             console.log('Written to chart.png');
//         });
//     }
// });