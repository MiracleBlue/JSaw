define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'lib/backbone.gui/js/src/components/vertical-slider',
  'lib/backbone.gui/js/src/components/knob',
  'text!../../templates/mixer.handlebars'
], function($, _, Backbone, Handlebars, Delay, Reverb, Slider, Knob, tmpl) {

  var ChannelView = Backbone.View.extend({

    className: 'channel',
    tagName: 'li',

    initialize: function() {
      
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.pan_knob = new Knob({
        model: this.model,
        property: 'pan',
        min: 0,
        max: 1
      });

      this.gain_slider = new Slider({
        model: this.model,
        property: 'gain',
        min: 0,
        max: 1
      });

      /*
      this.fx_view = new ChainView({
        audiolet: this.model.get('audiolet'),
        collection: this.model.get('fx'),
        options: [Delay, Reverb]
      });
      */

    },

    render: function() {

      var $el = $(this.el);

      $el.append(this.pan_knob.render().el);
      $el.append(this.gain_slider.render().el);
      // $el.append(this.fx_view.render().el);

      return this;

    },

    setElement: function($el) {

      this.$controls = $('.controls', $el);
      this.$channels = $('.channels', $el);

      return Backbone.View.prototype.setElement.apply(this, arguments);

    }

  });

  var MixerView = Backbone.View.extend({

    render: function() {

      var self = this,
        template = Handlebars.compile(tmpl),
        $el = $(template()),
        model = self.model;

      this.setElement($el);

      var $channels = this.$channels;

      // append each channel view
      model.get('channels').each(function(channel) {
        var channel_view = new ChannelView({
          model: channel
        });
        $channels.append(channel_view.render().el);
      });

      return this;

    },

    setElement: function($el) {

      this.$channels = $('.channels', $el);

      return Backbone.View.prototype.setElement.apply(this, arguments);

    }

  });

  return MixerView;

});