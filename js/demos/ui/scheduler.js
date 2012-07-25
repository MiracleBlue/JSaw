require([
  'underscore',
  'jquery',
  'core/channel',
  'core/scheduler',
  'ui/scheduler'
], function(_, $, Channel, Scheduler, SchedulerView) {

  var audiolet = new Audiolet(),
    channel = new Channel({ audiolet: audiolet }),
    scheduler = new Scheduler({ audiolet: audiolet }),
    instrument = channel.get('instrument'),
    notes = [{ key: 'E', octave: 2 }];

  // route graph
  channel.connect(audiolet.output);

  // repeat simple chord
  scheduler.play(notes, instrument.playNotes);

  var scheduler_view = new SchedulerView({
    model: scheduler
  });

  $('body').append(scheduler_view.render().el);

});