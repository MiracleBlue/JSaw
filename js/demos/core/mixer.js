require([
  'jquery',
  'underscore',
  'backbone',
  'core/track',
  'core/mixer',
  'core/scheduler',
  'ui/mixer'
], function($, _, Backbone, Track, Mixer, Scheduler, MixerView) {

  var audiolet = new Audiolet(),
    track = new Track({ audiolet: audiolet }),
    track2 = new Track({ audiolet: audiolet }),
    tracks = new Backbone.Collection([track, track2]),
    mixer = new Mixer({ audiolet: audiolet, tracks: tracks }),
    scheduler = new Scheduler({ audiolet: audiolet });

  // route graph
  mixer.connect(audiolet.output);

  // repease simple chords
  scheduler.play([{ key: 'C' }, { key: 'E' }], function(notes) {
    track.get('instrument').playNotes([notes[0]]);
    track2.get('instrument').playNotes([notes[1]]);
  }, 2)

  // build ui
  var mixer_view = new MixerView({
    model: mixer
  });

  $('body').append(mixer_view.render().el);

});