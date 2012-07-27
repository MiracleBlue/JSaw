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
  'underscore',
  'backbone',
  'core/scheduler',
  'core/mixer',
  'ui/mixer',
  'ui/nav'
], function($, _, Backbone, Scheduler, Mixer, MixerView, NavView) {

  // set up tracks

  // set up mixer

  var audiolet = new Audiolet(),
    scheduler = new Scheduler({ audiolet: audiolet }),
    mixer = new Mixer({ audiolet: audiolet });

  mixer.connect(audiolet.output);

  // build ui

  var nav_view = new NavView({
    model: scheduler
  });

  var mixer_view = new MixerView({
    model: mixer
  });

  $('body').append(nav_view.render().el);
  $('body').append(mixer_view.render().el);

});