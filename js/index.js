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
  'core/instrument',
  'ui/mixer',
  'ui/scheduler'
], function($, _, Backbone, Scheduler, Mixer, Instrument, MixerView, SchedulerView) {

  // set up tracks

  // set up mixer

  var audiolet = new Audiolet(),
    scheduler = new Scheduler({ audiolet: audiolet });

  var instrument = new Instrument({ audiolet: audiolet }),
    instrument2 = new Instrument({ audiolet: audiolet });

  var mixer = new Mixer({ audiolet: audiolet }),
    channels = mixer.get('channels'),
    channel_1 = channels.at(0),
    channel_2 = channels.at(1);

  // route graph
  instrument.connect(channel_1.inputs[0]);
  instrument2.connect(channel_2.inputs[0]);
  mixer.connect(audiolet.output);

  // repease simple chords
  scheduler.play([{ key: 'C' }, { key: 'E' }], function(notes) {
    instrument.playNotes([notes[0]]);
    instrument2.playNotes([notes[1]]);
  }, 2)

  // build ui
  var mixer_view = new MixerView({
    model: mixer
  });

  var scheduler_view = new SchedulerView({
    model: scheduler
  });

  $('body').append(mixer_view.render().el);
  $('body').append(scheduler_view.render().el);

});