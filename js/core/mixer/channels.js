define([
  'core/mixer/channel'
], function(Channel) {

  var Channels = Backbone.Collection.extend({
    model: Channel
  });

  return Channels;

});