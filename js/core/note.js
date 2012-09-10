// a `Note` object contains the definition for
// how an `Instrument` should treat a particular
// `Generator`. the generator's frequency,
// duration, etc.

// `
// var audiolet = new Audiolet(),
//   instrument = new Instrument({ audiolet: audiolet, generator: Synth }),
//   note = new Note({ key: 'A', octave: 5 });
// instrument.playNotes([note]);
// `
define([
  'backbone'
], function(Backbone) {

  var Note = Backbone.Model.extend({
    defaults: {
      key: 'C',
      octave: 3,
      velocity: 1,
      duration: 1
    }
  });

  return Note;

});