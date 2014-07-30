Chat App
=========

This is chat app using sails.

  - node.js
  - websocket.io
  - sails


Creation of  project
--------------

```sh
sails new sample_shat --linker
```


Addition of  network I/F function 
--------------

generate login page

```sh
sails generate controller chatapp login
```
api/controllers/ChatappController.js
```sh
login: function (req, res) {
    return res.view({});
},
```
views/chatapp/login.ejs
```sh
<!DOCTYPE html>
<h2>Welcome To SampleChat</h2>

<% 
var dummyID = Math.floor(Math.random() * 100); 
var user_name = "test";
%>


<form action='/chatroom/main' method='get'>
	<p>Your ID : <input type='text' name='id' value='<%= dummyID %>' size='20'/></p>
	<p>Your Name : <input type='text' name='name' value='<%= user_name %>' size='20' /></p>
	<p><input type='submit' name='submit' value='login' /></p>
</form>
```


generate room page and model
```sh
sails generate chatroom
sails generate user
```

creation of User and Chatroom model

api/model/User.js
```sh
attributes: {
	id: 'integer',
	name: 'string'
}
```

api/model/ChatroomUser.js
```sh
attributes: {
	id: 'integer',
	name: 'string',
	message: 'string'
}
```



api/controllers/ChatroomController.js

main function
```sh
main: function(req, res) {
	return res.view({
		id: req.param('id'),
		name: req.param('name')
	});
},
```

views/chatroom/main.ejs
```sh
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="/js/chatroom.js"></script>
<script type="text/javascript">
var g_id = <%= id %>;
var g_name = '<%= name %>';
</script>

<h2>Sample Chat Room</h2>
<h3>Your ID:<%= id %>,  Your Name: <%= name %></h3>

<div id='message_area'>
	<ul id='message_list'>
	</ul>
</div>

<div>
	<input type='text' id='message'></input>
	<input type='button' id='talk' value='send'></input>
	<input type='button' id='leave' value='leave'></input>
</div>
```

js/charroom.js
```sh
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
```

api/controllers/ChatroomController.js

enter leave talk function

```sh
/**
 * /chatroom/enter
 */
enter: function(req, res) {
	
	// register socket
	User.subscribe(req.socket);
	Chatroom.subscribe(req.socket);

	// broadcast message
	User.publishCreate({
    	id: req.param('id'),
	    name: req.param('name')
	});
},

/**
 * /chatroom/leave
 */
leave: function(req, res) {
	// broadcast message
	User.publishDestroy(req.param('id'));
	User.unsubscribe(req.socket);
	Chatroom.unsubscribe(req.socket);
},

/**
 *  /chatroom/talk
 */
talk: function(req, res) {
	
	Chatroom.publishCreate({
		id: req.param('id')	,
		name: req.param('name'),
		message: req.param('message')
	});
},
```

Addition of  push function
--------------

The function which notifies time from a server is added. 


config/bootstrap.js
```sh
module.exports.bootstrap = function (cb) {

    // add 
	NoticeDatetime.exec();

    // It's very important to trigger this callack method when you are finished 
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};

```

service/NoticeDatetime.js

```js
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
```


License
----

MIT
