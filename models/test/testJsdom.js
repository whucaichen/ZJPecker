/**
 * Created by Chance on 16/12/15.
 */

var jsdom = require("jsdom").jsdom;
var document = jsdom("hello world");
var window = document.defaultView;

console.log(window.document.documentElement.outerHTML);
// output: "<html><head></head><body>hello world</body></html>"
console.log(window.innerWidth);// output: 1024
console.log(typeof window.document.getElementsByClassName);// outputs: function