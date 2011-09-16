/**
 * JSaw - JavaScript Audio Workstation
 * @author Nicholas Kircher
 * Copyright 2011
 
 Everything in JSaw is split up into its component parts, and then connected together.
 Each pattern has a collection of tracks, each track is basically a synth which is attached
 to a piano roll.  Piano rolls are collections of step grids which are collections of notes.
 
 */

function debug(msg) {
	var dbg_on = true;
	if (dbg_on) console.log(msg);
}

// Hackery!  Witchery!  Nonsense and bullshit!
function construct(derpyfunc, args) {
	//console.log(derpyfunc);
	function F(derpyfunc) {
		return derpyfunc.apply(this, args);
	}
	F.prototype = derpyfunc.prototype;
	return new F(derpyfunc);
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
		JSAW.Model.Schedule.Step = Backbone.Model.extend({
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
					noteData.audiolet = this.self.al;
					//console.log(this.self);
					var voiceObj = construct(this.self.generatorClass, [noteData]);
					voiceObj.connect(this.self.al.output);
					this.list.push(voiceObj);
					debug("Voice created");
					debug(noteData);
				}
			},
			
			// Initialize stuff
			initialize: function(options) {
				debug("Instrument wrapper init");
				debug(options);
				this.al = options.al;
				this.generatorClass = options.generator;
				//console.log(this.generatorClass);
				this.voices.self = this;
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



/**
 * Begin initialising application logic here!
 */
window.onload = function() {
	var Synth = function(params) {
		//debug("Creating synth instance");
		var audiolet = params.audiolet;
		var frequency = params.frequency;
		
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
		this.saw = new Saw(this.audiolet, frequency);
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
		this.modulatorMulAdd.connect(this.saw);
		this.envelope.connect(this.gain, 0, 1);
		this.saw.connect(this.gain);
		this.gain.connect(this.outputs[0]);
	};
	extend(Synth, AudioletGroup);
	
	var AudioletApp = function(){
		this.audiolet = new Audiolet();
		var self = this;
		
		this.octave = 1;
		
		var numOfRepeats = 2;
		
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
		
		var playlistSequence = [
			[stepSequence],
			[],
			[],
			[],
			
			[stepSequence],
			[],
			[],
			[]
		];
		
		var myInstrument = new JSAW.Model.Instrument.Wrapper({name: "Derpsynth", type: "synth", generator: Synth, al: self.audiolet});
		
		// Hooray for overcomplication!
		for (i=0;i<stepSequence.length;i++) {
			var noteArr = [];
			//stepSequence[i] = new Step({notes: noteArr, position: i});
			
			for (j=0;j<stepSequence[i].length;j++) {
				//noteArr.push(new ExtNote({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]}));
				//noteArr.push(new PRNote({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]}));
				noteArr.push({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]+2});
			}
			//stepSequence[i] = new PRStep(noteArr);
			stepSequence[i] = new JSAW.Model.PianoRoll.Step();
			stepSequence[i].stepRow.add(noteArr);
		}
		
		var playlistPattern = new PSequence(playlistSequence, 1);
		var frequencyPattern = new PSequence(stepSequence, numOfRepeats);
		
		// Set global tempo
		this.audiolet.scheduler.setTempo(130);
		
		this.audiolet.scheduler.play(
			[playlistPattern],
			1,
			function(beat) {
				if (beat.length > 0) {
					_(beat).forEach(function(theSeq) {
						theSeq = new PSequence(theSeq, 1);
						self.audiolet.scheduler.play(
							[theSeq],
							0.25,
							function(step) {
								if (!step.isBlank()) {
									step.stepRow.each(function(note) {
										var nf = note.getFrequency();
										myInstrument.voices.create({frequency: nf});
									})
								}
							}.bind(this)
						);
					});
				}
			}.bind(this)
		);
		
		// Initialise sheduler and begin processing
		/*this.audiolet.scheduler.play(
			[frequencyPattern], // Value arrays to iterate over in callback
			0.25, // Quarter of a beat, 4 steps per beat (0.25)
			function(step) {
				if (!step.isBlank()){
					/*for (i=0;i<step.notes.length;i++){
						var nf = Note.fromLatin(step.notes[i].noteFromOctave(this.octave));
						var synth1 = new Synth(this.audiolet, nf.frequency());
						var synth2 = new Synth(this.audiolet, (nf.frequency()+3.2));
						var synth3 = new Synth(this.audiolet, (nf.frequency()-1.5));
						synth1.connect(this.audiolet.output);
						synth2.connect(this.audiolet.output);
						//synth3.connect(this.audiolet.output);
					}*//*
					step.stepRow.each(function(note) {
						var nf = note.getFrequency();
						myInstrument.voices.create({frequency: nf});
					})
				}
			}.bind(this)
		);*/
	};
	var myaudio = new AudioletApp();
};
