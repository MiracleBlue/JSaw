define([
  'core/group'
], function(Group) {

  var Track = Group.extend({

    defaults: {
      name: 'New Track'
    },

    initialize: function(attrs, options) {

      var instrument = this.instrument = options.instrument;

      Group.prototype.initialize.apply(this, [attrs, options, 0, 1]);

      this.route();

    },

    route: function() {

      var instrument = this.instrument,
        output = this.outputs[0];

      instrument.connect(output);

    }

  });

  return Track;

});