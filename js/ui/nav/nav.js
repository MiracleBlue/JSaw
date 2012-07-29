define([
  'ui/nav/bpm-selector',
  'text!../../../templates/nav/nav.handlebars',
  'less!../../../less/ui/nav.less'
], function(BpmSelector, tmpl) {

  var Nav = Backbone.View.extend({

    initialize: function(opts) {

      _.extend(this, opts);

      this.bpm_selector = new BpmSelector({
        model: opts.model
      });

    },

    render: function() {

      var template = Handlebars.compile(tmpl),
        $el = $(template());

      this.setElement($el);

      $el.append(this.bpm_selector.render().el);

      return this;

    }

  });

  return Nav;

});