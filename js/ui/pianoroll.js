define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'core/note',
  'text!../../templates/pianoroll.handlebars'
], function($, _, Backbone, Handlebars, Note, tmpl) {

  // populate undefined values in an array
  // with their index
  // fill([], 3) => [0, 1, 2]
  function fill(array, length) {
    for (var i = 0; i < length; i++) {
      if (!array[i]) {
        array[i] = i;
      }
    }
    return array;
  }

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

  var PianoRollView = Backbone.View.extend({

    events: {
      'mouseenter .steps .note': 'highlightNote',
      'mouseleave .steps .note': 'unhighlightNote',
      'click .steps .note': 'addNote',
      'contextmenu .steps .note': 'removeNote',
      'click .play': 'play'
    },

    initialize: function(options) {

      var self = this,
        model = new PianoRoll(options);

      model.get('steps').each(function(step, i) {
        step.get('notes').bind('remove', _.bind(self.deactivateNote, self));
        step.get('notes').bind('add', _.bind(self.activateNote, self));
      });

      this.model = model;

      return Backbone.View.prototype.initialize.apply(this, arguments);

    },

    play: function() {

      var self = [],
        model = this.model,
        steps = model.get('steps'),
        audiolet = model.get('audiolet'),
        scheduler = audiolet.scheduler,
        instrument = model.get('instrument');

      var all_notes = steps.map(function(step) {
        return step.get('notes');
      });

      // todo: should use play/stop
      // instead of inherent toggle
      if (this.playing) {
        scheduler.stop(this.playing);
        delete this.playing;
      
      } else {
        this.playing = scheduler.play(
          [new PSequence(all_notes, Infinity)],
          1/4,
          _.bind(instrument.playNotes, instrument)
        );
      }

    },

    addNote: function(e) {

      var $note = $(e.target),
        bar = $note.data('bar'),
        step = $note.data('step'),
        model = this.model,
        index = (bar * model.get('steps_per_bar')) + step;

      model.get('steps').at(index).get('notes').add({
        key: $note.data('key'),
        octave: $note.data('octave'),
        bar: bar,
        step: step
      });

    },

    removeNote: function(e) {

      var $note = $(e.target),
        bar = $note.data('bar'),
        step = $note.data('step'),
        key = $note.data('key'),
        octave = $note.data('octave'),
        model = this.model,
        index = (bar * model.get('steps_per_bar')) + step,
        step = model.get('steps').at(index);

      step.get('notes').find(function(note) {
        return note.get('key') == key && note.get('octave') == octave;
      }).destroy();

      e.preventDefault();

    },

    activateNote: function(note) {
      $('.note')
        .filter('[data-bar="' + note.get('bar') + '"]')
        .filter('[data-step="' + note.get('step') + '"]')
        .filter('[data-key="' + note.get('key') + '"]')
        .filter('[data-octave="' + note.get('octave') + '"]')
        .addClass('active');
    },

    deactivateNote: function(note) {
      $('.note')
        .filter('[data-bar="' + note.get('bar') + '"]')
        .filter('[data-step="' + note.get('step') + '"]')
        .filter('[data-key="' + note.get('key') + '"]')
        .filter('[data-octave="' + note.get('octave') + '"]')
        .removeClass('active');
    },

    highlightNote: function(e) {
      $(e.target).addClass('highlight');
    },

    unhighlightNote: function(e) {
      $(e.target).removeClass('highlight');
    },

    render: function() {

      var template = Handlebars.compile(tmpl),
        model = this.model;

      // creates an array, who contains arrays of scales
      // 1 for each octave.
      var scales = _.map(model.get('octaves'), function(octave) {
        return _.map(model.get('scale'), function(key) {
          return {
            key: key,
            octave: octave
          };
        }).reverse();
      });

      this.setElement($(template({

        bars: fill([], model.get('bars')),
        steps_per_bar: fill([], model.get('steps_per_bar')),

        // reduces the array of many octave arrays 
        // into 1 iterable array
        notes: _.reduce(scales, function(memo, scale) {
          return memo.concat(scale);
        }, []).reverse()

      })));

      return this;

    }

  });

  return PianoRollView;

});