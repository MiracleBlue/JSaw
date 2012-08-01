define([
  'core/model'
], function(Model) {

  var Track = Model.extend({

    defaults: {
      name: 'New Track'
    },

    constructor: function(attrs, options) {
      Model.apply(this, [attrs, options, 0, 1]);
    },

    initialize: function(attrs, options) {
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