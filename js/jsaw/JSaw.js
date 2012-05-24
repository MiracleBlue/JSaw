/**
 * JSaw - JavaScript Audio Workstation
 * Copyright (c) 2011 Nicholas Kircher, Aaron 'Spanky Tanks' Danks
 * JSaw may be freely distributed under the MIT license.
 
 Everything in JSaw is split up into its component parts, and then connected together.
 Each pattern has a collection of tracks, each track is basically a synth which is attached
 to a piano roll.  Piano rolls are collections of step grids which are collections of notes.
 
 TODO: set all float values to proper midi values, 0 - 127
 */

// Hackery!  Witchery!  Nonsense and bullshit!
function construct(constructor, args) {
	function F(constructor) {
		return constructor.apply(this, args);
	}
	F.prototype = constructor.prototype;
	return new F(constructor);
}


/**
 * JSAW core
 */

// Static Class
var JSAW = {
	audiolet: false,
	count: {
		instrument: 0,
		pattern: 0,
		track: 0
	}
};

JSAW.App = function(newConfig) {
	this.audiolet = null;
	this.model = {};
	this.init = function() {
		// Do stuff here
	};
	_(this).extend(newConfig);
	
	window.onload = function(){
		if (!this.audiolet) this.audiolet = new Audiolet();
		this.playback = new JSAW.Playback({bpm: 130});
		this.model = new this.model();
		ko.applyBindings(this.model);
		this.init();
		
	}.bind(this);
}
	
/**
 * Note object: represents a note in a pattern.
 * 
 * @constructor
 * @param {Object} options Configuration options for the constructor.
 */
JSAW.Note = function(options) {
	this.instance = true; // This is the instance of Note!
	
	options = (_(options).isString()) ? {key: options} : options;
	
	this.options = {
		id: false,
		key: "C",
		octave: 3,
		velocity: 1.0,
		duration: 1, // Number of steps
		position: 0 // Step position
	}
	_(this.options).extend(options);
	
	this.id = this.options.id;
};
/**** METHODS ****/

JSAW.Note.prototype.getKey = function(){return this.options.key;};
JSAW.Note.prototype.getOctave = function(){return this.options.octave;};
JSAW.Note.prototype.getVelocity = function(){return this.options.velocity;};
JSAW.Note.prototype.getDuration = function(){return this.options.duration;};
JSAW.Note.prototype.getPosition = function(){return this.options.position;};
JSAW.Note.prototype.getFullName = function(){return this.options.key+this.options.octave;};
JSAW.Note.prototype.getFrequency = function(){return Note.fromLatin(this.getFullName()).frequency();};
JSAW.Note.prototype.hashify = function(){
	var outhash = {}
	_(outhash).extend(this.options);
	outhash.frequency = this.getFrequency();
	outhash.fullName = this.getFullName();
	outhash.velocity = this.getVelocity();
	outhash.instance = false;
	return outhash;
};

JSAW.Note.prototype.set = function(params){
	params.id = this.id;	// Prevent changes to ID parameter
	_(this.options).extend(params);
};

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
	//this.self._increment.pattern += 1;
	//return ++this.self._increment.pattern;
};

/**
 * Get a note object by ID.
 */
JSAW.Pattern.prototype.getNote = function(id) {
	return _(_.keys(this._notes)).contains(id) ? this._notes[id] : false;
};

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
}

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
}

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

/**
 * JSaw Playback
 */
JSAW.Playback = function(options) {
	this.bpm = options.bpm || 130;
	this.playing = false;
	this.audiolet = JSAW.audiolet;
	this.sequenceEvent = null;
}

JSAW.Playback.prototype = {
	play: function(pattern, instrument) {
		if (!this.playing) {
			var sequence = new PSequence(pattern._steps, Infinity);
			this.sequenceEvent = this.audiolet.scheduler.play(
				[sequence],
				1/4,
				function(step) {
					if (step.length > 0) {
						_(step).forEach(function(note){
							instrument.voices.create(note);
						});
					}
				}
			);
			this.playing = true;
		}
	},
	stop: function() {
		this.audiolet.scheduler.stop(this.sequenceEvent);
		this.playing = false;
	},
	toggle: function(pattern, instrument) {
		if (!this.playing) return this.play(pattern, instrument);
		return this.stop();
	}
};

