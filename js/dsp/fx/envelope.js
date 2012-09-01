define([
  'lodash',
  'backbone',
  'dsp/fx/fx'
], function(_, Backbone, FX) {

  var JEnvelope = FX.extend(_.extend({

    defaults: {
      name: 'Envelope',
      attack: 0.01,
      decay: 0.15,
      release: 0.01
    },

    build: function() {

      var self = this,
        audiolet = this.audiolet,
        attack = this.get('attack'),
        decay = this.get('decay'),
        release = this.get('release'),
        times = [attack, decay, release];

      this.envelope = new Envelope(audiolet, 1, [0, 1, 0, 0], times, null, function() {
        self.trigger('complete');
      });

    },

    route: function() {
      this.envelope.connect(this.outputs[0]);
    },

    properties: function() {

      var self = this,
        envelope = self.envelope;

      self.on('change:attack', function(self, val) {
        envelope.times[0].setValue(val);
      });

      self.on('change:decay', function(self, val) {
        envelope.times[1].setValue(val);
      });

      self.on('change:release', function(self, val) {
        envelope.times[2].setValue(val);
      });

    }

  }, Backbone.Events));

  return JEnvelope;

});