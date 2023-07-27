var express = require('express');
var app = express();
var http = require('http'),
	fs = require('fs'),
	ccav = require('./ccavutil.js'),
	qs = require('querystring'),
	ccavReqHandler = require('./ccavRequestHandler.js'),
	ccavResHandler = require('./ccavResponseHandler.js');



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
app.use(express.static('public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);


app.get('/about', function (req, res) {

	var data1 = req.query;
	var name = data1.amt;
	var name1 = data1.email;
	var name2 = data1.mobileno;

	// var name='10';
	// var name1="ckala5005@gmail.com";
	// var name2="9597993063";


	res.render('dataFrom.html', { name: name, name1: name1, name2: name2 });
	/*server.listen(3002,'192.168.1.49',function(){
		server.close(function(){
			server.listen(3002,'192.168.1.49')
		})
	})*/

	next();

});

app.post('/ccavRequestHandler', function (request, response) {
	ccavReqHandler.postReq(request, response);
});


app.post('/ccavResponseHandler', function (request, response) {
	ccavResHandler.postRes(request, response);
});

app.listen(3002);
console.log("Server listening at port 3004");
