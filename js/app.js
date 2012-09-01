require([

  'core/scheduler',
  'core/arrangement/tracks',
  'core/mixer/mixer',

  'views/nav/nav',
  'views/arrangement/arrangement',
  'views/mixer/mixer'
  
], function(
  Scheduler, Tracks, Mixer,
  NavView, ArrangementView, MixerView) {

  //
  // create nodes
  //

  var audiolet = new Audiolet(),
    scheduler = new Scheduler({}, { audiolet: audiolet }),
    tracks = new Tracks(),
    mixer = new Mixer({}, { audiolet: audiolet });

  //
  // route graph
  //

  // by default, newly added tracks get routed
  // to the mixer master channel
  tracks.on('add', function(track) {
    track.connect(mixer.channels.at(0));
  });

  // removing a track from the collection
  // should remove it from the audiolet graph
  tracks.on('remove', function(track) {
    tracks.remove();
  });

  // connect mixer to output
  mixer.connect(audiolet.output);

  //
  // build ui
  //

  var $body = $('body');

  var nav_view = new NavView({
    model: scheduler
  });

  var arrangement_view = new ArrangementView({
    audiolet: audiolet,
    tracks: tracks,
    mixer: mixer
  });

  var mixer_view = new MixerView({
    model: mixer,
    audiolet: audiolet
  });

  $body.append(nav_view.render().el);
  $body.append(arrangement_view.render().el);
  $body.append(mixer_view.render().el);

  // hack to get sound. on track add, repeat a note
  tracks.on('add', function(track) {
    scheduler.play([{ key: 'E', key: 'B' }], function(notes) {
      track.instrument.playNotes([{}]);
    });
  });

});