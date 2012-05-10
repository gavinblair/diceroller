var mysql = require('mysql');
var config = {}

config.client = mysql.createClient({
	user: 'root',
	password: '',
});
module.exports = config;