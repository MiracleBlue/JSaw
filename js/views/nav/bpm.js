define([
  'backbone',
  'handlebars',
  'lib/backbone.gui/src/components/horizontal-slider',
  'lib/backbone.gui/src/components/text-input',
  'text!../../../handlebars/nav/bpm.handlebars'
], function(Backbone, Handlebars, HorizontalSlider, TextInput, tmpl) {

  var template = Handlebars.compile(tmpl);

  var BpmView = Backbone.View.extend({

    initialize: function(options) {

      Backbone.View.prototype.initialize.apply(this, arguments);

      this.bpm_slider = new HorizontalSlider({
        model: options.model,
        property: 'bpm',
        min: 0,
        max: 400
      });

      this.bpm_text = new TextInput({
        model: options.model,
        property: 'bpm'
      });

    },

    render: function() {

      var self = this,
        $el = this.setElement($(template())).$el;

      $el.append(self.bpm_slider.render().el);
      $el.append(self.bpm_text.render().el);

      return self;

    }

  });

  return BpmView;

});