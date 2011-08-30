/**
 * JSaw - JavaScript Audio Workstation
 * @author Nicholas Kircher
 */

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/**
 * JSaw global static object
 */
var JSaw = {
	version: '0.01',
	_is_ready: false
}

/**
 * The awesome JSaw Piano Roll!
 */
var PianoRoll = function(params){
	this.options = {
		beats: 4,			// Number of beats (length of the piano roll sequence)
		steps_per_beat: 4	// Number of steps in a beat (step resolution)
	};
	
	this.stepGrid = new Array(this.options.steps_per_beat*this.options.beats);
	
	$.each(this.stepGrid, function(key, value){
		value = new Step();
	});
	//this.stepGrid = (params.stepGrid ? params.stepGrid : new Array(this.options.steps_per_beat*this.options.beats));
};

// Extensive, descriptive, Note information storage class.
var ExtNote = function(params) {
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
};

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
			for (j=0;j<stepSequence[i].length;j++) {
				noteArr.push(new ExtNote({name: stepSequence[i][j][0], octave: stepSequence[i][j][1]}));
			}
			stepSequence[i] = new Step({notes: noteArr, position: i});
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
