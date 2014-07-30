/**
 * ChatroomController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  

	/**
	 *	/chatroom/main
	 */
	main: function(req, res) {
		return res.view({
			id: req.param('id'),
			name: req.param('name')
		});
	},

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
		User.publishDestroy(//{
			//id: 
			req.param('id') //,
			//name: req.param('name')
		//}
		);
		
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

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ChatroomController)
   */
  _config: {}

  
};
