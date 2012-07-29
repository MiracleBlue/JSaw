define([
  'core/arrangement/track'
], function(Track) {

  var Tracks = Backbone.Collection.extend({
    model: Track
  });

  return Tracks;

});