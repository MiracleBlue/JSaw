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
		generator: Synth,
		muted: false,
		volume: 0.8,
		pan: 0.5,
		effects: []
	}
	_(this.options).extend(options);
	
	this.options.name = ko.observable(this.options.name);
	
	console.group("Instrument ("+this.options.type+"): '"+this.options.name()+"'");
	
	// this.al is the primary AudioLet object
	this.al = this.options.audiolet;
	this.generatorClass = this.options.generator;
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
				
				var voiceObj = construct(this.self.generatorClass, [noteData]);
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