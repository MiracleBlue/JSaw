define([
  'lodash',
  'backbone',
  'handlebars',
  'text!../../../handlebars/mixer/monitor.handlebars'
], function(_, Backbone, Handlebars, tmpl) {

  var template = Handlebars.compile(tmpl);

  var MonitorView = Backbone.View.extend({

    initialize: function() {

      Backbone.View.prototype.initialize.apply(this, arguments);

    },

    render: function() {

      var model = this.model,
        $el = this.setElement($(template())).$el;

      // todo: lol update equation is so wrong
      // webkitRequestAnimationFrame(_.bind(this.update, this));

      return this;

    },

    update: function() {

      var output = this.model.outputs[0].outputs[0],
        sample = _.reduce(output.samples, function(m, channel) { return m + channel; }, 0),
        height = (Math.abs(sample) / 1) * 1000;

      this.$gain.height(height + '%');

      webkitRequestAnimationFrame(_.bind(this.update, this));

    },

    setElement: function($el) {
      this.$gain = $('.gain', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return MonitorView;

});