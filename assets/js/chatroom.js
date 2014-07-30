var MAX_MSG_LENGTH = 10;
$(function() {

	// onload event
	socket.get('/chatroom/enter',{'id': g_id, 'name': g_name},function(res){});

	// receive message buffer
	var msg_list = [];
	socket.on ('message',function(msg) {
		
		switch (msg['model']) {
			case 'user':
				if ('create' == msg['verb']) {
					alert('enter new user [' + msg['data']['name'] + '(' + msg['id'] + ')]');
				} else if ('destroy' == msg['verb']) {
					alert('leave user [' + msg['id'] + ']');
				}
				break;
			
			case 'chatroom':
				if (msg_list.length >= MAX_MSG_LENGTH) {
					for (var i = 0; i < (MAX_MSG_LENGTH - 1); ++i) {
						msg_list[i] = msg_list[i + 1];
					}
					// pop last message
					msg_list.pop(msg_list.length - 1);
				}
				// create new message
				var chatMessage = '<li>'+msg['data']['name']+':'+msg['data']['message']+'</li>';
				// push new messgae
				msg_list.push(chatMessage);
				// update message_list			
				$('#message_list').html(msg_list.join(""));
				break;
			default:
				console.log("error");
		}
	});

	// talk event
	$('#talk').click(function() {
		socket.post('/chatroom/talk', {
			'id': g_id,
			'name': g_name,
			'message':$('#message').val()
		}, function(res){
		});
		// clear message area
		$('#message').val('');
	});

	// leave event
	$('#leave').click(function() {
		socket.get('/chatroom/leave', {'id': g_id, 'name':g_name}, function(res) {});
	});

});
