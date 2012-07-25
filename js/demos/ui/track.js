require([
  'jquery',
  'underscore',
  'backbone',
  'core/channel',
  'ui/channel'
], function($, _, Backbone, Channel, ChannelView) {

  var audiolet = new Audiolet(),
    channel = new Channel({ audiolet: audiolet });

  channel.connect(audiolet.output);

  channel.get('instrument').playNotes([
    { key: 'C' }
  ]);

  var channel_view = new ChannelView({
    model: channel
  });

  $('body').append(channel_view.render().el);

});