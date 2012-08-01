// a `Group` is an `AudioletGroup` with the addition
// of a Backbone `Model` interface. this lets you
// create a Backbone `Model` which has the ability to be
// used as a group in an Audiolet graph.

// `
// var effect = Group.extend({  
//   initialize: function(attrs, options) {  
//     Group.prototype.initialize.apply(this, [attrs, options, 1, 1]);  
//   }  
// });
// `
define([
], function() {

  var Group = Backbone.Model.extend({

    constructor: function(attrs, options, num_inputs, num_outputs) {
      AudioletGroup.apply(this, [options.audiolet, num_inputs, num_outputs]);
      Backbone.Model.apply(this, arguments);
    }

  });

  Group.prototype = AudioletGroup.prototype;
  _.extend(Group.prototype, Backbone.Model.prototype);

  return Group;

});