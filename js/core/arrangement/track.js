define([
  'core/group'
], function(Group) {

  var Track = Group.extend({

    defaults: {
      name: 'New Track'
    },

    constructor: function(attrs, options) {
      Group.apply(this, [attrs, options, 0, 1]);
    },

    initialize: function(attrs, options) {
      console.log(options.instrument);
      this.instrument = options.instrument;
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