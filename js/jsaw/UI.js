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

jQuery(function($){
	// Template rendering test
	var statusList = [
		{name: "status", value: "Stopped"},
		{name: "step", value: 0},
		{name: "voices", value: 0}
	];
	
	$("#template_debugbar_status_item").tmpl(statusList).appendTo("#jsaw-debug-bar .controls ul.status");
	
	$("#jsaw-playback-play").button({
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
	});
});

jQuery(function($){
	// Total number of steps in this piano roll instance
	var numOfSteps = 16;
	
	// Wrapper element for piano roll
	var $pianoRollWrap = $("#pianoroll");
	
	// Generate HTML for piano roll gui elements
	// Set up dom elements
	var pianoGridElem = $("<div class='pianogrid'></div>").appendTo($pianoRollWrap);
	
		// Generate key list
		var pianoGridKeyList = $("<ul class='keyList'></ul>").appendTo(pianoGridElem);
		$((function(){
			var markup = "";
			$.each(NoteLookup.all, function(key, value){
				markup += '<li class="note" rel="' + key + '"><span>' + value + '</span></li>';
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
	
});
