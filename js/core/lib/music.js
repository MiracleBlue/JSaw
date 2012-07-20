define([
], function() {

  /*
   *  MUSIC.js - a music creation library containing functions and data sets to generate notes, intervals, chords, scales, ...
   *  (currently for twelve-tone equal temperament tuning only)
   *
   *  developed by Greg Jopa and Piers Titus 
   *
   */
   
  var Music = {

    // notes - two dimensional [octave, fifth] - relative to the 'main' note
    notes: {
      'Fb':   [ 6,-10],
      'Cb':   [ 5,-9],
      'Gb':   [ 5,-8],
      'Db':   [ 4,-7],
      'Ab':   [ 4,-6],
      'Eb':   [ 3,-5],
      'Bb':   [ 3,-4],
    
      'F':  [ 2,-3],
      'C':  [ 1,-2],
      'G':  [ 1,-1],
      'D':  [ 0, 0],
      'A':  [ 0, 1],
      'E':  [-1, 2],
      'B':  [-1, 3],
    
      'F#':   [-2, 4], 
      'C#':   [-3, 5],
      'G#':   [-3, 6],
      'D#':   [-4, 7],
      'A#':   [-4, 8],
      'E#':   [-5, 9],
      'B#':   [-5,10]
    },
    
    baseFreq: 440, // A4 'main' note
    baseOffset: [4, 1],    // offset of base note from D0
    
    // intervals - two dimensional [octave, fifth] - relative to the 'main' note
    intervals: {
      'unison':   [ 0, 0],
      'minor second':   [ 3,-5],
      'major second':   [-1, 2],
      'minor third':    [ 2,-3],
      'major third':    [-2, 4],
      'fourth':     [ 1,-1],
      'augmented fourth': [-3, 6],
      'tritone':    [-3, 6],
      'diminished fifth': [ 4,-6],
      'fifth':    [ 0, 1],
      'minor sixth':    [ 3,-4],
      'major sixth':    [-1, 3],
      'minor seventh':  [ 2,-2],
      'major seventh':  [-2, 5],
      'octave':   [ 1, 0]
    },

    intervals_semitones: {
      1:  [ 3,-5],
      2:  [-1, 2],
      3:  [ 2,-3],
      4:  [-2, 4],
      5:  [ 1,-1],
      6:  [-3, 6],
      7:  [ 0, 1],
      8:  [ 3,-4],
      9:  [-1, 3],
      10: [ 2,-2],
      11: [-2, 5]
    },
    
    scales: {
      'major':    ['major second','major third','fourth','fifth','major sixth','major seventh'],
      'natural minor':  ['major second','minor third','fourth','fifth','minor sixth','minor seventh'],
      'harmonic minor': ['major second','minor third','fourth','fifth','minor sixth','major seventh'],
      'major pentatonic': ['major second','major third','fifth','major sixth'],
      'minor pentatonic': ['minor third','fourth','minor sixth','minor seventh']
    }

  };

  return Music;

});