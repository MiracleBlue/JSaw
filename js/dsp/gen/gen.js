// a simple `generator` base `AudioletModel`. provides a templates
// for simple `generator`s  with 0 inputs and 1 output. on initialization,
// it triggers 3 methods in the following order:  
// `build`: this is where you should create the nodes used in your Model  
// `route`: this is where you should connect the internals of your Model  
// `properties`: this is where you should proxy access to `Backbone` changes to
// nodes internally
define([
  'lib/JSam/core/model'
], function(Model) {

  var Generator = Model.extend({

    defaults: {
      name: 'Generator'
    },

    constructor: function(attrs, options) {
      Model.apply(this, [attrs, options, 0, 1]);
    },

    initialize: function(attrs, options) {
      this.build();
      this.route();
      this.properties();
    },

    build: function() {

    },

    route: function() {

    },

    properties: function() {

    }

  });

  return Generator;

});