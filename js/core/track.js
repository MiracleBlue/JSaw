define([
  'underscore',
  'backbone',
  'core/group',
  'core/instrument',
  'core/chain'
], function(_, Backbone, Group, Instrument, Chain) {

  var Track = Group.extend({

    defaults: {
      audiolet: null,
      instrument: null,
      fx: null,
      gain: 0.7
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      this.build();
      this.route();
      this.properties();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        fx = this.get('fx'),
        instrument = this.get('instrument');

      if (!fx) {
        this.set('fx', new Chain([], { audiolet: audiolet }));
      }

      if (!instrument) {
        this.set('instrument', new Instrument({ audiolet: audiolet }));
      }

      this.gain = new Gain(audiolet, this.get('gain'));

    },

    route: function() {

      var fx = this.get('fx'),
        instrument = this.get('instrument'),
        gain = this.gain;

      instrument.connect(fx.inputs[0]);
      fx.connect(gain);
      gain.connect(this.outputs[0]);

    },

    properties: function() {

      var self = this,
        gain = self.gain;

      self.on('change:gain', function(self, val) {
        gain.gain.setValue(val);
      });

    }

  });

  return Track;

});