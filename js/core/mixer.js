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
      _.bindAll(this, 'route');

      this.set('channels', channels);

      channels.on('add reset remove', this.route);

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