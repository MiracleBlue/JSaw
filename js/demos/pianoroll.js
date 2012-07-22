require([
  'jquery',
  'ui/pianoroll',
  'core/instrument'
], function($, PianoRoll, Instrument) {
  
  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet });

  var roll = new PianoRoll({
    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['E', 'B', 'G#'],
    instrument: instrument
  });

  instrument.connect(audiolet.output);

  $('body').append(roll.render().el);

});