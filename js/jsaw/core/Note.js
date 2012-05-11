/**
 * Note object: represents a note in a pattern.
 * 
 * @constructor
 * @param {Object} options Configuration options for the constructor.
 */
JSAW.Note = function(options) {
	this.instance = true; // This is the instance of Note!
	
	options = (_(options).isString()) ? {key: options} : options;
	
	this.options = {
		id: false,
		key: "C",
		octave: 3,
		velocity: 1.0,
		duration: 1, // Number of steps
		position: 0 // Step position
	}
	_(this.options).extend(options);
	
	this.id = this.options.id;
};
/**** METHODS ****/

JSAW.Note.prototype.getKey = function(){return this.options.key;};
JSAW.Note.prototype.getOctave = function(){return this.options.octave;};
JSAW.Note.prototype.getVelocity = function(){return this.options.velocity;};
JSAW.Note.prototype.getDuration = function(){return this.options.duration;};
JSAW.Note.prototype.getPosition = function(){return this.options.position;};
JSAW.Note.prototype.getFullName = function(){return this.options.key+this.options.octave;};
JSAW.Note.prototype.getFrequency = function(){return Note.fromLatin(this.getFullName()).frequency();};
JSAW.Note.prototype.hashify = function(){
	var outhash = {}
	_(outhash).extend(this.options);
	outhash.frequency = this.getFrequency();
	outhash.fullName = this.getFullName();
	outhash.velocity = this.getVelocity();
	outhash.instance = false;
	return outhash;
};

JSAW.Note.prototype.set = function(params){
	params.id = this.id;	// Prevent changes to ID parameter
	_(this.options).extend(params);
};