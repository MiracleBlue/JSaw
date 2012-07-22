// the `Instrument` class is a model who is responsible for
// scheduling `Note` objects for playback by a given `Generator`. 
define([
  'underscore',
  'backbone',
  'core/lib/note',
  'core/note',
  'core/chain',
  'dsp/generators/synth',
  'dsp/misc/mixer'
], function(_, Backbone, LibNote, Note, Chain, Synth, Mixer) {

  var Notes = Backbone.Collection.extend({
    model: Note
  });

  // the `Instrument` class. example use
  // (an `Instrument` using the `Synth` `Generator`, who
  // exposes a public `attack` property):  
  // `
  // var Keyboard = new Instrument({  
  //   audiolet: audiolet,  
  //   generator: Synth,  
  //   attack: 0.01  
  // });
  // `
  var Instrument = Backbone.Model.extend(_.extend({}, AudioletGroup.prototype, {

    // an `Instrument` only needs 2 attributes.
    // the `audiolet` context, for audio playback,
    // and a `Generator` class which is used to create the instrument voices.
    defaults: {
      audiolet: null,
      generator: Synth,
      fx: null
    },

    initialize: function() {
      Backbone.Model.prototype.initialize.apply(this, arguments);
      AudioletGroup.apply(this, [this.get('audiolet'), 0, 1]);
    },

    // an `Instrument` has one primary method of interaction, `playNotes`.
    // `playNotes` accepts a `Collection` of `Note` objects,
    // and will play each `Note` in the `Collection` when triggered.
    playNotes: function(notes) {

      var self = this,
        audiolet = self.get('audiolet'),
        name, frequency, generator;

      // user can pass in a collection
      // or an array of notes which will be turned into a collection
      if (_.isArray(notes)) {
        notes = new Notes(notes);
      }

      notes.each(function(note) {

        name = note.get('key') + note.get('octave');
        frequency = LibNote.fromLatin(name).frequency();

        // `playNotes` uses the `Instrument`'s `Generator` class to create
        // a new sound for each `Note` in the `Collection`.
        // the `frequency` of the note is derived from the `key` and `octave`
        // properties of the `Note`.
        generator = new (self.get('generator'))({
          audiolet: audiolet,
          frequency: frequency
        });

        generator.on('complete', function() {
          generator.disconnect(self.outputs[0]);
        });

        generator.connect(self.outputs[0]);

      });

    }

  }));

  return Instrument;

});