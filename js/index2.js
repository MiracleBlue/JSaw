require.config({

  paths: {
    jquery: 'lib/jquery-1.7.2',
    underscore: 'lib/underscore-1.3.3',
    backbone: 'lib/backbone-0.9.2',
    handlebars: 'lib/handlebars-1.0.0.beta.6',
    gui: 'lib/backbone.gui/js/src/view',
    text: 'lib/require-text-2.0.1'
  }

});

require([
  'jquery',
  'backbone',
  'core/instrument',
  'core/chain',
  'dsp/fx/delay',
  'dsp/fx/reverb'
], function($, Backbone, Instrument, Chain, Delay, Reverb) {

  var audiolet = new Audiolet(),
    instrument = new Instrument({ audiolet: audiolet }),
    chain = new Chain([], { audiolet: audiolet }),
    delay = new Delay({ audiolet: audiolet }),
    reverb = new Reverb({ audiolet: audiolet });

  instrument.connect(chain.inputs[0]);
  chain.add(delay);
  chain.add(reverb);
  chain.connect(audiolet.output);
  
  instrument.playNotes([{
    key: 'E'
  }, {
    key: 'B'
  }]);

});