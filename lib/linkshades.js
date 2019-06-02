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


function Linkshades() {
	if (!(this instanceof Linkshades)) {
		return new Linkshades();
	}
	console.log('hey');
	this.socket = io.connect(host, {
		secure: true,
		rejectUnauthorized: false,
	});


	// set up callbacks
	this.socket.on('connect', (function() {
			console.log("Connected")
	}).bind(this));
	this.socket.on('message', (function(message, userID) {
		console.log(message);
		if (message.msg == "success") {
			this.userID = message.uID
			this.isLoggedIn = true;
			console.log('success');
		}
		console.log('logged in?' + this.isLoggedIn);
	}).bind(this));
	this.socket.on('shades', (function(shades) {
		console.log(shades);
		// TODO iterate through array and populate chips data
		this.shades = shades;
	}).bind(this));
	this.socket.on('error', (function(data) {
		console.log('error');
		console.log(data);
	}).bind(this));
	this.socket.on('userData', (function(data) {
		console.log(data);
	}).bind(this));
}

Linkshades.prototype.login = function(username, password) {
	this.socket.emit('Login', username, password);
}

Linkshades.prototype.gatherDevices = function() {
	this.socket.emit('requestData', 'getAllDevices', this.userID);
}

Linkshades.prototype.gatherShades = function() {
	this.socket.emit('requestData', 'getShades', this.userID);
}

Linkshades.prototype.gatherSchedules = function() {
	this.socket.emit('requestData', 'getSchedules', this.userID);
}

Linkshades.prototype.setShadeHeight = function(value) {
	this.shades.forEach((function(shade) {
		console.log("shade " + shade + ", value " + value);
		this.socket.emit('sendCommand', {chipID: shade.chipID, command: value}, this.userID);
	}).bind(this));
}


module.exports = Linkshades;