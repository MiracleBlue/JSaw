define([
  'dsp/fx/fx'
], function(FX) {

  var JReverb = FX.extend({

    defaults: {
      name: 'Reverb',
      mix: 0.3,
      room_size: 0.7,
      damping: 0.5
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

    properties: function() {

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