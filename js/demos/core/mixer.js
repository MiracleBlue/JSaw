require([
  'jquery',
  'underscore',
  'backbone',
  'core/track',
  'core/mixer',
  'ui/mixer'
], function($, _, Backbone, Track, Mixer, MixerView) {

  var audiolet = new Audiolet(),
    track = new Track({ audiolet: audiolet }),
    track2 = new Track({ audiolet: audiolet }),
    tracks = new Backbone.Collection([track, track2]),
    mixer = new Mixer({ audiolet: audiolet, tracks: tracks });

  mixer.connect(audiolet.output);

  track.get('instrument').playNotes([
    { key: 'C' }
  ]);

  track2.get('instrument').playNotes([
    { key: 'E' }
  ]);

  var mixer_view = new MixerView({
    model: mixer
  });

  $('body').append(mixer_view.render().el);

  console.log('instrument played');

});