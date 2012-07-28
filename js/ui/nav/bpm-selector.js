define([
  'jquery',
  'underscore',
  'backbone',
  'lib/backbone.gui/js/src/components/horizontal-slider',
  'lib/backbone.gui/js/src/components/text-input'
], function($, _, Backbone, Slider, Input) {

  var BpmSelector = Backbone.View.extend({

    className: 'bpm',

    render: function() {

      var self = this,
        model = self.model,
        $el = $(self.el);

      var bpm_slider = new Slider({
        model: model,
        property: 'bpm',
        min: 0,
        max: 400
      });

      var bpm_text = new Input({
        model: model,
        property: 'bpm'
      });

      $el.append(bpm_slider.render().el);
      $el.append(bpm_text.render().el);

      return self;

    }

  });

  return BpmSelector;

});