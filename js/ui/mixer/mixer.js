define([
  'ui/mixer/channel',
  'text!../../../templates/mixer/mixer.handlebars',
  'less!../../../less/ui/mixer.less'
], function(ChannelView, tmpl) {

  var template = Handlebars.compile(tmpl);

  var MixerView = Backbone.View.extend({

    initialize: function() {

      var self = this,
        model = self.model,
        channels = model.channels,
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
          self.selectChannel(channel);
          prev_channel = channel;
        }

      });

    },

    selectChannel: function(channel) {
      this.$fx.empty();
      this.$fx.html('<li>' + channel.get('name') + ' FX</li>');
      this.$fx.show();
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