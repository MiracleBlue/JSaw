define([
  'dsp/gen/gen',
  'dsp/fx/envelope'
], function(Generator, Envelope) {

  var Synth2 = Generator.extend(_.extend({

    defaults: {
      name: 'Synth2',
      frequency: 440,
      attack: 0.01,
      decay: 0.15
    },

    build: function() {

      var self = this,
        audiolet = this.get('audiolet'),
        freq = this.get('frequency');

      this.sine = new Sine(audiolet, freq);
      this.sine2 = new Sine(audiolet, 1.05 * freq);
      this.gain = new Gain(audiolet);

      this.envelope = new Envelope({
        audiolet: audiolet,
        attack: this.get('attack'),
        decay: this.get('decay')
      });

      this.envelope.on('complete', function() {
        self.trigger('complete');
      });

    },

    route: function() {
      this.sine.connect(this.gain);
      this.sine2.connect(this.gain);
      this.envelope.connect(this.gain, 0, 1);
      this.gain.connect(this.outputs[0]);
    },

    properties: function() {

      var self = this,
        envelope = self.envelope;

      self.on('change:frequency', function(self, val) {
        self.sine.frequency.setValue(val);
        self.sine2.frequency.setValue(1.05 * freq);
      });

      self.on('change:attack', function(self, val) {
        envelope.set('attack', val);
      });

      self.on('change:decay', function(self, val) {
        envelope.set('decay', val);
      });

    }

  }, Backbone.Events));

  return Synth2;

});