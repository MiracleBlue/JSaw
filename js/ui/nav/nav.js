define([
  'ui/nav/bpm',
  'text!../../../templates/nav/nav.handlebars',
  'less!../../../less/ui/nav.less'
], function(BpmView, tmpl) {

  var NavView = Backbone.View.extend({

    initialize: function(opts) {

      Backbone.View.prototype.initialize.apply(this, arguments);

      this.bpm_selector = new BpmView({
        model: opts.model
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