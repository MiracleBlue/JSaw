require([
  'underscore',
  'jquery',
  'core/track',
  'core/scheduler',
  'ui/scheduler'
], function(_, $, Track, Scheduler, SchedulerView) {

  var audiolet = new Audiolet(),
    track = new Track({ audiolet: audiolet }),
    scheduler = new Scheduler({ audiolet: audiolet }),
    instrument = track.get('instrument'),
    notes = [{ key: 'E', octave: 2 }];

  // route graph
  track.connect(audiolet.output);

  // repeat simple chord
  scheduler.play(notes, instrument.playNotes);

  var scheduler_view = new SchedulerView({
    model: scheduler
  });

  $('body').append(scheduler_view.render().el);

});