define([
	'backbone'
], function (Backbone) {

	var Point = Backbone.Model.extend({
		defaults:{
			row:   null,
			step:  null,
			active:null
		}
	});

	var Points = Backbone.Collection.extend({
		model:Point
	});

	var Sequencer = Backbone.Model.extend({

		defaults:{
			playing:false,
			steps:  16,
			step:   0
		},

		initialize:function (attrs, options) {

			var rows = this.rows = options.rows,
				scheduler = this.scheduler = options.scheduler,
				points = this.points = new Points(),
				steps = this.get('steps');

			this.on('change:playing', _.bind(this.changePlaying, this));
			this.on('change:step', _.bind(this.changeStep, this));

			rows.each(function (row) {
				for (var i = 0; i < steps; i++) {
					points.add({
						row: row,
						step:i
					});
				}
			});

			return Backbone.Model.prototype.initialize.apply(this, arguments);

		},

		changePlaying:function (self, playing) {
			var self = this,
				steps = this.get('steps'),
				scheduler = this.scheduler;
			scheduler.play([], function () {
				var step = self.get('step'),
					reset = step == self.get('steps') - 1,
					next = reset ? 0 : step + 1;
				self.set('step', next);
			});
		},

		changeStep:function (self, step) {
			var active = this.points.filter(function (point) {
				var is_active = point.get('active'),
					is_current_step = point.get('step') == step;
				return is_current_step && is_active;
			});
			_.each(active, function (point) {
				point.get('row').trigger('noteOn');
			});
		}

	});

	return Sequencer;

});