define([
  'underscore',
  'backbone',
  'dsp/gen/gen',
  'dsp/fx/envelope'
], function(_, Backbone, Generator, Envelope) {

  var Synth = Generator.extend(_.extend({

    defaults: {
      frequency: 440,
      attack: 0.01,
      decay: 0.15
    },

    build: function() {

      var self = this,
        audiolet = this.get('audiolet'),
        freq = this.get('frequency');

      this.saw = new Saw(audiolet, freq);
      this.mod = new Sine(audiolet, 2 * freq);
      this.modMulAdd = new MulAdd(audiolet, freq / 2, freq);
      this.gain = new Gain(audiolet);
      this.velocity = new Gain(audiolet, 0.1);

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
      this.mod.connect(this.modMulAdd);
      this.modMulAdd.connect(this.saw);
      this.envelope.connect(this.gain, 0, 1);
      this.saw.connect(this.gain);
      this.gain.connect(this.velocity);
      this.velocity.connect(this.outputs[0]);
    },

    properties: function() {

      var self = this,
        envelope = self.envelope;

      self.on('change:frequency', function(self, val) {
        self.saw.frequency.setValue(val);
        self.mod.frequency.setValue(2 * val);
        self.modMulAdd.mul.setValue(val / 2);
        self.modMulAdd.add.setValue(val);
      });

      self.on('change:attack', function(self, val) {
        envelope.set('attack', val);
      });

      self.on('change:decay', function(self, val) {
        envelope.set('decay', val);
      });

    }

  }, Backbone.Events));

  return Synth;

});