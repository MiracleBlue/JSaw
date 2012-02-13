/**
 * JSaw Core
 * 
 * Tests for checking the integrity of the various JSaw core components
 */

JSAW.Test = JSAW.Test || {};

JSAW.Test.Instrument = {
	synth: function() {
		console.group("JSaw Synth Instrument Test");
		
		console.debug("Constructing new instrument");
		this.basicSynth = new JSAW.Instrument({
			id: 1,
			name: "Basic Synth Test",
			al: JSAW.audiolet,
			effects: [FXDelay]	// With delay effects!
		});
		
		console.debug("Testing voice creation");
		/*this.basicSynth.voices.create([
			new JSAW.Note({key: "A", octave: 3}),
			new JSAW.Note({key: "C", octave: 4}),
			new JSAW.Note({key: "E", octave: 4}),
		]);*/
		
		// A simple note sequence, written out in JSaw Notation Format
		var stepSequence = [
			// Beat 1
			[{key: 'G', octave: 3, velocity: 0.10}, {key: 'G', octave: 4, velocity: 0.10}],
			[{key: 'G', octave: 3, velocity: 0.20}, {key: 'G', octave: 5, velocity: 0.20}],
			[],
			[{key: 'G', octave: 3, velocity: 0.6}],
			// Beat 2
			[{key: 'G', octave: 3, velocity: 0.2}],
			[],
			[{key: 'G#', octave: 3, velocity: 0.6}],
			[{key: 'G#', octave: 3, velocity: 0.6}, {key: 'G#', octave: 5, velocity: 0.6}],
			// Beat 3
			[{key: 'G', octave: 3, velocity: 0.2}],
			[{key: 'G', octave: 3, velocity: 0.4}],
			[],
			[{key: 'G', octave: 3, velocity: 0.6}],
			// Beat 4
			[{key: 'G', octave: 3, velocity: 0.2}],
			[],
			[{key: 'F', octave: 4, velocity: 0.6}],
			[{key: 'G#', octave: 4, velocity: 0.6}]
		];
		
		this.myPattern = new JSAW.Pattern({pattern: stepSequence});
		this.myTrack = new JSAW.Track({instrument: this.basicSynth, pattern: this.myPattern });
		
		this.myTrack.startPlayback();
		
		//console.dir(this.myTrack);
		
		console.info("Instrument object contents:");
		console.dir(this.basicSynth);
		
		console.groupEnd();
	},
	
	sampler: function() {
		console.group("JSaw Sampler Instrument Test");
		
		console.debug("Constructing new instrument");
		this.kickDrumSampler = new JSAW.Instrument({
			id: 2,
			name: "Kick Drum Test", 
			type: "sampler", 
			generator: Sampler, 
			al: JSAW.audiolet,
			volume: 0.3,
			samplerParams: {sample: 'audio/wayfinder_kick_49_round.wav'}
		});
		
		console.debug("Testing sample triggering");
		this.kickDrumSampler.voices.create(new JSAW.Note({key: "A"}));
		
		console.info("Instrument object contents:");
		console.dir(this.kickDrumSampler);
		
		console.groupEnd();
	}
};
