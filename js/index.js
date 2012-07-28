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
  'core/track',
  'core/mixer',

  'ui/nav',
  'ui/arrangement',
  'ui/mixer'

], function(
  $, _, Backbone,
  Scheduler, Track, Mixer,
  NavView, ArrangementView, MixerView) {

  var Tracks = Backbone.Collection.extend({
    model: Track
  });

  //
  // create nodes
  //

  var audiolet = new Audiolet(),
    scheduler = new Scheduler({ audiolet: audiolet }),
    tracks = new Tracks(),
    mixer = new Mixer({ audiolet: audiolet, tracks: tracks });

  //
  // route graph
  //

  // by default, newly added tracks get routed
  // to the mixer master channel
  tracks.on('add', function(track) {
    track.connect(mixer.get('channels').at(0).inputs[0]);
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
    model: mixer
  });

  $body.append(nav_view.render().el);
  $body.append(arrangement_view.render().el);
  $body.append(mixer_view.render().el);

  // hack to get sound. on track add, repeat a note
  tracks.on('add', function(track) {
    scheduler.play([{ key: 'E', key: 'B' }], function(notes) {
      track.get('instrument').playNotes([{}]);
    });
  });

});