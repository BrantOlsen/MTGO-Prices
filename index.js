var express = require('express'),
    path = require('path'),
    fs = require('fs');
var http = require('https');

var app = express();
var staticRoot = __dirname + '/src';
app.set('port', (process.env.PORT || 3000));
//app.use(express.static(staticRoot));
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(path.join(staticRoot + '/index.html'));
});
app.get('/GetPrice', function (req, res) {
    console.log('GetPrice');

    res.setHeader('Content-Type', 'text/html');
    http.get(req.query.url, function (price_res) {
        var str = '';
        console.log('Response is ' + price_res.statusCode);

        price_res.on('data', function (chunk) {
            str += chunk;
        });

        price_res.on('end', function () {
            res.write(str);
            res.end();
        });
    });
});
app.use(function (req, res, next) {
    if (req.accepts('css', 'js')) {
        console.log('Send ' + path.join(__dirname, 'src', req.path));
        res.sendFile(path.join(__dirname, 'src', req.path));
        return;
    }

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        console.log('HTML');
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== '') {
        console.log('Next');
        return next();
    }

    console.log('Read Stream');
    res.sendFile(path.join(staticRoot + '/index.html'));
});

app.listen(app.get('port'), function () {
    console.log('app running on port', app.get('port'));
});