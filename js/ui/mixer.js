define([
  'jquery',
  'underscore',
  'backbone',
  'ui/channel',
  'lib/backbone.gui/js/src/components/vertical-slider'
], function($, _, Backbone, ChannelView, Slider) {

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

      // append each channel view
      model.get('channels').each(function(channel) {
        var channel_view = new ChannelView({
          model: channel
        });
        $el.append(channel_view.render().el);
      });

      return this;

    }

  });

  return MixerView;

});