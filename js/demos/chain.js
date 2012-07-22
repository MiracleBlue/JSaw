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
    delay = new Delay({ audiolet: audiolet }),
    reverb = new Reverb({ audiolet: audiolet })
    chain = new Chain([delay, reverb], { audiolet: audiolet });

  // route nodes
  instrument.connect(chain.inputs[0]);
  chain.connect(audiolet.output);
  
  // repeat simple chord
  setInterval(function() {
    instrument.playNotes([
      { key: 'E', octave: 2 }
    ]);
  }, 1200);

  // make fx chain ui
  delay.set('name', 'delay');
  reverb.set('name', 'reverb');

  var view = new ChainView({
    collection: chain
  });

  $('body').append(view.render().el);

});