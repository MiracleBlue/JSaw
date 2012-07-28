define([
  'backbone',
  'core/mixer/channel'
], function(Backbone, Channel) {

  var Channels = Backbone.Collection.extend({
    model: Channel
  });

  return Channels;

});