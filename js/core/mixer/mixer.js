define([
  'core/model',
  'core/mixer/channels'
], function(Model, Channels) {

  var Mixer = Model.extend({

    constructor: function(attrs, options) {
      Model.apply(this, [attrs, options, 0, 1]);
    },

    initialize: function(attrs, options) {

      var audiolet = this.audiolet = options.audiolet,
        channels = this.channels = new Channels(),
        channel_name;

      // add 5 channels
      _.each(['Master', 1, 2, 3, 4], function(i) {
        var channel_name = _.isString(i)? i: ('Channel ' + i);
        channels.add({ name: channel_name }, { audiolet: audiolet });
      });

      this.route();

    },

    route: function() {

      var channels = this.channels,
        first = channels.at(0),
        output = this.outputs[0];

      // connect all channels to first "master" channel
      _.each(channels.last(channels.length - 1), function(channel) {
        channel.connect(first);
      });

      // connect master channel to output
      first.connect(output);

    }

  });

  return Mixer;

});