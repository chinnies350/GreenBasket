var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    qs = require('querystring');

exports.postReq = function(request,response){
    var body = '',
	workingKey = 'F7BB0C773282E1075FD9BAE97439726D',		//Put in the 32-Bit key shared by CCAvenues.6A0354607F0B1426EE68E27A1A14B516
	accessCode = 'AVLC69EC80BS95CLSB',		//Put in the access code shared by CCAvenues.AVGL68DK09CL38LGLC
	encRequest = '',
	formbody = '';
				
    request.on('data', function (data) {
	body += data;
	encRequest = ccav.encrypt(body,workingKey); 
	POST =  qs.parse(body);
	formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id='+POST.merchant_id+'&encRequest='+encRequest+'&access_code='+accessCode+'"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
    });

    request.on('end', function () {
        response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
    });
   return; 
};
