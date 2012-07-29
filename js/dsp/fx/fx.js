// a simple `FX` base `AudioletGroup`. provides a templates
// for simple FX with 1 input and 1 output. on initialization,
// it triggers 3 methods in the following order:  
// `build`: this is where you should create the nodes used in your group  
// `route`: this is where you should connect the internals of your group  
// `properties`: this is where you should proxy access to `Backbone` changes to
// nodes internally
define([
  'core/group'
], function(Group) {

  var FX = Group.extend({

    defaults: {
      audiolet: null,
      name: 'FX'
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
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