define([
  'backbone',
  'handlebars',
  'ui/mixer/channel',
  'ui/mixer/fx',
  'text!../../../handlebars/mixer/mixer.handlebars'
], function(Backbone, Handlebars, ChannelView, FXView, tmpl) {

  var template = Handlebars.compile(tmpl);

  var MixerView = Backbone.View.extend({

    initialize: function(options) {

      var self = this,
        model = self.model,
        channels = model.channels,
        audiolet = this.audiolet = options.audiolet,
        prev_channel;

      Backbone.View.prototype.initialize.apply(self, arguments);

      // we wait for propagated "select" events
      // from the channel subviews
      channels.on('select', function(channel) {

        // selected current channel,
        // toggle the fx pane to show / hide
        if (channel == prev_channel) {
          self.$fx.toggle();

        // changing channel selection
        // assume we are opening the panel
        } else {
          self.$fx.show();
          self.selectChannel(channel);
          prev_channel = channel;
        }

      });

    },

    selectChannel: function(channel) {

      var $fx = this.$fx,
        audiolet = this.audiolet;

      $fx.empty();

      channel.fx.each(function(fx) {
        var fx_view = new FXView({ model: fx, audiolet: audiolet });
        $fx.append(fx_view.render().el);
      });

    },

    render: function() {

      var self = this,
        model = self.model,
        $el = this.setElement($(template())).$el,
        $channels = this.$channels,
        $fx = this.$fx,
        view;

      // append each channel view
      model.channels.each(function(channel) {
        view = new ChannelView({ model: channel });
        $channels.append(view.render().el);
      });

      return this;

    },

    setElement: function($el) {
      this.$channels = $('.channels', $el);
      this.$fx = $('.fx', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return MixerView;

});