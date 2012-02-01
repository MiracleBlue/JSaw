/**
 * Utility methods and math operations
 */

JSAW.Util = {
	calculateDetune: function(frequency, detune, voices) {
		var values = [];
		
		// Calculate initial detuning values
		var detuneVal = (detune * (voices - 1)) / 2;
		var detuneFreq = frequency - detuneVal;
		
		// This is just freaking COOL
		_(voices).times(function(n){
			var newFrequency = (detuneFreq) + (detune * n);
			values.push(newFrequency);
			n++;
		});
		
		// Return array of frequency values
		return values;
	}
};
