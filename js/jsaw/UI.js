/**
 * JSaw-UI - User Interface for JSaw (JavaScript Audio Workstation)
 */

var NoteLookup = {
	all: {
		1: 'B',
		2: 'A#',
		3: 'A',
		4: 'G#',
		5: 'G',
		6: 'F#',
		7: 'F',
		8: 'E',
		9: 'D#',
		10: 'D',
		11: 'C#',
		12: 'C'
	},
	accidentals: [
		2,
		4,
		6,
		9,
		11
	],
	naturals: [
		1,
		3,
		5,
		7,
		8,
		10,
		12
	]
};

var JUI = {};

//jQuery.noConflict();
(function($){
	JUI.Note = function(note) {
		/*this.options = {
			step: 0,
			key: "G#",
			octave: 3,
			length: 1,
			velocity: 1.0
		}
		_(this.options).extend(params);*/
		this.note = note;
		this.rel = function(){
			var nl = _(NoteLookup.all).values().indexOf(this.note.getKey())+1;
			return nl;
		};
		this.elem = $("<div class='noteBlock'></div>");
		this.elem.data("note", this.note);
	}
	
	JUI.PianoRoll = function(options) {
		this.options = {
			steps: 16,
			instrument: null
		};
		_(this.options).extend(options);
		
		this.pattern = options.pattern;
		
		this.wrapperElem = $("#pianoroll");
		this.buildUI();
		this.elem = {
			steps: this.wrapperElem.find(".stepGrid ul.step"),
			keys: this.wrapperElem.find(".keyList")
		};
	}
	
	JUI.PianoRoll.prototype.findStep = function(index) {
		return this.wrapperElem.find(".stepGrid ul.step[rel="+index+"]");
	}
	
	JUI.PianoRoll.prototype.findNote = function() {
		
	}
	
	JUI.PianoRoll.prototype.buildUI = function() {
		var self = this;
			// Wrapper element for piano roll
		var $pianoRollWrap = this.wrapperElem;
		
		var numOfSteps = this.options.steps;
		
		// Generate HTML for piano roll gui elements
		// Set up dom elements
		var pianoGridElem = $("<div class='pianogrid' style='overflow: auto; display: table;' rel='3'></div>").appendTo($pianoRollWrap);
		
			// Generate key list
			var pianoGridKeyList = $("<ul class='keyList dockme-left'></ul>").appendTo(pianoGridElem);
			$((function(){
				var markup = "";
				$.each(NoteLookup.all, function(key, value){
					markup += '<li class="note" rel="' + key + '"><span class="note-hint" rel="'+value+'">' + value + '</span></li>';
				});
				return $(markup);
			}())).appendTo(pianoGridKeyList);
			
			// Generate step grid
			var pianoGridStepGrid = $("<ul class='stepGrid dockme-center'></ul>").appendTo(pianoGridElem);
			for (var i=1;i<=numOfSteps;i++){
				var innerStepListElem = $('<li class="stepList"></li>').appendTo(pianoGridStepGrid);
				var innerStepElem = $('<ul class="step" rel="'+i+'"></ul>').appendTo(innerStepListElem);
				$((function(){
					var markup = "";
					$.each(NoteLookup.all, function(key, value){
						markup += '<li class="note" rel="'+key+'"><span class="note-hint">'+value+'</span></li>';
					});
					return $(markup);
				}())).appendTo(innerStepElem);
			}
			
			$("ul.step > li.note").each(function(){
				$(this).data("note", {
					key: NoteLookup.all[$(this).attr("rel")],
					position: $(this).parent().attr("rel")-1
				});
				
			});
		
		// Now we can fine-tune our styling of our generated markup and initialise the GUI functionality!
			
		var $pianoGrid = $("div.pianogrid");
		var $stepGrid = $pianoGrid.find("ul.stepGrid");
		var $stepList = $stepGrid.find("ul.step");
		
		stepListWrap = "li.stepList";
		stepListNote = "li.note";
		
		$stepGrid.find(stepListWrap+":nth-child(4n+1)").addClass("beatMarker");
		
		$pianoGrid.find(stepListNote).filter("[rel=2],[rel=4],[rel=6],[rel=9],[rel=11]").each(function(){
			$(this).addClass("accidental");
		});
		
		// Initialise hover event listeners on keylist items, for same-note highlighting
		$("ul.keyList > li.note, ul.step > li.note").mouseover(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.parent();
			elem.addClass("highlight");
			$("ul.step > li.note[rel=" + elem.attr("rel") + "]").addClass("highlight");
		}).mouseout(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.parent();
			elem.removeClass("highlight");
			$("ul.step > li.note[rel=" + elem.attr("rel") + "]").removeClass("highlight");
		});
		
		$("ul.keyList > li.note").mousedown(function(e) {
			var elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.parent();
			
			var newkey = elem.find('span.note-hint').attr("rel");
			self.options.instrument().playNote({key: newkey, octave: 3});
		});
		
		$("ul.step > li.note").on("mouseup", function(e){
			if (e.which == 3) return;
			var target = $(e.target);
			if (target.hasClass("noteBlock")) return;
			if (!target.hasClass("note")) target = target.parent();
			var data = {
				key: NoteLookup.all[target.attr("rel")],
				position: target.parent().attr("rel")-1
			}
			self.addNote(data);
		});
		
		$("ul.step > li.note").droppable({
			drop: function(event, ui) {
				console.dir(event);
				console.dir(ui);
				console.dir(this);
				console.dir($(event.target).data("note"));
				var src = $(event.target);
				var target = $(this);
				self.pattern.removeNote(src.data("note"));
				self.addNote(target.data("note"));
				src.remove();
				// Bingo.
			}
		});
		
		//$("")
		$("#test-play").on("click", function(){
			self.play();
		});
		
	}
	
	JUI.PianoRoll.prototype.addNote = function(note) {
		var self = this;
		var nd = this.pattern.addNote(note);
		var nb = new JUI.Note(nd);
		nb.elem.prependTo("ul.step[rel="+(nb.note.getPosition()+1)+"] > li.note[rel="+nb.rel()+"]");
		nb.elem.on("mouseup", function(e){
			e.preventDefault();
			//e.stopPropagation();
		});
		nb.elem.on("contextmenu", function(e){
			//if (e.which == 3) {
				e.preventDefault();
				e.stopPropagation();
				self.removeNote(nb);
			//}
		});
		nb.elem.draggable({
			snap: "ul.step > li.note",
			snapMode: "inner",
			snapTolerance: 10
		});
	}
	
	JUI.PianoRoll.prototype.removeNote = function(note) {
		this.pattern.removeNote(note.note);
		note.elem.remove();
	}
	
	JUI.PianoRoll.prototype.play = function() {
		console.debug("play:");
		console.dir(this.pattern);
		console.dir(this.options.instrument());
		jsawApp.playback.toggle(this.pattern, this.options.instrument());
	}
})(jQuery);



