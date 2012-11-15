define([
	'lodash',
	'backbone',
	'handlebars',
	'lib/backbone.gui/src/components/dropdown',
	'text!../../../handlebars/arrangement/track.handlebars'
], function (_, Backbone, Handlebars, Dropdown, tmpl) {

	var TrackView = Backbone.View.extend({

		track: this.model,

		events: {
			"click button.remove": "removeTrack"
		},

		initialize:function (options) {
			_.extend(this, options);
			Backbone.View.prototype.initialize.apply(this, arguments);
			this.build();
		},

		build:function () {

			var track = this.model,
				channels = this.mixer.channels;

			var channel_properties = [];
			channels.each(function (channel) {
				channel_properties.push(channel.get("name"));
			});

			console.log("channels.models", channels.models);

			this.channel_dropdown = new Dropdown({
				options:channel_properties
			});

			this.channel_dropdown.on('change', function (val) {
				console.log('beep', val);
				var channel = channels.find(function (channel) {
					return channel.get("name") === val;
				});
				// Why does the view handle routing instead of the track itself?
				//track.disconnect(track.outputs[0].outputs[0].connectedTo[0].node);
				//track.connect(channel);
				track.route(channel);
			});



		},

		render:function () {

			var model = this.model,
				track = model,
				self = this,
				template = Handlebars.compile(tmpl),
				data = model.toJSON(),
				$el = $(template(data)),
				channels = this.mixer.channels;

			$el.append(this.channel_dropdown.render().el);

			this.setElement($el);

			return this;

		},

		setElement:function ($el) {
			this.$sequence = $('.sequence', $el);
			return Backbone.View.prototype.setElement.apply(this, arguments);
		},

		removeTrack: function() {
			console.log("remove called");
			this.model.trigger("removeTrack", this.model);
			this.remove();
		}

	});

	return TrackView;

});