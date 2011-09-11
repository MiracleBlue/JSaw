/**
 * JSaw - JavaScript Audio Workstation
 * @author Nicholas Kircher
 * Copyright 2011
 
 Everything in JSaw is split up into its component parts, and then connected together.
 Each pattern has a collection of tracks, each track is basically a synth which is attached
 to a piano roll.  Piano rolls are collections of step grids which are collections of notes.
 
 */

// Hackery!  Witchery!  Nonsense and bullshit!
function construct(constructor, args) {
	function F() {
		return constructor.apply(this, args);
	}
	F.prototype = constructor.prototype;
	return new F();
}


/**
 * JSAW core
 */

var JSAW = {};

// Static stuff and class definitions
JSAW.Project = Backbone.Model.extend({
	
});

/**
 * JSAW Model Definitions
 */
JSAW.Model = {};
	
	// Sheduling models
	JSAW.Model.Schedule = {};
		// Shedule step model
		JSAW.Model.Shedule.Step = Backbone.Model.extend({
			open: true
		})
	
	// Instrument model
	JSAW.Model.Instrument = {};
		
		// Instrument playlist scheduling collection
		
		// Instrument wrapper model
		JSAW.Model.Instrument.Wrapper = Backbone.Model.extend({
			defaults: {
				type: "synth",		// Can be either "synth" or "sampler"
				name: "Instrument",
				muted: false,
				volume: 1.0,
				panning: 0.5
			},
			
			// Voice handling
			// ** Real voices only.  Support for imaginary voices requires copious amounts of medication.js **
			voices: {
				list: [],
				// Create synth instance, passing an attribute hash from the related note object to the synth constructor
				create: function(noteData) {
					list.push(construct(this.generatorClass, [noteData]));
				}
			},
			
			// Initialize stuff
			initialize: function(options) {
				this.generatorClass = options.generator;
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
				"velocity": 1.0,
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
var JSaw = {
	version: '0.01',
	_is_ready: false,
	bpm: 130,
	
	Class: {
		// Note class
		Note: Backbone.Model.extend({
			defaults: {
				"name": "C",
				"octave": 1,
				"velocity": 1.0,
				"length": 1,
			},
			getFullName: function() {
				return this.get("name") + this.get("octave");
			}
		}),
		
		// Step class
		Step: Backbone.Collection.extend({
			model: JSaw.Class.Note,
			isBlank: function(){
				return (this.length < 1);
			}
		}),
		
		
	},
	
}

/**
 * The awesome JSaw pattern object!
 */
var JSawPattern = function (params) {
	
}

/**
 * The awesome JSaw Piano Roll!
 */
var PianoRoll = function(params){
	this.options = {
		beats: 4,			// Number of beats (length of the piano roll sequence)
		steps_per_beat: 4,	// Number of steps in a beat (step resolution)
		bars: 1
	};
	
	// The Step Grid; a horizontally-mapped list of step objects.
	this.stepGrid = new Array(this.options.steps_per_beat*this.options.beats);
	
	$.each(this.stepGrid, function(key, value){
		//value = new Step();
		value = new PRStep;
	});
	//this.stepGrid = (params.stepGrid ? params.stepGrid : new Array(this.options.steps_per_beat*this.options.beats));
};

var PRNote = Backbone.Model.extend({
	defaults: {
		"name": "C",
		"octave": 1,
		"velocity": 1.0,
		"length": 1,
	},
	getFullName: function() {
		return this.get("name") + this.get("octave");
	}
});

// Extensive, descriptive, Note information storage class.
/*var ExtNote = function(params) {
	// Setting defaults
	this.name = 'C';	// Latin name of note
	this.octave = 0;	// The note octave relative to the base octave
	this.velocity = 1;	// Velocity of note (volume)
	
	this.name = (params.name ? params.name : this.name);
	this.octave = (params.octave ? params.octave : this.octave);
	this.velocity = (params.velocity ? params.velocity : this.velocity);
	
	// Return note latin name and absolute octave as a string
	this.noteFromOctave = function(octave) {
		return this.name + (octave + this.octave);
	};
	
	return this;
};*/

var PRStep = Backbone.Collection.extend({
	model: PRNote,
	isBlank: function(){
		return (this.length < 1);
	}
});


// Step class, for an individual step in a sequence
var Step = function(options) {
	this.defaults = {
		notes: [
			//new ExtNote({name: 'A', octave: 0, velocity: 1}),
			//new ExtNote({name: 'D', octave: 1, velocity: 1})
		],
		position: 0
	}
	
	this.notes = (options.notes ? options.notes : this.defaults.notes);
	this.position = (options.position ? options.position : this.defaults.position);
	
	// Add notes to this step
	this.addNotes = function(notes) {
		if (typeof notes.length == "number") {
			for (i=0; i<notes.length; i++) {
				this.notes.push(notes[i]);
			}
		}
		
		
		return this; // Chainability!
	};
	
	// Remove a particular note object
	this.removeNote = function(index) {
		this.notes.remove(index);
		
		return this; // Chainability!
	}
	
	// Clears all note objects from this step, effectively making it a blank step
	this.clearAllNotes = function() {
		this.notes = [];
		
		return this; // Chainability!
	};
	
	// Is this a blank/dead step?
	this.isDead = function() {
		if (this.notes.length < 1) return true;
		return false;
	};
	
	return this;
};


/**
 * Begin initialising application logic here!
 */
window.onload = function() {
	var Synth = function(audiolet, frequency) {
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
		this.sine = new Saw(this.audiolet, frequency);
		this.modulator = new Sine(this.audiolet, 2 * frequency);
		this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
		
		this.gain = new Gain(this.audiolet);
		
		this.envelope = new PercussiveEnvelope(
			this.audiolet,
			1,// gate control
			0.01,// attack
			0.15,// release
			function() {
				this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			}.bind(this)
		);
		
		this.modulator.connect(this.modulatorMulAdd);
		this.modulatorMulAdd.connect(this.sine);
		this.envelope.connect(this.gain, 0, 1);
		this.sine.connect(this.gain);
		this.gain.connect(this.outputs[0]);
	};
	extend(Synth, AudioletGroup);
	
	var AudioletApp = function(){
		this.audiolet = new Audiolet();
		var self = this;
		
		this.octave = 1;
		
		var numOfRepeats = 2;
		/*
		var stepSequence = [
			// Beat 1
			[new ExtNote({name: 'A', octave: 0})],
			[new ExtNote({name: 'A', octave: 0})],
			[],
			[new ExtNote({name: 'A#', octave: 0})],
			// Beat 2
			[new ExtNote({name: 'A#', octave: 0})],
			[],
			[new ExtNote({name: 'D', octave: 1})],
			[new ExtNote({name: 'D', octave: 1})],
			// Beat 3
			[new ExtNote({name: 'A', octave: 0})],
			[new ExtNote({name: 'A', octave: 0})],
			[],
			[new ExtNote({name: 'A#', octave: 0})],
			// Beat 4
			[new ExtNote({name: 'A#', octave: 0})],
			[],
			[new ExtNote({name: 'D', octave: 1})],
			[new ExtNote({name: 'D', octave: 1})]
		];
		*/
		var stepSequence = [
			// Beat 1
			[['G',0],['G',1]],
			[['G',0],['G',2]],
			[],
			[['G',0]],
			// Beat 2
			[['G',0]],
			[],
			[['G#',0]],
			[['G#',0],['G#',2]],
			// Beat 3
			[['G',0]],
			[['G',0]],
			[],
			[['G',0]],
			// Beat 4
			[['G',0]],
			[],
			[['F',1]],
			[['G#',1]]
		];
		
		// Hooray for overcomplication!
		for (i=0;i<stepSequence.length;i++) {
			var noteArr = [];
			//stepSequence[i] = new Step({notes: noteArr, position: i});
			
			for (j=0;j<stepSequence[i].length;j++) {
				//noteArr.push(new ExtNote({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]}));
				noteArr.push(new PRNote({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]}));
			}
			stepSequence[i] = new PRStep(noteArr);
		}
		
		var frequencyPattern = new PSequence(stepSequence, numOfRepeats);
		
		// Set global tempo
		this.audiolet.scheduler.setTempo(130);
		
		// Initialise sheduler and begin processing
		this.audiolet.scheduler.play(
			[frequencyPattern], // Value arrays to iterate over in callback
			0.25, // Quarter of a beat, 4 steps per beat (0.25)
			function(step) {
				if (!step.isDead()){
					for (i=0;i<step.notes.length;i++){
						var nf = Note.fromLatin(step.notes[i].noteFromOctave(this.octave));
						var synth1 = new Synth(this.audiolet, nf.frequency());
						var synth2 = new Synth(this.audiolet, (nf.frequency()+3.2));
						var synth3 = new Synth(this.audiolet, (nf.frequency()-1.5));
						synth1.connect(this.audiolet.output);
						synth2.connect(this.audiolet.output);
						//synth3.connect(this.audiolet.output);
					}
				}
			}.bind(this)
		);
	};
	var myaudio = new AudioletApp();
};
