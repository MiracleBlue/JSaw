/**
 * Synths
 */

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
	//this.gain.connect(this.saw);
	//this.gain.connect(this.outputs[0]);
	this.gain.connect(this.vel);
	this.vel.connect(this.outputs[0]);
	//this.saw.connect(this.outputs[0]);
	
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