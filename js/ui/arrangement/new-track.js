define([
  'jquery',
  'underscore',
  'backbone',
  'core/arrangement/track',
  'core/instrument'
], function($, _, Backbone, Track, Instrument) {

  var NewTrackView = Backbone.View.extend({

    tagName: 'li',
    className: 'track',

    model: null,
    tracks: null,
    audiolet: null,

    events: {
      'click': 'addTrack'
    }, 

    initialize: function(opts) {
      _.extend(this, opts);
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    addTrack: function() {
      this.model = new Track({
        audiolet: this.audiolet,
        instrument: new Instrument({ audiolet: this.audiolet, generator: this.gen })
      });
      this.tracks.add(this.model);
    },

    render: function() {

      var $el = $(this.el),
        gen = this.gen;

      $el.append(gen.prototype.defaults.name);

      return this;

    }

  });
  
  return NewTrackView;

});