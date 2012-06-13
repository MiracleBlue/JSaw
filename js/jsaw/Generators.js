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

JSAW.GeneratorClass = function(generatorClass) {
	var generatorBaseClass = function(audiolet) {
		var self = this;
		self.audiolet = audiolet;
		AudioletGroup.apply(this, [self.audiolet, 0, 1]);
		
		self.parameters = new ParameterGroup({
			"envelope": {
				attack: 0.01,
				release: 0.15
			}
		});
		
		self.voiceArray = ko.observableArray([]).indexed();
		
		self.addVoice = function(generatorObject) {
			self.voiceArray.push(generatorObject);
		};
		
		self.removeVoice = function(generatorObject) {
			if (generatorObject === undefined) {
				//generatorObject = this;
				console.error("BasicSynth: could not call removeVoice, the required generatorObject was undefined.");
				return null;
			}
			return self.voiceArray.remove(generatorObject);
		};
		
		self.createVoice = function(data, callbacks) {
			var newCallbacks = _({
				onComplete: function(){self.removeVoice(this)}
			}).extend(callbacks);
			
			var newParameters = _({
				noteData: data
			}).extend(self.parameters.hashify());
			
			self.addVoice(construct(generatorObject, [self.audiolet, newParameters, newCallbacks]));
		};
	};
	extend(generatorBaseClass, AudioletGroup);
}

JSAW.Generator = {
	
	"BasicSynth": function(audiolet) {
		var self = this;
		self.audiolet = audiolet;
		
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
		self.parameters = new ParameterGroup({
			"envelope": {
				attack: 0.01,
				release: 0.15
			}
		});
		
		self.voiceArray = ko.observableArray([]).indexed();
		
		self.addVoice = function(generatorObject) {
			self.voiceArray.push(generatorObject);
		};
		
		self.removeVoice = function(generatorObject) {
			if (generatorObject === undefined) {
				//generatorObject = this;
				console.error("BasicSynth: could not call removeVoice, the required generatorObject was undefined.");
				return null;
			}
			return self.voiceArray.remove(generatorObject);
		};
		
		self.createVoice = function(data, callbacks) {
			var newCallbacks = _({
				onComplete: function(){self.removeVoice(this)}
			}).extend(callbacks);
			
			var newParameters = _({
				noteData: data
			}).extend(self.parameters.hashify());
			
			self.addVoice(construct(generatorObject, [self.audiolet, newParameters, newCallbacks]));
		}
		
		var generatorNode = function(audiolet, parameters, callbacks) {
			console.group("Synth constructor");
			console.info("Constructing Synth object...");
			
			//var self = this;
			
			//elf.par
			
			this.audiolet = audiolet;
			var frequency = parameters.noteData.frequency;
			
			AudioletGroup.apply(this, [this.audiolet, 0, 1]);
			
			this.saw = new Saw(this.audiolet, frequency);
			this.modulator = new Sine(this.audiolet, 2 * frequency);
			this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
			
			this.gain = new Gain(this.audiolet);
			this.velocity = new Gain(this.audiolet, 0.10);
			
			this.envelope = new PercussiveEnvelope(
				this.audiolet,
				1,// gate control
				(parameters.envelope.attack || 0.01),// attack
				(parameters.envelope.release || 0.15),// release
				function() {
					this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
					this.audiolet.scheduler.addRelative(0, callbacks.onComplete.bind(this));
				}.bind(this)
			);
			
			this.modulator.connect(this.modulatorMulAdd);
			this.modulatorMulAdd.connect(this.saw);
			this.envelope.connect(this.gain, 0, 1);
			this.saw.connect(this.gain);
			//this.gain.connect(this.saw);
			//this.gain.connect(this.outputs[0]);
			this.gain.connect(this.velocity);
			this.velocity.connect(this.outputs[0]);
			//this.saw.connect(this.outputs[0]);
			
			console.log(this.audiolet);
			console.groupEnd();
		};
		extend(generatorNode, AudioletGroup);
	},
	
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
		
		
		// End of instrument
	}
	
	// Simple kick sampler
	//"SimpleKick": function()
}

// Really basic sawtooth synth

