/**
 * Synths
 */
JSAW.AudioNode = {
	"MultiVoiceOscillator": function(audiolet, params){
		var self = this;
		
		this.params = {
			frequency: 500,
			volume: 80/127,
			voices: 3,
			detune: 20
		}
		_(this.params).extend(params);
		
		this.audiolet = audiolet;
		
		// Generate
		var gen = function(audiolet, params) {
			this.params = params;
			
			AudioletGroup.apply(this, [audiolet, 0, 1]);
			
			this.voice = [];
			
			_(JSAW.Util.calculateDetune(
				this.params.frequency, 
				this.params.detune, 
				this.params.voices)).forEach(function(newFrequency){
					this.voice.push(new Saw(audiolet, newFrequency));
				},
				this
			);
			
			this.velocity = new Gain(audiolet, 1.0/this.params.voices);
			
			_(this.voice).forEach(function(osc){
				osc.connect(this.velocity);
			}, this);
			
			this.velocity.connect(this.outputs[0]);
		};
		extend(gen, AudioletGroup);
		
		// Wrapper around generator processing group
		this.generate = function() {
			return new gen(this.audiolet, this.params);
		}
		
	}
}

JSAW.Generator = {
	// Simple Sawtooth.
	// This is a STATIC method, that returns a newly instantiated JSAW.Instrument object.
	"SimpleSaw": function() {
		// Set up your generator function here, with all the node routing stuff, and inherit the AudioletGroup parent class
		var generatorNode = function(params){
			console.group("Synth constructor");
			console.info("Constructing Synth object...");
			
			this.audiolet = params.audiolet;
			var frequency = params.frequency;
			
			AudioletGroup.apply(this, [this.audiolet, 0, 1]);
			
			this.saw = new Saw(this.audiolet, frequency);
			this.modulator = new Sine(this.audiolet, 2 * frequency);
			this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
			
			this.gain = new Gain(this.audiolet);
			this.vel = new Gain(this.audiolet, 0.10);
			
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
			//this.gain.connect(this.saw);
			//this.gain.connect(this.outputs[0]);
			this.gain.connect(this.vel);
			this.vel.connect(this.outputs[0]);
			//this.saw.connect(this.outputs[0]);
			
			console.log(this.audiolet);
			console.groupEnd();
		};
		extend(generatorNode, AudioletGroup);
		
		// Return a new JSAW Instrument
		return new JSAW.Instrument({
			id: 9001,
			name: "Default Simple Saw",
			al: JSAW.audiolet,
			generator: generatorNode
		});
		// End of instrument
	}
	
	// Simple kick sampler
	//"SimpleKick": function()
}

// Really basic sawtooth synth
var Synth = function(params) {
	console.group("Synth constructor");
	console.info("Constructing Synth object...");
	
	this.audiolet = params.audiolet;
	var frequency = params.frequency;
	
	AudioletGroup.apply(this, [this.audiolet, 0, 1]);
	
	this.saw = new Saw(this.audiolet, frequency);
	this.modulator = new Sine(this.audiolet, 2 * frequency);
	this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
	
	this.gain = new Gain(this.audiolet);
	this.vel = new Gain(this.audiolet, 0.10);
	
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
	
	this.gain.connect(this.vel);
	this.vel.connect(this.outputs[0]);
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(Synth, AudioletGroup);



/**
 * Samplers
 */

// Really basic sampler (in this case, a kick drum)
var Sampler = function(params) {
	console.group("Sampler constructor");
	
	this.audiolet = params.audiolet;
	var sampleFile = params.sample;
	
	AudioletGroup.apply(this, [this.audiolet, 0, 1]);
	
	this.sample = new AudioletBuffer(1, 0);
	this.sample.load(sampleFile, false);
	
	this.player = new BufferPlayer(this.audiolet, this.sample, 1, 0, 0);
	this.triggerSample = new TriggerControl(this.audiolet, 0);
	this.gain = new Gain(this.audiolet, 0.01);
	
	this.triggerSample.connect(this.player, 0, 1);
	this.player.connect(this.gain);
	this.gain.connect(this.outputs[0]);
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(Sampler, AudioletGroup);



/**
 * Effects
 */

// Delay
var FXDelay = function(params) {
	console.group("FXDelay constructor");
	
	this.audiolet = params.audiolet;
	
	AudioletGroup.apply(this, [this.audiolet, 1, 1]);
	
	this.delay = new FeedbackDelay(this.audiolet, 0.5, ((60/this.audiolet.scheduler.bpm)*0.8), 0.3, 0.2);
	this.feedback = new Gain(this.audiolet, 0.4);
	
	this.inputs[0].connect(this.delay);
	this.delay.connect(this.feedback);
	this.feedback.connect(this.outputs[0]);
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(FXDelay, AudioletGroup);

/**
 * MixerNode
 * 
 * Acts as a mixer channel, through which all effects chains are routed together and through which all synth audio data gets passed
 */
var MixerNode = function(params) {
	console.group("MixerNode constructor");
	
	var FX = [];
	var effectsList = params.effects || [];
	
	this.audiolet = params.audiolet;
	
	AudioletGroup.apply(this, [this.audiolet, 1, 1]);
	
	this.createRoutes = function() {
		console.debug("Creating routes for audionodes");
		this.gain = new Gain(this.audiolet, 0.8);
		
		if (effectsList.length > 0) {
			for (var i = 0; i < effectsList.length; i++) {
				FX.push(construct(effectsList[i], [{audiolet: this.audiolet}]));
			}
			for (var i = 0; i < FX.length; i++) {
				if (i < 1) {
					this.inputs[0].connect(FX[i]);
					if (FX.length === 1) FX[i].connect(this.gain);
				}
				else if (i < FX.length-1) {
					FX[i].connect(FX[i+1]);
				}
				else {
					FX[i].connect(this.gain);
				}
			}
		}
		else {
			this.inputs[0].connect(this.gain);
		}
		
		console.debug("Pushing to outputs");
		this.gain.connect(this.outputs[0]);
	}.bind(this);
	
	this.FX = FX;
	
	this.createRoutes();
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(MixerNode, AudioletGroup);