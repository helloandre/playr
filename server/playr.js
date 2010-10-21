/**
 * TODO
 *  - maybe roll all these 'get()'s into one
 */

var express = require('express'),
    sys = require('sys'),
    exec = require('child_process').exec,
    child;

var app = express.createServer();

/**
 * regular info stuff
 */
app.get(/^\/info(.*)/, function(req, res){
    child = exec("rhythmbox-client --print-playing-format='%ta;%tt;%td;%te'", function (error, stdout, stderr) {
        if (error !== null) {
            res.header('Content-Type', 'text/javascript');
            res.send('0');
        }
        else {
            res.header('Content-Type', 'text/javascript');
            info = stdout.split(";");
            res.send(req.query.callback+"({'artist':'"+escape(info[0])+"', 'title': '"+escape(info[1])+"', 'duration': '"+info[2]+"', 'elapsed': '"+info[3].trim()+"'})");
        }
    });

});
/**
 * playing and pausing
 */
app.get(/^\/play\-pause(.*)/, function(req, res){
    child = exec("rhythmbox-client --play-pause", function (error, stdout, stderr) {
        if (error !== null) {
            res.send('0');
        }
        else {
            res.header('Content-Type', 'text/javascript');
            res.send(req.query.callback+'()');
        }
    });

});
/**
 * next
 */
app.get(/^\/next(.*)/, function(req, res){
    child = exec("rhythmbox-client --next", function (error, stdout, stderr) {
        if (error !== null) {
            res.send('0');
        }
        else {
            res.header('Content-Type', 'text/javascript');
            res.send(req.query.callback+'()');
        }
    });
});
/**
 * next
 */
app.get(/^\/prev(.*)/, function(req, res){
    child = exec("rhythmbox-client --previous", function (error, stdout, stderr) {
        if (error !== null) {
            res.send('0');
        }
        else {
            res.header('Content-Type', 'text/javascript');
            res.send(req.query.callback+'()');
        }
    });
});

app.listen(3000);
