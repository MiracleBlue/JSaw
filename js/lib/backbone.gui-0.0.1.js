define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var GUI = (function(GUI) {

    GUI.Component = Backbone.View.extend({

      initialize: function(opts) {

        Backbone.View.prototype.initialize.apply(this, arguments);
        _.extend(this.options, opts);

        var self = this,
          model = self.model,
          prop = this.options.property;

        // update the slider position
        // when the model property changes
        if (model && prop) {
          model.on('change:' + prop, function(model, val) {
            self.setVal(val);
          });
        }

      },

      setElement: function() {
        var model = this.model;
        Backbone.View.prototype.setElement.apply(this, arguments);
        this.setVal(model? model.get(this.options.property): 0);
      },

      setVal: function() {
      },

      render: function() {
        this.setElement($(this.template));
        return this;
      }

    });

    GUI.View = Backbone.View.extend({

      template: '<div class="bb-gui"></div>',
      row_template: '<div class="row"><% if (key) { %><span class="label"><%= key %></span><% } %></div>',

      initialize: function(opts) {
        this.gui = opts.gui;
        Backbone.View.prototype.initialize.apply(this, arguments);
      },

      render: function() {
          
        var model = this.model,
          $el = $(this.template),
          user_opts = this.gui || {},
          row_template = _.template(this.row_template);

        // create a component for each attribute
        // of the model
        _.each(model.attributes, function(attr, key) {

          var type = typeof(attr),
            cur_opts = user_opts[key],
            cur_opts_advanced = !_.isString(cur_opts),
            opts = _.extend({ model: model, property: key }, cur_opts_advanced? cur_opts: {}),
            component,
            $row,
            view;

          // pass in `component` option to 
          // bypass component inference
          if (!cur_opts_advanced || opts.component) {

            // options is a hash of options
            // who defines a `component`
            if (cur_opts_advanced) {
              component = opts.component;

            // options is a string, simply defining component
            } else {
              component = cur_opts;
            }

          // if no `component` was declared in this.gui
          // infer component from type
          } else {
            switch (type) {
              case 'string':
                component = 'TextInput'
                break;
              case 'number':
                component = 'HorizontalSlider';
                break;
              case 'boolean':
                component = 'TriggerButton';
                break;
            }
          }

          // set this.gui[key] to `null`
          // to not render the component
          if (user_opts[key] !== null && component) {
            needs_label = ['HoldButton', 'TriggerButton'].indexOf(component) == -1
            $row = $(row_template({ key: needs_label? key: false }))
            view = new GUI[component](opts);
            $row.append(view.render().el);
            $el.append($row);
          } 

        });
        
        this.setElement($el);
        return this;

      }

    });

    return GUI;

  })({});

  GUI = (function(GUI) {

    // options
    // `mode` (default: `hold`): `hold` for intantaneous or `trigger` for toggle
    // `action` (optional): a function, or string representing a model's action by key
    //                      triggered *when* true is set if `trigger`, and *while* true is set if `hold`
    // `property` (optional): a boolean property to set `true` or `false`
    // `label` (optional): label for the button

    GUI.HoldButton = GUI.Component.extend({

      options: {
        action: false,
        label: false
      },

      events: {
        'mousedown input': 'click'
      },

      template: '<div class="bb-gui-component"><input type="button" class="button" /></div>',

      setVal: function(val) {
          this.$input[val? 'addClass': 'removeClass']('true');
      },

      click: function(e) {

        var model = this.model,
          opts = this.options,
          prop = opts.property,
          action = opts.action,
          method,
          interval;

        // if there's a `property`
        // this button should set boolean for that property
        if (prop) {
          model.set(prop, !model.get(prop));
          $(window).one('mouseup.button', function() {
            model.set(prop, !model.get(prop));
          });

        // if there's an `action`
        // this button should also trigger a function
        } else if (action) {
          method = _.isFunction(action)? action: model[action];
          interval = setInterval(method);
          $(window).one('mouseup.button', function() {
            clearInterval(interval);
          });

        }

        e.preventDefault();

      },

      setElement: function($el) {
        var opts = this.options,
          label = opts.label,
          prop = opts.property,
          action = this.options.action;
        this.$input = $('input', $el);
        this.$input.attr('value', label || prop || (_.isString(action)? action: 'Unknown'));
        GUI.Component.prototype.setElement.apply(this, arguments);
      }

    });

    GUI.TriggerButton = GUI.HoldButton.extend({

      events: {
        'mousedown': 'click'
      },

      template: '<div class="bb-gui-component"><input type="button" class="button" /></div>',

      click: function(e) {

        var model = this.model,
          opts = this.options,
          prop = opts.property,
          action = opts.action,
          method,
          interval;

        // if there's a `property`
        // this button should set boolean for that property
        if (prop) {
          model.set(prop, !model.get(prop));

        // if there's an `action`
        // this button should also trigger a function
        } else if (action) {
          method = _.isFunction(action)? action: model[action];
          method();

        }

        e.preventDefault();

      }

    });

    return GUI;

  })(GUI);

  GUI = (function(GUI) {

    GUI.RadioButtons = GUI.Component.extend({

      options: {
        property: false,
        options: false
      },

      events: {
        'click input': 'changeInput'
      },

      template: '<div class="bb-gui-component"><form class="radio"></form></div>',

      setVal: function(val) {
        this.$inputs.val([val]);
      },

      changeInput: function(e) {
        var val = this.$inputs.filter(':checked').val();
        this.model.set(this.options.property, val);
      },

      setElement: function($el) {
        this.$inputs = $('input', $el);
        GUI.Component.prototype.setElement.apply(this, arguments);
      },

      render: function() {

        var $el = $(this.template),
          prop = this.options.property,
          cid = this.cid,
          $form = $('form', $el);

        _.each(this.options.options, function(opt) {
          $form.append('<div class="input"><input type="radio" name="' + cid + '-' + prop + '" value="' + opt + '" /><span>' + opt + '</span></div>');
        });

        this.setElement($el);
        return this;

      }

    });

    GUI.Dropdown = GUI.RadioButtons.extend({

      options: {
        property: false,
        options: false
      },

      events: {
        'change select': 'changeInput'
      },

      template: '<div class="bb-gui-component"><form class="dropdown"><select></select></form></div>',

      changeInput: function(e) {
        var val = this.$inputs.val();
        this.model.set(this.options.property, val);
      },

      setElement: function($el) {
        this.$inputs = $('select', $el);
        GUI.Component.prototype.setElement.apply(this, arguments);
      },

      render: function() {

        var $el = $(this.template),
          prop = this.options.property,
          input_name = this,
          $select = $('select', $el);

        _.each(this.options.options, function(opt) {
          $select.append('<option value="' + opt + '">' + opt + '</option>');
        });

        this.setElement($el);
        return this;

      }

    });

    return GUI;

  })(GUI);

  GUI = (function(GUI) {

    GUI.VerticalSlider = GUI.Component.extend({

      options: {
        property: false,
        min: 0,
        max: 100
      },

      events: {
        'mousedown .grip': 'startSlide'
      },

      template: '<div class="bb-gui-component">' +
      '<div class="vertical slider">' +
        '<div class="track">' +
          '<div class="grip"></div>' +
        '</div>' +
      '</div>' +
      '</div>',

      setVal: function(val) {

        var height_range = 100,
          val_range = this.options.max - this.options.min,
          ratio = (val - this.options.min) / val_range,
          height = height_range * ratio;

        this.$track.height(height + '%');

      },

      startSlide: function(e) {
        $(window).on('mousemove.slider', _.bind(this.onSlide, this));
        $(window).one('mouseup',this.stopSlide);
      },

      stopSlide: function() {
        $(window).off('mousemove.slider');
      },

      onSlide: function(e) {

        // calculate new value based on
        // el position, el offset, and mouse position
        var model = this.model,
          opts = this.options,
          $el = this.$el,
          height = $el.height(),                  // height of el
          top = $el.offset().top,                 // top px of el
          bottom = top + height,                  // bottom px of el
          rel_y_px = bottom - e.clientY,          // px from bottom user clicked
          rel_y = (rel_y_px / height),            // % from bottom user clicked
          range_y = opts.max - opts.min,          // total range of values
          new_val = opts.min + (range_y * rel_y), // the new value
          normalized_val;

        if (new_val < opts.min) {
          normalized_val = opts.min;
        
        } else if (new_val > opts.max) {
          normalized_val = opts.max
        
        } else {
          normalized_val = new_val;
        }

        model.set(opts.property, normalized_val);

      },

      setElement: function($el) {
        this.$track = $('.track', $el);
        GUI.Component.prototype.setElement.apply(this, arguments);
      }

    });

    GUI.HorizontalSlider = GUI.VerticalSlider.extend({

      template: '<div class="bb-gui-component">' +
        '<div class="horizontal slider">' +
          '<div class="track">' +
            '<div class="grip"></div>' +
          '</div>' +
        '</div>' +
      '</div>',

      setVal: function(val) {

        var width_range = 100,
          val_range = this.options.max - this.options.min,
          ratio = (val - this.options.min) / val_range,
          width = width_range * ratio;

        this.$track.width(width + '%');

      },

      onSlide: function(e) {

        // calculate new value based on
        // el position, el offset, and mouse position
        var model = this.model,
          opts = this.options,
          $el = this.$el,
          width = $el.width(),                    // width of el
          left = $el.offset().left,               // left px of el
          rel_x_px = e.clientX - left,            // px from left user clicked
          rel_x = (rel_x_px / width),             // % from bottom user clicked
          range_x = opts.max - opts.min,          // total range of values
          new_val = opts.min + (range_x * rel_x), // the new value
          normalized_val;

        if (new_val < opts.min) {
          normalized_val = opts.min;
        
        } else if (new_val > opts.max) {
          normalized_val = opts.max
        
        } else {
          normalized_val = new_val;
        }

        model.set(opts.property, normalized_val);

      }

    });

    GUI.Knob = GUI.VerticalSlider.extend({

      options: _.extend({
        rotate: 120
      }, GUI.VerticalSlider.prototype.options),

      template: '<div class="bb-gui-component">' +
        '<div class="round slider">' +
          '<div class="track">' +
            '<div class="grip"></div>' +
          '</div>' +
        '</div>' +
      '</div>',

      setVal: function(val) {

        var rotate_range = this.options.rotate * 2,
          val_range = this.options.max - this.options.min,
          ratio = (val - this.options.min) / val_range,
          rotation = (rotate_range * ratio) - this.options.rotate;

        this.$grip.css('-webkit-transform', 'rotate(' + rotation + 'deg)');

      },

      setElement: function($el) {
        this.$grip = $('.grip', $el);
        GUI.Component.prototype.setElement.apply(this, arguments);
      },

    });

    return GUI;

  })(GUI);

  GUI = (function(GUI) {

    GUI.TextInput = GUI.Component.extend({

      options: {
        property: false
      },

      events: {
        'submit form': 'changeInput'
      },

      template: '<div class="bb-gui-component">' +
        '<form class="text">' +
          '<input />' +
        '</form>' +
      '</div>',

      setVal: function(val) {
        this.$input.val(val);
      },

      changeInput: function(e) {
        var val = this.$input.val();
        this.model.set(this.options.property, val);
        e.preventDefault();
      },

      setElement: function($el) {
        this.$input = $('input', $el);
        GUI.Component.prototype.setElement.apply(this, arguments);
      }

    });

    return GUI;

  })(GUI);

  return GUI;

});