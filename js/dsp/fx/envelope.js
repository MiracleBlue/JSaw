// a basic `Envelope`.
define([
  'underscore',
  'backbone',
  'core/group'
], function(_, Backbone, Group) {

  var JEnvelope = Group.extend(_.extend({

    defaults: {
      attack: 0.01,
      decay: 0.15,
      release: 0.01
    },

    params: {

      attack: {
        min: 0,
        max: 0.1
      },

      decay: {
        min: 0,
        max: 0.3
      },

      release: {
        min: 0,
        max: 0.1
      }

    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
      this.route();
      this.bind();
    },

    build: function() {

      var self = this,
        audiolet = this.get('audiolet'),
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

    bind: function() {

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