var Synth2 = function(config) {
	var self = this;
	var osc = config.osc || Saw;
	
	this.parameters = new ParameterListProxy("reverb", {
		attack: {value: 01, type: 'knob'},
		decay: {value: 15, type: 'knob'},
		release: {value: 05, type: 'knob'}
	});
	this.createGenerator = function(params) {
		params.parameters = this.parameters.hashify();
		params.osc = osc;
		return construct(generatorNode, [params]);
	};
	var generatorNode = function(params) {
		console.group("Synth constructor");
		console.info("Constructing Synth object...");
		console.dir(params);
		
		this.audiolet = params.audiolet;
		var frequency = params.frequency;
		var osc = params.osc || Saw;
		var onStart = params.onStart;
		var onFinish = function(){
			// Do nothing
		};
		if (params.onFinish) onFinish = params.onFinish;
		
		AudioletGroup.apply(this, [this.audiolet, 0, 1]);
		
		this.saw = new osc(this.audiolet, frequency);
		this.modulator = new Sine(this.audiolet, 2 * frequency);
		this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
		
		this.gain = new Gain(this.audiolet);
		this.vel = new Gain(this.audiolet, 0.10);
		
		// Shooting self in the foot.  Freaking damn it!!!  ARGH!
		this.envelope = new SuperEnvelope(
			this.audiolet,
			{
				attack: params.parameters.attack || 0.01,
				decay: params.parameters.decay || 0.15,
				release: params.parameters.release || 0.01
			},
			function() {
				console.log("Removing synth from processing group");
				this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
				// Finish callback
				onFinish();
			}.bind(this)
		);
		
		this.modulator.connect(this.modulatorMulAdd);
		this.modulatorMulAdd.connect(this.saw);
		this.envelope.connect(this.gain, 0, 1);
		this.saw.connect(this.gain);
		
		this.gain.connect(this.vel);
		this.vel.connect(this.outputs[0]);
		
		// Start callback
		onStart();
		
		console.log(this.audiolet);
		console.groupEnd();
	};
	extend(generatorNode, AudioletGroup);
};


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
	
	/*this.envelope = new PercussiveEnvelope(
		this.audiolet,
		1,// gate control
		0.01,// attack
		0.15,// release
		function() {
			this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			console.log("Removing synth from processing group");
		}.bind(this)
	);*/
	
	// Shooting self in the foot.  Freaking damn it!!!  ARGH!
	this.envelope = new SuperEnvelope(
		this.audiolet,
		{
			attack: 0.01,
			decay: 0.15,
			release: 0.01
		},
		function() {
			console.log("Removing synth from processing group");
			//this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			
		}.bind(this)
	);
	
	// Create some parameters for this thing in the UI
	this.parameters = new ParameterList(this.envelope, {
		attack: {value: 01, type: 'knob'},
		decay: {value: 15, type: 'knob'},
		release: {value: 05, type: 'knob'}
	});
	// How verbose!
	
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
 * I can't believe I actually have to create a new envelope component to wrap around this one.  How ridiculous!
 */
var SuperEnvelope = function(audiolet, params, onComplete) {
	// Create the envelope in question
	this.env = new Envelope(audiolet, 1, [0, 1, 0, 0], [params.attack, params.decay, params.release], null, onComplete);
	this.env.attack = this.env.times[0];
	//this.sustain = new ValueProxy(
	this.env.decay = this.env.times[1];
	this.env.release = this.env.times[2];
	// Watch it all break apart into bits!
	return this.env;
}

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
	this.name = ko.observable("FXDelay");
	
	this.audiolet = params.audiolet;
	
	AudioletGroup.apply(this, [this.audiolet, 1, 1]);
	
	this.delay = new FeedbackDelay(this.audiolet, 0.5, ((60/this.audiolet.scheduler.bpm)*0.8), 0.3, 0.2);
	this.feedback = new Gain(this.audiolet, 0.4);
	
	this.parameters = new ParameterList(this.delay, {
		mix: {value: 50, type: 'knob'},
		feedback: {value: 30, type: 'knob'}
	});
	
	this.inputs[0].connect(this.delay);
	this.delay.connect(this.feedback);
	this.feedback.connect(this.outputs[0]);
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(FXDelay, AudioletGroup);