/**
 * Instrument object
 * 
 * @constructor
 * @param {Object} options Configuration parameters for the instrument instance
 */
JSAW.Instrument = function(options) {
	// Default instrument options
	this.options = {
		id: JSAW.count.instrument++,
		name: "New Instrument",
		type: "synth",
		generator: {
			node: Synth2,
			config: {}
		},
		muted: false,
		volume: 0.8,
		pan: 0.5,
		effects: []
	}
	_(this.options).extend(options);
	
	this.options.name = ko.observable(this.options.name);
	
	console.group("Instrument ("+this.options.type+"): '"+this.options.name()+"'");
	
	// this.al is the primary AudioLet object
	this.audiolet = this.al = this.options.audiolet;
	this.generatorClass = new this.options.generator.node(this.options.generator.config);
	this.effects = this.options.effects;
	
	// Create mixer node
	this.mixer = new MixerNode({audiolet: this.al, effects: this.effects});
	// Connect mixer directly to the output!  Yay!
	this.mixer.connect(this.al.output);
	
	// Set options for sampler type instrument
	if (this.options.type === "sampler") {
		this.samplerParams = options.samplerParams;
		this.samplerParams.audiolet = this.al;
		this.generator = construct(this.generatorClass, [this.samplerParams]);
		// Connect the sampler to the mixer node
		this.generator.connect(this.mixer);
	}
	
	// self referencing, used in nested child objects
	var _self = this;
	
	console.debug("this.options:");
	console.dir(this.options);
	
	this.voices = {
		// Reference to the parent object
		self: _self,
		list: [],
		
		// Create method
		create: function(data) {
			console.group("Voice create");
			console.info("Type: "+this.self.options.type);
			
			// If the data has no actual data, something is obviously wrong
			if (_.isUndefined(data) || _.isNull(data)) {
				console.error("Cannot create voice: data argument is null or undefined.");
				console.groupEnd();
				return false;
			}
			
			// If the note data is an array, iterate through it and treat each item as a separate note data packet
			if (_.isArray(data)) {
				_(data).forEach(function(value){
					this.voices.create(value);
				}, this.self);
				
				console.groupEnd();
				return;
			}
			
			// If the note data passed is actually an instance of a Note object, just grab a hash of its properties
			var noteData = (data.instance) ? data.hashify() : data;
			
			// Synth type
			if (this.self.options.type == "synth") {
				noteData.audiolet = this.self.al;
				noteData.velocity = noteData.velocity * this.self.options.volume;
				
				// Pass info about the note to the console.
				console.debug(noteData);
				
				//var voiceObj = construct(this.self.generatorClass, [noteData]);
				var voiceObj = this.self.generatorClass.createGenerator(noteData);
				var voiceFX = [];
				
				// Set voice gain to note velocity
				voiceObj.vel.gain.setValue(noteData.velocity);
				
				voiceObj.connect(this.self.mixer);
				
				this.list.push(voiceObj);
				
				console.debug("Voice created");
			}
			
			// Sampler type
			else if (this.self.options.type == "sampler") {
				this.self.generator.gain.gain.setValue(noteData.velocity);
				this.self.generator.triggerSample.trigger.setValue(1);
				
				console.debug("Sample triggered");
			}
			
			console.groupEnd();
		} // end Create method
		
	}; // end Voices
	
	console.debug("Mixer object:");
	console.dir(this.mixer);
	
	console.groupEnd();
}; // end Instrument

// Plays a single note or multiple notes immediately.  Useful for testing!
// Example use of Single Note: myInstrument.playNote({key: "A", octave: 3})
// Example use of Multi Note: myInstrument.playNote([{key: "A", octave: 3}, {key: "G", octave: 4}])
JSAW.Instrument.prototype.playNote = function(notes) {
	if (_(notes).isArray()) {
		_(notes).forEach(function(item){
			this.voices.create(new JSAW.Note(item));
		}, this);
	}
	else {
		this.voices.create(new JSAW.Note(notes)); // Awwwyea!
	}
};


/**
 * Playlist thing
 */
