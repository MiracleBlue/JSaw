//track an index on items in an observableArray
ko.observableArray.fn.indexed = function() {
   //whenever the array changes, make one loop to update the index on each
   this.subscribe(function(newValue) {
       if (newValue) {
           var item;
           for (var i = 0, j = newValue.length; i < j; i++) {
               item = newValue[i];
               if (!ko.isObservable(item.$index)) {
                  item.$index = ko.observable();
               }
               item.$index(i);      
           }
       }   
   }); 
    
   this.valueHasMutated(); 
   return this;
};

ko.extenders.validator = function(target, config) {
	//var current = target();
	var typeValidate = {
		'float': function(value) {
			var result = false;
			value = parseFloat(value);
			if (_(value).isNumber() && !_(value).isNaN()) {
				if (value >= config.min && value <= config.max) {
					result = true;
				}
			}
			return result;
		},
		'int': function(value) {
			var result = false;
			value = parseInt(value);
			if (_(value).isNumber() && !_(value).isNaN()) {
				if (value >= config.min && value <= config.max) {
					result = true;
				}
			}
			return result;
		},
		'string': function(value) {
			var result = false;
			if (_(value).isString()) {
				result = true;
			}
			return result;
		},
		'boolean': function(value) {
			var result = false;
			if (_(value).isBoolean()) {
				result = true;
			}
			return result;
		},
		'enum': function(value) {
			var result = false;
			if (_(config.list).indexOf(value) !== -1) {
				result = true;
			}
			return result;
		}
	};
	var output = ko.computed({
		read: target,
		write: function(newValue) {
			console.log("validate: "+typeValidate[config.type](newValue)+", value: "+newValue);
			var current = target();
			if (typeValidate[config.type](newValue)) {
				target(newValue);
			}
			else {
				target.notifySubscribers(current);
			}
		}
	});
	output(target());
	return output;
}

/**
 * Keep data in sync
 */

function SmartParameter(parameterNode, config) {
	var defaults = {
		'float': {
			value: 0.5,
			min: 0,
			max: 1
		},
		'int': {
			value: 1,
			min: 0,
			max: 999
		},
		'string': {
			value: 'hello'
		},
		'boolean': {
			value: true
		},
		'enum': {
			list: [
				'yes',
				'no'
			],
			value: 'yes'
		}
	};
	_(defaults[config.type]).extend(config);
	this.parameterNode = parameterNode;
	this.value = ko.observable(config.value || this.parameterNode.getValue()).extend({validator: defaults[config.type]});
	this.value.subscribe(function(newValue) {
		this.parameterNode.setValue(newValue);
		console.log("write value: "+this.parameterNode.getValue());
	}.bind(this));
	
	this.elements = [];
}

SmartParameter.prototype.getValue = function() {
	return this.value();
}

SmartParameter.prototype.setValue = function(newVal) {
	this.value(newVal);
}

SmartParameter.prototype.update = function() {
	this.parameterNode.setValue(this.value);
	for (var i = 0; i < this.elements.length; i++) {
		var el = this.elements[i];
		if (el.val() !== this.value) {
			el.val(this.value);
		}
	}
}

SmartParameter.prototype.addElement = function(element) {
	var that = this;
	element.val(this.value);
	element.on("change", function(e) {
		that.setValue(element.val());
	});
	this.elements.push(element);
	this.update();
}

/**
 * ParameterList
 */

function ParameterList (targetNode, parameters) {
	var output = {
		array: ko.observableArray([])
	};
	_(parameters).forEach(function(value, key){
		output[key] = new SmartParameter(targetNode[key], value);
		output.array.push({name: key, value: output[key].value});
	}, this);
	return output;
}

function ParameterGroup (groups) {
	var output = {};
	
	_(groups).forEach( function(item, key) {
		// wrap item in underscore object
		item = _(item);
		var newItem = {};
		
		// if item is an Object Literal, loop over its nested properties.
		
		if (!item.isArray() && item.keys().length > 0) {
			item.forEach( function(value, key) {
				newItem[key] = ko.observable(value);
			});
		}
		
		else {
			newItem = ko.observable(item.value());
		}
		
		// Add the newItem to the output object
		output[key] = newItem;
	});
	
	
	function ParameterGroup() {
		//console.log("parameter group!");
		return output;
	}
	ParameterGroup.hashify = function() {
		//console.log("parameter group test method!");
		var outputHash = {};
		
		_(output).forEach( function(item, key) {
			// wrap item in underscore object
			item = _(item);
			var newItem = {};
			
			// if item is a function, it's probably a ko observable, so get its real value.
			
			if (item.isObject && !item.isFunction() && !item.isArray()) {
				item.forEach( function(value, key) {
					newItem[key] = value();
				});
			}
			
			else {
				newItem = item.value()();
			}
			
			// Add the newItem to the output object
			outputHash[key] = newItem;
		});
		
		return outputHash;
	}
	
	// return our new inner function
	return ParameterGroup;
}



function GroupedParameterList (groupObject) {
	/*
	var groupObject = {
			"reverb": {
				targetNode: reverb,
				parameters: {
					mix: 0.5
				}
			},
			"volume": {
				targetNode: gain,
				parameters: {
					gain: 0.8
				}
			}
		}
		var groupArray = [
			{
				groupName: "reverb",
				
			}
		]*/
	
	var output = {
		array: ko.observableArray([])
	};
	_(groupObject).forEach(function(object, key){
		var groupArray = ko.observableArray([]);
		var groupObject = {};
		_(object.parameters).forEach(function(value, key){
			groupObject[key] = new SmartParameter(object.targetNode[key], value);
			groupArray.push({name: key, value: groupObject[key].value});
		});
		output[key] = groupObject;
		output.array.push({groupName: key, array: groupArray});
	}, this);
	return output;
}