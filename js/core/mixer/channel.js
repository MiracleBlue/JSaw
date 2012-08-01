define([
  'core/model',
  'core/chain',
  'dsp/fx/fx'
], function(Model, Chain, FX) {

  var Channel = Model.extend({

    defaults: {
      name: 'New Channel',
      gain: 0.7,
      pan: 0.5
    },

    constructor: function(attrs, options) {
      Model.apply(this, [attrs, options, 1, 1]);
    },

    initialize: function(attrs, options) {

      var audiolet = this.audiolet = options.audiolet,
        gain = this.gain = new Gain(audiolet, this.get('gain')),
        pan = this.pan = new Pan(audiolet, this.get('pan')),
        fx1 = new FX({ name: 'FX 1' }, { audiolet: options.audiolet }),
        fx2 = new FX({}, { audiolet: options.audiolet }),
        fx3 = new FX({ name: 'FX 3' }, { audiolet: options.audiolet }),
        fx = this.fx = new Chain([fx1, fx2, fx3], { audiolet: audiolet });

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
        fx = this.fx,
        output = this.outputs[0];

      input.connect(fx);
      fx.connect(gain);
      gain.connect(pan);
      pan.connect(output);

    }

  });

  return Channel;

});