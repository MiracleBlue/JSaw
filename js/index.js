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
  'demos/pianoroll'
], function() {
  console.log('demo loaded');
});