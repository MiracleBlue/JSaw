// a Note object contains the definition
// for the type of sound an instrument should play
define([
  'backbone'
], function(Backbone) {

  // the `Note` class. example use
  // (playing a simple chord with an instrument):  
  // `
  // var instrument = new Instrument({ audiolet: audiolet }),
  //   a3 = new Note({ key: 'A', octave: 3 }),
  //   a5 = new Note({ key: 'A', octave: 5 }),
  //   notes = new Backbone.Collection([a3, a5]);
  // instrument.playNotes(notes);
  // `
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