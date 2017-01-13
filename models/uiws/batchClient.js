/**
 * Created by Chance on 17/01/06.
 */

var child = require("child_process");

console.log("请输入你想执行的操作序号：\n",
    "0.退出程序；\n",
    "1.启动AutoClient；\n"
);
process.stdin.setEncoding("utf8");
process.stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        var array = chunk.trim().split(/\s+/);
        switch (array[0]) {
            case "0":
                process.exit(1);
            case "1":
                child.fork("./autoClient.js", array.slice(1));
                break;
            default:
                console.log("无效的菜单选项.");
        }
    }
});