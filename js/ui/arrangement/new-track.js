define([
  'core/arrangement/track',
  'core/instrument'
], function(Track, Instrument) {

  var NewTrackView = Backbone.View.extend({

    tagName: 'li',
    className: 'track',

    model: null,
    tracks: null,
    audiolet: null,

    events: {
      'click': 'addTrack'
    }, 

    initialize: function(options) {
      _.extend(this, options);
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    addTrack: function() {
      this.tracks.add({}, {
        audiolet: this.audiolet,
        instrument: new Instrument({ generator: this.gen }, { audiolet: this.audiolet })
      });
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