define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'core/track',
  'core/instrument',
  'dsp/gen/synth',
  'dsp/gen/synth2',
  'ui/track',
  'text!../../templates/arrangement.handlebars'
], function($, _, Backbone, Handlebars, Track, Instrument, Synth, Synth2, TrackView, tmpl) {

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

  var ArrangementView = Backbone.View.extend({

    events: {
      'click .add': 'toggleAdd'
    },

    initialize: function(opts) {

      Backbone.View.prototype.initialize.apply(this, arguments);

      _.extend(this, opts);

      this.tracks.on('add', _.bind(this.trackAdded, this));

    },  

    trackAdded: function(track) {
      var view = new TrackView({
        model: track
      });
      this.$tracks.append(view.render().el);
    },

    toggleAdd: function() {
      this.$new_tracks.toggle();
    },

    render: function() {

      var self = this,
        audiolet = self.audiolet,
        template = Handlebars.compile(tmpl),
        $el = $(template()),
        tracks = this.tracks,
        view;

      this.setElement($el);

      var $new_tracks = self.$new_tracks;

      _.each([Synth, Synth2], function(gen) {

        view = new NewTrackView({
          gen: gen,
          tracks: tracks,
          audiolet: audiolet
        });

        $new_tracks.append(view.render().el);

      });

      return this;

    },

    setElement: function($el) {

      this.$tracks = $('.tracks', $el);
      this.$new_tracks = $('.new-tracks', $el);

      return Backbone.View.prototype.setElement.apply(this, arguments);

    }

  });

  return ArrangementView;

});