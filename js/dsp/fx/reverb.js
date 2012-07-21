// a basic `Reverb`.
define([
  'backbone',
  'core/group'
], function(Backbone, Group) {

  var JReverb = Group.extend({

    defaults: {
      mix: 0.3,
      room_size: 0.7,
      damping: 0.5
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        mix = this.get('mix'),
        room_size = this.get('room_size'),
        damping = this.get('damping');

      this.reverb = new Reverb(audiolet, mix, room_size, damping);

      this.route();

    },

    route: function() {
      this.inputs[0].connect(this.reverb);
      this.reverb.connect(this.outputs[0]);
    }

  });

  return JReverb;

});