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
var io = require('socket.io-client');
const host = "https://app.linkshades.com";
var userID;
var socket;
var shades;
var isLoggedIn = false;
var callbacks = {};



function Linkshades(username, password, callback) {
	if (!(this instanceof Linkshades)) {
		console.alert('not an instance of linkshades');
		return new Linkshades();
	}
	if (username && password) {
		console.log('have full data');
		// do full sequential login
		this.didConnectCallback = (function() {
			console.log("in didConnectCallback, " + username);
			this.login(username, password);
		}).bind(this);
		this.didFinishLoginCallback = (function() {
			console.log("in didFinishLoginCallback");
			this.gatherShades();
		}).bind(this);
		this.didGatherShadesCallback = callback;
	}

	this.socket = io.connect(host, {
		secure: true,
		rejectUnauthorized: false,
	});


	// set up callbacks
	this.socket.on('connect', (function() {
			console.log("Connected")
			this.didConnectCallback();
	}).bind(this));
	this.socket.on('message', (function(message, userID) {
		if (message.msg == "success") {
			console.log('success ' + message + userID);
			this.userID = message.uID
			this.isLoggedIn = true;
		} else {return new Error(message);}
		if (this.didFinishLoginCallback) {
			message.msg == 'success' ? this.didFinishLoginCallback() : this.didFinishLoginCallback(new Error("login failed"));
		}
	}).bind(this));
	this.socket.on('shades', (function(shades) {
		console.log(shades);
		this.shades = shades;
		if (this.didGatherShadesCallback) {
			this.didGatherShadesCallback();
		}
	}).bind(this));
	this.socket.on('error', (function(data) {
		console.log('error');
		console.log(data);
	}).bind(this));
	this.socket.on('userData', (function(data) {
		console.log(data);
		console.log('userdata');
	}).bind(this));
}



// callback is an OPTIONAL fn called when request finishes
Linkshades.prototype.login = function(username, password, callback) {
	this.socket.emit('Login', username, password);
	this.loginCallback = callback;
}


Linkshades.prototype.gatherDevices = function(callback) { //TODO does this do anything
	console.log('gatheringDevices, userid is ' + this.userID);
	this.socket.emit('requestData', 'getAllDevices', this.userID);
	this.devicesCallback = callback;
}

Linkshades.prototype.gatherShades = function(callback) {
	console.log('gatherShades');
	this.socket.emit('requestData', 'getShades', this.userID);
	this.devicesCallback = callback;
}

Linkshades.prototype.gatherSchedules = function(callback) {
	this.socket.emit('requestData', 'getSchedules', this.userID);
	this.schedulesCallback = callback;
}

Linkshades.prototype.setShadeHeightAll = function(value, callback) {
	console.log(shades);
	this.shades.forEach((function(shade) {
		console.log("shade " + shade + ", value " + value);
		this.socket.emit('sendCommand', {chipID: shade.chipID, command: value}, this.userID);
	}).bind(this));
	this.shadeCmdCallback = callback;
}


module.exports = Linkshades;