// Reverb
var FXReverb = function(params) {
	console.group("FXReverb constructor");
	this.name = ko.observable("FXReverb");
	
	this.audiolet = params.audiolet;
	
	AudioletGroup.apply(this, [this.audiolet, 1, 1]);
	
	this.reverb = new Reverb(this.audiolet, 0.3, 0.7, 0.5);
	
	/*
	this.parameters = {
			mix: new SmartParameter(this.reverb.mix),
			roomSize: new SmartParameter(this.reverb.roomSize),
			damping: new SmartParameter(this.reverb.damping)
		}*/
	
	
	this.parameters = new ParameterList(this.reverb, {
		mix: {value: 30, type: 'knob'},
		roomSize: {value: 70, type: 'knob'},
		damping: {value: 50, type: 'knob'}
	});
	
	this.inputs[0].connect(this.reverb);
	this.reverb.connect(this.outputs[0]);
	//this.feedback.connect(this.outputs[0]);
	
	console.log(this.audiolet);
	console.groupEnd();
};
extend(FXReverb, AudioletGroup);

/**
 * MixerNode
 * 
 * Acts as a mixer channel, through which all effects chains are routed together and through which all synth audio data gets passed.
 */
var MixerNode = function(params) {
	console.group("MixerNode constructor");
	
	this.audiolet = params.audiolet;
	AudioletGroup.apply(this, [this.audiolet, 1, 1]);
	
	var self = this;
	
	this.id = ++JSAW.count.mixer;
	
	this.name = params.name || "Channel "+this.id;
	this.name = ko.observable(this.name);
	
	var FX = ko.observableArray([]).indexed();
	var effectsList = params.effects || [];
	var outputConnected = false;
	var output = params.output || this.outputs[0];
	
	console.debug("Name: "+this.name());
	console.debug("ID: "+this.id);
	
	
	this.createRoutes = function() {
		console.debug("Creating routes for audionodes");
		this.gain = this.gain || new Gain(this.audiolet, 0.8);
		this.amplitude = this.amplitude || new Amplitude(this.audiolet);
		
		if (effectsList.length > 0) {
			for (var i = 0; i < effectsList.length; i++) {
				FX.push(construct(effectsList[i], [{audiolet: this.audiolet}]));
			}
			effectsList = [];
		}
		
		if (FX().length > 0) {
			for (var i = 0; i < FX().length; i++) {
				if (i < 1) {
					console.debug("Connecting audio to input of first FX");
					this.inputs[0].connect(FX()[i]);
					if (FX().length === 1) {
						console.debug("Only one FX node, so connect it directly to master gain");
						FX()[i].connect(this.gain);
					}
					else {
						console.debug("More than one FX node found, so connect this output to the input of the next node");
						FX()[i].connect(FX()[i+1]);
					}
				}
				else if (i < FX().length-1) {
					console.debug("More than one FX node found, so connect this output to the input of the next node");
					FX()[i].connect(FX()[i+1]);
				}
				else {
					console.debug("Connect the final FX node to the master gain");
					FX()[i].connect(this.gain);
				}
			}
		}
		
		if (FX().length === 0) {
			this.inputs[0].connect(this.gain);
		}
		
		if (!outputConnected) {
			console.debug("Pushing to outputs");
			this.gain.connect(this.amplitude);
			this.gain.connect(output);
			
			outputConnected = true;
		}
	}.bind(this);
	
	this.disconnectAll = function() {
		if (FX().length > 0) {
			this.inputs[0].disconnect(FX()[0]);
			console.debug("Disconnected input channel from the first FX node");
			for (var i = FX().length; i > 0; i--) {
				if (i === FX().length - 1) {
					console.debug("Disconnecting end FX node from gain");
					FX()[i].disconnect(this.gain);
				}
				else {
					console.debug("Disconnecting FX node from its forward sibling");
					FX()[i].disconnect(FX()[i+1]);
				}
			}
		}
		else {
			this.inputs[0].disconnect(this.gain);
		}
	}.bind(this);
	
	this.addEffects = function(effects) {
		this.disconnectAll();
		if (_(effects).isArray()) {
			//FX()[FX().length-1].disconnect(this.gain);
			_(effects).forEach(function(item){
				FX.push(construct(item, [{audiolet: self.audiolet}]));
			});
		}
		else {
			FX.push(construct(effects, [{audiolet: self.audiolet}]));
		}
		this.createRoutes();
	}.bind(this);
	
	this.FX = FX;
	
	this.createRoutes();
	
	console.log(output);
	console.groupEnd();
};
extend(MixerNode, AudioletGroup);