define([
  'lodash',
  'backbone',
  'handlebars',
  'lib/backbone.gui/src/components/dropdown',
  'text!../../../templates/arrangement/track.handlebars'
], function(_, Backbone, Handlebars, Dropdown, tmpl) {

  var TrackView = Backbone.View.extend({

    initialize: function(options) {
      _.extend(this, options);
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.build();
    },

    build: function() {

      var track = this.model,
        channels = this.mixer.channels;

      this.channel_dropdown = new Dropdown({
        options: channels.models
      });

      this.channel_dropdown.on('change', function(val) {
        console.log('beep', val);
        var channel = channels.find(function(channel) {
          return channel.get('name') == val;
        });
        track.disconnect(track.outputs[0].outputs[0].connectedTo[0].node);
        track.connect(channel);
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