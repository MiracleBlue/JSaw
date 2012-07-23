// a basic `Reverb`.
define([
  'backbone',
  'core/group'
], function(Backbone, Group) {

  var JReverb = Group.extend({

    defaults: {
      name: 'Reverb',
      mix: 0.3,
      room_size: 0.7,
      damping: 0.5
    },

    params: {

      mix: {
        min: 0,
        max: 1
      },

      room_size: {
        min: 0,
        max: 1
      },

      damping: {
        min: 0,
        max: 1
      }

    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
      this.route();
      this.bind();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        mix = this.get('mix'),
        room_size = this.get('room_size'),
        damping = this.get('damping');

      this.reverb = new Reverb(audiolet, mix, room_size, damping);

    },

    route: function() {
      this.inputs[0].connect(this.reverb);
      this.reverb.connect(this.outputs[0]);
    },

    bind: function() {

      var self = this,
        reverb = self.reverb;

      self.on('change:mix', function(self, val) {
        reverb.mix.setValue(val);
      });

      self.on('change:room_size', function(self, val) {
        reverb.roomSize.setValue(val);
      });

      self.on('change:damping', function(self, val) {
        reverb.damping.setValue(val);
      });

    }

  });

  return JReverb;

});