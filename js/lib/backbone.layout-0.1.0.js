Backbone.Layout = (function() {

  var logEnabled = false;

  function log() {
    if (logEnabled) {
      console.log.apply(this, arguments);
    }
  };

  return Backbone.View.extend({

    initialize: function() {

      // a map of selector -> view references
      this.view_references = {};

      // the promises for the data
      // required before rendering the view
      this.promises = this.data? _.map(this.data(), function(model) {
        return model.fetch();
      }): [];

      return Backbone.View.prototype.initialize.apply(this, arguments);

    },

    // initViews will go through the layouts
    // `views`, creating a new view for each one.
    // it sets the view's `el` as the `el` matched
    // from the selector.
    initViews: function() {

      var self = this,
        views = self.views? self.views(): [],
        $el = self.$el;

      _.each(_.keys(views), function(selector) {
        var view = views[selector].apply(self);
        self.setView(selector, view);
      });

    },

    // layout will automatically try
    // serialize the layout's `model`,
    // or `collection` first
    serialize: function() {
      var model = this.model? this.model.toJSON():
        (this.collection? this.collection.toJSON(): {});
      return model;
    },

    // the default render action for a layout
    // simply empties the layouts main `$el`,
    // and replaces it's content with the result of
    // the layouts `template` function. it also sets
    // the `id` and `class` of it's $el
    render: function() {

      var self = this,
        $el = this.$el,
        rendered = this.rendered,
        name = self.id || self.className;

      log('Backbone.Layout (' + name + '):', rendered? 're-rendering': 'rendering');

      // prepare the div for rendering
      $el.attr('id', this.id);
      $el.attr('class', this.className);
      $el.empty();

      // wait for any data that the view requires to load
      // if there is no data, $.when will resolve immediately
      $.when.apply($, this.promises).then(function() {

        // clean up so cancelling functions
        // don't try to abort complete promises
        self.promises = [];

        // render simply appends the contents of the layouts `template`
        // function to the layouts `$el`
        var $content = self.template(self.serialize());
        $el.append($content);

        // create the subviews for the current layout
        // only when the layout is rendered the first time
        if (!rendered) {
          self.initViews();
          self.rendered = true;
        }

      });

      return this;

    },

    setView: function(selector, view) {

      var $el = this.$el,
        $node = $(selector, $el),
        name = this.id || this.className,
        v_name = view.id || view.className,
        prev_view = this.view_references[selector];

      log('Backbone.Layout (' + name + '):', 'setting view', v_name);

      // clean up previous view
      if (prev_view) {

        // cleanup events
        prev_view.undelegateEvents();
        prev_view.destroy && prev_view.destroy();

        // cancel any data request callbacks
        // so old hanging requests don't render
        _.each(prev_view.promises, function(deferred) {
          deferred.abort();
        });

      }

      // set the element and save a reference 
      // to the view (for subsequent renders)
      this.view_references[selector] = view;
      view.setElement($node);

      // set `deferRender` to `true` on a sub-layout
      // to prevent it from rendering when it's initiated
      // (good for views which render themselves later
      // on fetch, reset, etc.)
      if (!view.deferRender) {
        view.render();
      }

    }

  });

})();