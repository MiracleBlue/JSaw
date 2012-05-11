/**
 * Track objects
 */
JSAW.Track = function(options) {
	//this.self = self;
	// This should hold an array store of all pattern objects associated with this track
	this.pattern = options.pattern || [];
	
	// What instrument am I?
	this.instrument = options.instrument || {};
};

JSAW.Track.prototype.generateID = function() {
	//this.self._increment.track += 1;
	//return ++this.self._increment.track;
};

/**
 * Playback of a pattern attached to a track through the tracks instrument
 */
JSAW.Track.prototype.startPlayback = function() {
	console.debug("startPlayback has been called");
	var self = this;
	var sequence = new PSequence(this.pattern._steps, 1);
	console.debug(this.instrument);
	
	this.instrument.al.scheduler.play(
		[sequence],
		1/4,
		function(step) {
			console.debug("stepping through sequence");
			if (step.length > 0) {
				_(step).forEach(function(note){
					self.instrument.voices.create(note);
				});
			}
		}
	);
	
};