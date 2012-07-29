// a `Group` is an `AudioletGroup` with the addition
// of a Backbone `Model` interface. this lets you
// create a Backbone `Model` which has the ability to be
// used as a group in an Audiolet graph.

// `
// var effect = Group.extend({  
//   initialize: function(attrs, opts) {  
//     Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);  
//   }  
// });
// `
define([
], function() {

  var Group = Backbone.Model.extend(_.extend({}, AudioletGroup.prototype, {

    defaults: {
      audiolet: null
    },

    // the `initialize` function is responsible
    // for inheriting properties of `AudioletGroup` and `Model`.
    // it also augments the constructor with two arguments;
    // num_inputs and num_outputs, which should be
    // passed in during initialization.
    initialize: function(attrs, opts, num_inputs, num_outputs) {
      Backbone.Model.prototype.initialize.apply(this, arguments);
      AudioletGroup.apply(this, [this.get('audiolet'), num_inputs, num_outputs]);
    },

  }));

  return Group;

});