// a basic `Delay`.
define([
  'backbone',
  'core/group'
], function(Backbone, Group) {

  var JDelay = Group.extend({

    defaults: {
      mix: 0.5,
      feedback: 0.3,
      frequency: 0.8,
      gain: 0.4
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        mix = this.get('mix'),
        feedback = this.get('feedback'),
        freq = this.get('frequency'),
        gain = this.get('gain'),
        frequency = ((60 / audiolet.scheduler.bpm) * freq),
        max_frequency = frequency * 2;

      this.delay = new FeedbackDelay(audiolet, max_frequency, frequency, feedback, mix);
      this.feedback = new Gain(audiolet, gain);

      this.route();

    },

    route: function() {
      this.inputs[0].connect(this.delay);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.outputs[0]);
    }

  });

  return JDelay;

});