define([
  'backbone',
  'core/note',
], function(Backbone, Note) {

  var Notes = Backbone.Collection.extend({
    model: Note
  });

  // a Step holds a collection of all Notes
  // that should be triggered for playback
  // when that Step is triggered
  var Step = Backbone.Model.extend({
    initialize: function() {
      this.set('notes', new Notes());
      return Backbone.Model.prototype.initialize.apply(this, arguments);
    }
  });

  // Steps is a collection of every Step in the pattern
  // if a PianoRoll has 2 bars and 8 steps per bar,
  // Steps will be of length 16
  var Steps = Backbone.Collection.extend({
    model: Step
  });

  var PianoRoll = Backbone.Model.extend({

    defaults: {

      scale: ['B', 'A#', 'A', 'G#',
        'G', 'F#', 'F', 'E',
        'D#', 'D', 'C#', 'C'],

      octaves: [0, 1, 2, 3,
        4, 5, 6, 7, 8],

      steps: null,
      steps_per_bar: 4,
      bars: 4,

      instrument: null

    },

    initialize: function() {
      var steps = this.get('steps_per_bar') * this.get('bars');
      this.set('steps', new Steps(new Array(steps)));
      return Backbone.Model.prototype.initialize.apply(this, arguments);
    }

  });

  return PianoRoll;

});