require([

	'core/scheduler',
	'core/arrangement/tracks',
	'core/mixer/mixer',
	'core/sequencer/sequencer',

	'views/nav/nav',
	'views/arrangement/arrangement',
	'views/mixer/mixer',
	'views/sequencer/sequencer'
], function (Scheduler, Tracks, Mixer, Sequencer, NavView, ArrangementView, MixerView, SequencerView) {

	//
	// create nodes
	//

	var audiolet = new Audiolet(),
		scheduler = new Scheduler({}, { audiolet:audiolet }),
		tracks = new Tracks(),
		mixer = new Mixer({}, { audiolet:audiolet });

	//
	// route graph
	//

	// by default, newly added tracks get routed
	// to the mixer master channel
	tracks.on('add', function (track) {
		track.connect(mixer.channels.at(0));
	});

	// removing a track from the collection
	// should remove it from the audiolet graph
	tracks.on('remove', function (track) {
		tracks.remove();
	});

	// connect mixer to output
	mixer.connect(audiolet.output);

	//
	// build ui
	//

	var $body = $('body');

	var nav_view = new NavView({
		model:scheduler
	});

	var arrangement_view = new ArrangementView({
		audiolet:audiolet,
		tracks:  tracks,
		mixer:   mixer
	});

	var mixer_view = new MixerView({
		model:   mixer,
		audiolet:audiolet
	});

	$body.append(nav_view.render().el);
	$body.append(arrangement_view.render().el);
	$body.append(mixer_view.render().el);

	// sequencer

	var Key = Backbone.Model.extend({

		defaults:{
			name:null
		},

		initialize:function () {
			this.on('noteOn', _.bind(this.noteOn, this));
			return Backbone.Model.prototype.initialize.apply(this, arguments);
		},

		// for now just to demo pianoroll,
		// each key just controls each instrument in the arrangement.
		// really, it should only control one specific instrument at a time.
		noteOn:    function (self) {
			var self = this;
			tracks.each(function (track) {
				track.instrument.playNotes([
					{
						key:self.get('name')
					}
				]);
			});
		}

	});

	var Keys = Backbone.Collection.extend({
		model:Key
	});

	var sequencer = new Sequencer({ }, {
		scheduler:scheduler,
		rows:     new Keys([
			{ name:'A' },
			{ name:'B' },
			{ name:'D' },
			{ name:'G' }
		])
	});

	var sequencer_view = new SequencerView({
		model:sequencer
	});

	$body.append(sequencer_view.render().$el);

	sequencer.set('playing', true);

});