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
  'gui',
  'ui/pianoroll',
  'core/instrument',
  'core/chain',
  'dsp/generators/synth',
  'dsp/fx/delay',
  'dsp/fx/reverb'
], function($, Backbone, GUI, PianoRoll, Instrument, Chain, Synth, Delay, Reverb) {
  
  var $body = $('body'),
    audiolet = new Audiolet(),
    $play_btn = $('<a href="#">PLAY</a>');

  var delay = new Delay({
    audiolet: audiolet
  });

  var delay_view = new GUI({
    model: delay
  });

  $body.append(delay_view.render().el);

  var reverb = new Reverb({
    audiolet: audiolet
  });

  var reverb_view = new GUI({
    model: reverb
  });

  $body.append(reverb_view.render().el);

  var fx = new Chain([delay], {
    audiolet: audiolet
  });

  var roll = new PianoRoll({

    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['B', 'A', 'F', 'D'],

    instrument: new Instrument({

      audiolet: audiolet,
      generator: Synth,

      fx: new Chain([delay, reverb], {
        audiolet: audiolet
      }),

      attack: 0.01,
      decay: 0.15

    })

  });

  var view = new GUI({

    model: roll.model.get('instrument'),

    params: {

      decay: {
        min: 0.1,
        max: 0.5
      },

      attack: {
        min: 0.01,
        max: 0.5
      }

    }

  });

  $body.append(view.render().el);
  $body.append(roll.render().el);
  $body.append($play_btn);

  $play_btn.click(function() {
    roll.play();
  }); 

});