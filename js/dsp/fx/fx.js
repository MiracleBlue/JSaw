// a simple `FX` base `AudioletModel`. provides a templates
// for simple FX with 1 input and 1 output. on initialization,
// it triggers 3 methods in the following order:  
// `build`: this is where you should create the nodes used in your Model  
// `route`: this is where you should connect the internals of your Model  
// `properties`: this is where you should proxy access to `Backbone` changes to
// nodes internally
define([
  'core/model'
], function(Model) {

  var FX = Model.extend({

    defaults: {
      name: 'FX'
    },

    constructor: function(attrs, options) {
      Model.apply(this, [attrs, options, 1, 1]);
    },

    initialize: function(attrs, options) {
      this.build();
      this.route();
      this.properties();
    },

    build: function() {

    },

    route: function() {
      this.inputs[0].connect(this.outputs[0]);
    },

    properties: function() {

    }

  });

  return FX;

});