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
		var basicSynth = new JSAW.Instrument({
			id: 1,
			name: "Basic Synth Test",
			al: JSAW.audiolet,
			effects: [FXDelay]	// With delay effects!
		});
		
		console.debug("Testing voice creation");
		basicSynth.voices.create([
			new JSAW.Note({key: "A", octave: 3}),
			new JSAW.Note({key: "C", octave: 4}),
			new JSAW.Note({key: "E", octave: 4}),
		]);
		
		var stepSequence = [
			// Beat 1
			[{key: 'G', octave: 0, velocity: 0.10}, {key: 'G', octave: 1, velocity: 0.10}],
			[{key: 'G', octave: 0, velocity: 0.20}, {key: 'G', octave: 2, velocity: 0.20}],
			[],
			[{key: 'G', octave: 0, velocity: 0.6}],
			// Beat 2
			[{key: 'G', octave: 0, velocity: 0.2}],
			[],
			[{key: 'G#', octave: 0, velocity: 0.6}],
			[{key: 'G#', octave: 0, velocity: 0.6}, {key: 'G#', octave: 2, velocity: 0.6}],
			// Beat 3
			[{key: 'G', octave: 0, velocity: 0.2}],
			[{key: 'G', octave: 0, velocity: 0.4}],
			[],
			[{key: 'G', octave: 0, velocity: 0.6}],
			// Beat 4
			[{key: 'G', octave: 0, velocity: 0.2}],
			[],
			[{key: 'F', octave: 1, velocity: 0.6}],
			[{key: 'G#', octave: 1, velocity: 0.6}]
		];
		
		
		
		console.info("Instrument object contents:");
		console.dir(basicSynth);
		
		console.groupEnd();
	},
	
	sampler: function() {
		console.group("JSaw Sampler Instrument Test");
		
		console.debug("Constructing new instrument");
		var kickDrumSampler = new JSAW.Instrument({
			id: 2,
			name: "Kick Drum Test", 
			type: "sampler", 
			generator: Sampler, 
			al: JSAW.audiolet,
			volume: 0.3,
			samplerParams: {sample: 'audio/wayfinder_kick_49_round.wav'}
		});
		
		console.debug("Testing sample triggering");
		kickDrumSampler.voices.create(new JSAW.Note({key: "A"}));
		
		console.info("Instrument object contents:");
		console.dir(kickDrumSampler);
		
		console.groupEnd();
	}
};
