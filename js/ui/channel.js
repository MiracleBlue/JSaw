define([
  'jquery',
  'underscore',
  'backbone',
  'ui/chain',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'lib/backbone.gui/js/src/components/vertical-slider',
  'lib/backbone.gui/js/src/components/knob'
], function($, _, Backbone, ChainView, Delay, Reverb, Slider, Knob) {

  var ChannelView = Backbone.View.extend({

    className: 'channel',

    initialize: function() {
      
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.gain_slider = new Slider({
        model: this.model,
        property: 'gain',
        min: 0,
        max: 1
      });

      this.fx_view = new ChainView({
        audiolet: this.model.get('audiolet'),
        collection: this.model.get('fx'),
        options: [Delay, Reverb]
      });

      this.pan_knob = new Knob({
        model: this.model,
        property: 'pan',
        min: 0,
        max: 1
      });

    },

    render: function() {

      var $el = $(this.el);

      $el.append(this.gain_slider.render().el);
      $el.append(this.fx_view.render().el);
      $el.append(this.pan_knob.render().el);

      return this;

    }

  });

  return ChannelView;

});