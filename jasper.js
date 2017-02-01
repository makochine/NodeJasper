/*======================================================================*
 * (C)Copyright ChenSoft 2015. All rights reserved.
 * 
 *      CCCC C HHHH HHH EEEEEEEE NNNN NNN  SSSSS S   OOOO   FFFFFFFF TTTTTTTT
 *     CC   CC  HH   H   EE       NN   N  SS    SS  OOO  O   FF      T  TT  T
 *   CCC    C  HH   H   EE    E  NNN  N  SS     S OOO   OO  FF    F    TT   
 *   CCC       HHHHHH   EEEEEEE  NNN  N   SSSSS   OOO    O  FFFFFFF    TT   
 *  CCC       HH   H   EE    E  NN N N       SSS OOO    O  FF    F    TT   
 *  CCC       HH   H   EE       NN  NN  S    SSS OOO   OO  FF         TT   
 *  CC    C  HH   H   EE    E  NN   N  SS   SSS  OOO  O   FF         TT   
 *   CCCCC  HHHH HHH EEEEEEEE NNNN NNN S SSSSS    OOOO   FFFF       TTTT  
 *
 *----------------------------------------------------------------------*/

/*======================================================================*
 *  モジュールのロード
 *----------------------------------------------------------------------*/
var websock = require('websocket.io');
var http = require('http');

/*======================================================================*
 *  設定ファイルのロード
 *----------------------------------------------------------------------*/
var config = require('./config.json');

/*======================================================================*
 *  例外発生時のお呪い
 *----------------------------------------------------------------------*/
process.on('uncaughtException', function(err) {
	console.log('uncaughtException => ' + err);
});

/*======================================================================*
 *  変数
 *----------------------------------------------------------------------*/
var http_server;
var ws;
var sessions = new Object();

/* -------------------------------------------------------------------- */

/*======================================================================*
 *  Main Routine
 *----------------------------------------------------------------------*/
function main()
{
	http_server = http.createServer();
	http_server.on('request', onHTTPRequest);
	http_server.listen(config.general.port, function() {
		console.log("# http server is listenning on port " + config.general.port);
	});
	console.log("HTTP server running");
	ws = websock.attach(http_server);

	console.log('Websocket server running');
}
main();

/*======================================================================*
 *  HTTPリクエスト受信時の処理
 *----------------------------------------------------------------------*/
function onHTTPRequest(req, res)
{
	console.log("=> http request comes.");
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write('Hello World\n');
	res.end();
}


/*======================================================================*
 *  Websoket接続時の処理
 *----------------------------------------------------------------------*/
ws.on('connection', function (con) {
	console.log("==> websocket connect comes.");
	var sinfo = new Object();
	sinfo.id = -1;
	sinfo.sock = con;
	sinfo.user = "nologin";
	con.sinfo = sinfo;
	con.on('message', function(data) {
		//  xxx
		var  json = JSON.parse(data);
		if(con.sinfo.user == "nologin")
		{
			//  only accept login command
			if(json.command!="login")
			{
				console.log("not login status, command must be 'login'.");
				return;
			}
			var ret = login(con, json);
			return;
		}

		switch(json.command)
		{
		case "adduser":
			console.log("command:adduser");
			break;
		default:
			console.log("session logined.");
			break;
		}
	});

	//  xxx

	//  クローズ時の処理
	con.on('close', function()
	{
		console.log("  #==> websocket session closed.");
		//  ログイン状態の場合はセッションを削除する
		if(con.logined==true)
		{
			var sinfo = sessions[con.id];
			console.log("       session info:");
			console.log("         user : ");
			console.log("");
			console.log("");
			delete sessions[con.sid];
		}
	});
});


/*======================================================================*
 *  login
 *----------------------------------------------------------------------*/
function login(con, json)
{
	var  ret=false;;

	console.log("try login");



	console.log("logn success.");
	ret = true;
	return ret;
}








