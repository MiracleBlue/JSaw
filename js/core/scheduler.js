define([
], function() {

  var Scheduler = Backbone.Model.extend({

    defaults: {
      bpm: 120
    },

    initialize: function(attrs, options) {

      var audiolet = this.audiolet = options.audiolet;

      Backbone.Model.prototype.initialize.apply(this, arguments);

      this.properties();

    },

    properties: function() {

      var self = this,
        scheduler = self.audiolet.scheduler;

      self.on('change:bpm', function(self, val) {
        scheduler.setTempo(val);
      });

    },

    play: function(args, cb, per_beat, repeat) {
      // repeat simple chord
      this.audiolet.scheduler.play(
        [new PSequence([args], (repeat || Infinity))],
        (per_beat || 1),
        cb
      );
    }

  });

  return Scheduler;

});