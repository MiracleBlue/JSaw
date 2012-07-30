define([
  'text!../../../templates/mixer/monitor.handlebars'
], function(tmpl) {

  var template = Handlebars.compile(tmpl);

  var MonitorView = Backbone.View.extend({

    initialize: function() {

      Backbone.View.prototype.initialize.apply(this, arguments);

    },

    render: function() {

      var model = this.model,
        $el = this.setElement($(template())).$el;

      // webkitRequestAnimationFrame(_.bind(this.update, this));

      return this;

    },

    update: function() {

      var output = this.model.outputs[0].outputs[0],
        sample_1 = output.samples[0], 
        sample_2 = output.samples[1];

      // todo: set a % of the height based on the volume
      // this.$gain.height('%');

      webkitRequestAnimationFrame(_.bind(this.update, this));

    },

    setElement: function($el) {
      this.$gain = $('.gain', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return MonitorView;

});