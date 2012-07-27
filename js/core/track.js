define([
  'core/group'
], function(Group) {

  var Track = Group.extend({

    defaults: {
      name: 'New Track',
      sequence: null,
      patterns: null,
      instrument: null
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 0, 1]);
      this.route();
    },

    route: function() {
      this.get('instrument').connect(this.outputs[0]);
    }

  });

  return Track;

});