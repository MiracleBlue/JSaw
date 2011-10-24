/**
 * JSaw - JavaScript Audio Workstation
 * Copyright (c) 2011 Nicholas Kircher
 * JSaw may be freely distributed under the MIT license.
 
 Everything in JSaw is split up into its component parts, and then connected together.
 Each pattern has a collection of tracks, each track is basically a synth which is attached
 to a piano roll.  Piano rolls are collections of step grids which are collections of notes.
 
 */

function debug(msg) {
	var dbg_on = true;
	if (dbg_on) console.log(msg);
}

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
var JSAW = {};

// Instance Class
var JSAW_Class = function(){
	var self = this;
	
	this._increment = {
		pattern: 1,
		track: 1
	};
}
	
JSAW_Class.prototype = {
	/**
	 * Note object: represents a note in a pattern.
	 */
	Note: function(options, parent) {
		/**** CONSTRUCTOR ****/
		this.self = self;
		this.parent = parent || false;
		
		if (!this.parent) {
			debug("Must pass a parent pattern object to this constructor!");
			return false; // Must pass a parent pattern object to this constructor!
		}
		
		this.options = {
			id: false,
			key: "C",
			octave: 3,
			velocity: 1.0,
			duration: 1, // Number of steps
			position: 0 // Step position
		}
		_(this.options).extend(options);
		
		this.id = this.options.id = (this.options.id) ? this.options.id : this.generateID();
		
		/**** METHODS ****/
		
		this.getKey = function(){return this.options.key;};
		this.getOctave = function(){return this.options.octave;};
		this.getVelocity = function(){return this.options.velocity;};
		this.getDuration = function(){return this.options.duration;};
		this.getPosition = function(){return this.options.position;};
		this.getFullName = function(){return this.options.key+this.options.octave;};
		this.getFrequency = function(){return Note.fromLatin(this.getFullName()).frequency();};
		
		this.set = function(params){
			params.id = this.id;	// Prevent changes to ID parameter
			_(this.options).extend(params);
		};
	},
	
	/**
	 * Pattern object: represents a sequence of notes to be played.
	 * 
	 * @constructor
	 * @param {Object} options Configuration options for the constructor.
	 */
	Pattern: function(options) {
		/**** CONSTRUCTOR ****/
		this.self = self;
		this._notes = {}; // Associative array of all note objects in this pattern.
		this._steps = []; // Step array.
		this._noteIncrement = 1; // Counter.
		
		this.options = {
			id: false,
			name: "New Pattern",
			beats: 4,
			stepsPerBeat: 4
		}
		_(this.options).extend(options);
		
		this.id = this.options.id = (this.options.id) ? this.options.id : this.generateID();
		
		/**** END CONSTRUCTOR ****/
		
		/**** METHODS ****/
		
		/**
		 * Generate a unique numeric ID and increment the internal counter + 1.
		 *
		 * @return {Number} The generated numeric ID.
		 */
		this.generateID = function() {
			this.self._increment.pattern += 1;
			return this.self._increment.pattern;
		};
		
		/**
		 * Get a note object by ID.
		 */
		this.getNote = function(id) {
			return _(_.keys(this._notes)).contains(id) ? this._notes[id] : false;
		};
		
		/**
		 * Create a new note and add it to the collection.
		 */
		this.addNote = function(options) {
			
		}
	},
	
	/**
	 * Track objects
	 */
	Track: function(options) {
		this.self = self;
		this._patterns = [];
		
		this.generateID = function() {
			self._increment.track += 1;
			return self._increment.track;
		};
	}
}

JSAW_Class.Pattern.prototype = {
	generateID: function(){
		self._increment.pattern += 1;
		return self._increment.pattern;
	}
}

JSAW_Class.prototype.Track = function() {
	this._patterns = [];
	
	this.generateID = function() {
		this._increment.track += 1;
		return this._increment.track;
	};
}

JSAW_Class.Track.prototype.Create = function() {
	
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
	
}

JSAW_Class.prototype.Track = function(config) {
	//this.id = config.id || 
}

JSAW.Sequence = function(config) {
	this.id = config.id || JSAW.Global.sequenceCount+1
	this.name = config.name || "Sequence #"+this.id;
}

/**
 * JSAW Model Definitions
 */
