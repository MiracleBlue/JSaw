/**
 * Pattern object: represents a sequence of notes to be played.
 * 
 * @constructor
 * @param {Object} options Configuration options for the constructor.
 */
JSAW.Pattern = function(options) {
	this._notes = {}; // Associative array of all note objects in this pattern.
	this._steps = []; // Step array.
	this._noteIncrement = 1; // Counter.
	
	this.options = {
		id: false,
		name: "New Pattern",
		beats: 4,
		stepsPerBeat: 4,
		pattern: [],
		track: false
	}
	_(this.options).extend(options);
	
	this.options.name = ko.observable(this.options.name);
	//this.options.id = this.$index() || this.options.id;
	
	//this.id = this.options.id = (this.options.id) ? this.options.id : this.generateID();
	this.track = this.options.track;
	
	// Track association is not forced, only recommended
	if (!this.track) {
		console.warn("Uh oh, pattern is not assigned to a track object!");
	}
	
	if (this.options.pattern.length > 0) {
		console.debug("pattern contents");
		console.dir(this.options.pattern);
		this.renderPattern(this.options.pattern);
	}
	else {
		for (var x = 0; x < this.options.beats; x++) {
			for (var i = 0; i < this.options.stepsPerBeat; i++) {
				this._steps.push([]);
			}
		}
	}
	
	
};

/**** METHODS ****/



/**
 * Generate a unique numeric ID and increment the internal counter + 1.
 *
 * @return {Number} The generated numeric ID.
 */
JSAW.Pattern.prototype.generateID = function() {
	// Herp derp
};

/**
 * Get a note object by ID.
 */
JSAW.Pattern.prototype.getNote = function(id) {
	return _(_.keys(this._notes)).contains(id) ? this._notes[id] : false;
};


JSAW.Pattern.prototype.getAllNotes = function() {
	return this._notes;
}
/**
 * Create a new note and add it to the collection.
 */
JSAW.Pattern.prototype.addNote = function(options) {
	console.debug(options.position + " add note called!");
	if (!this._steps[options.position]) this._steps.push([]);
	
	if (options.blank) {
		return [];
	}
	
	options.id = options.id || ++this._noteIncrement;
	var note = this._notes[options.id] = new JSAW.Note(options);
	
	this._steps[options.position].push(this._notes[options.id]);
	
	console.dir(note);
	
	return this._notes[options.id]; // How interesting
};

JSAW.Pattern.prototype.removeNote = function(note) {
	//var nstep = this._steps[note.getPosition()];
	this._steps[note.getPosition()] = _(this._steps[note.getPosition()]).without(note);
	this._notes = _(this._notes).without(note);
	console.debug("note removed");
	console.dir(this._steps);
};

JSAW.Pattern.prototype.renderPattern = function(newPattern) {
	var outPattern = [];
	_(newPattern).forEach(function(step, index){
		var newStep = [];
		if (step.length > 0) {
			_(step).forEach(function(noteData){
				noteData.position = index;
				newStep.push(this.addNote(noteData));
			}, this);
		}
		else {
			var noteData = {position: index, blank: true};
			this.addNote(noteData);
		}
		outPattern.push(newStep);
	}, this);
	return outPattern;
};

JSAW.Pattern.prototype.startPlayback = function() {
	var self = this;
	var sequence = new PSequence([this._steps], 1);
	this.track.instrument.al.scheduler.play(
		[sequence],
		0.25,
		function(step) {
			if (step.length > 0) {
				_(step).forEach(function(note){
					self.track.instrument.voices.create(note);
				});
			}
		}
	);
};