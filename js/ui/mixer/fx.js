define([
  'dsp/fx/fx',
  'dsp/fx/delay',
  'dsp/fx/reverb'
], function(FX, Delay, Reverb) {

  var fx_options = {};

  _.each([FX, Delay, Reverb], function(fx) {
    fx_options[fx.prototype.defaults.name] = fx;
  });

  var FXView = Backbone.View.extend({

    tagName: 'li',

    initialize: function(options) {

      var self = this,
        audiolet = this.audiolet = options.audiolet,
        fx = this.model;

      this.name_input = new Backbone.GUI.TextInput({
        model: this.model,
        property: 'name'
      });

      this.type_dropdown = new Backbone.GUI.Dropdown({
        options: _.keys(fx_options),
        callback: function(fx_name) {

          var new_fx_class = fx_options[fx_name],
            new_fx = new new_fx_class({}, { audiolet: audiolet }),
            coll = fx.collection,
            old_index = coll.models.indexOf(fx);

          fx.destroy();
          coll.add(new_fx, { at: old_index });
          
          self.model = new_fx;
          fx = new_fx;

        }
      });

    },

    render: function() {
      this.$el.append(this.type_dropdown.render().el);
      return this;
    }

  });

  return FXView;

});