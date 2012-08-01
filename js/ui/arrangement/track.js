define([
  'text!../../../templates/arrangement/track.handlebars'
], function(tmpl) {

  var TrackView = Backbone.View.extend({

    initialize: function(options) {
      _.extend(this, options);
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.build();
    },

    build: function() {

      var track = this.model,
        channels = this.mixer.channels;

      this.channel_dropdown = new Backbone.GUI.Dropdown({

        // dropdown will infer names from the models for values
        options: channels.models,

        // dropdown passes back the name of the selected model
        callback: function(channel_name) {

          // find the channel based on the name
          var channel = channels.find(function(channel) {
            return channel.get('name') == channel_name;
          });

          // disconnect the track from it's current channel
          track.disconnect(track.outputs[0].outputs[0].connectedTo[0].node);

          // connect the track to the new channel
          track.connect(channel);

        }

      });

    },

    render: function() {;

      var model = this.model,
        template = Handlebars.compile(tmpl),
        data = model.toJSON(),
        $el = $(template(data)),
        channels = this.mixer.channels;

      $el.append(this.channel_dropdown.render().el);

      this.setElement($el);

      return this;

    },

    setElement: function($el) {
      this.$sequence = $('.sequence', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return TrackView;

});