JSAW.Model = {};
	// Status model
	JSAW.Model.Status = Backbone.Model.extend({
		defaults: {
			playing: false,
			step_position: 0,
			voices: 0
		}
	})
	
	// Sheduling models
	JSAW.Model.Schedule = {};
		// Shedule step model
		JSAW.Model.Schedule.Step = Backbone.Model.extend({
			open: true
		})
		
	JSAW.Model.PatternWrap = function(sequence, instrument) {
		this.sequence = new PSequence(sequence, 1);
		this.instrument = instrument;
	};
	
	JSAW.Model.Pattern = Backbone.Model.extend({
		defaults: {
			"name": "Untitled Pattern",
			"colour": "#CCCCCC",
			"sequence": null
		},
		initialize: function(options) {
			this.instrument = options.instrument;
			
		}
	});
	
	// Instrument model
	JSAW.Model.Instrument = {};
		
		// Instrument playlist scheduling collection
		JSAW.Model.Instrument.Patterns = function(itself) {
			this.self = itself;
			
		}
		
		// Voice handling
		// ** Real voices only.  Support for imaginary voices requires copious amounts of medication.js **
		JSAW.Model.Instrument.Voices = function(itself) {
			this.self = itself;
			this.list = [];
			this.create = function(noteData) {
				debug("Type: "+this.self.get("type"));
				if (this.self.get("type") == "synth") {
					noteData.audiolet = this.self.al;
					noteData.velocity = noteData.velocity * this.self.get("volume");
					//console.log(this.self);
					var voiceObj = construct(this.self.generatorClass, [noteData]);
					var voiceFX = [];
					
					voiceObj.vel.gain.setValue(noteData.velocity);
					
					if (this.self.effects.length > 0) {
						for (var i = 0; i < this.self.effects.length; i++) {
							voiceFX.push(construct(this.self.effects[i], [{audiolet: this.self.al}]));
						}
						for (var i = 0; i < voiceFX.length; i++) {
							//voiceFX[i] = construct(voiceFX[i], [{audiolet: this.self.al}]);
							if (i < 1) {
								voiceObj.connect(voiceFX[i]);
								if (voiceFX.length === 1) voiceFX[i].connect(this.self.al.output);
							}
							else if (i < voiceFX.length-1) {
								voiceFX[i].connect(voiceFX[i+1]);
							}
							else {
								voiceFX[i].connect(this.self.al.output);
							}
						}
					}
					else {
						voiceObj.connect(this.self.al.output);
					}
					//voiceObj.connect(this.self.al.output);
					this.list.push(voiceObj);
					debug("Voice created");
					debug(noteData);
				}
				else if (this.self.get("type") == "sampler") {
					//this.self.generator.connect(this.self.al.output);
					this.self.generator.gain.gain.setValue(noteData.velocity);
					this.self.generator.triggerSample.trigger.setValue(1);
					debug("Sample triggered");
				}
			};
		};
		
		// Instrument wrapper model
		JSAW.Model.Instrument.Wrapper = Backbone.Model.extend({
			defaults: {
				type: "synth",		// Can be either "synth" or "sampler"
				name: "Instrument",
				muted: false,
				volume: 1.0,
				panning: 0.5
			},
			
			// Initialize stuff
			initialize: function(options) {
				debug("Instrument wrapper init");
				debug(options);
				
				this.al = options.al;
				this.generatorClass = options.generator;
				this.effects = options.effects || [];
				
				if (options.type == "sampler") {
					this.samplerParams = options.samplerParams;
					this.samplerParams.audiolet = this.al;
					this.generator = construct(this.generatorClass, [this.samplerParams]);
					this.generator.connect(this.al.output);
				}
				debug(this);
				this.voices = new JSAW.Model.Instrument.Voices(this);
			}
		});
	
	// Track model
	JSAW.Model.Track = {};
		// Instrument collection
		JSAW.Model.Track.Instruments = Backbone.Collection.extend({
			model: JSAW.Model.Instrument
		});
		
		//JSAW.Model.Track.Schedule
		
	
	/**
	 * JSaw Piano Roll models
	 */
	JSAW.Model.PianoRoll = {};
		// Note model
		JSAW.Model.PianoRoll.Note = Backbone.Model.extend({
			defaults: {
				"name": "C",
				"octave": 1,
				"velocity": 0.20,
				"num_of_steps": 1,
			},
			getFullName: function() {
				return this.get("name") + this.get("octave");
			},
			getFrequency: function() {
				return Note.fromLatin(this.getFullName()).frequency();
			},
			hashify: function() {
				var outhash = this.toJSON();
				outhash.frequency = this.getFrequency();
				outhash.fullName = this.getFullName();
				outhash.velocity = this.get("velocity");
				return outhash;
			}
		});
		
		// StepRow collection
		JSAW.Model.PianoRoll.StepRow = Backbone.Collection.extend({
			model: JSAW.Model.PianoRoll.Note,
			isBlank: function() {
				return (this.length < 1);
			}
		});
		
		// Step model
		JSAW.Model.PianoRoll.Step = Backbone.Model.extend({
			initialize: function() {
				this.stepRow = new JSAW.Model.PianoRoll.StepRow;
			},
			isBlank: function() {
				return this.stepRow.isBlank();
			}
		});
		
		// Sequence!
		JSAW.Model.PianoRoll.Sequence = Backbone.Collection.extend({
			model: JSAW.Model.PianoRoll.Step,
			toPattern: function() {
				
			}
		});
		
		JSAW.Model.PianoRoll.Wrapper = Backbone.Model.extend({
			defaults: {
				name: "Sequence",
				num_of_bars: 1,
				start_position: 0,
				end_position: 3
			}
		});
		
	// End JSaw Piano Roll models
	
	/**
	 * JSaw Playlist models
	 */
	JSAW.Model.Playlist = {
		
	};
	

/**
 * JSaw global static object
 */
var jsaw = {};
var myaudio;

