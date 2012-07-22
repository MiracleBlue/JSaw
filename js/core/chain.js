define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  // a chain is a Collection which represents a group of nodes.
  // the chain will automatically route its internals in their index order
  var Chain = Backbone.Collection.extend(_.extend({}, AudioletGroup.prototype, {

    initialize: function(models, opts) {

      var self = this;

      Backbone.Collection.prototype.initialize.apply(this, arguments);
      AudioletGroup.apply(this, [opts.audiolet, 1, 1]);

      self.on('add remove reset', function() {
        self.route(self.models);
      });

      self.audiolet = opts.audiolet;

      self.route(models);

    },

    route: function(models) {

      var self = this,
        first = _(models).first();

      // chain is not empty
      if (first) {

        // connect input to first fx
        self.inputs[0].connect(first.inputs[0]);

        // connect each fx into the next
        _.each(_(models).first(self.length - 1), function(effect, i) {
          effect.connect(models[i + 1].inputs[0]);
        });

        // connect last fx to output
        _(models).last().connect(self.outputs[0]);

      // chain is empty
      } else {
        self.inputs[0].connect(self.outputs[0]);
      }

    }

  }));

  return Chain;

});