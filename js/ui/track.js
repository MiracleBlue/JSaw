define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var TrackView = Backbone.View.extend({

    tagName: 'li',
    className: 'track',

    initialize: function(opts) {
      _.extend(this, opts);
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    render: function() {

      var $el = $(this.el),
        model = this.model;

      $el.append(model.get('name'));

      return this;

    }

  });

  return TrackView;

});