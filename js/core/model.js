// a `Model` is an `AudioletGroup` with the addition
// of a Backbone `Model` interface. this lets you
// create a Backbone `Model` which has the ability to be
// used as a group in an Audiolet graph.

// `
// var effect = Model.extend({  
//   constructor: function(attrs, options) {  
//     Model.apply(this, [attrs, options, 1, 1]);  
//   }  
// });
// `
define([
  'lodash',
  'backbone'
], function(_, Backbone) {

  var Model = function(attrs, options, num_inputs, num_outputs) {
    AudioletGroup.apply(this, [options.audiolet, num_inputs, num_outputs]);
    Backbone.Model.apply(this, [attrs, options]);
  }

  // we need to inherit `AudioletGroup`s constructor
  // so we satisfy `AudioletGroup` instanceof checks
  Model.prototype = Object.create(AudioletGroup.prototype);
  Model.prototype = _.extend(Model.prototype, Backbone.Model.prototype);
  Model.extend = Backbone.Model.extend;

  // `Backbone.Models`s `set` checks that it is of
  // instance `Backbone.Model`. we lose instanceof with
  // multiple inheritence, so we override `set`
  // to check instanceof against our JSaw `Model`
  Model.prototype.set = function(key, value, options) {
    var attrs, attr, val;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (_.isObject(key) || key == null) {
      attrs = key;
      options = value;
    } else {
      attrs = {};
      attrs[key] = value;
    }

    // Extract attributes and options.
    options || (options = {});
    if (!attrs) return this;
    if (attrs instanceof Model) attrs = attrs.attributes;
    if (options.unset) for (attr in attrs) attrs[attr] = void 0;

    // Run validation.
    if (!this._validate(attrs, options)) return false;

    // Check for changes of `id`.
    if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

    var changes = options.changes = {};
    var now = this.attributes;
    var escaped = this._escapedAttributes;
    var prev = this._previousAttributes || {};

    // For each `set` attribute...
    for (attr in attrs) {
      val = attrs[attr];

      // If the new and current value differ, record the change.
      if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
        delete escaped[attr];
        (options.silent ? this._silent : changes)[attr] = true;
      }

      // Update or delete the current value.
      options.unset ? delete now[attr] : now[attr] = val;

      // If the new and previous value differ, record the change.  If not,
      // then remove changes for this attribute.
      if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
        this.changed[attr] = val;
        if (!options.silent) this._pending[attr] = true;
      } else {
        delete this.changed[attr];
        delete this._pending[attr];
      }
    }

    // Fire the `"change"` events.
    if (!options.silent) this.change(options);
    return this;
  }

  return Model;

});