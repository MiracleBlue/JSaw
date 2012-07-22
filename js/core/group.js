// a simple backbone model wrapper
// around audiolet's `AudioletGroup` object

// Group provides a new Backbone model for you to extend
// which provides your model with x inputs and y outputs
// and the appropriate connection methods
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  // the group class. creates a constructor who extends AudioletGroup.
  // example use (an fx model with 1 input and 1 output):  
  // `
  // var FX = Group.extend({  
  //   initialize: function(attrs, opts) {  
  //     Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);  
  //   }  
  // });
  // `
  var Group = Backbone.Model.extend(_.extend({}, AudioletGroup.prototype, {

    initialize: function(attrs, opts, num_inputs, num_outputs) {
      Backbone.Model.prototype.initialize.apply(this, arguments);
      AudioletGroup.apply(this, [this.get('audiolet'), num_inputs, num_outputs]);
    },

  }));

  return Group;

});