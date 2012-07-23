require([
  'jquery',
  'backbone',
  'core/instrument',
  'core/chain',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'ui/chain'
], function($, Backbone, Instrument, Chain, Delay, Reverb, ChainView) {

  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet }),
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