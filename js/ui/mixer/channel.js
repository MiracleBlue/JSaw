define([
  'dsp/fx/delay',
  'dsp/fx/reverb',
  'ui/mixer/monitor',
  'text!../../../templates/mixer/channel.handlebars'
], function(Delay, Reverb, MonitorView, tmpl) {

  var template = Handlebars.compile(tmpl);

  var ChannelView = Backbone.View.extend({

    events: {
      'click': 'selectChannel'
    }, 

    selectChannel: function() {
      this.model.trigger('select', this.model);
    },

    initialize: function() {

      Backbone.View.prototype.initialize.apply(this, arguments);

      this.gain_monitor = new MonitorView({
        className: 'gain_monitor',
        model: this.model
      });

      this.name_input = new Backbone.GUI.TextInput({
        className: 'name_input',
        model: this.model,
        property: 'name'
      });

      this.pan_knob = new Backbone.GUI.Knob({
        className: 'pan_knob',
        model: this.model,
        property: 'pan',
        min: 0,
        max: 1
      });

      this.gain_slider = new Backbone.GUI.VerticalSlider({
        className: 'gain_slider',
        model: this.model,
        property: 'gain',
        min: 0,
        max: 1
      });

    },

    render: function() {

      var model = this.model,
        $el = this.setElement($(template())).$el,
        $meta = this.$meta,
        $controls = this.$controls;

      $meta.append(this.gain_monitor.render().el);
      $meta.append(this.name_input.render().el);
      $controls.append(this.pan_knob.render().el);
      $controls.append(this.gain_slider.render().el);

      return this;

    },

    setElement: function($el) {
      this.$meta = $('.meta', $el);
      this.$controls = $('.controls', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return ChannelView;

});