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
      gain: 0.7,

      channels: null

    },

    initialize: function(attrs, opts) {

      var audiolet = this.get('audiolet'),
        channels = new Channels([
        { audiolet: audiolet },
        { audiolet: audiolet }
      ]);

      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      _.bindAll(this, 'build', 'route');

      this.set('channels', channels);

      channels.on('add reset remove', this.route);

      this.build();
      this.route();
      this.properties();

    },

    build: function() {
      var audiolet = this.get('audiolet');
      this.gain = new Gain(audiolet, this.get('gain'))
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