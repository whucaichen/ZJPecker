/**
 * Created by Chance on 16/12/15.
 */

var jsdom = require('jsdom');
var spawn = require('child_process').spawn;

function createHighchartsWindow(callback) {
    console.log("function createHighchartsWindow");

    var window = jsdom.jsdom().defaultView;
    window.SVGAngle = true;
    var document = window.document;

    window.onload = function () {
        var chart = document.createElement("div");
        chart.id = "chart";
        chart.style.width = "500px";
        chart.style.height = "400px";
        document.body.appendChild(chart);

        console.log("window", window.innerWidth);
        callback(window);
    };
}

function render(options, callback) {
    console.log("function render");
    createHighchartsWindow(function (window) {
        var document = window.document;
        var chart, svg, convert, buffer;

        try {
            var dom = document.getElementById("chart");
            console.log("dom", dom, dom.style.width);
            // chart = require("echarts").init(dom);
            var echarts = require("./../utils/client/echarts");
            chart= echarts.init(dom);
            chart.setOption(options);
            console.log("chart", chart);
        } catch (e) {
            console.error("err", e);
            callback(e, null);
            return;
        }
        svg = document.getElementById("chart").children().html();
        convert = spawn('convert', ['svg:-', 'png:-']);
        convert.stdin.write(svg);
        convert.stdin.end();
        convert.stdout.on('data', function (data) {
            try {
                var prevBufferLength = (buffer ? buffer.length : 0),
                    newBuffer = new Buffer(prevBufferLength + data.length);
                if (buffer) {
                    buffer.copy(newBuffer, 0, 0);
                }
                data.copy(newBuffer, prevBufferLength, 0);
                buffer = newBuffer;
            } catch (err) {
                callback(err, null);
            }
        });
        convert.on('exit', function (code) {
            callback(null, buffer);
        });
    });
}

module.exports.render = render;
