// the `Instrument` class is a model who is responsible for
// scheduling `Note` objects for playback by a given `Generator`. 
define([
  'underscore',
  'backbone',
  'core/lib/note',
  'dsp/generators/synth',
  'dsp/misc/mixer'
], function(_, Backbone, LibNote, Synth, Mixer) {

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
  var Instrument = Backbone.Model.extend({

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
      this.build();
    },

    build: function() {

      // make sure we have a working FX chain
      // if one is not passed in
      if (!this.get('fx')) {
        this.set('fx', new Backbone.Collection());
      }

      this.mixer = new Mixer({
        audiolet: this.get('audiolet'),
        fx: this.get('fx')
      });

      this.route();
    
    },

    route: function() {
      this.mixer.connect(this.get('audiolet').output);
    },

    // an `Instrument` has one primary method of interaction, `playNotes`.
    // `playNotes` accepts a `Collection` of `Note` objects,
    // and will play each `Note` in the `Collection` when triggered.
    playNotes: function(notes) {

      var self = this,
        audiolet = self.get('audiolet'),
        name, frequency, generator;

      notes.each(function(note) {

        name = note.get('key') + note.get('octave');
        frequency = LibNote.fromLatin(name).frequency();

        // `playNotes` uses the `Instrument`'s `Generator` class to create
        // a new sound for each `Note` in the `Collection`.
        // the `frequency` of the note is derived from the `key` and `octave`
        // properties of the `Note`.

        // any non-requisite attributes explicitly given
        // to the `Instrument` on instantiation will be passed to the `Generator`.
        // this means new `Generator`s will reflect changes made to attributes
        // of the `Instrument` itself. in the example above, this means generators
        // created by the `keyboard` `Instrument` will always be passed the latest
        // `attack` value to each new `Generator`.
        generator = new (self.get('generator'))(_.extend({
          frequency: frequency
        }, self.attributes));

        generator.on('complete', function() {
          generator.disconnect(self.mixer.inputs[0]);
        });

        // AudioletNode.prototype.connect checks if
        // the node in the argument is instanceof AudioletGroup
        // but our extended object doesn't match the instanceof check.
        // as such you must connect to the input directly, for now.
        generator.connect(self.mixer.inputs[0]);

      });

    }

  });

  return Instrument;

});