function noticeDatetime() {

	try {
		// current time
		var now = new Date();
			
		if (0 == now.getSeconds()) {
			// create message HH:mm:SS	
			var msg = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
			Chatroom.publishCreate({
				id: 9999,
				name: 'server',
				message: 'push now [' + msg + ']',
			});
		}
	} catch(e) {
		console.log(e);
	}
}

module.exports.exec = function() {
	setInterval(noticeDatetime, 1000);
}

