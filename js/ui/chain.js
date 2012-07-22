define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'text!../../templates/chain.handlebars'
], function($, _, Backbone, Handlebars, tmpl) {

  var ChainView = Backbone.View.extend({

    initialize: function(opts) {
      _.extend(this, opts);
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    render: function() {

      var template = Handlebars.compile(tmpl),
        collection = this.collection;

      this.setElement($(template({
        models: collection.toJSON()
      })));

      return this;

    }

  });

  return ChainView;

});