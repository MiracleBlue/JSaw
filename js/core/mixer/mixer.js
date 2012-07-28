define([
  'underscore',
  'backbone',
  'core/group',
  'core/mixer/channels'
], function(_, Backbone, Group, Channels) {

  var Mixer = Group.extend({

    defaults: {
      audiolet: null,
      channels: null
    },

    initialize: function(attrs, opts) {

      var audiolet = this.get('audiolet'),
        channels = new Channels([
        { audiolet: audiolet, name: 'Master' },
        { audiolet: audiolet, name: 'Channel 1'  },
        { audiolet: audiolet, name: 'Channel 2'  },
        { audiolet: audiolet, name: 'Channel 3'  },
        { audiolet: audiolet, name: 'Channel 4'  }
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