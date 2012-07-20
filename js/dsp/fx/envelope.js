// a basic `Envelope`.
define([
  'underscore',
  'backbone',
  'core/group'
], function(_, Backbone, Group) {

  var JEnvelope = Group.extend(_.extend({

    defaults: {
      attack: 0.01,
      decay: 0.15,
      release: 0.01
    },

    initialize: function(attrs, opts) {
      Group.prototype.initialize.apply(this, [attrs, opts, 1, 1]);
      this.build();
    },

    build: function() {

      var self = this,
        audiolet = this.get('audiolet'),
        attack = this.get('attack'),
        decay = this.get('decay'),
        release = this.get('release'),
        params = [attack, decay, release];

      function on_complete() {
        self.trigger('complete');
      };

      this.envelope = new Envelope(audiolet, 1, [0, 1, 0, 0], params, null, on_complete);

      this.route();

    },

    route: function() {
      this.envelope.connect(this.outputs[0]);
    }

  }, Backbone.Events));

  return JEnvelope;

});