JSAW.Playlist = function() {
	// code goes here
	
	//this.
}


JSAW.Global = function() {
	this._sequenceCount = 1;
	this._instrumentCount = 1;
};
	
JSAW.Global.prototype.getNewSequenceID = function(){
	this._sequenceCount += 1;
	return this._sequenceCount;
};
JSAW.Global.prototype.getNewTrackID = function(){
	this._instrumentCount += 1;
	return this._instrumentCount;
};

// Static stuff and class definitions
JSAW.Project = function(config) {
	this.title = config.title || "Ode To JSaw";
	this.artist = config.artist || "Someone";
	this.bpm = config.bpm || 120.0;
	
	
};

JSAW.Sequence = function(config) {
	//this.id = config.id || JSAW.Global.sequenceCount+1
	//this.name = config.name || "Sequence #"+this.id;
};

/**
 * Core application model
 */
JSAW.Model = function() {
	var self = this;
	
	this.Instruments = new (function(){
		// Currently with two instruments already defined, for testing purposes
		var self = this;
		this.instrumentArray = ko.observableArray([
			new JSAW.Instrument({
				name: "Observed Instrument",
				audiolet: JSAW.audiolet,
				generator: {
					node: Synth2,
					config: {
						osc: Saw
					}
				},
				effects: [FXDelay, FXReverb]
			}),
			new JSAW.Instrument({
				name: "Second instrument!",
				audiolet: JSAW.audiolet,
				generator: {
					node: Synth2,
					config: {
						osc: Square
					}
				},
				effects: [FXDelay, FXReverb]
			})
		]).indexed(); // Gives the array items their index position in the array, accessible via $index in bindings
		
		this.selectedInstrumentIndex = ko.observable();
		
		this.selectedInstrumentObject = ko.observable();
		
		this.selectedInstrumentIndex.subscribe(function(newIndex) {
			self.selectedInstrumentObject(self.instrumentArray()[newIndex]);
			console.log("Selected Instrument changed!  Index: "+self.selectedInstrumentIndex()+", instrument: "+self.selectedInstrumentObject().options.name());
			// Hard coded dependency, to be totally changed laters
			pianoroll.options.instrument = self.selectedInstrumentObject;
		});
		
		this.add = function(configObject) {
			self.instrumentArray.push(new JSAW.Instrument(configObject));
		}
		
	})();
	
	this.Mixer = {
		masterChannel: new MixerNode({
			audiolet: JSAW.audiolet,
			output: JSAW.audiolet.output
		}),
		
		channelArray: ko.observableArray([
			new MixerNode({
				audiolet: JSAW.audiolet,
				effects: [FXReverb],
				output: this.masterChannel
			}),
			new MixerNode({
				audiolet: JSAW.audiolet,
				effects: [FXDelay, FXReverb],
				output: this.masterChannel
			})
		]).indexed()
	};
};

JSAW.Mixer = function() {
	
}

/**
 * Begin initialising application logic here!
 */
JSAW.audiolet = new Audiolet();
jsawApp = new JSAW.App({
	audiolet: JSAW.audiolet,
	model: JSAW.Model,
	init: function() {
		console.debug("JSaw App started!");
		this.model.Instruments.selectedInstrumentIndex(0);
		$(function() {
			$(".dial").knob({
				min: 0,
				max: 100,
				width: 50,
				thickness: .4
			});
		});
	}
});
/*window.onload = function() {
	//jsaw.status = new JSAW.Model.Status();
	
	JSAW.audiolet = new Audiolet();
	//JSAW.audiolet.scheduler.setTempo(130);
	JSAW.audiolet.scheduler.stop();
	
	/*window.derpSynth = new JSAW.Instrument({
		name: "Basic Synth Test",
		al: JSAW.audiolet,
		generator: Synth,
		effects: [FXDelay, FXReverb]	// With delay effects!
	});
	
	JSAW.new_model = new JSAW.Model();
	
	ko.applyBindings(JSAW.new_model);
	
	// Set the initial selected instrument
	JSAW.new_model.Instruments.selectedInstrumentIndex(0);
	
	$(function() {
		$(".dial").knob({
			min: 0,
			max: 100,
			width: 50,
			thickness: .4
		});
	});
};*/



