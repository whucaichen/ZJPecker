var fs = require('fs');
var crypto = require('crypto');
var util = require('util');

function wsapcrypt(){
	function getDesMac(fileData){
		var bufferKey = new Buffer(8);
		bufferKey[0] = 0x00;
		bufferKey[1] = 0x00;
		bufferKey[2] = 0x00;
		bufferKey[3] = 0x0a;
		bufferKey[4] = 0x24;
		bufferKey[5] = 0x69;
		bufferKey[6] = 0x20;
		bufferKey[7] = 0x41;
		
		var iv = new Buffer(8);
		iv[0] = 0x00;
		iv[1] = 0x00;
		iv[2] = 0x00;
		iv[3] = 0x00;
		iv[4] = 0x00;
		iv[5] = 0x00;
		iv[6] = 0x00;
		iv[7] = 0x00;
		
		var padLength = ((fileData.length + 7)/8)*8;
		var fileContent = new Buffer(padLength);
		for(var index = 0; index < fileData.length; index++){
			fileContent[index] = fileData[index];
		}
		for(var index = fileData.length; index < padLength; index++){
			fileContent[index] = 0x00;
		}
		
		var cipher = crypto.createCipheriv('des-cbc', bufferKey, iv);
		cipher.setAutoPadding(true);
		var ciph = cipher.update(fileContent, 'utf-8', 'hex');
        ciph  += cipher.final('hex');
		
		delete bufferKey;
		delete iv;
		delete fileContent;
		
		return ciph.slice(ciph.length-32, ciph.length-16).toString().toUpperCase();
	}
	
	this.readFileSync = function(filePath){
		var fileContent = fs.readFileSync(filePath);
		
		if(fileContent.length < 16){
			return fileContent.toString('utf-8');
		}
		
		var byPadChar = 0x35;
		var szInnerMac = '';
		for(var index = 0; index < 16; index++){
			szInnerMac += String.fromCharCode(fileContent[index]^byPadChar);
		}
		//console.log('szInnerMac:' + szInnerMac);
		
		var fileLength = fileContent.length-16;
		var fileEncData = new Buffer(fileLength);
		
		for(var index = 0; index < fileLength; index++){
			fileEncData[index] = fileContent[16+index] ^ byPadChar;
		}
		//console.log('fileEncData:' + fileEncData.toString());
		
		var fileContentMac = getDesMac(fileEncData);
		delete fileEncData;
		//console.log('fileContentMac:' + util.inspect(fileContentMac));
		if(szInnerMac != fileContentMac){
			return fileContent;
		}
				
		return fileEncData;
	}
};

module.exports = wsapcrypt;