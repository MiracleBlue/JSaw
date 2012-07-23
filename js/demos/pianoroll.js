require([
  'jquery',
  'ui/pianoroll',
  'core/instrument',
  'dsp/generators/synth'
], function($, PianoRoll, Instrument, Synth) {
  
  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet, generator: Synth });

  var roll = new PianoRoll({
    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['E', 'B', 'G#'],
    instrument: instrument
  });

  instrument.connect(audiolet.output);

  $('body').append(roll.render().el);

});