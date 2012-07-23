require([
  'jquery',
  'backbone',
  'core/instrument',
  'core/chain',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'dsp/generators/synth',
  'ui/chain'
], function($, Backbone, Instrument, Chain, Delay, Reverb, Synth, ChainView) {

  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet, generator: Synth }),
    chain = new Chain([], { audiolet: audiolet });

  // route nodes
  instrument.connect(chain.inputs[0]);
  chain.connect(audiolet.output);
  
  // repeat simple chord
  setInterval(function() {
    instrument.playNotes([
      { key: 'E', octave: 2 }
    ]);
  }, 1200);

  var view = new ChainView({
    collection: chain,
    audiolet: audiolet,
    options: [Delay, Reverb]
  });

  window.chain = chain;

  $('body').append(view.render().el);

});