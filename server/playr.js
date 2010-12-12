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
 * handles all requests
 */
app.get(/^\/(.*)/, function(req, res){
    var execute_string = "";

    switch (req.params[0]){
        case "play-pause":
            execute_string = "rhythmbox-client --play-pause";
            break;
        case "next":
            execute_string = "rhythmbox-client --next";
            break;
        case "prev":
            execute_string = "rhythmbox-client --previous";
            break;
        default: // typically 'info'... this is to prevent anything actually happening in the case of a mal-formed request
            execute_string = "rhythmbox-client --print-playing-format='%ta;%tt;%td;%te'";
            break;
    }

    child = exec(execute_string, function (error, stdout, stderr){
        res.header('Content-Type', 'text/javascript');
        // error of some sort
        if (error !== null) {
            res.send('0');
        }
        else {
            // info actually requires us returning something useful
            if (req.params[0] == 'info'){
                info = stdout.split(";");
                res.send(req.query.callback+"({'artist':'"+escape(info[0])+"', 'title': '"+escape(info[1])+"', 'duration': '"+info[2]+"', 'elapsed': '"+info[3].trim()+"'})");
            }
            else {
                res.send(req.query.callback+"()");
            }
        }
    });
});

app.listen(3000);
