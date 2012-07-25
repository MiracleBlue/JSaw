define([
  'underscore',
  'backbone',
  'core/group',
  'core/channel'
], function(_, Backbone, Group, Channel) {

  var Channels = Backbone.Collection.extend({
    model: Channel
  });

  var Mixer = Group.extend({

    defaults: {
      audiolet: null,
      channels: null,
      gain: 0.7
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      _.bindAll(this, 'build', 'route');
      this.build();
      this.route();
      this.properties();
    },

    build: function() {

      var audiolet = this.get('audiolet'),
        channels = this.get('channels');

      if (!channels) {
        channels = new Channels();
        this.set('channels', channels);
      }

      this.gain = new Gain(audiolet, this.get('gain'))

      channels.on('add reset remove', this.route);

    },

    route: function() {

      var self = this,
        channels = self.get('channels'),
        gain = self.gain;

      channels.each(function(channel) {
        channel.connect(gain);
      });
      
      gain.connect(self.outputs[0]);

    },

    properties: function() {

      var self = this,
        gain = self.gain;

      self.on('change:gain', function(self, val) {
        gain.gain.setValue(val);
      });

    }

  });

  return Mixer;

});