# linkshades
Linkshades Cloud API (WiFi Blackout Shades) 

API to control linkshades.

example:
var Linkshades = require('./linkshades.js');
var l = new Linkshades();
l.login('jacborossfrantz@gmail.com', 'testpassword');
l.gatherShades();
l.setShadeHeight(0); // close shades. 100 is open.

TODO:
- wait for socket calls when necessary
- write up the API more clearly
- actually test this with homebridge
- link to this package from my hoembridge plugin
- publish homebridge plugin


I am providing code in the repository to you under an open source license. Because this is my personal repository, the license you receive to my code is from me and not my employer (Facebook)
