// extracted from  
// [MUSIC.js](http://www.gregjopa.com/2011/05/calculate-note-frequencies-in-javascript-with-music-js/)
define([
  'core/lib/music'
], function(LibMusic) {

  // add the .add and .subtract functions to an array. Those functions now are executed for each element in an array.
  function add_addsubtract_func(array) {

    array.add = function(that) {
      var out = new Array();
      for (var x in this) {
        if (typeof(this[x]) == 'object') { 
          out[x] = this[x].add(that);
        }
      }
      add_addsubtract_func(out);
      return out;
    };

    array.subtract = function(that) {
      var out = new Array();
      for (var x in this) {
        if (typeof(this[x]) == 'object') { 
          out[x] = this[x].subtract(that);
        }
      }
      add_addsubtract_func(out);
      return out;
    };

    return array;

  }

  function Note(coord) {
    this.coord = coord;
  }

  Note.prototype.frequency = function() {
    return LibMusic.baseFreq * Math.pow(2.0, (this.coord[0] * 1200 + this.coord[1]*700) / 1200);
  }

  Note.prototype.accidental = function() {
    return Math.round((this.coord[1] + LibMusic.baseOffset[1])/7);
  }

  // calculate octave of base note without accidentals
  Note.prototype.octave = function() {
    var acc = this.accidental();
    return this.coord[0] + LibMusic.baseOffset[0] + 4*acc + Math.floor((this.coord[1] + LibMusic.baseOffset[1] - 7*acc)/2);
  }

  Note.prototype.latin = function() {
    var noteNames = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
    var accidentals = ['bb', 'b', '', '#', 'x'];
    var acc = this.accidental();
    return noteNames[this.coord[1] + LibMusic.baseOffset[1] - acc*7 + 3] + accidentals[acc+2];
  }

  Note.fromLatin = function(name) {

    var n = name.split(/(\d+)/);

    // if input is more than one note return an array
    if (n.length > 3) {
      var out = new Array();
      var j = 0;
      for (var i = 0; i<(n.length-1)/2; i++) {
      
        var coord = LibMusic.notes[n[j]];
        coord = [coord[0] + parseInt(n[j+1]), coord[1]];
        
        coord[0] -= LibMusic.baseOffset[0];
        coord[1] -= LibMusic.baseOffset[1];
        
        out[i] = new Note(coord);
        j += 2;
      }
      return out;

    } else {
      var coord = LibMusic.notes[n[0]];
      coord = [coord[0] + parseInt(n[1]), coord[1]];  
      
      coord[0] -= LibMusic.baseOffset[0];
      coord[1] -= LibMusic.baseOffset[1];

      return new Note(coord);
    }
  }

  Note.prototype.scale = function(name) {
    var scale = LibMusic.scales[name];
    var out = new Array();
    
    out.push(this.add('unison'));
    for (var i = 0; i<scale.length; i++) {
      out[i+1] = this.add(Interval.fromName(scale[i]));
    }
    out.push(this.add('octave'));
    
    return out;
  }

  Note.prototype.add = function(interval) {

    // if input is string try to parse it as interval
    if (typeof(interval) == 'string') {
      interval = Interval.fromName(interval);
    }

    // if input is an array return an array too, loop over indices
    if (interval.length) {
      var out = new Array();
      for (var n = 0; n<interval.length; n++) {
        out[n] = this.add(interval[n]);
      }
      add_addsubtract_func(out);
      return out;

    } else {
      return new Note([this.coord[0] + interval.coord[0], this.coord[1] + interval.coord[1]]);
    }

  }

  Note.prototype.subtract = function(interval) {
    
    // if input is string try to parse it as interval
    if (typeof(interval) == 'string') {
      interval = Interval.fromName(interval);
    }

    // if input is an array return an array too, loop over indices
    if (interval.length) {
      var out = new Array();
      for (var n = 0; n<interval.length; n++) {
        out[n] = this.subtract(interval[n]);
      }
      add_addsubtract_func(out);
      return out;

    } else {
      var coord = [this.coord[0] - interval.coord[0], this.coord[1] - interval.coord[1]];
     
      // if input is another note return the difference as interval
      if (typeof(interval.frequency) == 'function') {
        return new Interval(coord);
        
      } else {
        return new Note(coord);
      }

    }
  }

  return Note;

});