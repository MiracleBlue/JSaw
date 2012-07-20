require.config({

  paths: {
    jquery: 'lib/jquery-1.7.2',
    underscore: 'lib/underscore-1.3.3',
    backbone: 'lib/backbone-0.9.2',
    handlebars: 'lib/handlebars-1.0.0.beta.6',
    text: 'lib/require-text-2.0.1'
  }

});

require([
  'jquery',
  'ui/pianoroll'
], function($, PianoRoll) {

  var $body = $('body'),
    audiolet = new Audiolet(),
    $play_btn = $('<a href="#">PLAY</a>');

  var roll = new PianoRoll({
    audiolet: audiolet,
    octaves: [4, 5, 6],
    scale: ['B', 'A', 'F', 'D']
  });

  $body.append(roll.render().el);

  $body.append($play_btn);

  $play_btn.click(function() {
    roll.play();
  }); 

});