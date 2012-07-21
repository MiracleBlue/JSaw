// a basic `Mixer`.
define([
  'underscore',
  'backbone',
  'core/group'
], function(_, Backbone, Group) {

  var Mixer = Group.extend({

    defaults: {
      audiolet: null,
      fx: null
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
    },

    build: function() {
      var audiolet = this.get('audiolet');
      this.output = audiolet.output;
      this.gain = new Gain(audiolet, 0.8);
      this.amp = new Amplitude(audiolet);
      this.route();
    },

    route: function() {

      var fx = this.get('fx');

      // if there are fx
      // chain them together before gain
      if (fx.length) {

        // connect input to first fx
        this.inputs[0].connect(fx.first().inputs[0]);

        // connect each fx into the next
        _.each(fx.first(fx.length - 1), function(effect, i) {
          effect.connect(fx.at(i + 1).inputs[0]);
        });

        // connect last fx to output
        fx.last().connect(this.gain);

      // no fx, input goes directly into gain
      } else {
        this.inputs[0].connect(this.gain);
      }

      this.gain.connect(this.amp);
      this.gain.connect(this.output);

    }

  });

  return Mixer;

});