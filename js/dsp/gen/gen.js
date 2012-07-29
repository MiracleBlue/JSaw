// a simple `generator` base `AudioletGroup`. provides a templates
// for simple `generator`s  with 0 inputs and 1 output. on initialization,
// it triggers 3 methods in the following order:  
// `build`: this is where you should create the nodes used in your group  
// `route`: this is where you should connect the internals of your group  
// `properties`: this is where you should proxy access to `Backbone` changes to
// nodes internally
define([
  'core/group'
], function(Group) {

  var Generator = Group.extend({

    defaults: {
      audiolet: null,
      name: 'Generator'
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
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