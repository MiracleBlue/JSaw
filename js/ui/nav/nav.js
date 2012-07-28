define([
  'jquery',
  'underscore',
  'backbone',
  'ui/nav/bpm-selector',
  'lib/backbone.gui/js/src/components/horizontal-slider',
  'lib/backbone.gui/js/src/components/text-input'
], function($, _, Backbone, BpmSelector, Slider, Input) {

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