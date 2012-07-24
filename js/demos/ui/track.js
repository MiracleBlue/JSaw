require([
  'jquery',
  'underscore',
  'backbone',
  'core/track',
  'ui/track'
], function($, _, Backbone, Track, TrackView) {

  var audiolet = new Audiolet(),
    track = new Track({ audiolet: audiolet });

  track.connect(audiolet.output);

  track.get('instrument').playNotes([
    { key: 'C' }
  ]);

  var track_view = new TrackView({
    model: track
  });

  window.track = track;

  $('body').append(track_view.render().el);

});