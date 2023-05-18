
async function getData1(dir) {
	var data = require("./"+dir);
	return data;
}
module.exports={ getData1 };
