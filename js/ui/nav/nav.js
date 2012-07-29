define([
  'ui/nav/bpm-selector',
  'less!../../../less/ui/nav.less'
], function(BpmSelector) {

  var Nav = Backbone.View.extend({

    scheduler: null,

    className: 'nav',

    initialize: function(opts) {

      _.extend(this, opts);

      this.bpm_selector = new BpmSelector({
        model: opts.model
      });

    },

    render: function() {

      var $el = $(this.el);

      $el.append(this.bpm_selector.render().el);

      return this;

    }

  });

  return Nav;

});