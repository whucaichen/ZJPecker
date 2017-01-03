/**
 * Created by Chance on 16/12/06.
 */

var formidable = require('formidable'),
    http = require('http'),
    fs = require('fs'),
    TAG = "TAG: ";

http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';		//设置编辑
        form.uploadDir = "../../temp/";	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
                res.write(err);
                return;
            }
            console.log(TAG, JSON.stringify(files));
            var fileName = files.upload.name;
            var fileType = files.upload.type;

            if (fileName.length == 0) {
                console.log("只支持png和jpg格式图片");
                res.write("文件类型错误");
                res.end();
                return;
            }
            // var avatarName = Math.random() + '.' + "png";
            var newPath = form.uploadDir + fileName;
            fs.renameSync(files.upload.path, newPath);  //重命名

            res.writeHead(200, {'content-type': 'text/plain'});
            console.log("上传成功");
            res.write("upload successfully");
            res.end();
            return;
        });

        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
}).listen(8080);