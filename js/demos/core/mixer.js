require([
  'jquery',
  'underscore',
  'backbone',
  'core/channel',
  'core/mixer',
  'core/scheduler',
  'ui/mixer'
], function($, _, Backbone, Channel, Mixer, Scheduler, MixerView) {

  var audiolet = new Audiolet(),
    channel = new Channel({ audiolet: audiolet }),
    channel2 = new Channel({ audiolet: audiolet }),
    channels = new Backbone.Collection([channel, channel2]),
    mixer = new Mixer({ audiolet: audiolet, channels: channels }),
    scheduler = new Scheduler({ audiolet: audiolet });

  // route graph
  mixer.connect(audiolet.output);

  // repease simple chords
  scheduler.play([{ key: 'C' }, { key: 'E' }], function(notes) {
    channel.get('instrument').playNotes([notes[0]]);
    channel2.get('instrument').playNotes([notes[1]]);
  }, 2)

  // build ui
  var mixer_view = new MixerView({
    model: mixer
  });

  $('body').append(mixer_view.render().el);

});