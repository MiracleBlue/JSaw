require([
  'jquery',
  'core/pianoroll',
  'core/instrument',
  'dsp/gen/synth',
  'ui/pianoroll'
], function($, PianoRoll, Instrument, Synth, PianoRollView) {
  
  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet, generator: Synth });

  // create `PianoRoll`
  var pianoroll = new PianoRoll({
    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['E', 'B', 'G#'],
    instrument: instrument
  });

  // route graph
  instrument.connect(audiolet.output);

  // create UI
  var roll = new PianoRollView({
    audiolet: audiolet,
    model: pianoroll
  });

  // render UI
  $('body').append(roll.render().el);

});