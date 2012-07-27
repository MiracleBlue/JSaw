define([
  'underscore',
  'backbone',
  'core/group',
  'core/chain'
], function(_, Backbone, Group, Chain) {

  var Channel = Group.extend({

    defaults: {
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
        console.log('x', val);
        pan.pan.setValue(val);
      });

    }

  });

  var Channels = Backbone.Collection.extend({
    model: Channel
  });

  var Mixer = Group.extend({

    defaults: {
      audiolet: null,
      channels: null
    },

    initialize: function(attrs, opts) {

      var audiolet = this.get('audiolet'),
        channels = new Channels([
        { audiolet: audiolet },
        { audiolet: audiolet },
        { audiolet: audiolet },
        { audiolet: audiolet },
        { audiolet: audiolet }
      ]);

      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      this.set('channels', channels);
      this.route();

    },

    route: function() {

      var self = this,
        channels = self.get('channels'),
        first = channels.at(0);

      // connect all channels to first "master" channel
      _.each(channels.last(channels.length - 1), function(channel) {
        channel.connect(first.inputs[0]);
      });

      // connect master channel to output
      first.connect(self.outputs[0]);

    }

  });

  return Mixer;

});