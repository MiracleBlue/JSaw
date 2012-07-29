define([
  'ui/mixer/channel',
  'text!../../../templates/mixer/mixer.handlebars',
  'less!../../../less/ui/mixer.less'
], function(ChannelView, tmpl) {

  var template = Handlebars.compile(tmpl);

  var MixerView = Backbone.View.extend({

    render: function() {

      var self = this,
        model = self.model,
        $el = this.setElement($(template())).$el,
        $channels = this.$channels,
        view;

      // append each channel view
      model.get('channels').each(function(channel) {
        view = new ChannelView({ model: channel });
        $channels.append(view.render().el);
      });

      return this;

    },

    setElement: function($el) {
      this.$channels = $('.channels', $el);
      return Backbone.View.prototype.setElement.apply(this, arguments);
    }

  });

  return MixerView;

});