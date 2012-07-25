define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var Scheduler = Backbone.Model.extend({

    defaults: {
      audiolet: null,
      bpm: 120
    },

    initialize: function() {
      Backbone.Model.prototype.initialize.apply(this, arguments);
      this.properties();
    },

    properties: function() {

      var self = this,
        scheduler = self.get('audiolet').scheduler;

      self.on('change:bpm', function(self, val) {
        scheduler.setTempo(val);
      });

    },

    play: function(args, cb, per_beat, repeat) {
      // repeat simple chord
      this.get('audiolet').scheduler.play(
        [new PSequence([args], (repeat || Infinity))],
        (per_beat || 1),
        cb
      );
    }

  });

  return Scheduler;

});