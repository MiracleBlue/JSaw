define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'text!../../templates/chain.handlebars'
], function($, _, Backbone, Handlebars, tmpl) {

  function serializeObject($form) {
    var o = {};
    var a = $form.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  var NodeView = Backbone.View.extend({

    tagName: 'li',
    template: '<span>{{name}} <a href="#" class="destroy">delete</a></span>',

    events: {
      'click .destroy': 'destroy'
    },

    initialize: function() {
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.model.on('destroy', _.bind(this.remove, this));
    },

    destroy: function() {
      this.model.destroy();
    },

    render: function() {
      var template = Handlebars.compile(this.template),
        $el = $(this.el);
      console.log(this.model);
      $el.append($(template(this.model.toJSON())));
      return this;
    }

  });

  var ChainView = Backbone.View.extend({

    events: {
      'submit .add': 'add'
    },

    initialize: function(opts) {
      _.extend(this, opts);
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.collection.on('add', _.bind(this.addNodeView, this));
    },

    add: function(e) {

      var $form = $(e.target),
        name = serializeObject($form).name,
        options = _(this.options);

      var node = options.find(function(opt) {
        return opt.prototype.defaults.name == name; 
      });

      this.collection.add(new node({ audiolet: this.audiolet }));

      e.preventDefault()

    },

    addNodeView: function(model) {
      var subview = new NodeView({ model: model });
      this.$nodes.append(subview.render().el);
    },

    render: function() {

      var data = {
        options: _(this.options).map(function(opt) {
          return opt.prototype.defaults.name;
        })
      };

      var self = this,
        template = Handlebars.compile(tmpl),
        $el = $(template(data)),
        subview;

      self.setElement($el);

      // append subviews
      _.each(self.collection.models, this.addNodeView);

      return self;

    },

    setElement: function($el) {
      var ret = Backbone.View.prototype.setElement.apply(this, arguments);
      this.$nodes = $('.nodes', $el);
      return ret;
    }

  });

  return ChainView;

});