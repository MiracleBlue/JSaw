define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  // a chain is a `Collection` which has the same routing interface as a `Group`.
  // the only difference is a `Chain` routes it's nodes automatically, linearly
  // connecting the first output of each node into the first input of the following node
  // `
  // var instrument = new Instrument({ audiolet: audiolet }),
  //   delay = new Delay({ audiolet: audiolet }),
  //   reverb = new Reverb({ audiolet: audiolet })
  //   chain = new Chain([], { audiolet: audiolet });
  // instrument.connect(chain.inputs[0]);
  // chain.connect(audiolet.output);
  // `
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