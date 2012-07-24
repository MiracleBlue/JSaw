define([
  'jquery',
  'underscore',
  'backbone',
  'ui/track',
  'lib/backbone.gui/js/src/components/vertical-slider'
], function($, _, Backbone, TrackView, Slider) {

  var MixerView = Backbone.View.extend({

    className: 'mixer',

    initialize: function() {

      Backbone.View.prototype.initialize.apply(this, arguments);

      this.gain_slider = new Slider({
        model: this.model,
        property: 'gain',
        min: 0,
        max: 1
      });

    },

    render: function() {

      var self = this,
        model = self.model,
        $el = $(this.el);

      // append mixer controls
      $el.append(this.gain_slider.render().el);

      // append each track view
      model.get('tracks').each(function(track) {
        var track_view = new TrackView({
          model: track
        });
        $el.append(track_view.render().el);
      });

      return this;

    }

  });

  return MixerView;

});