define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'core/arrangement/track',
  'core/instrument',
  'dsp/gen/synth',
  'dsp/gen/synth2',
  'ui/arrangement/track',
  'ui/arrangement/new-track',
  'text!../../../templates/arrangement/arrangement.handlebars'
], function($, _, Backbone, Handlebars, Track, Instrument, Synth, Synth2, TrackView, NewTrackView, tmpl) {

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
        model: track,
        mixer: this.mixer
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