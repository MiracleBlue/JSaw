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
		var self = this;
		this.note = note;
		
		this.item = this.note;
		this.rel = function(){
			var nl = _(NoteLookup.all).values().indexOf(this.note.getKey())+1;
			return nl;
		};
		this.elem = $("<div class='noteBlock'></div>");
		$("<span class='note-hint'>"+this.note.getKey()+"</span>").appendTo(this.elem);
		this.elem.data("note", this.note);
		
		this.note.onStart = function() {
			console.debug("onStart");
			self.elem.addClass("active");
		}
		this.note.onFinish = function() {
			console.debug("onFinish");
			self.elem.removeClass("active");
		}
	};
	
	JUI.Pattern = function(item) {
		var self = this;
		//this.note = note;
		
		this.item = item;
		this.rel = function(){
			//var nl = _(NoteLookup.all).values().indexOf(this.note.getKey())+1;
			//return nl;
		};
		this.elem = $("<div class='noteBlock'></div>");
		$("<span class='note-hint'>"+this.item.pattern.options.name()+"</span>").appendTo(this.elem);
		this.elem.data("note", this.item);
		
		this.item.onStart = function() {
			console.debug("onStart");
			self.elem.addClass("active");
		}
		this.item.onFinish = function() {
			console.debug("onFinish");
			self.elem.removeClass("active");
		}
	};
	
	JUI.Instrument = function(instrument) {
		this.item = instrument;
		
		this.elem = $("<div data-bind='template: {name: \"template_playlist_instrument\", data: Instruments.instrumentArray()["+this.item.$index()+"]}'></div>");
	}
	
	JUI.SuperGrid = function(options) {
		this.pattern = options.pattern;
		this.addItemCallback = options.addItem || function(){console.log("addItem Callback");};
		this.removeItemCallback = options.removeItem || function(){console.log("removeItem Callback");};
		this.wrapperElem = options.wrapperElem;
		this.steps = 16;
		this.itemObject = options.itemObject;
		this.rowModel = options.rowModel;
		this.rowObject = options.rowObject;
		
		this.template = {
			superGridWrap: "<div class='supergrid' style='overflow: auto; display: table;' rel='3'></div>",
			itemContainer: "<li class='item'></li>",
			sidebar: '<ul class="sidebar dockme-left" data-bind="foreach: Instruments.instrumentArray">'
					+'<li class="item" data-bind="attr: {rel: $index()+1}, template: \'template_playlist_instrument\'"></li>'
					+'</ul>',
			grid: "<ul class='grid dockme-center'></ul>"
		}
		
		this.buildUI();
	}
	
	JUI.SuperGrid.prototype.buildUI = function() {
		var self = this;
			// Wrapper element for piano roll
		var wrapperElem = this.wrapperElem;
		
		var numOfSteps = this.steps;
		
		// Generate HTML for piano roll gui elements
		// Set up dom elements
		var superGridElem = $(this.template.superGridWrap).appendTo(wrapperElem);
		
		$(this.template.sidebar).appendTo(superGridElem);
		
			
			// Generate step grid
			var gridElem = $(this.template.grid).appendTo(superGridElem);
			for (var i=1;i<=numOfSteps;i++){
				var innerStepListElem = $('<li class="stepList"></li>').appendTo(gridElem);
				var innerStepElem = $('<ul class="step" rel="'+i+'"></ul>').appendTo(innerStepListElem);
				$.each(this.rowModel(), function(key, value){
					//markup += '<li class="note" rel="' + key + '"><span class="note-hint" rel="'+value+'">' + value + '</span></li>';
					var item = $(self.template.itemContainer);
					item.attr("rel", key+1);
					item.appendTo(innerStepElem);
					item.data("note", {
						rowIndex: key,
						position: innerStepElem.attr("rel")-1
					});
				});
			}

		
		// Now we can fine-tune our styling of our generated markup and initialise the GUI functionality!
			
		var $superGrid = $("div.supergrid");
		var $stepGrid = $superGrid.find("ul.grid");
		var $stepList = $stepGrid.find("ul.step");
		
		var stepListWrap = "li.stepList";
		var stepListItem = "li.item";
		
		$stepGrid.find(stepListWrap+":nth-child(4n+1)").addClass("beatMarker");
		
		$superGrid.find(stepListItem).filter("[rel=2],[rel=4],[rel=6],[rel=9],[rel=11]").each(function(){
			$(this).addClass("accidental");
		});
		
		// Initialise hover event listeners on keylist items, for same-note highlighting
		$("ul.sidebar > li.item, ul.step > li.item").mouseenter(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("item")) elem = elem.parent();
			elem.addClass("highlight");
			$("ul.step > li.item[rel=" + elem.attr("rel") + "]").addClass("highlight");
		}).mouseleave(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("item")) elem = elem.parent();
			elem.removeClass("highlight");
			$("ul.step > li.item[rel=" + elem.attr("rel") + "]").removeClass("highlight");
		});
		
		$("ul.sidebar > li.item").mousedown(function(e) {
			var elem = $(e.target);
			if (!elem.hasClass("item")) elem = elem.parent();
			
			//var newkey = elem.find('span.note-hint').attr("rel");
			//self.options.instrument().playNote({key: newkey, octave: 3});
		});
		
		$("ul.step > li.item").on("mouseup", function(e){
			if (e.which == 3) return;
			var target = $(e.target);
			if (target.hasClass("noteBlock")) return;
			if (!target.hasClass("item")) target = target.parent();
			/*var data = {
				key: NoteLookup.all[target.attr("rel")],
				position: target.parent().attr("rel")-1
			}*/
			var data = target.data("note");
			self.addItem(data);
		});
		
		$("ul.step > li.item").droppable({
			drop: function(event, ui) {
				console.dir(event);
				console.dir(ui);
				console.dir(this);
				console.dir($(event.target).data("note"));
				var src = $(event.target);
				var target = $(this);
				self.pattern.removeItem(src.data("note"));
				self.addItem(target.data("note"));
				src.remove();
				// Bingo.
			}
		});
	}
	
	JUI.SuperGrid.prototype.addItem = function(item) {
		var self = this;
		var nd = item.instance ? item : this.pattern.addItem(item);
		var nb = new this.itemObject(nd);
		nb.elem.prependTo("ul.step[rel="+(nb.item.position+1)+"] > li.item[rel="+(item.rowIndex+1)+"]");
		nb.elem.on("mouseup", function(e){
			e.preventDefault();
			//e.stopPropagation();
		});
		nb.elem.on("contextmenu", function(e){
			//if (e.which == 3) {
				e.preventDefault();
				e.stopPropagation();
				self.removeItem(nb);
			//}
		});
		nb.elem.on("mouseover", function(e){
			nb.elem.addClass("hover");
		}).on("mouseout", function(e){
			nb.elem.removeClass("hover");
		});
		nb.elem.draggable({
			snap: "ul.step > li.item",
			snapMode: "inner",
			snapTolerance: 10
		});
	}
	
	JUI.SuperGrid.prototype.removeItem = function(item) {
		this.pattern.removeItem(item.item);
		item.elem.remove();
	}
	
	JUI.SuperGrid.prototype.clearGrid = function() {
		this.wrapperElem.find(".noteBlock").remove();
	}
	
	JUI.SuperGrid.prototype.refreshGrid = function() {
		var self = this;
		
		this.clearGrid();
		
		_(this.pattern.getAllItems()).forEach(function(item){
			self.addItem(item);
		});
		
		return this;
	}
	
	/**
	 * Piano Roll
	 */
	JUI.PianoRoll = function(options) {
		this.options = {
			stepsPerBar: 16,
			bars: 2,
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
		
		var numOfSteps = this.options.stepsPerBar * this.options.bars;
		
		// Generate HTML for piano roll gui elements
		// Set up dom elements
		var pianoGridElem = $("<div class='pianogrid' style='display: table;' rel='3'></div>").appendTo($pianoRollWrap);
			
			var pianoGridKeyList = $("<ul class='keyList dockme-left'></ul>").appendTo(pianoGridElem);
			var pianoGridStepGrid = $("<ul class='stepGrid dockme-center' style='width: 1352px;'></ul>").appendTo(pianoGridElem);
				// Generate key list
				
				$((function(){
					var markup = "";
					for (var i=8; i>=0; i--) {
						$.each(NoteLookup.all, function(key, value){
							markup += '<li class="note" rel="'+key+'" data-key="' + value + '" data-octave="'+i+'" data-name="'+value+i+'"><span class="note-hint" rel="'+value+i+'">' + value + i +'</span></li>';
						});
					}
					return $(markup);
				}())).appendTo(pianoGridKeyList);
				
				// Generate step grid
				
				for (var j=1;j<=numOfSteps;j++){
					var innerStepListElem = $('<li class="stepList"></li>').appendTo(pianoGridStepGrid);
					var innerStepElem = $('<ul class="step" rel="'+j+'"></ul>').appendTo(innerStepListElem);
					$((function(){
						var markup = "";
						for (var i=8; i>=0; i--) {
							$.each(NoteLookup.all, function(key, value){
								markup += '<li class="note" rel="'+key+'" data-key="' + key + '" data-octave="'+i+'" data-name="'+value+i+'"><span class="note-hint" rel="'+value+i+'">' + value + i +'</span></li>';
							});
						}
						return $(markup);
					}())).appendTo(innerStepElem);
				}
			
			$("ul.step > li.note").each(function(){
				$(this).data("note", {
					key: NoteLookup.all[$(this).data("key")],
					octave: $(this).data("octave"),
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
		$("ul.keyList > li.note, ul.step > li.note").mouseenter(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.closest("li.note");
			elem.addClass("highlight");
			$("ul.step > li.note[data-name='"+elem.data("name")+"']").addClass("highlight");
		}).mouseleave(function(e) {
			elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.closest("li.note");
			elem.removeClass("highlight");
			$("ul.step > li.note[data-name='"+elem.data("name")+"']").removeClass("highlight");
		});
		
		$("ul.keyList > li.note").mousedown(function(e) {
			var elem = $(e.target);
			if (!elem.hasClass("note")) elem = elem.closest("li.note");
			
			//var newkey = elem.find('span.note-hint').attr("rel");
			self.options.instrument().playNote({key: elem.data("key"), octave: elem.data("octave")});
		});
		
		$("ul.step > li.note").on("mouseup", function(e){
			if (e.which == 3) return;
			var target = $(e.target);
			
			if (target.hasClass("noteBlock") || target.parent().hasClass("noteBlock")) return;
			if (!target.hasClass("note")) target = target.parent();
			
			var data = target.data("note");
			self.addNote(data);
		});
		
		$("ul.step > li.note").droppable({
			drop: function(event, ui) {
				
				var src = $(event.target);
				if (!src.hasClass("noteBlock")) src = src.closest(".noteBlock");
				var target = $(this);
				self.options.pattern().removeNote(src.data("note"));
				self.addNote(target.data("note"));
				src.remove();
				// Bingo.
				console.dir(event);
				console.dir(ui);
				console.dir(this);
				console.dir(src.data("note"));
			}
		});
		
		//$("")
		$("#test-play").on("click", function(){
			self.play();
		});
		
		
		setTimeout(function(){$pianoRollWrap.scrollTop(1372);}, 100);
	}
	
	JUI.PianoRoll.prototype.addNote = function(note) {
		var self = this;
		
		// Check if note is a JSAW.Note object, otherwise add a new one
		var nd = note.instance ? note : this.options.pattern().addNote(note);
		var nb = new JUI.Note(nd);
		
		nb.elem.prependTo("ul.step[rel="+(nb.note.getPosition()+1)+"] > li.note[data-name='"+nb.note.getFullName()+"']");
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
		nb.elem.on("mouseover", function(e){
			nb.elem.addClass("hover");
		}).on("mouseout", function(e){
			nb.elem.removeClass("hover");
		});
		nb.elem.draggable({
			snap: "ul.step > li.note",
			snapMode: "inner",
			snapTolerance: 10
		});
		
		return nb;
	}
	
	JUI.PianoRoll.prototype.removeNote = function(note) {
		this.options.pattern().removeNote(note.note);
		note.elem.remove();
	}
	
	JUI.PianoRoll.prototype.clearGrid = function() {
		this.wrapperElem.find(".noteBlock").remove();
	}
	
	JUI.PianoRoll.prototype.refreshGrid = function() {
		var self = this;
		
		this.clearGrid();
		
		_(this.options.pattern().getAllNotes()).forEach(function(note){
			self.addNote(note);
		});
		
		return this;
	}
	
	JUI.PianoRoll.prototype.play = function() {
		console.debug("play:");
		console.dir(this.options.pattern());
		console.dir(this.options.instrument());
		jsawApp.playback.toggle(this.options.pattern(), this.options.instrument());
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

});