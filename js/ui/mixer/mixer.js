define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'lib/backbone.gui/js/src/components/text-input',
  'lib/backbone.gui/js/src/components/vertical-slider',
  'lib/backbone.gui/js/src/components/knob',
  'text!../../../templates/mixer/channel.handlebars',
  'text!../../../templates/mixer/mixer.handlebars'
], function($, _, Backbone, Handlebars, Delay, Reverb, Text, Slider, Knob, c_tmpl, m_tmpl) {

  var ChannelView = Backbone.View.extend({

    initialize: function() {
      
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.name_input = new Text({
        className: 'name_input',
        model: this.model,
        property: 'name'
      });

      this.pan_knob = new Knob({
        className: 'pan_knob',
        model: this.model,
        property: 'pan',
        min: 0,
        max: 1
      });

      this.gain_slider = new Slider({
        className: 'gain_slider',
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

      var template = Handlebars.compile(c_tmpl),
        model = this.model,
        $el = $(template(model.toJSON));

      this.setElement($el);

      this.$meta.append(this.name_input.render().el);
      this.$controls.append(this.pan_knob.render().el);
      this.$controls.append(this.gain_slider.render().el);
      // $el.append(this.fx_view.render().el);

      return this;

    },

    setElement: function($el) {

      this.$meta = $('.meta', $el);
      this.$controls = $('.controls', $el);

      return Backbone.View.prototype.setElement.apply(this, arguments);

    }

  });

  var MixerView = Backbone.View.extend({

    render: function() {

      var self = this,
        template = Handlebars.compile(m_tmpl),
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