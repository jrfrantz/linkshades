/**
 * Linkshade Appliance nodejs module
 *
 * Author jacob frantz <@jrfrantz>
 *
 * Todo ?
 *
 */
/*var username; // e.g email address
var userID; // e.g token
var socket; 
var isLoggedIn;*/
const host = "http://app.linkshades.com";
var userID;
var isLoggedIn = false;

// register all the callback methods
function getConnectedSocket() {
	var socket = io.connect(host, {secure: false});
	socket.on('connect', function() {
			console.log("Connected")
	});
	socket.on('message', function(message, userID) {
		console.log(message);
		if (message.msg == "success") {
			localStorage.setItem("userID", message.uID)
			this.userID = message.uID
			isLoggedIn = true;
			localStorage.setItem('host', host);
			console.log('success');
		}
		console.log('logged in?' + isLoggedIn);
	});

	socket.on('shades', function(data) {
		console.log(data);
	});
	return socket;
}

function login(socket, username, password) {
	socket.emit('Login', username, password);
}

function requestData(socket, request, value) {
	socket.emit('requestData', request, userID);
}

function setShadeHeight(socket, chipID, value) {
	socket.emit('sendCommand', {chipID: chipID, command:value}, this.userID);
}