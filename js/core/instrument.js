// an `Instrument` is responsible for providing
// an enhanced interface to a `Generator`. a generator on it's
// own can only play some sound. an `Instrument` dictates ways
// that sound should be used. having the `Generator` playing
// a specific key at a specific time for a specific length, for instance.

// `
// var Keyboard = new Instrument({  
//   audiolet: audiolet,  
//   generator: Synth
// });
// keyboard.connect(audiolet.output);
// keyboard.playNotes([{ key: 'C' }]);
// `
define([
	'lodash',
	'backbone',
	'lib/JSam/lib/note',
	'core/note',
	'lib/JSam/core/chain',
	'lib/JSam/core/model',
	'dsp/gen/synth'
], function (_, Backbone, LibNote, Note, Chain, Model, Synth) {

	// this `Notes` collection enables the `playNotes`
	// to accept simple javascript objects instead
	// of only `Note` objects
	var Notes = Backbone.Collection.extend({
		model:Note
	});

	var ParameterStore = Backbone.Model.extend({

	});

	var Instrument = Model.extend({

		// an `Instrument` requires 1 attribute:
		// `generator`: a `Generator` from which the
		// `Instrument` should derive it's sound
		defaults:{
			generator:Synth
		},

		parameters: null,

		constructor:function (attrs, options) {
			Model.apply(this, [attrs, options, 0, 1]);
		},

		initialize:function (attrs, options) {
			_.bindAll(this, 'playNotes');

			this.parameters = new ParameterStore(this.get("generator").prototype.defaults);

			console.log(this);
		},

		// `playNotes` accepts a `Collection` of `Note` objects, or an array
		// of javascript objects, and will play each `Note` in the `Collection`
		// when triggered.
		playNotes: function (notes) {

			var self = this,
				audiolet = self.audiolet;


			// allow the user to pass in
			// an array of javascript objects
			// instead of only a `Collection`
			if (_.isArray(notes)) {
				notes = new Notes(notes);
			}

			notes.each(function (note) {

				var name, frequency, generator;
				name = note.get('key') + note.get('octave');
				frequency = LibNote.fromLatin(name).frequency();

				// `playNotes` uses the `Instrument`'s `Generator` class to create
				// a new sound for each `Note` in the `Collection`.
				// the `frequency` of the note is derived from the `key` and `octave`
				// properties of the `Note`.
				generator = new (self.get('generator'))({
					frequency:frequency
				}, { audiolet:audiolet });

				// at the moment, the generators `Envelope`
				// is responsible for diminishing the `Note`
				// after it's given duration, at which point
				// it triggers a `complete` event. when triggered
				// we disconnect the generator from the graph
				// since it's no longer needed.
				generator.on('complete', function () {
					generator.disconnect(self.outputs[0]);
				});

				generator.connect(self.outputs[0]);

			});

		}

	});

	return Instrument;

});