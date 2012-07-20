require.config({

  paths: {
    jquery: 'lib/jquery-1.7.2',
    underscore: 'lib/underscore-1.3.3',
    backbone: 'lib/backbone-0.9.2',
    handlebars: 'lib/handlebars-1.0.0.beta.6',
    gui: 'lib/backbone.gui-0.0.1',
    text: 'lib/require-text-2.0.1'
  }

});

require([
  'jquery',
  'gui',
  'ui/pianoroll',
  'core/instrument',
  'dsp/generators/synth'
], function($, GUI, PianoRoll, Instrument, Synth) {

  var $body = $('body'),
    audiolet = new Audiolet(),
    $play_btn = $('<a href="#">PLAY</a>');

  var roll = new PianoRoll({

    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['B', 'A', 'F', 'D'],

    instrument: new Instrument({
      audiolet: audiolet,
      generator: Synth,
      attack: 0.01,
      decay: 0.15
    })

  });

  var view = new GUI.View({

    model: roll.model.get('instrument'),

    gui: {

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