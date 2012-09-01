define([
  'backbone',
  'handlebars',
  'ui/nav/bpm',
  'text!../../../templates/nav/nav.handlebars'
], function(Backbone, Handlebars, BpmView, tmpl) {

  var NavView = Backbone.View.extend({

    initialize: function(options) {

      Backbone.View.prototype.initialize.apply(this, arguments);

      this.bpm_selector = new BpmView({
        model: options.model
      });

    },

    render: function() {

      var template = Handlebars.compile(tmpl),
        $el = this.setElement($(template())).$el;

      $el.append(this.bpm_selector.render().el);

      return this;

    }

  });

  return NavView;

});