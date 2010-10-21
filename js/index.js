var first, second, artist, title, duration;
var site = window.location;

/**
 * my own spiffy ajax wrapper
 */
function pajax(u, cb){
    $.ajax({
         url: 'http://'+site.host+':3000/'+u,
         dataType: 'jsonp',
         cache: false,
         jsonpCallback: cb});
}

/**
 * callback functions for jsonp
 */
function init(){
    pajax('info', 'setInit');
    setTimeout("pajax('info', 'checkTime')", 1100);
}

function setInit(data){
    artist = unescape(data.artist);
    title = unescape(data.title);
    duration = unescape(data.duration);
    first = unescape(data.elapsed);
}
function checkTime(data){
    if (data != 0){
        second = data.elapsed;

        if (second > first){
            // song is playing, show pause button, info
            $('#loader').fadeOut('fast', function(){
                $('#artist').text(artist);
                $('#title').text(title);
                $('#data').fadeIn('fast');
                $('#pause').fadeIn('fast');
            });
        }
        else{
            // is paused
            $('#loader').fadeOut('fast', function(){
                $('#title').text('Not Playing');
                $('#play').fadeIn('fast');
                $('#data').fadeIn('fast');
            });
        }
    }
    else {
        $('#title').text('An Error Occurred').fadeIn('fast');
    }
}
function setPlaying(data){
    artist = unescape(data.artist);
    title = unescape(data.title);
    $('#artist').text(artist);
    $('#title').text(title);
    $('#play').fadeOut('fast', function(){
        $('#data').fadeIn('fast');
        $('#pause').fadeIn('fast');
    });

}
function update(data){
    if (unescape(data.artist) != artist){
        artist = unescape(data.artist);
        $('#artist').fadeOut('fast', function(){
           $('#artist').text(artist).fadeIn('fast');
        });
    }
    if (unescape(data.title) != title){
        title = unescape(data.title);
        $('#title').fadeOut('fast', function(){
           $('#title').text(title).fadeIn('fast');
        });
    }
}
function change(data){
    setInterval("pajax('info', 'update')", 500); // .5
}

function play_pause(){
    pajax('play-pause', 'blank');
}

function blank(){}

/**
 * interval to check and see which song is still playing
 */
setInterval("init()", 10000); // 5 seconds

$(function(){
    $('#play').live('click', function(e){
        e.preventDefault();
        play_pause();
        $('#data').fadeOut('fast', pajax('info', 'setPlaying'));
    });

    $('#pause').live('click', function(e){
        e.preventDefault();
        play_pause();
        $('#data').fadeOut('fast', function(){
           $('#title').text('Not Playing');
           $('#data').fadeIn('fast');
        });
        $('#pause').fadeOut('fast', function(){
           $('#play').fadeIn('fast');
        });
    });

   $("#next").live('click', function(e){
        e.preventDefault();
        pajax('next', 'change');
    });
    $("#prev").live('click', function(e){
        e.preventDefault();
        pajax('prev', 'change');
    });

    /**
     * very first call to set things up.
     * set 'first'
     */
    init();

});
