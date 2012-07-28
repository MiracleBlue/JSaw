define([
  'core/group',
  'core/chain'
], function(Group, Chain) {

  var Channel = Group.extend({

    defaults: {
      name: 'Channel',
      audiolet: null,
      fx: null,
      gain: 0.7,
      pan: 0.5
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
      this.route();
      this.properties();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        fx = this.get('fx');

      if (!fx) {
        this.set('fx', new Chain([], { audiolet: audiolet }));
      }

      this.gain = new Gain(audiolet, this.get('gain'));
      this.pan = new Pan(audiolet, this.get('pan'));

    },

    route: function() {

      var fx = this.get('fx'),
        pan = this.pan,
        gain = this.gain;

      this.inputs[0].connect(fx.inputs[0]);
      fx.connect(pan);
      pan.connect(gain);
      gain.connect(this.outputs[0]);

    },

    properties: function() {

      var self = this,
        gain = self.gain,
        pan = self.pan;

      self.on('change:gain', function(self, val) {
        gain.gain.setValue(val);
      });

      self.on('change:pan', function(self, val) {
        pan.pan.setValue(val);
      });

    }

  });

  return Channel;

});