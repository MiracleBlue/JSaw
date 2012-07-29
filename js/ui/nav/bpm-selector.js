define([
], function() {

  var BpmSelector = Backbone.View.extend({

    className: 'bpm',

    render: function() {

      var self = this,
        model = self.model,
        $el = $(self.el);

      var bpm_slider = new Backbone.GUI.HorizontalSlider({
        model: model,
        property: 'bpm',
        min: 0,
        max: 400
      });

      var bpm_text = new Backbone.GUI.TextInput({
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