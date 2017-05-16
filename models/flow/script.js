var fs = require('fs');
var map = require('./map');
var vm = require('vm');

function wsapscript() {
    this.mapScript = new map();				//存储名称及序号应对
    this.scriptFile = '';

    this.loadScriptFile = function (varPath) {
        console.log("loadAction loadScriptFile: " + varPath.toString());

        var content = fs.readFileSync(varPath.toString(), 'utf-8');

        // global.require = require;//有什么用？
        // global.exports = this.exports;
        // global.__filename = this.scriptFile;
        // global.__dirname = __dirname;
        // global.module = this;

        var arr_case = null;
        var varPrevFlag = "/*[";
        //	var varNextFlag = "]-----------------------------------------------------------*/";
        var varNextFlag = "]";
        var regexline = /\/\*\[.*(\]-+\*\/)$/gm;
        /* regex
         var 变量名 = /表达式/模式修饰符
         模式修饰符：g（全局模式，查找所有匹配字符串）
         m（多行匹配模式）
         表达式：$（行尾匹配）
         .（匹配换行符外任意字符）
         x*（匹配0个或任意多个x）
         x+（至少匹配1个x）

         */

        var varPreIndex = 0;
        var varPreFlagLength = 0;
        var varPreName = "";
        while (arr_case = regexline.exec(content)) {
            /*
             查找脚本文件中的所有以/*[AmountInput]-----------------------------*\/为标识开始的函数
             在字符串中执行匹配检索，返回结果数组
             第0个元素是与整个模式匹配的字符串，其它元素是与捕获组匹配的字符串（小括号"("从左至右编号）
             */
            if (varPreIndex != 0) {
                var varLength = arr_case.index - varPreIndex - varPreFlagLength;
                var varFileName = varPath.toString() + ":" + parseInt(varPreIndex);
                var varCurContent = content.substring(varPreIndex + varPreFlagLength, arr_case.index);
                varCurContent += "\r\nEntryAction();";
                // vm.createScript(code, [filename])，存储vm.Script对象
                var varScript = new vm.Script(varCurContent, {filename: varFileName, displayErrors: false});
                //
                this.mapScript.put(varPreName, varScript);
            }

            var varPrevIndex = arr_case[0].indexOf(varPrevFlag);
            var varNextIndex = arr_case[0].indexOf(varNextFlag);
            //console.log("varNextIndex:" + varPrevIndex + ",varNextIndex:" + varNextIndex);
            //截取函数标识的方括号的函数名，比如AmountInput
            varPreName = arr_case[0].substring(varPrevIndex + varPrevFlag.length, varNextIndex);
            varPreFlagLength = arr_case[0].length;
            varPreIndex = arr_case.index;//匹配项在字符串中的位置
        }

        if (varPreIndex != 0) {
            var varFileName = varPath.toString() + ":" + parseInt(varPreIndex);
            var varCurContent = content.substring(varPreIndex + varPreFlagLength);
            varCurContent += "\r\nEntryAction();";
            var varScript = new vm.Script(varCurContent, {filename: varPath.toString()});
            //
            this.mapScript.put(varPreName, varScript);
        }

        this.scriptFile = varPath;
    };
    /*
     功能：加载脚本文件
     参数：varPath-脚本文件路径
     */
    this.loadAction = function (varPath) {
        //console.log("loadAction varPath: " + varPath.toString());

        this.loadScriptFile(varPath);
    };

    /*
     功能：运行对应节点的脚本
     参数：varName-节点名称
     */
    this.runNode = function (varName) {
        // console.log("runNode varName: " + varName);

        var varScript = this.mapScript.get(varName);
        // console.log(typeof(varScript));
        if (typeof(varScript) === 'undefined') {
            return false;
        }

        try {
            varScript.runInThisContext();
        } catch (e) {
            console.error(varName, "节点运行错误：", e.stack);
            require("../utils/logFile").log(varName + "-节点运行错误：" + e.stack);
            throw new Error("案例执行异常");
        }
        return true;
    };

    this.getScript = function (varName) {
        return this.arrScript.get(varName);
    };
}
module.exports = wsapscript;
