// a basic saw wave `Generator`. can be used directly as a node
// in an `Audiolet` chain, or can be passed into an `Instrument`
// as it's source sound.
define([
  'underscore',
  'backbone',
  'core/group',
  'dsp/fx/envelope'
], function(_, Backbone, Group, Envelope) {

  var Synth = Group.extend(_.extend({

    defaults: {
      
      audiolet: null,

      frequency: 440,
      attack: 0.01,
      decay: 0.15

    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      this.build();
    },

    build: function() {

      var self = this,
        audiolet = this.get('audiolet'),
        freq = this.get('frequency');

      this.saw = new Saw(audiolet, freq);
      this.mod = new Sine(audiolet, 2 * freq);
      this.modMulAdd = new MulAdd(audiolet, freq / 2, freq);
      this.gain = new Gain(audiolet);
      this.velocity = new Gain(audiolet, 0.1);

      this.envelope = new Envelope({
        audiolet: audiolet,
        attack: this.get('attack'),
        decay: this.get('decay')
      });

      this.envelope.on('complete', function() {
        self.trigger('complete');
      });

      this.route();

    },

    route: function() {
      this.mod.connect(this.modMulAdd);
      this.modMulAdd.connect(this.saw);
      this.envelope.connect(this.gain, 0, 1);
      this.saw.connect(this.gain);
      this.gain.connect(this.velocity);
      this.velocity.connect(this.outputs[0]);
    }

  }, Backbone.Events));

  return Synth;

});