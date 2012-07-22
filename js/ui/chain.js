define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars'
], function($, _, Backbone, Handlebars) {

  var NodeView = Backbone.View.extend({

    tagName: 'li',
    template: '<span>{{name}} <a href="#" class="destroy">delete</a></span>',

    events: {
      'click .destroy': 'destroy'
    },

    initialize: function() {
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.model.on('destroy', _.bind(this.remove, this));
    },

    destroy: function() {
      this.model.destroy();
    },

    render: function() {
      var template = Handlebars.compile(this.template),
        $el = $(this.el);
      $el.append($(template(this.model.toJSON())));
      return this;
    }

  });

  var ChainView = Backbone.View.extend({

    tagName: 'ul',
    className: 'chain',

    initialize: function(opts) {
      _.extend(this, opts);
      Backbone.View.prototype.initialize.apply(this, arguments);
    },

    render: function() {

      var $el = $(this.el),
        subview;

      // append subviews
      _.each(this.collection.models, function(model) {
        subview = new NodeView({ model: model });
        $el.append(subview.render().el);
      });

      return this;

    }

  });

  return ChainView;

});