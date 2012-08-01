define([
], function() {

  var FXView = Backbone.View.extend({

    tagName: 'li',

    initialize: function() {

      this.name_input = new Backbone.GUI.TextInput({
        model: this.model,
        property: 'name'
      });

    },

    render: function() {
      this.$el.append(this.name_input.render().el);
      return this;
    }

  });

  return FXView;

});