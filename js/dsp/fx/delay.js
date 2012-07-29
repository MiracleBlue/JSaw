define([
  'dsp/fx/fx'
], function(FX) {

  var JDelay = FX.extend({

    defaults: {
      name: 'Delay',
      mix: 0.5,
      feedback: 0.3,
      frequency: 0.8,
      gain: 0.4
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

    },

    route: function() {
      this.inputs[0].connect(this.delay);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.outputs[0]);
    },

    properties: function() {

      var self = this,
        delay = self.delay,
        feedback = self.feedback;

      self.on('change:frequency', function(self, val) {
        delay.delayTime.setValue(val);
      });

      self.on('change:feedback', function(self, val) {
        delay.feedback.setValue(val);
      });

      self.on('change:mix', function(self, val) {
        delay.mix.setValue(val);
      });

      self.on('change:gain', function(self, val) {
        feedback.gain.setValue(val);
      });

    }

  });

  return JDelay;

});