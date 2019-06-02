const express = require('express')
const io = require('socket.io-client')
const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/package_test_site.html');
	console.log('sup');
	console.log(io);
	var s = io.connect("https://app.linkshades.com", {secure: true, rejectUnauthorized: false});
	console.log(s);

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static(__dirname));
