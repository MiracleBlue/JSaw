define([
	'backbone',
	'core/arrangement/track'
], function (Backbone, Track) {

	var Tracks = Backbone.Collection.extend({

		model:Track,

		initialize: function() {
			console.log("Tracks collection initialize");

			this.on("remove", _.bind(function(event, data) {
				console.log("remove bubbled", event, data);
			}, this));
		}

	});

	return Tracks;

});