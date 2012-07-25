// extracted from  
// [MUSIC.js](http://www.gregjopa.com/2011/05/calculate-note-frequencies-in-javascript-with-music-js/)
define([
], function() {
 
  function Interval(coord) {
      this.coord = coord;
  }

  Interval.fromName = function(name) {
     return new Interval(MUSIC.intervals[name]);
  }

  Interval.fromSemitones = function(num) {
    return new Interval(MUSIC.intervals_semitones[num]);
  }

  // multiply [tones, semitones] vector with [-1 2;3 -5] to get coordinate from tones and semitones
  Interval.fromTonesSemitones = function(tone_semitone) {
    return new Interval([tone_semitone[0] * -1 + tone_semitone[1] * 3, tone_semitone[0] * 2 + tone_semitone[1] * -5]);
  }

  // multiply coord vector with [5 2;3 1] to get coordinate in tones and semitones
    // [5 2;3 1] is the inverse of [-1 2;3 -5], which is the coordinates of [tone; semitone]
  Interval.prototype.tone_semitone = function() {
    return [this.coord[0] * 5 + this.coord[1] * 3, this.coord[0] * 2 + this.coord[1] * 1];
  }

  // number of semitones of interval = tones * 2 + semitones
  Interval.prototype.semitone = function() {
    var tone_semitone = this.tone_semitone();
    return tone_semitone[0] * 2 + tone_semitone[1];
  }

  Interval.prototype.add = function(interval) {
    if (typeof(interval) == 'string') {
      interval = Interval.fromName(interval);
    }
    return new Interval([this.coord[0] + interval.coord[0], this.coord[1] + interval.coord[1]]);
  }

  Interval.prototype.subtract = function(interval) {
    if (typeof(interval) == 'string') {
      interval = Interval.fromName(interval);
    }
    return new Note([this.coord[0] - interval.coord[0], this.coord[1] - interval.coord[1]]);
  }

  return Interval;

});