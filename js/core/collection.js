// a `Collection` is identical to a `Collection`
// except it inherits from Backbone.Collection
// rather than Backbone.Collection
define([
  'core/model'
], function(Model) {

  function Collection(models, options, num_inputs, num_outputs) {
    AudioletGroup.apply(this, [options.audiolet, num_inputs, num_outputs]);
    Backbone.Collection.apply(this, [models, options]);
  }

  // we need to inherit `AudioletGroup`s constructor
  // so we satisfy `AudioletGroup` instanceof checks
  Collection.prototype = Object.create(AudioletGroup.prototype);
  Collection.prototype = _.extend(Collection.prototype, Backbone.Collection.prototype);
  Collection.extend = Backbone.Collection.extend;

  // `Backbone.Collection`s `_prepareModel` checks that it is of
  // instance `Backbone.Model`. we lose instanceof with
  // multiple inheritence, so we override `_prepareModel`
  // to check instanceof against our JSaw `Model`
  Collection.prototype._prepareModel = function(model, options) {
    options || (options = {});
    if (!(model instanceof Model)) {
      var attrs = model;
      options.collection = this;
      model = new this.model(attrs, options);
      if (!model._validate(model.attributes, options)) model = false;
    } else if (!model.collection) {
      model.collection = this;
    }
    return model;
  };

  return Collection;

});