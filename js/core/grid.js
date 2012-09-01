define([
  'backbone'
], function(Backbone) {

  var Steps = Backbone.Collection.extend({

  });

  var Grid = Backbone.Model.extend({

    defaults: {
      steps: 16,
      steps_per_measure: 4
    },

    initialize: function(attrs, options) {
      this.collection = options.collection;
      this.steps = new Steps(new Array(this.get('steps')));
      return Backbone.Model.prototype.initialize.apply(this, arguments);
    }

  });

  return Grid;

});