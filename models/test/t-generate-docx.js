/**
 * Created by Chance on 17/02/08.
 */

var http = require('http');
var generateDocx = require('generate-docx');

// http.createServer(function (request, response) {
    var options = {
        template: {
            filePath: '../res/test.docx',
            data: {
                'title': 'This is the title',
                'description': 'Description is good',
                'body': 'My body is my temple'
            }
        },
        save: {
            filePath: '../res/tested.docx'
        }
    };

    generateDocx(options, function (error, message) {
        if (error) {
            console.error(error)
        } else {
            console.log(message)

            // response.writeHead(200, {"Content-Type": "application/msword"});
            // response.write(message.toString());
            // response.end();
        }
    });
// }).listen(8888);