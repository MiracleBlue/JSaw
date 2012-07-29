define([
  'core/group'
], function(Group) {

  var Channel = Group.extend({

    defaults: {
      name: 'New Channel',
      gain: 0.7,
      pan: 0.5
    },

    initialize: function(attrs, options) {

      var audiolet = this.audiolet = options.audiolet,
        gain = this.gain = new Gain(audiolet, this.get('gain')),
        pan = this.pan = new Pan(audiolet, this.get('pan'));

      Group.prototype.initialize.apply(this, [attrs, options, 1, 1]);

      this.on('change:gain', function(self, val) {
        gain.gain.setValue(val);
      });

      this.on('change:pan', function(self, val) {
        pan.pan.setValue(val);
      });

      this.route();

    },

    route: function() {

      var input = this.inputs[0],
        pan = this.pan,
        gain = this.gain,
        output = this.outputs[0];

      input.connect(pan);
      pan.connect(gain);
      gain.connect(output);

    }

  });

  return Channel;

});