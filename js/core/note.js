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
], function() {

  var Note = Backbone.Model.extend({
    defaults: {

      key: 'C',
      octave: 3,
      velocity: 1,
      duration: 1,

      // technically, only the piano roll should
      // really care about the bar/step of each note. but because of
      // rendering complexities, the note needs to have these properties.
      // ideally, these should not be part of the `Note` object.
      bar: 0,
      step: 0

    }
  });

  return Note;

});