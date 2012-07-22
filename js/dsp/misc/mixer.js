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

      console.log(fx);

      this.inputs[0].connect(fx.inputs[0]);
      fx.connect(this.gain);

      this.gain.connect(this.amp);
      this.gain.connect(this.output);

    }

  });

  return Mixer;

});