jQuery(function($){
	// Template rendering test
	var statusList = [
		{name: "status", value: "Stopped"},
		{name: "step", value: 0},
		{name: "voices", value: 0}
	];
	
	jQuery("#template_debugbar_status_item").tmpl(statusList).appendTo("#jsaw-debug-bar .controls ul.status");
	
	
	window.pianoroll = new JUI.PianoRoll({instrument: null, pattern: new JSAW.Pattern()});
	/*$("body").layout();*/
	DockMe(jQuery(".pianogrid"));
	
	
	/*$("#jsaw-playback-play").button({
		text: false,
		icons: {
			primary: 'ui-icon-play'
		}
	}).click(function(){
		myaudio.startPlayback(); // awwwyeaeeaaaaaaa
	});
	
	$("#jsaw-playback-stop").button({
		text:false,
		icons: {
			primary: 'ui-icon-stop'
		}
	});*/
});
/*
jQuery(function($){
	// Total number of steps in this piano roll instance
	var numOfSteps = 16;
	
	// Wrapper element for piano roll
	var $pianoRollWrap = $("#pianoroll");
	
	// Generate HTML for piano roll gui elements
	// Set up dom elements
	var pianoGridElem = $("<div class='pianogrid' rel='3'></div>").appendTo($pianoRollWrap);
	
		// Generate key list
		var pianoGridKeyList = $("<ul class='keyList'></ul>").appendTo(pianoGridElem);
		$((function(){
			var markup = "";
			$.each(NoteLookup.all, function(key, value){
				markup += '<li class="note" rel="' + key + '"><span class="note-hint" rel="'+value+'">' + value + '</span></li>';
			});
			return $(markup);
		}())).appendTo(pianoGridKeyList);
		
		// Generate step grid
		var pianoGridStepGrid = $("<ul class='stepGrid'></ul>").appendTo(pianoGridElem);
		for (var i=1;i<=numOfSteps;i++){
			var innerStepListElem = $('<li class="stepList"></li>').appendTo(pianoGridStepGrid);
			var innerStepElem = $('<ul class="step" rel="'+i+'"></ul>').appendTo(innerStepListElem);
			$((function(){
				var markup = "";
				$.each(NoteLookup.all, function(key, value){
					markup += '<li class="note" rel="'+key+'"><span class="note-hint">'+value+'</span></li>';
				});
				return $(markup);
			}())).appendTo(innerStepElem);
		}
	
	// Now we can fine-tune our styling of our generated markup and initialise the GUI functionality!
		
	var $pianoGrid = $("div.pianogrid");
	var $stepGrid = $pianoGrid.find("ul.stepGrid");
	var $stepList = $stepGrid.find("ul.step");
	
	stepListWrap = "li.stepList";
	stepListNote = "li.note";
	
	$stepGrid.find(stepListWrap+":nth-child(4n+1)").addClass("beatMarker");
	
	$pianoGrid.find(stepListNote).filter("[rel=2],[rel=4],[rel=6],[rel=9],[rel=11]").each(function(){
		$(this).addClass("accidental");
	});
	
	// Initialise hover event listeners on keylist items, for same-note highlighting
	$("ul.keyList > li.note, ul.step > li.note").mouseover(function(e) {
		elem = $(e.target);
		if (elem.hasClass("note-hint")) elem = elem.parent();
		elem.addClass("highlight");
		$("ul.step > li.note[rel=" + elem.attr("rel") + "]").addClass("highlight");
	}).mouseout(function(e) {
		elem = $(e.target);
		if (elem.hasClass("note-hint")) elem = elem.parent();
		elem.removeClass("highlight");
		$("ul.step > li.note[rel=" + elem.attr("rel") + "]").removeClass("highlight");
	});
	
	$("ul.keyList > li.note").mousedown(function(e) {
		var elem = $(e.target);
		if (elem.hasClass("note-hint")) elem = elem.parent();
		
		var newkey = elem.find('span.note-hint').attr("rel");
		derpSynth.playNote({key: newkey, octave: 3});
	})
	
});
*/