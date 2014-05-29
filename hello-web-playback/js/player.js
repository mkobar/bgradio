/*
Copyright (c) 2011 Rdio Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

// A global variable that will hold a reference to the api swf once it has loaded
var apiswf = null;

function passVars()
{
	var str = decodeURIComponent(location.href);
	var question = str.indexOf('?');
	// create result object
	var res = {};
	if (question != -1) { // if there are parameters in URL
		var str = str.substring(question+1, str.length); // only keep the part of the URL after the '?'
		var components = str.split(/&|=/i); // split the string at each '&' or '='
		for (var i = 0; i < components.length; i+=2) {
			var c = components[i];
			if (res[c]) res[c].push(components[i+1]); // if property 'c' already exists, then append new component
			else res[c] = [components[i+1]]; // otherwise, create new property and set it equal to new component
		}
	}
	console.log("Params = ", res);
	return res;
}


$(document).ready(function() {
  // on page load use SWFObject to load the API swf into div#apiswf
  var flashvars = {
	'playbackToken': playback_token,	// from token.js
	'domain': domain,					// from token.js
	'listener': 'callback_object'		// the global name of the object that will receive callbacks from the SWF
	};
  var params = {
    'allowScriptAccess': 'always'
  };
  var attributes = {};
  swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
      'apiswf', // the ID of the element that will be replaced with the SWF
      1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);
	
  // set up the controls
  $('#play').click(function() { apiswf.rdio_play(); });
  $('#stop').click(function() { apiswf.rdio_stop(); });
  $('#pause').click(function() { apiswf.rdio_pause(); });
  $('#previous').click(function() { playPrevious(); });
  $('#next').click(function() { playNext(); });
  $('#toggleplay').click(function() { togglePlayback(); });
});

// Local queue of tracks.
var trackIds = passVars()["ID"];
var trackMood = passVars()["mood"];
var trackPosition = 0;

function playPrevious() {
  trackPosition = trackPosition - 2;
  if (trackPosition < 0) trackPosition = trackIds.length + trackPosition;
  apiswf.rdio_clearQueue();
  apiswf.rdio_play(trackIds[trackPosition]);
}
function playNext() {
  apiswf.rdio_clearQueue();
  apiswf.rdio_play(trackIds[trackPosition]);
}

// the global callback object
var callback_object = {};
var curPlayState = -1;

function togglePlayback() {
	if (curPlayState == 1) { // if playing
		apiswf.rdio_pause();
	}
	else if (curPlayState != -1) { // if not playing but player is already ready
		apiswf.rdio_play();
	}
}

callback_object.ready = function(user) {
  // Called once the API SWF has loaded and is ready to accept method calls.

  // find the embed/object element
  apiswf = $('#apiswf').get(0);
  
  // determine subscription status of user and display appropriate message
  if (user == null) {
    $('#nobody').show();
    $('#rdioSignIn').show();
  } else if (user.isSubscriber) {
    $('#subscriber').show();
  } else if (user.isTrial) {
    $('#trial').show();
	$('#rdioSubscribe').show();
  } else if (user.isFree) {
    $('#free').show();
	$('#rdioSubscribe').show();
  } else {
    $('#nobody').show();
	  $('#rdioSignIn').show();
  }
  console.log("User = ", user);
  
  // display the mood
  $('#mood').text(trackMood);
  
  // Shuffle the tracks.
  for (var i = trackIds.length - 1; i > 0; --i) {
    var j = Math.floor(Math.random() * (i+1));
    var temp = trackIds[i];
    trackIds[i] = trackIds[j];
    trackIds[j] = temp;
  }

  // Play the first track.
  apiswf.rdio_play(trackIds[trackPosition]);
}

callback_object.playStateChanged = function(playState) {
  // The playback state has changed.
  // The state can be: 0 - paused, 1 - playing, 2 - stopped, 3 - buffering or 4 - paused.
  curPlayState = playState;
  $('#playState').text(playState);
}

callback_object.playingTrackChanged = function(playingTrack, sourcePosition) {
  // The currently playing track has changed.
  // Track metadata is provided as playingTrack and the position within the playing source
  // as sourcePosition.
  if (playingTrack != null) {
    $('#track').text(playingTrack['name']);
    $('#album').text(playingTrack['album']);
    $('#artist').text(playingTrack['artist']);
    $('#art').attr('src', playingTrack['icon']);
  }
}

callback_object.playingSourceChanged = function(playingSource) {
  // The currently playing source changed.
  // The source metadata, including a track listing is inside playingSource.
  trackPosition = (trackPosition + 1) % trackIds.length;
  apiswf.rdio_queue(trackIds[trackPosition]);
}

callback_object.queueChanged = function(newQueue) {
  // The queue has changed to newQueue.
  // console.log("queueChanged:", newQueue);
}

callback_object.positionChanged = function(position) {
  //The position within the track changed to position seconds.
  // This happens both in response to a seek and during playback.
  $('#position').text(position);
}

callback_object.shuffleChanged = function(shuffle) {
  // The shuffle mode has changed.
  // shuffle is a boolean, true for shuffle, false for normal playback order.
}

callback_object.repeatChanged = function(repeatMode) {
  // The repeat mode change.
  // repeatMode will be one of: 0: no-repeat, 1: track-repeat or 2: whole-source-repeat.
}

callback_object.playingSomewhereElse = function() {
  // If playback begins somewhere else then playback will stop and this callback will be called.
  alert("An Rdio user can only play from one location at a time. Your playback here will now stop.");
};

callback_object.volumeChanged = function(volume) {
  // The volume changed to volume, a number between 0 and 1.
};

callback_object.muteChanged = function(mute) {
  // Mute was changed. mute will either be true (for muting enabled) or false (for muting disabled).
};