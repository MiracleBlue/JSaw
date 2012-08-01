// a `Chain` is an `AudioletGroup` with two unique properties.
// first, it assumes all it's nodes only have (or require) one input
// and one output. as such, it's able to automatically route the internals
// of the chain. secondly, it inherits from a Backbone `Collection`. this
// means your primary interface to manipulate the chain is through standard
// `Collection` methods.

//`
// var audiolet = new Audiolet(),
//   instrument = new Instrument({ audiolet: audiolet, generator: Synth }),
//   reverb = new Reverb({ audiolet: audiolet }),
//   chain = new Chain([reverb], { audiolet: audiolet });
// instrument.connect(chain);
// chain.connect(audiolet.output);
// `
define([
  'core/collection'
], function(Collection) {

  var Chain = Collection.extend({

    constructor: function(attrs, options) {
      Collection.apply(this, [attrs, options, 1, 1]);
    },

    initialize: function(models, options) {

      var self = this;

      // whenever a node is added or removed
      // from the `Chain`, the nodes should be rerouted
      // to compensate for the new nodes
      self.on('add reset', function() {
        self.route(self.models);
      });

      // removing a node should reroute the `Chain`,
      // as well as disconnecting the node from the graph
      // entirely
      self.on('remove', function(model) {
        model.disconnect(model.connectedTo);
        self.route(self.models);
      });

      // route the initial nodes passed in
      // during initialization
      self.route(models);

    },

    // we override the `remove` method to resolve a method name
    // collision between Backbone and Audiolet. since Audiolet's
    // `remove` method requires no arguments, we use that
    // as a determining factor.
    remove: function(node) {
      if (arguments.length) {
        return Backbone.Collection.prototype.remove.apply(this, arguments);
      } else {
        return AudioletGroup.prototype.remove.apply(this, arguments);
      }
    },

    // the `route` method is responsible for connecting
    // the nodes contained within the `Chain` to the group's
    // inputs and ouputs. `route` should not be called directly;
    // instead, the user should trust the `Collection` add/remove methods
    // will reroute the `Chain` when necessary.
    route: function(models) {

      var self = this,
        first = _(models).first(),
        last = _(models).last(),
        input, output;

      // if the chain is not empty
      // we need to route the group's input
      // to it's output- passing through all the nodes first
      if (first) {

        // connect the group input to first node
        self.inputs[0].connect(first);

        // connect each node to the following
        _.each(_(models).first(self.length - 1), function(node, i) {
          input = models[i + 1].inputs[0];
          node.connect(input);
          node.connectedTo = input;
        });

        // connect the last node to the group output
        last.connect(self.outputs[0]);
        last.connectedTo = output;

      // if the chain is empty, we can route the group's input
      // directly to it's output. effectively rendering it a
      // pass through node.
      } else {
        self.inputs[0].connect(self.outputs[0]);
      }

    }

  });

  return Chain;

});