var frequencyPattern = function(noteSeq, instr) {
	this.sequence = noteSeq;
	this.instrument = instr;
	//return {sequence: noteSeq, instrument: instr};
};

/**
 * Begin initialising application logic here!
 */
window.onload = function() {
	jsaw.status = new JSAW.Model.Status();
	
	var AudioletApp = function(){
		this.audiolet = new Audiolet();
		var self = this;
		
		this.octave = 1;
		
		var numOfRepeats = 2;
		
		// {name: 'G', octave: 0, velocity: 1.0}
		
		var stepSequence = [
			// Beat 1
			[{name: 'G', octave: 0, velocity: 0.10}, {name: 'G', octave: 1, velocity: 0.10}],
			[{name: 'G', octave: 0, velocity: 0.20}, {name: 'G', octave: 2, velocity: 0.20}],
			[],
			[{name: 'G', octave: 0, velocity: 0.6}],
			// Beat 2
			[{name: 'G', octave: 0, velocity: 0.2}],
			[],
			[{name: 'G#', octave: 0, velocity: 0.6}],
			[{name: 'G#', octave: 0, velocity: 0.6}, {name: 'G#', octave: 2, velocity: 0.6}],
			// Beat 3
			[{name: 'G', octave: 0, velocity: 0.2}],
			[{name: 'G', octave: 0, velocity: 0.4}],
			[],
			[{name: 'G', octave: 0, velocity: 0.6}],
			// Beat 4
			[{name: 'G', octave: 0, velocity: 0.2}],
			[],
			[{name: 'F', octave: 1, velocity: 0.6}],
			[{name: 'G#', octave: 1, velocity: 0.6}]
		];
		
		var kickSequence = [
			// Beat 1
			[{name: 'C', octave: 0, velocity: 0.3}],
			[],
			[],
			[],
			// Beat 2
			[{name: 'C', octave: 0, velocity: 0.3}],
			[],
			[],
			[],
			// Beat 3
			[{name: 'C', octave: 0, velocity: 0.3}],
			[],
			[],
			[],
			// Beat 4
			[{name: 'C', octave: 0, velocity: 0.3}],
			[],
			[],
			[]
		];
		
		var myInstrument = new JSAW.Model.Instrument.Wrapper({
			name: "Derpsynth", 
			type: "synth", 
			generator: Synth, 
			al: self.audiolet, 
			effects: [FXDelay]
		});
		
		var myKickDrum = new JSAW.Model.Instrument.Wrapper({
			name: "Kickdrum", 
			type: "sampler", 
			generator: Sampler, 
			al: self.audiolet, 
			volume: 0.3,
			samplerParams: {sample: 'audio/wayfinder_kick_49_round.wav'}
		});
		
		// Hooray for overcomplication!
		for (var i=0;i<stepSequence.length;i++) {
			var noteArr = [];
			
			for (var j=0;j<stepSequence[i].length;j++) {
				stepSequence[i][j].octave = stepSequence[i][j].octave + 2;
				noteArr.push(stepSequence[i][j]);
			}
			stepSequence[i] = new JSAW.Model.PianoRoll.Step();
			stepSequence[i].stepRow.add(noteArr);
		}
		
		// Hooray for overcomplication!
		for (var i=0;i<kickSequence.length;i++) {
			var noteArr = [];
			
			for (var j=0;j<kickSequence[i].length;j++) {
				noteArr.push(kickSequence[i][j]);
			}
			kickSequence[i] = new JSAW.Model.PianoRoll.Step();
			kickSequence[i].stepRow.add(noteArr);
		}
		
		var playlistSequence = [
			[new frequencyPattern(stepSequence, myInstrument), new frequencyPattern(kickSequence, myKickDrum)],
			[],
			[],
			[],
			
			[new frequencyPattern(stepSequence, myInstrument), new frequencyPattern(kickSequence, myKickDrum)],
			[],
			[],
			[]
		];
		
		var playlistPattern = new PSequence(playlistSequence, 1);
		
		// Set global tempo
		this.audiolet.scheduler.setTempo(120);
		debug(60/this.audiolet.scheduler.bpm);
		
		// This is the epic scheduler.  However, soon to be replaced by sample-based scheduling.
		this.startPlayback = function() {
			this.audiolet.scheduler.play(
				[playlistPattern],
				1,
				function(beat) {
					debug("Beat: ");
					debug(beat);
					if (beat.length > 0) {
						// Child sequence
						_(beat).forEach(function(theSeq) {
							debug("theSeq: ");
							debug(theSeq.instrument.get("type"));
							theSeq.sequence = new PSequence(theSeq.sequence, 1);
							// Internal pattern scheduler
							self.audiolet.scheduler.play(
								[theSeq.sequence],
								0.25,
								function(step) {
									if (!step.isBlank()) {
										step.stepRow.each(function(note) {
											var nf = note.getFrequency();
											theSeq.instrument.voices.create(note.hashify());
											//debug("Instrument")
											//debug("instrument: "+theSeq.instrument.generatorClass);
											//debug("Step trigger");
										})
									}
								}.bind(this)
							);
						});
					}
				}.bind(this)
			);
		};
	};
	myaudio = new AudioletApp();
};
