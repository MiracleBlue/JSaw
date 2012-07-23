// this demo shows how to use a `Chain` to
// control the routing of a group of nodes.
// it also demonstrates the default `Chain` UI.
require([
  'jquery',
  'core/chain',
  'core/instrument',
  'dsp/gen/synth',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'ui/chain'
], function($, Chain, Instrument, Synth, Delay, Reverb, ChainView) {

  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet, generator: Synth }),
    reverb = new Reverb({ audiolet: audiolet });

  // create `Chain`
  var chain = new Chain([reverb], { audiolet: audiolet });

  // route graph
  instrument.connect(chain.inputs[0]);
  chain.connect(audiolet.output);
  
  // repeat simple chord
  // using setInterval for clarity-
  // ideally you should use the Audiolet scheduler
  setInterval(function() {
    instrument.playNotes([
      { key: 'E', octave: 2 }
    ]);
  }, 1200);

  // create UI
  var view = new ChainView({
    collection: chain,
    audiolet: audiolet,
    options: [Delay, Reverb]
  });

  // render UI
  $('body').append(view.render().el);

});