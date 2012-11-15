define([
	'backbone',
	'layout',
	'handlebars',
	'text!../../../handlebars/sequencer/sequencer.handlebars',
	'text!../../../handlebars/sequencer/row.handlebars',
	'text!../../../handlebars/sequencer/point.handlebars'
], function (Backbone, Layout, Handlebars, tmpl, row_tmpl, point_tmpl) {

	Handlebars.registerHelper('')

	var PointView = Layout.extend({

		tagName: 'td',
		template:Handlebars.compile(point_tmpl),

		events:{
			'click':'clickStep'
		},

		initialize:function () {
			this.model.on('change:active', _.bind(this.render, this));
			return Layout.prototype.initialize.apply(this, arguments);
		},

		clickStep:function (e) {
			var point = this.model,
				active = point.get('active');
			point.set('active', !active);
			e.preventDefault();

			console.log("clickStep: ", this.model);
		}

	});

	var SequencerRow = Layout.extend({

		tagName: 'tr',
		template:Handlebars.compile(row_tmpl),

		initialize:function (options) {
			this.points = options.points;
			return Layout.prototype.initialize.apply(this, arguments);
		},

		render:function () {
			var self = Layout.prototype.render.apply(this, arguments),
				points = self.points;
			_.each(points, function (point) {
				var view = new PointView({
					model:point
				});
				self.$el.append(view.render().el);
			});
			return self;
		}

	});

	var Sequencer = Layout.extend({

		tagName:  'table',
		className:'sequencer',
		template: Handlebars.compile(tmpl),

		initialize:function (options) {
			this.model.points.on('add', function (point) {
				console.log(point.get('row'), point.get('step'));
			});
			return Layout.prototype.initialize.apply(this, arguments);
		},

		serialize:function () {
			return new Array(this.model.get('steps'));
		},

		render:function () {
			var self = Layout.prototype.render.apply(this, arguments),
				$tbody = $('tbody', self.$el),
				points = this.model.points,
				rows = this.model.rows;
			rows.each(function (row) {
				var view = new SequencerRow({
					model: row,
					points:points.filter(function (p) {
						return p.get('row') == row
					})
				});
				$tbody.append(view.render().el);
			});
			return self;
		}

	});

	return Sequencer;

});