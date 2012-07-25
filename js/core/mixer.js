define([
  'underscore',
  'backbone',
  'core/group',
  'core/track'
], function(_, Backbone, Group, Track) {

  var Tracks = Backbone.Collection.extend({
    model: Track
  });

  var Mixer = Group.extend({

    defaults: {
      audiolet: null,
      tracks: null,
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
        tracks = this.get('tracks');

      if (!tracks) {
        tracks = new Tracks();
        this.set('tracks', tracks);
      }

      this.gain = new Gain(audiolet, this.get('gain'))

      tracks.on('add reset remove', this.route);

    },

    route: function() {

      var self = this,
        tracks = self.get('tracks'),
        gain = self.gain;

      tracks.each(function(track) {
        track.connect(gain);
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