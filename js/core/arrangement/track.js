define([
	'lib/JSam/core/model'
], function (Model) {



	var Track = Model.extend({

		defaults:{
			name:'New Track'
		},



		isConnected:false,

		constructor:function (attrs, options) {
			Model.apply(this, [attrs, options, 0, 1]);
		},

		initialize:function (attrs, options) {
			console.log("Track model initialize");

			this.instrument = options.instrument;
			this.route(this.outputs[0]);

			console.log(this.instrument.attributes.generator.prototype.defaults);



			//console.log(this);

			this.on("removeTrack", _.bind(function(event, data) {
				console.log("removeTrack called", event, data);
				this.collection.remove(this);
			}, this))
		},

		route:function (destination) {
			if (this.isConnected) this.instrument.disconnect(this.outputs[0].outputs[0].connectedTo[0].node);

			var instrument = this.instrument,
				output = destination;

			instrument.connect(output);

			this.isConnected = true;

		}

	});

	return Track;

});