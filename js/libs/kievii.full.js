function loadImageArray (args) {

    this.onCompletion = function () {

        // Call the callback if there's one.
        if (typeof (this.onComplete) === "function") {
            var final_status = this.pollStatus();
            var retvalue = {
                imagesArray: this.imagesArray,
                status: final_status
            }
            this.onComplete (retvalue);
        }

        return;
    };

    this.onLoad = function (that) {
        return function () {
            that.objectsLoaded += 1;
            that.check (that.onSingle, this);
        }
    };
    
    this.onError = function (that) {
        return function () {
            that.objectsError += 1;
            that.check (that.onErr, this);
            }
        };

    this.check = function (callback, imageObj) {

        if (typeof(callback) === 'function') {
                var temp_status = this.pollStatus();
                callback ({
                    obj: imageObj,
                    status: temp_status
                });
            }
            if (this.objectsLoaded + this.objectsError === this.objectsTotal) {
                this.onCompletion();
            }
    }

    this.pollStatus = function () {
        return {
                id: this.ID,
                loaded: this.objectsLoaded,
                error: this.objectsError,
                total:  this.objectsTotal
                };
    }

    // The user will recognize this particular instance by ID
    this.ID = args.ID;

    // Optional callbacks
    this.onComplete = args.onComplete;
    this.onSingle = args.onSingle;
    this.onErr = args.onError;

    // Statistics
    this.objectsLoaded = 0;
    this.objectsError = 0;
    this.objectsTotal = args.imageNames.length;
    this.imagesArray = [];

    // Load images from names
    for (var i = 0; i < this.objectsTotal; i += 1) {
        this.imagesArray[i] = new Image();
        this.imagesArray[i].onload = this.onLoad(this);
        this.imagesArray[i].onerror = this.onError(this);
        this.imagesArray[i].src = args.imageNames[i];
    }
}

function loadMultipleImages (args) {

    this.loadingManager = function () {
        // Storage the closurage.
        var that = this;
        return function (loaderStatus) {
            var ls = loaderStatus;
                    console.log (ls.status.id, " called back to say everything is loaded.");

                    // Update the element status
                    if (that.loaders[ls.status.id] !== undefined) {
                        that.loaders[ls.status.id].done = true;
                        that.loaders[ls.status.id].images = that.loaders[ls.status.id].imageArray.imagesArray;
                        // Call the singleArray callback
                        if (typeof (that.onSingleArray) === 'function') {
                            that.onSingleArray (loaderStatus);
                        }
                    }
                    else {
                        throw new Error("in loaders, " + ls.status.id + " is undefined");
                    }

                    // Check if every registered element is complete.
                    for (var element in that.loaders) {
                        if (that.loaders.hasOwnProperty(element)) {
                            if (that.loaders[element].done !== true) {
                                console.log ("status of element ", element, " is not true: ", that.loaders[element].done);
                                // Return, we're not done yet.
                                return;
                            }
                        }
                    }

                    that.onComplete (that.loaders);
                }
            }

     this.errorManager = function () {
         // Storage the closurage.
        var that = this;
        return function (errorStatus) {
            if (typeof (that.onError) === 'function') {
                that.onError (errorStatus);
            }
        }
    }

     this.singleManager = function () {
         // Storage the closurage.
        var that = this;
        return function (singleStatus) {
            if (typeof (that.onSingle) === 'function') {
                that.onSingle (singleStatus);
            }
        }
    }


    this.multipleImages = args.multipleImages;
    this.onComplete = args.onComplete;
    this.onError = args.onError;
    this.onSingle = args.onSingle;
    this.onSingleArray = args.onSingleArray;
    this.loaders = {};

    // init as many loadImageArray as needed, by the mighty powers of object
    // composition.
    for (var i = 0; i < this.multipleImages.length; i += 1) {

        var loader = {};
        loader.imageArray = new loadImageArray ({ID : this.multipleImages[i].ID,
                                                 imageNames: this.multipleImages[i].imageNames,
                                                 onComplete: this.loadingManager(),
                                                 onError: this.errorManager(),
                                                 onSingle: this.singleManager()
                                                });
        loader.done = false;
        this.loaders[this.multipleImages[i].ID] = loader;
    }



}

function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

function Element(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

Element.prototype.getready = function (args) {

    this.ID = args.ID;

    // By default, we want to be notified if some event occurs.
    this.isClickable = args.isClickable;
    
    if (typeof (this.isClickable) === 'undefined') {
        this.isClickable = true;
    }
    
    if (typeof (this.isClickable) !== 'boolean') {
        throw "Property isClickable for element " + this.ID + " is not boolean " + this.isClickable;
    }

    // Element is visible by default
    this.isVisible = args.isVisible;

    if (typeof (this.isVisible) === 'undefined') {
        this.isVisible = true;
    }

    if (typeof (this.isVisible) !== 'boolean') {
        throw "Property isVisible for element " + this.ID + " is not boolean " + this.isVisible;
    }
    
    // The element boundaries
    this.xOrigin = args.left;
    this.yOrigin = args.top;
        
    //set the ROI if defined
    if (args.ROILeft !== undefined) {
        this.ROILeft = args.ROILeft;
    }
    else {
        this.ROILeft = this.xOrigin;
    }
    
    if (args.ROITop !== undefined) {
        this.ROITop = args.ROITop;
    }
    else {
        this.ROITop = this.yOrigin;
    }
    
    this.ROIWidth = args.ROIWidth;
    this.ROIHeight = args.ROIHeight;

    // These are to be set later
    this.values = {};
    
    // Specific parameters of the object, to be passed to the wrapper
    this.objParms = args.objParms;

    // See if there is a callback to call when the value is set
    if (args !== undefined) {
        this.onValueSet = args.onValueSet;
    }

};

// Private function
Element.prototype.isInROI = function (x, y) {
    // This is the abstract class.
    return false;
};

Element.prototype.getValues = function () {
    var tempArray = [],
        i;
    for (i in this.values) {
        if (this.values.hasOwnProperty(i)) {
            tempArray.push(i);
        }
    }
    // Returns the keys.
    return tempArray;
};

Element.prototype.getXCoord = function () {
    return this.xOrigin;
};

Element.prototype.getYCoord = function () {
    return this.yOrigin;
};

Element.prototype.getWidth = function () {
    return this.width;
};

Element.prototype.getHeight = function () {
    return this.height;
};

Element.prototype.setHeight = function (height) {
    this.height = height;
    if (this.ROIHeight === undefined) {
        this.ROIHeight = height;
    }
}

Element.prototype.setWidth = function (width) {
    this.width = width;
    if (this.ROIWidth === undefined) {
        this.ROIWidth = width;
    }
}

Element.prototype.getValue = function (slot) {
    
    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }
    else {
        return this.values[slot];
    }
};

// Setters
Element.prototype.setValue = function (slot, value) {

    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }

    if (value === this.values[slot]) {
        // Nothing to do.
        return;
    }

    this.values[slot] = value;
    

};

//TODO this should be changed in isListening, for example
Element.prototype.setClickable = function (isClickable) {
     if (typeof isClickable === "boolean") {
        this.isClickable = isClickable;
     }
     else {
        throw "Property isClickable for element " + this.ID + " is not boolean " + isClickable;
    }
};

Element.prototype.getClickable = function () {
    return this.isClickable;
};

// Refresh. This is the basic action.
Element.prototype.refresh = function (drawPrimitive) {
// Nothing to do in the abstract class.
};

Element.prototype.getID = function () {
    return this.ID;
};

Element.prototype.setDrawClass = function (drawClass) {
    this.drawClass = drawClass;
};

Element.prototype.setVisible = function (isVisible) {
    if (typeof isVisible === "boolean") {
        this.isVisible = isVisible;
    }
    else {
        throw "Property isVisible for element " + this.ID + " is not boolean " + isVisible;
    }

}

Element.prototype.getVisible = function () {
    return this.isVisible;
}

Element.prototype.onMouseMove = function (x,y) {
    return undefined;
};

Element.prototype.onMouseDown = function (x,y) {
    return undefined;
};

Element.prototype.onMouseUp = function (x,y) {
    return undefined;
};

Element.prototype.setGraphicWrapper = function (wrapper) {
    this.wrapper = wrapper;
}

function UI(domElement, wrapperFactory, parameters) {

    // <EVENT HANDLING>

    // Thanks for these two functions to the noVNC project. You are great.
    // https://github.com/kanaka/noVNC/blob/master/include/util.js#L121
    
    // Get DOM element position on page
    this.getPosition = function (obj) {
        var x = 0, y = 0;
        if (obj.offsetParent) {
            do {
                x += obj.offsetLeft;
                y += obj.offsetTop;
                obj = obj.offsetParent;
            } while (obj);
        }
        return {'x': x, 'y': y};
    };

    // Get mouse event position in DOM element (don't know how to use scale yet).
    this.getEventPosition = function (e, obj, scale) {
        var evt, docX, docY, pos;
        //if (!e) evt = window.event;
        evt = (e ? e : window.event);
        if (evt.pageX || evt.pageY) {
            docX = evt.pageX;
            docY = evt.pageY;
        } else if (evt.clientX || evt.clientY) {
            docX = evt.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            docY = evt.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        pos = this.getPosition(obj);
        if (typeof scale === "undefined") {
            scale = 1;
        }
        return {'x': (docX - pos.x) / scale, 'y': (docY - pos.y) / scale};
    };

    // Event handlers: we need closures here, because they will be called as callbacks.

    // On mouseMove event
    this.onMouseMoveFunc = function () {
        var that = this;
            return function (evt) {

            //var realCoords = that.calculateOffset(evt);
            var realCoords = that.getEventPosition (evt, that.domElement);

            // Only if the mouse button is still down (This could be useless TODO).
            if (that.mouseUp === false) {
                that.elementsNotifyEvent(realCoords.x, realCoords.y, "onMouseMove");
            }
        };
    };

    // On mouseDown event
    this.onMouseDownFunc = function () {
        var that = this;
            return function (evt) {

            var realCoords = that.getEventPosition (evt, that.domElement);

            that.mouseUp = false;
            that.elementsNotifyEvent(realCoords.x, realCoords.y, "onMouseDown");
        };
    };

    // On mouseUp event
    this.onMouseUpFunc = function () {
        var that = this;
            return function (evt) {

            var realCoords = that.getEventPosition (evt, that.domElement);

            that.mouseUp = true;
            that.elementsNotifyEvent(realCoords.x, realCoords.y, "onMouseUp");

        };
    };

    // Note: breakOnFirstEvent works only elements that share the same kind of
    // event handling mechanism (es: buttons with buttons).
    // Notify every element about the event.
    this.elementsNotifyEvent = function (x, y, event) {
        
        // For every element in Z-index array, in order
        for (var z = this.zMax; z >= this.zMin; z -= 1) {
            // The array has holes.
            if (this.zArray[z] !== undefined) {
                for (var k = (this.zArray[z].length -1); k >=0; k -= 1) {
                    // If the element wants to be bothered with events
                    if (this.zArray[z][k].getClickable()) {
                        // Notify the element
                        ret = this.zArray[z][k][event](x, y);
                        // See if the element changed its value
                        if (ret !== undefined) {
                            if (ret instanceof Array) {
                                // An element could change multiple slots of itself.
                                for (var i = 0; i < ret.length; i+=1) {
                                    this.setValue({elementID: this.zArray[z][k].ID, slot: ret[i].slot, value: ret[i].value});
                                }
                            }
                            else {
                                // console.log("UI: Element ", ID, " changed its value on event ", event);
                                this.setValue({elementID: this.zArray[z][k].ID, slot: ret.slot, value: ret.value});
                            }

                            if (this.breakOnFirstEvent === true) {
                                // One element has answered to an event, return.
                                return;
                            }
                        }
                    }
                }
            }
        }
        
    };

    // <END OF EVENT HANDLING>


    // <CONSTRUCTOR>
    this.domElement = domElement;

    this.domElement.addEventListener("mousedown", this.onMouseDownFunc(), true);
    this.domElement.addEventListener("mouseup", this.onMouseUpFunc(), true);
    this.domElement.addEventListener("mousemove", this.onMouseMoveFunc(), true);

    this.mouseUp = true;
   
    var ret;

    // Elements in this UI.
    this.elements = {};

    // Connection between elements
    this.connections = {};

    // Z-index lists.
    this.zArray = [];

    // Graphic frontend wrapper
    this.graphicWrapper = wrapperFactory;

    // Break on first
    if (parameters !== undefined) {
        this.breakOnFirstEvent = parameters.breakOnFirstEvent || false;
    }

    // </CONSTRUCTOR>

    // <ELEMENT HANDLING>

    // *** Add an UI element **** //
    this.addElement = function (element, elementParameters) {
        var slot,
            slots;

        if (this.elements[element.ID] !== undefined) {
            throw new Error("Conflicting / Duplicated ID in UI: " + element.ID + " (IDs are identifiers and should be unique)");
            return;
        }

        this.elements[element.ID] = element;

        // Set the element's graphic wrapper
        element.setGraphicWrapper(this.graphicWrapper);

        // Insert the element in the connection keys.
        this.connections[element.ID] = {};

        // Get the slots available from the element.
        slots = element.getValues();

        // Insert all possible elements in the connection matrix TODO ARRAY
        for (slot in slots) {
            if (slots.hasOwnProperty(slot)) {
                this.connections[element.ID][slots[slot]] = [];
            }
        }

        // Store the parameters
        var zIndex = 0;
        
        if (elementParameters !== undefined) {
            zIndex = elementParameters.zIndex;
        }
        
        if ((zIndex < 0) || (typeof(zIndex) !== "number")) {
                throw new Error("zIndex " + zIndex + " invalid");
            }
            
        // Insert the z-index into the element
        // Do we ever use this? TODO
        this.elements[element.ID].zIndex = zIndex;
        
        // if it's the first of its kind, initialize the array.
        if (this.zArray[zIndex] === undefined) {
            this.zArray[zIndex] = [];
        }
        // Update the maximum and minimum z index.
        this.zArray[zIndex].push(this.elements[element.ID]);
        if ((this.zMin === undefined) || (this.zMin > zIndex)) {
            this.zMin = zIndex;
        }
        if ((this.zMax === undefined) || (this.zMax <  zIndex)) {
            this.zMax = zIndex;
        }
        
    };
    
    // </ELEMENT HANDLING>


    // <CONNECTION HANDLING>

    // Connect slots, so that one element can "listen" to the other
    this.connectSlots  = function (senderElement, senderSlot, receiverElement, receiverSlot, connectParameters) {

        //Check for the elements.
        if ((this.elements[senderElement] !== undefined) && (this.elements[receiverElement] !== undefined)) {
            // //Check for the slots.
            if ((this.elements[senderElement].values[senderSlot] === undefined) ||
                (this.elements[receiverElement].values[receiverSlot] === undefined))  {
                throw new Error("Slot " + senderSlot + " or " + receiverSlot + " not present.");
            }

            else {

                //The sender & receiver element & slot exist. Do the connection.
                var receiverHash = {"recvElement" : receiverElement, "recvSlot": receiverSlot};

                //Check if there are optional parameters
                if (connectParameters !== undefined) {
                    // Is there a callback?
                    if (typeof(connectParameters.callback) === "function") {
                        receiverHash.callback = connectParameters.callback;
                    }
                    // Should the connection setValue fire cascading setValue callbacks?
                    // By default, yes.
                    receiverHash.cascade = true;
                    if (connectParameters.cascade !== undefined) {
                        receiverHash.cascade = connectParameters.cascade;
                    }
                }

                // Push the destination element/slot in the connections matrix.
                this.connections[senderElement][senderSlot].push(receiverHash);
            }
            
        }
        else {
            throw new Error("Element " + senderElement + " or " + receiverElement + " not present.");
        }
    };

    //</CONNECTION HANDLING>


    // <VALUE HANDLING>

    // This method handles one set value event and propagates it in the connections matrix
    //this.setValue = function (elementID, slot, value, history, fireCallback) {
    //this.setValue ({slot: sl, value: val, elementID: id, fireCallback:false, history:undefined});
    this.setValue = function (setParms) {
        var hist = [],
            receiverHash,
            recvElementID,
            recvSlot,
            i,
            RECURSIONMAX = 1000,
            elementID,
            value,
            slot,
            fireCallback,
            history;
        
        // Default parameters
        if (typeof (setParms.elementID) === 'undefined') {
            throw ("ID is undefined");
        }
        else elementID = setParms.elementID;
        
        if (typeof (setParms.value) === 'undefined') {
            throw ("value is undefined");
        }
        else value = setParms.value;
        
        if (typeof (setParms.fireCallback) === 'undefined') {
            fireCallback = true;
        }
        else fireCallback = setParms.fireCallback;
        
        history = setParms.history;
        // End of defaults
        
        if (this.elements[elementID] !== undefined) {
            
            // Get the default slot here, if no one specified a slot
            if (typeof (setParms.slot) === 'undefined') {
                slot = this.elements[elementID].defaultSlot;
                if (typeof(slot) === undefined) {
                    throw "Default slot is undefined!";
                }
            }
            else slot = setParms.slot;

            // First of all, check history if it is present.
            if (history !== undefined) {
                hist = history;
                // Is this an infinite loop?
                for(var k = 0; k < hist.length ; k += 1) {
                    // This is for precaution.
                    if (hist.length > RECURSIONMAX) {
                        throw new Error ("Recursion exceeded");
                        return;
                    }
                    if ((hist[k]["element"] === elementID) && (hist[k]["slot"] === slot)) {
                        // Loop is infinite; bail out!
                        console.log ("Broke recursion!");
                        return;
                    }
                }
            }
            // Element is present an there's no need to break a loop
            // really set value.
            this.elements[elementID].setValue(slot, value, fireCallback);
            
            // Finally, call the callback if there is one and we're allowed to.
            if ((typeof (this.elements[elementID].onValueSet) === "function") && (fireCallback !== false)) {
                this.elements[elementID].onValueSet (slot, this.elements[elementID].values[slot], this.elements[elementID].ID);
            }

            //TODO!!
            // Callback must be not defined to trigger the default behaviour. If
            // the callback is set to something that's not a function, the 
            // default will not be executed.
            /*if (this.elements[elementID].onValueSet === undefined) {
                // No (undefined) callback default behaviour: refresh the entire UI.
                // this.refresh();
            }*/

            // This element has been already set: update history
            hist.push({"element" : elementID, "slot" : slot});
        }

        else {
            throw new Error("Element " + elementID + " not present.");
        }

        // Check if this element has connections
        if (this.connections[elementID][slot] !== undefined) {

            // For every connection the element has
            for (i in this.connections[elementID][slot]) {

                if (this.connections[elementID][slot].hasOwnProperty(i)){

                    // Retrieve the other connection end and the connection parameters.
                    receiverHash = this.connections[elementID][slot][i];
                 
                    recvElementID = receiverHash.recvElement;
                    recvSlot = receiverHash.recvSlot;

                    // Check the callback here.
                    if (typeof(receiverHash.callback) === "function") {
                        // We have a callback to call.
                        value = receiverHash.callback (value);
                    }

                    // Check if consequent setValue()s should have cascading
                    // consequences (i.e. fire the callbacks)
                    var fire_conn_callback;
                    if (receiverHash.cascade === false) {
                        fire_conn_callback = false;
                    }
                    else {
                        fire_conn_callback = true;
                    }

                    // Recursively calls itself, keeping an history in the stack
                    this.setValue({elementID: recvElementID, slot: recvSlot, value: value, history: hist, fireCallback: fire_conn_callback});
                }
            }
        }
    };
    // </VALUE HANDLING>

    // <VISIBILITY, RECEIVING EVENTS>

    // todo these two functions are complementary.

    this.hideElement = function (elementID) {

        var visibilityState;

        if (this.elements[elementID] !== undefined) {
            visibilityState = this.elements[elementID].getVisible();
            if (visibilityState === true) {
                // Set the element's visibility
                this.elements[elementID].setVisible (false);
                // When hidden, the element is also not listening to events
                this.elements[elementID].setClickable (false);

            }

        }

        else {
            throw new Error("Element " + elementID + " not present.");
        }

    }

    this.unhideElement = function (elementID) {

        var visibilityState;

        if (this.elements[elementID] !== undefined) {
            visibilityState = this.elements[elementID].getVisible();
            if (visibilityState === false) {

                // Set the element's visibility
                this.elements[elementID].setVisible (true);
                // When unhidden, the element starts listening to events again.
                this.elements[elementID].setClickable (true);

            }

        }

        else {
            throw new Error("Element " + elementID + " not present.");
        }
    }

    this.setHidden = function (elementID, value) {
        this.setVisible(elementID, !value)
    }

    this.setVisible = function (elementID, value) {
        var visibilityState;

        if (this.elements[elementID] !== undefined) {
            visibilityState = this.elements[elementID].getVisible();
            if (visibilityState !== value) {

                // Set the element's visibility
                this.elements[elementID].setVisible (value);
                // When unhidden, the element starts listening to events again.
                this.elements[elementID].setClickable (value);

            }

        }

        else {
            throw new Error("Element " + elementID + " not present.");
        }
    }
    
    this.setClickable = function (elementID, value) {
            var state;

            if (this.elements[elementID] !== undefined) {
                state = this.elements[elementID].getClickable();
                if (state !== value) {

                    // When unhidden, the element starts listening to events again.
                    this.elements[elementID].setClickable (value);

                }

            }

            else {
                throw new Error("Element " + elementID + " not present.");
            }
        }

    // </VISIBILITY, RECEIVING EVENTS>
   

    // <REFRESH HANDLING>
    this.refreshZ = function (z) {
        //Refresh every layer, starting from z to the last one.
        for (var i = z, length =  this.zArray.length; i < length; i += 1) {
            if (typeof(this.zArray[i]) === "object") {
                for (var k = 0, z_length = this.zArray[i].length; k < z_length; k += 1) {
                    if (this.zArray[i][k].getVisible() === true) {
                        this.zArray[i][k].refresh();
                    }
                }
            }
        }
    }

    this.refresh = function (doReset) {
        // Reset everything
        /*if (doReset !== false) {
            this.reset();
        }*/
        
        // Then refresh everything from the smallest z-value, if there is one.
        if (this.zMin !== undefined) {
            this.refreshZ(this.zMin);
        }
    }

    this.reset = function () {
        // Reset the graphic frontend
        this.graphicWrapper.reset();
    }
}
    // </REFRESH HANDLING>

function Background(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Background, Element);

Background.prototype.getready = function (args) {
    
    if (args === undefined) {
        throw new Error("Error: args is undefined!");
    }

    // Call the constructor from the superclass.
    Background.superclass.getready.call(this, args);
    
    this.values = {"backgroundvalue" : 0};
    this.defaultSlot = "backgroundvalue";

    this.image = args.image;
    
    this.setWidth(this.image.width);
    this.setHeight(this.image.height);
    

};

// This method returns the image object.
Background.prototype.GetImage = function () {
    return this.image;
};

// This methods returns true if the point given belongs to this element.
Background.prototype.isInROI = function (x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {
            return true;
        }
        return false;
    }
};

Background.prototype.onMouseDown = function (x, y) {

    //console.log ("Click down on ", x, y);

    if (this.isInROI(x, y)) {
        this.triggered = true;
    }
    return undefined;
};

Background.prototype.onMouseUp = function (curr_x, curr_y) {

    var to_set = 0,
        ret = {};

    if (this.triggered) {
        
        if (this.isInROI(curr_x, curr_y)) {
            
            ret = {"slot" : "backgroundvalue", "value" : 0};

            // Click on button is completed, the button is no more triggered.
            this.triggered = false;
            
            return ret;
        }
    }
    
    // Action is void, button was upclicked outside its ROI or never downclicked
    // No need to trigger anything, ignore this event.
    return undefined;
    
};

Background.prototype.refresh = function () {

    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.

        // Call the superclass.
        Background.superclass.refresh.call(this, this.drawClass.drawImage);

        if (this.isVisible === true) {
            this.drawClass.drawImage.draw(this.image, this.xOrigin, this.yOrigin);
        }
    }
    
};

Background.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Background.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawImage",
                                           objParms: this.objParms}]);

};

function Button(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Button, Element);

Button.prototype.getready = function (args) {

    if (args === undefined) {
        throw new Error("Error: args is undefined!");
    }

    // Call the constructor from the superclass.
    Button.superclass.getready.call(this, args);

    // Now that all required properties have been inherited
    // from the parent class, define extra ones from this class
    // Value 0 by default
    this.values = {"buttonvalue" : 0};
    this.defaultSlot = "buttonvalue";

    this.triggered = false;

    this.imagesArray = args.imagesArray;

    if (this.imagesArray.length < 1) {
        throw new Error("Invalid images array length, " + this.imagesArray.length);
    }

    this.nButtons = this.imagesArray.length;

    for (var i = 0; i < this.nButtons; i += 1) {
        this.setWidth(this.imagesArray[i].width);
        this.setHeight(this.imagesArray[i].height);
    }


};

// This method returns true if the point given belongs to this button.
Button.prototype.isInROI = function (x, y) {
    if ((x >= this.ROILeft) && (y >= this.ROITop)) {
        if ((x <= (this.ROILeft + this.ROIWidth)) && (y <= (this.ROITop + this.ROIHeight))) {
            //console.log ("Point ", x, ",", y, " in ROI: ", this.ROILeft, ",", this.ROITop, this.ROIWidth, "x", this.ROIHeight);
            return true;
        }
        /*jsl:pass*/
    }
    //console.log ("Point ", x, ",", y, " NOT in ROI: ", this.ROILeft, ",", this.ROITop, this.ROIWidth, "x", this.ROIHeight);
    return false;
};

Button.prototype.onMouseDown = function (x, y) {

    //console.log ("Click down on ", x, y);

    if (this.isInROI(x, y)) {
        this.triggered = true;
    }
    return undefined;
};

Button.prototype.onMouseUp = function (curr_x, curr_y) {

    var to_set = 0,
        ret = {};

    if (this.triggered) {
        // Button is activated when cursor is still in the element ROI, otherwise action is void.
        if (this.isInROI(curr_x, curr_y)) {

            //Simply add 1 to the button value until it rolls back.
            to_set = (this.values.buttonvalue + 1) % this.nButtons;
            ret = {"slot" : "buttonvalue", "value" : to_set};

            // Click on button is completed, the button is no more triggered.
            this.triggered = false;
            
            return ret;
        }
    }
    
    // Action is void, button was upclicked outside its ROI or never downclicked
    // No need to trigger anything, ignore this event.
    return undefined;
    
};

// Setters
Button.prototype.setValue = function (slot, value, fireCallback) {

    if ((value < 0) || (value > this.nButtons)) {
        return;
    }

    // Now, we call the superclass
    Button.superclass.setValue.call(this, slot, value, fireCallback);

};

Button.prototype.refresh = function () {
    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.

        // Call the superclass.
        Button.superclass.refresh.apply(this, [this.drawClass.drawImage]);

        // Draw, if the element is visible.
        if (this.isVisible === true) {
            this.drawClass.drawImage.draw(this.imagesArray[this.values.buttonvalue], this.xOrigin, this.yOrigin);
        }
    }
};

Button.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Button.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawImage",
                                           objParms: this.objParms}]);

};

Button.prototype.setStatesNumber = function (number) {
    this.nButtons = number;
};

Button.prototype.getStatesNumber = function () {
    return this.nButtons;
}

function Knob(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Knob, Element);

Knob.prototype.getready = function (args) {

    if (args === undefined) {
        throw new Error("Error: specArgs is undefined!");
    }
    
    // Call the constructor from the superclass.
    Knob.superclass.getready.call(this, args);
    
    //now that all required properties have been inherited
    //from the parent class, define extra ones from this class

    //Default value is 0
    this.values = {"knobvalue" : 0};
    this.defaultSlot = "knobvalue";

    this.sensitivity = args.sensitivity || 2000;
    this.imagesArray = args.imagesArray || null;
    
    if (this.imagesArray.length < 1) {
        throw new Error("Invalid images array length, " + this.imagesArray.length);
    }
                                   
    var width = 0,
        height = 0;

    // Calculate maximum width and height.
    for (var i = 0, len = this.imagesArray.length; i < len; i += 1) {
        if (this.imagesArray[i].width > width) {
            width = this.imagesArray[i].width;
        }
        if (this.imagesArray[i].height > height) {
            height = this.imagesArray[i].height;
        }
    }
    
    // Set them.
    this.setWidth(width);
    this.setHeight(height);

};


// This method returns an image index given the knob value.
/*jslint nomen: false*/
Knob.prototype._getImageNum = function () {
/*jslint nomen: true*/
    if ((this.values.knobvalue < 0) || (this.values.knobvalue > 1)) {
        // Do nothing
        return undefined;
    }
    var ret = Math.round(this.values.knobvalue * (this.imagesArray.length - 1));
    return ret;
};

// This method returns an image object given the knob value.
/*jslint nomen: false*/
Knob.prototype._getImage = function () {
/*jslint nomen: true*/

    /*jslint nomen: false*/
    var ret = this._getImageNum();
    /*jslint nomen: true*/
    return this.imagesArray[ret];
};

// This method returns true if the point given belongs to this knob.
Knob.prototype.isInROI = function (x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {
            return true;
        }
        /*jsl:pass*/
    }
    return false;
};

Knob.prototype.onMouseDown = function (x, y) {

    var inROI = this.isInROI(x, y);
    // Save the starting point if event happened in our ROI.
    if (inROI) {
        this.start_x = x;
        this.start_y = y;
    }

    // No value has been changed.
    return undefined;
};

Knob.prototype.onMouseUp = function (x, y) {

    // Reset the starting point.
    this.start_x = undefined;
    this.start_y = undefined;

    // No value has been changed
    return undefined;

};

Knob.prototype.onMouseMove = function (curr_x, curr_y) {

    if ((this.start_x !== undefined) && (this.start_y !== undefined)) {

        // This means that the mouse is currently down.
        var deltaY = 0,
            temp_value,
            to_set,
            ret;

        deltaY = curr_y - this.start_y;

        temp_value = this.values.knobvalue;

        // Todo set sensitivity.
        to_set = temp_value - deltaY / this.sensitivity;

        if (to_set > 1) {
            to_set = 1;
        }
        if (to_set < 0) {
            to_set = 0;
        }

        ret = {"slot" : "knobvalue", "value" : to_set};

        return ret;
    }

    // The mouse is currently up; ignore the event notify.
    return undefined;

};

// Setters
Knob.prototype.setValue = function (slot, value, fireCallback) {
    var temp_value = value;

    if ((temp_value < 0) || (temp_value > 1)) {
        //Just do nothing.
        //console.log("Knob.prototype.setValue: VALUE INCORRECT!!");
        return;
    }

    // Now, we call the superclass
    Knob.superclass.setValue.call(this, slot, value, fireCallback);

};
        
Knob.prototype.refresh = function () {

    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.
       
        // Call the superclass.
        Knob.superclass.refresh.call(this, this.drawClass.drawImage);

        // Draw if visible.
        if (this.isVisible === true) {
            /*jslint nomen: false*/
            var imageNum = this._getImageNum();
            /*jslint nomen: true*/
            this.drawClass.drawImage.draw(this.imagesArray[imageNum], this.xOrigin, this.yOrigin);

        }
    }
};

Knob.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Knob.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawImage",
                                           objParms: this.objParms}]);

};

function RotKnob(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

// TODO should it extend Knob? Or maybe we should make a GenericKnob class?
extend(RotKnob, Element);

RotKnob.prototype.getready = function (args) {

    if (args === undefined) {
        throw new Error("Error: specArgs is undefined!");
    }

    // Call the constructor from the superclass.
    RotKnob.superclass.getready.call(this, args);

    //now that all required properties have been inherited
    //from the parent class, define extra ones from this class

    //Default value is 0
    this.values = {"knobvalue" : 0,
                   "realknobvalue" : 0}
               
    this.defaultSlot = "knobvalue";

    // Init angular value. Describes the orientation of the rotary part image,
    // relative to the angular 0 point.
    if (args.initAngValue === undefined) {
        this.initAngValue = 0;
    }
    else {
        this.initAngValue = args.initAngValue;
    }

    // Defines the rotation direction in relation to the movement type.
    if (args.moveDirection == 'anticlockwise') {
        this.moveDirection = -1;
    }
    else {
        // Default, clockwise.
        this.moveDirection = 1;
    }

    // Start angular value. Defines the start point of the knob.
    this.startAngValue = args.startAngValue || 0;

    // Stop angular value. Defines the stop point of the knob.
    this.stopAngValue = args.stopAngValue || 360;

    // Steps. Defines the number of discrete steps of the knob. Infinite if
    // left undefined.
    this.angSteps = args.angSteps;

    var sens = args.sensitivity || 2000;
    // Scale sensivity according to the knob angle.
    this.sensitivity = Math.round((sens / 360) *  (Math.abs(this.stopAngValue - this.startAngValue)));

    
    this.image = args.image;
    
    this.setWidth(this.image.width);
    this.setHeight(this.image.height);

};


// This method returns an image index given the RotKnob value.
/*jslint nomen: false*/
RotKnob.prototype._getRotateAmount = function () {
/*jslint nomen: true*/
    if ((this.values.knobvalue < 0) || (this.values.knobvalue > 1)) {
        // Do nothing
        return undefined;
    }
    
    // value in degrees.
    var angularValue = this.values.knobvalue * 360;
    //console.log ("angularValue: ", angularValue);

    // Linear interpolation between startAngValue and stopAngValue
    var rangedAngularValue = 360 - (angularValue * (this.startAngValue - this.stopAngValue) / 360 + this.stopAngValue) % 360;
    //console.log ("rangedAngularValue: ", rangedAngularValue);

    // Add the angular offset, if any.
    var offsetAngularValue = (360 - this.initAngValue + rangedAngularValue) % 360;

    // Convert to radians
    var ret = offsetAngularValue * Math.PI / 180;
    return ret;
};

// This method returns true if the point given belongs to this RotKnob.
RotKnob.prototype.isInROI = function (x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {
            //console.log ("Point ", x, ",", y, " in ROI: ", this.ROILeft, ",", this.ROITop, this.ROIWidth, "x", this.ROIHeight);
            return true;
        }
        /*jsl:pass*/
    }
    //console.log ("Point ", x, ",", y, " NOT in ROI: ", this.ROILeft, ",", this.ROITop, this.ROIWidth, "x", this.ROIHeight);
    return false;
};

RotKnob.prototype.onMouseDown = function (x, y) {

    var inROI = this.isInROI(x, y);
    // Save the starting point if event happened in our ROI.
    if (inROI) {
        this.start_x = x;
        this.start_y = y;
    }

    // No value has been changed.
    return undefined;
};

RotKnob.prototype.onMouseUp = function (x, y) {

    // Reset the starting point.
    this.start_x = undefined;
    this.start_y = undefined;

    // No value has been changed
    return undefined;

};

RotKnob.prototype.onMouseMove = function (curr_x, curr_y) {

    if ((this.start_x !== undefined) && (this.start_y !== undefined)) {

        // This means that the mouse is currently down.
        var deltaY = 0,
            temp_value,
            to_set,
            ret;

        deltaY = curr_y - this.start_y;

        temp_value = this.values.realknobvalue;

        to_set = temp_value - ((deltaY / this.sensitivity) * this.moveDirection);

        if (to_set > 1) {
            to_set = 1;
        }
        if (to_set < 0) {
            to_set = 0;
        }

        ret = {"slot" : "knobvalue", "value" : to_set};

        return ret;
    }

    // The mouse is currently up; ignore the event notify.
    return undefined;

};

// Setters
RotKnob.prototype.setValue = function (slot, value, fireCallback) {
    var stepped_new_value;

    if ((value < 0) || (value > 1)) {
        //Just do nothing.
        //console.log("RotKnob.prototype.setValue: VALUE INCORRECT!!");
        return;
    }

    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }

    if ((value === this.values[slot]) || (value === this.values['real' + slot]))  {
        // Nothing to do.
        return;
    }

    this.values['real' + slot] = value;

    if ((this.angSteps) !== undefined) {
        
        var single_step = 1 / this.angSteps;
        stepped_new_value = Math.floor(value / single_step) * single_step;

        // No change in step -> no change in state or representation. Return.
        if (stepped_new_value === this.values [slot]) {
            return;
        }
    }

    else {
        stepped_new_value = value;
    }
    
    console.log ("Value is: ", stepped_new_value);

    // Now, we call the superclass
    RotKnob.superclass.setValue.call(this, slot, stepped_new_value, fireCallback);

};

RotKnob.prototype.refresh = function () {

    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.

        // Call the superclass.
        RotKnob.superclass.refresh.call(this, this.drawClass.drawImage);

        // Draw if visible.
        if (this.isVisible === true) {

            /*jslint nomen: false*/
            var rot = this._getRotateAmount();
            /*jslint nomen: true*/

            this.drawClass.drawImage.drawRotate(this.image, this.xOrigin, this.yOrigin, rot);

        }
    }
};

RotKnob.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    RotKnob.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawImage",
                                           objParms: this.objParms}]);

};

function Label(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Label, Element);

Label.prototype.getready = function (args) {

    // Call the constructor from the superclass.
    Label.superclass.getready.call(this, args);

    this.values = {"labelvalue" : ""};
    this.defaultSlot = "labelvalue";
     
    this.setWidth(args.width);
    this.setHeight(args.height);

};

// This methods returns true if the point given belongs to this element.
Label.prototype.isInROI = function (x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {
            return true;
        }
    }
    return false;
};

// Setters
Label.prototype.setValue = function (slot, value, fireCallback) {
    Label.superclass.setValue.call(this, slot, value, fireCallback);
};
 
Label.prototype.refresh = function () {
    
    var text;
    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.

        // Call the superclass.
        Label.superclass.refresh.call(this, this.drawClass.drawText);

        // Draw, if our draw class is already set.
        if (this.isVisible === true) {

            // Maybe the filtering should be done here?
            text = this.values.labelvalue;
            this.drawClass.drawText.draw(text, this.xOrigin, this.yOrigin, this.width, this.height);

        }
    }

};

Label.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Label.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawText",
                                           objParms: this.objParms}]);
}

function Multiband(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Multiband, Element);


Multiband.prototype.getready = function (args) {

    if (args === undefined) {
        throw new Error("Error: specArgs is undefined!");
    }

    var valueName,
        i;

     // Call the constructor from the superclass.
    Multiband.superclass.getready.call(this, args);
    
    this.nBands = args.nBands;
    this.sideBands = new Array (this.nBands);

    // The values. Every band has its starting point, height, width, hight and color.

    this.values = {};

    for (i = 0; i < args.nBands; i += 1) {
        valueName = i + "sp";
        this.values[valueName] = 0;
        valueName = i + "ep";
        this.values[valueName] = 0;
        valueName = i + "width";
        this.values[valueName] = 0;
        valueName = i + "height";
        this.values[valueName] = 0;
        valueName = i + "color";
        this.values[valueName] = 0;
    }
    
    this.defaultSlot = "0sp";

    this.values.colorRange = args.colorRange;

    /* Get the wrapper primitive functions, unique to label */
    this.drawClass = args.wrapper.initObject ([{objName: "drawRect",
                                           objParms: args.objParms}]);

    // The multiband display has a fixed width and height.
    this.setWidth(args.width);
    this.setHeight(args.height);

};

Multiband.prototype.calculateSidebands = function () {

    var startValue,
        endValue,
        heightValue,
        startXPoint,
        endXPoint,
        yPoint,
        i;

    for (i = 0; i < this.nBands; i += 1) {

        startValue = this.values[i + "sp"];
        endValue = this.values[i + "ep"];
        heightValue = this.values[i + "height"];

        startXPoint = this.xOrigin + (this.width * startValue);
        endXPoint = this.xOrigin + (this.width * endValue);
        yPoint = this.yOrigin + (1 - this.height * heightValue);

        this.sideBands[i] = {"startXPoint": startXPoint, "endXPoint": endXPoint, "yPoint": yPoint};
    }

};

Multiband.prototype.isInROI = function (x, y) {
    var proximity,
        i,
        curSB;

    /* DOES NOT WORK */
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {

            // It's in the multiband's real estate on the screen. Now we got to find if it's on the proximity of a sideband.
            // TODO set this somewhere else
            proximity = 3;
            this.calculateSidebands();
            for (i = 0; i < this.nBands; i += 1) {

                curSB = this.sideBands[i];

                if (y < curSB.yPoint) {
                    //Too high!
                    //console.log("Too high! (", y, " vs ", curSB["yPoint"]);
                    continue;
                }
                // Check for the start side band
                if ((x > curSB.startXPoint - proximity) && (x < curSB.startXPoint + proximity)) {
                    //console.log(this.name, " ROI Handler: ", x, y, " is in ROI for starting point of sideband ", i);
                    // We got it!
                    this.sideBand = [0, i];
                    return true;
                }
                if ((x > curSB.endXPoint - proximity) && (x < curSB.endXPoint + proximity)) {
                    // We got it!
                    //console.log(this.name, " ROI Handler: ", x, y, " is in ROI for ending point of sideband ", i);
                    this.sideBand = [1, i];
                    return true;
                }
            }
        }
    }
    //console.log(this.name, " ROI Handler: ", x, y, " is NOT in sideband ROI ");
    //console.log ("Returning false");
    return false;
};

Multiband.prototype.onROI = function (start_x, start_y, curr_x, curr_y) {

    var temp_value,
            to_set,
            ret,
            startSlot,
            endSlot,
            prevEndSlot,
            nextStartSlot,
            deltaX;
            
    deltaX = curr_x - start_x;

    if (this.sideBand[0] === 0) {

        //Moving the start sideband
        if (this.sideBand[1] === 0) {
            //Moving the first starting sideband: this is affected by the endband.
            temp_value = this.values.band0sp;

            to_set = temp_value - deltaX / 2000;

            if (to_set >= this.values["0ep"]) {
                to_set = this.values["0ep"];
            }
            if (to_set < 0) {
                to_set = 0;
            }

            ret = {"slot" : "0sp", "value" : to_set};

            return ret;
        }
        // Moving a middle start sideband; this is affected by the endband.
        startSlot = this.sideBand[1] + "sp";
        endSlot = this.sideBand[1] + "ep";
        prevEndSlot = (this.sideBand[1] - 1) + "ep";

        temp_value = this.values[startSlot];

        to_set = temp_value - deltaX / 2000;

        if (to_set >= this.values[endSlot]) {
            to_set = this.values[endSlot];
        }

        if (to_set <= this.values[prevEndSlot]) {
            to_set = this.values[prevEndSlot];
        }

        ret = {"slot" : startSlot, "value" : to_set};
        return ret;

    }

    else if (this.sideBand[0] === 1) {
        //Moving the end sideband
        if (this.sideBand[1] === 0) {
            //Moving the last ending sideband: This is affected only by the hard limit.
            startSlot = this.sideBand[this.nBands] + "sp";
            endSlot = this.sideBand[this.nBands] + "ep";

            temp_value = this.values[endSlot];

            to_set = temp_value - deltaX / 2000;

            if (to_set < this.values[startSlot]) {
                to_set = this.values[startSlot];
            }
            if (to_set > 1) {
                to_set = 1;
            }

            ret = {"slot" : endSlot, "value" : to_set};

            return ret;
        }

        // Moving a middle end sideband; this is affected by other bands
        startSlot = this.sideBand[1] + "sp";
        endSlot = this.sideBand[1] + "ep";
        nextStartSlot = (this.sideBand[1] + 1) + "sp";

        temp_value = this.values[endSlot];

        to_set = temp_value - deltaX / 2000;

        if (to_set < this.values[startSlot]) {
            to_set = this.values[startSlot];
        }

        if (to_set > this.values[nextStartSlot]) {
            to_set = this.values[nextStartSlot];
        }

        ret = {"slot" : endSlot, "value" : to_set};
        return ret;

    }
    else {
        //Shouldn't be here.
        throw new Error("Error: sideband is neither start not end.");
    }

};

Multiband.prototype.setValue = function (slot, value, fireCallback) {

    var bandn,
        bandtype,
        previous,
        next;
    
    bandn = parseInt(slot, 10);
    bandtype = slot.substring(slot.length - 2);

    // Bad hack. It catches the end or start points. TODO write it better.
    if ((bandtype === "sp") || (bandtype === "ep")) {

        // If it's a start or end point, don't make them overlap.
        previous = undefined;
        next = undefined;

        if ((bandtype === "sp") && (bandn === 0)) {
            if (value > this.values["0ep"]) {
                value = this.values["0ep"];
            }
        }

        else if ((bandtype === "ep") && (bandn === this.nBands - 1)) {
            previous = bandn + "sp";
            if (value < this.values[previous]) {
                value = this.values[previous];
            }
        }

        else {

            if (bandtype === "sp") {
                previous = (bandn - 1) + "ep";
                next = bandn + "ep";
            }
            else if (bandtype === "ep") {
                previous = bandn + "sp";
                next = (bandn + 1) + "sp";
            }

            if (value < this.values[previous]) {
                value = this.values[previous];
            }

            if (value > this.values[next]) {
                value = this.values[next];
            }

        }
    }

    //Can't call the superclass; we need to clear the old band, so we need a
    //special behaviour. TODO this is no more needed. TODO call the callback
    //and use fireCallback.

    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }

    if (value === this.values[slot]) {
        // Nothing to do.
        return;
    }

    this.values[slot] = value;
 
};


Multiband.prototype.refresh = function () {

    var height,
        range,
        colValue,
        color_shade,
        i;

    // Call the superclass.
    Multiband.superclass.refresh.apply(this, [this.drawClass.drawRect]);
    
    // Draw, if our draw class is already set.
    if ((this.drawClass !== undefined) && (this.isVisible === true)) {

        // Here we do the math and draw ourselves
        this.calculateSidebands();

        for (i = 0; i < this.nBands; i += 1) {

            height = (1 - this.values[i + "height"]) * this.height;
            range = this.values.colorRange;
            colValue = this.values[i + "color"];
            color_shade = (colValue - 0.5) * range;
            this.drawClass.drawRect.draw(this.sideBands[i].startXPoint,
                                         this.yOrigin + height,
                                         this.sideBands[i].endXPoint - this.sideBands[i].startXPoint,
                                         this.height - height,
                                         color_shade);
        }
    }
};
                    


function Wavebox(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Wavebox, Element);

Wavebox.prototype.getready = function (args) {

    // Call the constructor from the superclass.
    Wavebox.superclass.getready.call(this, args);

    this.values = {"waveboxposition" : 0,
                   "startsample" : 0,
                   "endsample" : null,
                   "waveboxsignal" : undefined
               };
    this.defaultSlot = "waveboxposition";
    
    this.setWidth(args.width);
    this.setHeight(args.height);

};

// This methods returns true if the point given belongs to this element.
Wavebox.prototype.isInROI = function (x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {            
            return true;
        }
    }
    return false;
};

Wavebox.prototype.setValue = function (slot, value, fireCallback) {

    // Won't call the parent: this element has a custom way to set values.
    // TODO CALL THE CALLBACK AND USE fireCallback

    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }

    if (this.values[slot] === value) {
        //Nothing changed, don't redraw.
        return;
    }

    // Check some boundaries.

    if ((slot === "startsample") || (slot === "endsample")) {
        if (value < 0) {
            throw new Error("Error: Trying to set ", slot, " less than 0: ", value);
        }
        if (this.values["waveboxsignal"] !== undefined) {
            if (value > this.values["waveboxsignal"].length) {
                throw new Error("Error: Trying to set ", slot, " bigger than signal length: ", value, " > ", this.values["waveboxsignal"].length);
            }
        }
    }

    if (slot === "startsample") {
        if (value > this.values["endsample"]) {
                throw new Error("Error: Trying to set startsample > endsample: ", value, " > ", this.values["endsample"]);
            }
    }

    if (slot === "endsample") {
        if (value < this.values["startample"]) {
                throw new Error("Error: Trying to set endsample < startsample: ", value, " < ", this.values["startsample"]);
            }
    }

    this.values[slot] = value;
    console.log ("set value for slot ", slot);

    // When we change the signal, we know we must reset the whole thing.
    if (slot === "waveboxsignal") {
        //Take the whole waveform
        console.log ("inside!");
        this.values["endsample"] = this.values["waveboxsignal"].length;
        this.values["startsample"] = 0;
    }
};

Wavebox.prototype.refresh = function () {
    if (this.drawClass !== undefined) {
        // Draw, if our draw class is already set.
       
        // Call the superclass.
        Wavebox.superclass.refresh.call(this, this.drawClass.drawPath);
        // Draw, if our draw class is already set.
        if (this.isVisible === true) {

            var oldpoint = 0;
            this.drawClass.drawPath.beginDraw();

            for (var i = 0; i < this.width; i += 1) {
                var point = this.calculateSampleCoord(i);
                if (point !== oldpoint) {
                    //console.log ("Drawing a point, x is ", point.x, " y is ", point.y);
                    //this.drawClass.drawImage.draw(this.imagesArray[imageNum], this.xOrigin, this.yOrigin);
                    this.drawClass.drawPath.draw(point.x, point.y);
                }
                oldpoint = point;
            }
            this.drawClass.drawPath.endDraw();

        }
    }
};

//Non-interface functions

Wavebox.prototype.sampleindexToY = function (samplenum) {
    //Check boundaries
    if ((samplenum >= this.values.endsample) || (this.values.waveboxsignal[samplenum] === undefined) || (this.values.waveboxsignal[samplenum] === null)) {
        throw new Error("Error: problem with sample index: ", samplenum, " or sample value: ", this.values.waveboxsignal[samplenum]);
    }

    //We got a sample number, and we want to know where it should be drawn.
    //Sample values go from -1 to 1.
    //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
    var range01 = (this.values.waveboxsignal[samplenum] + 1) / 2;
    //console.log ("signal that was ", this.values.waveboxsignal[samplenum], " is now transformed in ", range01);
    var temp = ((1 - range01) *  this.height);
    //console.log ("Adding to origin ", temp);
    var y = this.yOrigin + temp;
    return parseInt (y, 10);

}

Wavebox.prototype.sampleXToIndex = function (xcoord) {

    var factor = ((this.values.endsample - this.values.startsample) / this.width);
    var x = xcoord * factor;
    var ret = parseInt (x, 10);
    //if (( x % 100) == 0 ) {
        //console.log ("xcoord is ", xcoord , " of ", this.width , " factor is ", factor, " and corresponding sample number is ", ret , " finishing at ", this.values.endsample);
    //}
    return ret;

}

Wavebox.prototype.calculateSampleCoord = function (xcoord) {
    // this returns the absolute x,y coordinates from the sample in x position, relative to the x-origin of the box
    var ret = {};
    ret.x = xcoord + this.xOrigin;
    ret.y = this.sampleindexToY(this.sampleXToIndex(xcoord));
    return ret;
}

Wavebox.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Wavebox.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawPath",
                                           objParms: this.objParms}]);
                                   
};

// Ok, this Slider is an horizontal one. Must implement the vertical one as well.
function Slider(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(Slider, Element);

Slider.prototype.getready = function (args /*sliderImg, knobImg*/) {

    if (args === undefined) {
        throw new Error("Error: specArgs is undefined!");
    }

    // Call the constructor from the superclass.
    Slider.superclass.getready.call(this, args);

    //now that all required properties have been inherited
    //from the parent class, define extra ones from this class

    // Default value is 0
    this.values = {"slidervalue" : 0};
    this.defaultSlot = "slidervalue";

    this.width = 0;
    this.height = 0;

    this.sliderImage = args.sliderImg;
    this.knobImage = args.knobImg;
    this.type = args.type;

    this.calculateDimensions();

};


// This method returns an x position given the Slider value.
/*jslint nomen: false*/
Slider.prototype._getKnobPosition = function () {
/*jslint nomen: true*/
    var ret;

    if ((this.values.slidervalue < 0) || (this.values.slidervalue > 1)) {
        // Do nothing
        return undefined;
    }
    // We must take in account the half-knob thing, here.
    switch(this.type) {

      case "horizontal":
          ret = Math.round(this.values.slidervalue * this.width + this.zeroLimit);
      break;

      case "vertical":
          ret = Math.round(this.values.slidervalue * this.height + this.zeroLimit);
      break;

      default:
          throw new Error("Error: Slider orientation is undefined!");
      }

    return ret;
};

// This method returns true if the point given belongs to this Slider.
Slider.prototype.isInROI = function (x, y) {
    switch(this.type) {
        case "horizontal":
            if ((x > this._getKnobPosition()) && (y > this.ROITop)) {
                if ((x < (this._getKnobPosition() + this.kWidth)) && (y < (this.ROITop + this.kHeight))) {
                    return true;
                }
            }
        break;

        case "vertical":
            if ((y > this._getKnobPosition()) && (x > this.ROILeft)) {
                if ((y < (this._getKnobPosition() + this.kHeight)) && (x < (this.ROILeft + this.kWidth))) {
                    return true;
                }
            }
        break;

        default:
          throw new Error("Error: Slider orientation is undefined!");
      }

    // Slider is in ROI if and only if we drag the knob.
    return false;
};

Slider.prototype.onMouseDown = function (x, y) {
    if (this.isInROI(x, y)) {
        this.triggered = true;
        // This remembers the difference between the current knob start and
        // the point where we started dragging.
        switch(this.type) {

            case "horizontal":
                this.drag_offset = x - this._getKnobPosition();
            break;

            case "vertical":
                this.drag_offset = y - this._getKnobPosition();
            break;

            default:
              throw new Error("Error: Slider orientation is undefined!");
          }
    }
    return undefined;
};

Slider.prototype.onMouseUp = function (x, y) {
    this.triggered = false;
    this.drag_offset = undefined;
    return undefined;
};

Slider.prototype.onMouseMove = function (curr_x, curr_y) {

        if (this.triggered === true) {
            var to_set,
                ret;

            // We must compensate for the point where we started to drag if
            // we want a seamless drag animation.
            switch(this.type) {
                case "horizontal":
                    to_set = (curr_x - this.zeroLimit - this.drag_offset) / (this.width);
                break;

                case "vertical":
                    to_set = (curr_y - this.zeroLimit - this.drag_offset) / (this.height);
                break;

                default:
                  throw new Error("Error: Slider orientation is undefined!");
              }

            if (to_set > 1) {
                to_set = 1;
            }
            if (to_set < 0) {
                to_set = 0;
            }

            ret = {"slot" : "slidervalue", "value" : to_set};

            return ret;
        }
        
        return undefined;
    };

// Setters
Slider.prototype.setValue = function (slot, value, fireCallback) {

    if ((value < 0) || (value > 1)) {
        // Can happen if the user drags too much.
        return;
    }

    // Now, we call the superclass
    Slider.superclass.setValue.call(this, slot, value, fireCallback);

};

Slider.prototype.refresh = function () {

    // Completely override the superclass, because the mechanism is different.
    // Maybe this function could be polymorphic and also accept areas, so we
    // could call the superclass with parameters.

    if (this.drawClass === undefined) {
        return;
    }
    else {

        if ((this.drawClass !== undefined) && (this.isVisible === true)) {
            this.drawClass.drawImage.draw(this.sliderImage, this.xOrigin, this.yOrigin);
            /*jslint nomen: false*/

            switch(this.type) {
                case "horizontal":
                    this.drawClass.drawImage.draw(this.knobImage, this._getKnobPosition(), this.yOrigin);
                break;

                case "vertical":
                    this.drawClass.drawImage.draw(this.knobImage, this.xOrigin, this._getKnobPosition());
                break;

                default:
                  throw new Error("Error: Slider orientation is undefined!");
              }
          }
        
        /*jslint nomen: true*/
    }
};

Slider.prototype.calculateDimensions = function () {

    // The length of the slider knob.
    this.kWidth = this.knobImage.width;
    this.kHeight = this.knobImage.height;
   
    //TODO Maybe we should override this function, to set the ROI to the fader.
    this.setWidth(this.sliderImage.width);
    this.setHeight(this.sliderImage.height);
    
    // The fader can stick out by an half of its length at the two extremes of the
    // slider. Let's store some useful variables.
        switch(this.type) {
        case "horizontal":
            this.totalStride = this.width + this.kWidth;
            this.additionalEndSpace = Math.round (this.kWidth / 2);
            this.zeroLimit = this.xOrigin - this.additionalEndSpace;
            this.oneLimit =  this.xOrigin + this.width + this.additionalEndSpace;
        break;

        case "vertical":
            this.totalStride = this.height + this.kHeight;
            this.additionalEndSpace = Math.round (this.kHeight / 2);
            this.zeroLimit = this.yOrigin - this.additionalEndSpace;
            this.oneLimit =  this.yOrigin + this.height + this.additionalEndSpace;
        break;

        default:
          throw new Error("Error: Slider orientation is undefined!");
      }
    
};

Slider.prototype.setGraphicWrapper = function (wrapper) {

    // Call the superclass.
    Slider.superclass.setGraphicWrapper.call(this, wrapper);

    // Get the wrapper primitive functions
    this.drawClass = wrapper.initObject ([{objName: "drawImage",
                                           objParms: this.objParms}]);

};

// This kind of knob can be easily emulated with callbacks and so on. Not sure
// if I really need to mantain it.

function NonOverlappingMultiknob(args) {
    if (arguments.length) {
        this.getready(args);
    }
}

extend(NonOverlappingMultiknob, Element);


NonOverlappingMultiknob.prototype.getready = function (args) {
    
     // Call the constructor from the superclass.
    NonOverlappingMultiknob.superclass.getready.call(this, args);

    //now that all required properties have been inherited
    //from the parent class, define extra ones from this class
    this.KnobArray = [];
    this.ROIKnob = undefined;

    var nKnobs,
        tempKnob,
        knob,
        valuename,
        i;

    //Coordinates is an array of arrays. We infer the number of knobs from its
    //length. No alignment functions here, they must be provided outside of this
    //class.
    nKnobs = args.coordinates.length;

    // Set the status progress. TODO this can go.
    this.objectsTotal = nKnobs * args.images.length;

    // Fill the knob array. It contains, you know, knobs :)
    for (i = 0; i < nKnobs; i += 1) {

        var knobSpecArgs = {
            images: args.images
        };
        // The knobs are named 1,2,3...n
        tempKnob = new Knob(i, args.coordinates[i], knobSpecArgs);

        this.KnobArray.push(tempKnob);
    }

    this.values = {};

    //Map our values to the corresponding knob
    for (i = 0; i < this.KnobArray.length; i += 1) {
        valuename = "knobvalue" + this.KnobArray[i].name;
        this.values[valuename] = i;
    }
    
    this.defaultSlot = "knobvalue0";

};

NonOverlappingMultiknob.prototype.isInROI = function (x, y) {

    var nKnobs,
        i;

    //Check all the "subknobs".
    nKnobs = this.KnobArray.length;
    for (i = 0; i < nKnobs; i += 1) {
        if (this.KnobArray[i].isInROI(x, y) === true) {
            // Store the knob that responded true.
            this.ROIKnob = i;
            return true;
        }
    }

    return false;

};

NonOverlappingMultiknob.prototype.onMouseDown = function (x, y) {

    var knobret,
        inROI;

    inROI = this.isInROI(x, y);

    if (inROI === true) {
        knobret = this.KnobArray[this.ROIKnob].onMouseDown(x,y);
    }

    //assert (knobret === undefined) TODO
    return knobret;
    
};

NonOverlappingMultiknob.prototype.onMouseUp = function (x, y) {

    var knobret;

    if (this.ROIKnob !== undefined) {
        knobret = this.KnobArray[this.ROIKnob].onMouseUp(x,y);
    }
    this.ROIKnob = undefined;
    //assert (knobret === undefined) TODO
    return knobret;
}

NonOverlappingMultiknob.prototype.onMouseMove = function (x, y) {

    var knobret;

    if (this.ROIKnob !== undefined) {
        //Pass it to the right subknob
        knobret = this.KnobArray[this.ROIKnob].onMouseMove(x,y);

        if (knobret !== undefined) {
            var ret = {"slot" : ("knobvalue" + this.ROIKnob), "value" : knobret.value};
            return ret;
        }
    }
    // else
    return undefined;
}

NonOverlappingMultiknob.prototype.setValue = function (slot, value) {

    var knobN;

    //Do the magic here. Knobs should not overlap.
    //Note that we don't change any other knob value, we simply assure that knob[i]
    //is always minor (or equal?) to knob[i+1] and that knob[0] >= 0 and knob[1]
    // <= 1.

    if ((value < 0) || (value > 1)) {
        //Just do nothing.
        //console.log("NonOverlappingMultiknob.prototype.setValue: VALUE INCORRECT!!");
        return;
    }

    //Retrieve the knob number here. Kind of an hack, mh?
    knobN = parseInt(this.values[slot], 10);

    if (knobN === 0) {
        if (value < 0) {
            value = 0;
        }
        if (value > this.KnobArray[knobN + 1].values.knobvalue) {
            value = this.KnobArray[knobN + 1].values.knobvalue;
        }
    }

    else if (knobN === (this.KnobArray.length - 1)) {
        if (value > 1) {
            value = 1;
        }
        if (value < this.KnobArray[knobN - 1].values.knobvalue) {
            value = this.KnobArray[knobN - 1].values.knobvalue;
        }
    }

    else {
        if (value < this.KnobArray[knobN - 1].values.knobvalue) {
            value = this.KnobArray[knobN - 1].values.knobvalue;
        }
        if (value > this.KnobArray[knobN + 1].values.knobvalue) {
            value = this.KnobArray[knobN + 1].values.knobvalue;
        }
    }

    //Set the values in the subknob. I don't like the hardcoded string here.
    //(maybe a Multielement could be generalized)
    this.KnobArray[knobN].setValue("knobvalue", value);
    
};

NonOverlappingMultiknob.prototype.refresh = function () {
    
    var i;

    if (this.drawClass === undefined) {
        throw new Error("Error: drawClass is undefined!");
    }
    else {
        // Refresh all the subknobs.
        for (i = 0; i < this.KnobArray.length; i += 1) {
            //drawClasses must be lazily initialized here.
            if (this.KnobArray[i].drawClass === undefined) {
                this.KnobArray[i].drawClass = this.drawClass;
            }
            this.KnobArray[i].refresh();
        }
    }
};

NonOverlappingMultiknob.prototype.getValue = function (slot) {
    //Retrieve the knob numer here. Kind of an hack, mh?
    var knobN = this.values[slot];
    //Get the values from the subknob. Same as setValue.
    this.KnobArray[knobN].getValue("knobvalue");
};

CANVAS_WRAPPER = {

    drawImage: function (canvas) {

        this.canvasC = canvas


        this.draw = function (image, x, y) {

                this.canvasC.drawImage(image, x, y);

            }

        this.drawRotate = function (image, x, y, rot, rot_type /* = center TODO */) {
            this.canvasC.save();
            this.canvasC.translate(x + (image.width / 2), y + (image.height / 2));
            this.canvasC.rotate(rot);
            this.canvasC.translate(-(image.width / 2) - x, -(image.height / 2) - y);
            this.canvasC.drawImage(image, x, y);
            this.canvasC.restore();
        }

        this.saveBackground = function (left, top, width, height) {


            this.backgroundPixels = this.canvasC.getImageData(left, top, width, height);
            this.bgX = left;
            this.bgY = top;
        }

        this.restoreBackground = function () {
            this.canvasC.putImageData(this.backgroundPixels, this.bgX, this.bgY);
        }
    },

    drawText: function (canvas, textParms) {

        this.canvasC = canvas;

        var HTML5TextParameters = ['fillStyle', 'font', 'textAlign', 'textBaseline'];
        var canvasPropStorage = {};

        this.font = textParms.font || "verdana";        //Default
        this.textColor = textParms.textColor || null;   // Use the canvas' value
        this.textAlignment = textParms.textAlignment || null;
        this.textBaseline = textParms.textBaseline || null;

        this.draw = function (text, x, y, width, length) {

                //Save the parameters.
                canvasPropStorage.tempBaseline = this.canvasC.textBaseline;
                canvasPropStorage.tempAlign = this.canvasC.textAlign;
                canvasPropStorage.tempFont = this.canvasC.font;
                canvasPropStorage.tempfillStyle = this.canvasC.fillStyle;

                if (this.textBaseline !== null) {
                    this.canvasC.textBaseline = this.textBaseline;
                }

                if (this.textAlignment!== null) {
                    this.canvasC.textAlign = this.textAlignment;
                }

                if (this.font !== null) {
                    this.canvasC.font = this.font;
                }

                if (this.textColor != null) {
                    this.canvasC.fillStyle = this.textColor;
                }

                //Write the label
                this.canvasC.fillText(text, x, y);

                this.canvasC.textBaseline = canvasPropStorage.tempBaseline;
                this.canvasC.textAlign = canvasPropStorage.tempAlign;
                this.canvasC.font = canvasPropStorage.tempFont;
                this.canvasC.fillStyle = canvasPropStorage.tempfillStyle;

            }

            this.saveBackground = function (left, top, width, height) {

                var xcoord,
                    ycoord,
                    wd,
                    hg;

                    xcoord = left;
                    ycoord = top;
                    wd = width;
                    hg = height;

                /* TODO check all the out of bounds
                 * and all the possibilities:
                 * https://developer.mozilla.org/en/drawing_text_using_a_canvas */
                if (this.textBaseline === 'bottom') {
                    ycoord = top - height;
                }
                if (this.textBaseline === 'middle') {
                    ycoord = top - height / 2;
                }
                if (this.textAlignment === 'end') {
                    xcoord = xcoord - wd;
                    if (xcoord < 0) {
                        xcoord = 0;
                    }
                }

                this.backgroundPixels = this.canvasC.getImageData(xcoord, ycoord, wd, hg);
                this.bgX = xcoord;
                this.bgY = ycoord;


            }

            this.restoreBackground = function () {

                this.canvasC.putImageData(this.backgroundPixels, this.bgX, this.bgY);

            }
    },

    drawRect: function (canvas) {

        function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
        function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
        function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
        function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
        function RGB2HTML(R, G, B) {
            var red = parseInt(R);
            var green = parseInt(G);
            var blue = parseInt(B);
            var hexcode = fillZero(red.toString(16)) + fillZero(green.toString(16)) + fillZero(blue.toString(16));
            return '#' + hexcode.toUpperCase();
        }

        function fillZero(myString) {
            if (myString.length == 1) return "0" + myString;
            else return myString;
        }

        this.canvasC = canvas;
        this.fillStyle = undefined;

        this.setFillStyle = function (color) {
            this.fillStyle = color;
        }

        this.setClearStyle = function (color) {
            this.clearStyle = color;
        }

        this.setStroke = function (stroke) {
            this.stroke = stroke;
        }

        /* TODO Maybe opacity? */
        this.draw = function (x, y, width, length, shade) {

            //Trasform the base color in RGB
            var R = HexToR(this.fillStyle);
            var G = HexToG(this.fillStyle);
            var B = HexToB(this.fillStyle);

            //Add "shade" to the RGB values
            R += shade;
            G += shade;
            B += shade;

            if (R < 0) {
                R = 0;
            }
            if (G < 0) {
                G = 0;
            }
            if (B < 0) {
                B = 0;
            }
            if (R > 255) {
                R = 255;
            }
            if (G > 255) {
                G = 255;
            }
            if (B > 255) {
                B = 255;
            }
            //Convert back to hex format.
            var realColor = RGB2HTML(R, G, B);

            this.reallyDraw (x,y, width, length, realColor);
        }

        this.draw = function (x, y, width, length, color) {

            //Save fillStyle.
            var tempfillStyle = this.canvasC.fillStyle;

            // draw
            this.canvasC.fillStyle = color;
            this.canvasC.fillRect (x, y,  width, length);

            // Restore fillStyle
            this.canvasC.fillStyle = tempfillStyle;
        }
    },

    drawPoint: function (canvas, color, dimension) {

        this.canvasC = canvas;
        this.fillStyle = color;
        this.dimension = dimension;

        this.draw = function (x, y) {
            //Save fillStyle.
            var tempfillStyle = this.canvasC.fillStyle;
            this.canvasC.fillStyle = this.fillStyle;

            this.canvasC.fillRect(x, y, this.dimension, this.dimension);

            // Restore fillStyle
            this.canvasC.fillStyle = tempfillStyle;

        }
    },

    drawPath: function (canvas, pathParms) {

        this.canvasC = canvas;
        this.inited = false;
        this.pathColor = pathParms.pathColor || null;
        // To be implemented
        this.pathDimension = pathParms.pathDimension;

        this.draw = function (x, y) {

            //Save fillStyle.
            var tempfillStyle = this.canvasC.fillStyle;
            this.canvasC.fillStyle = this.pathColor;

            if (this.inited === false) {
                this.canvasC.beginPath();
                this.canvasC.moveTo(x, y);
                this.inited = true;
            }
            else {
                this.canvasC.lineTo(x, y);
            }

            // Restore fillStyle
            this.canvasC.fillStyle = tempfillStyle;
        }

        // Redundant.
        this.beginDraw = function () {
            this.inited = false;
        }

        this.endDraw = function () {

            this.inited = false;
            //Save fillStyle.
            var tempfillStyle = this.canvasC.fillStyle;
            this.canvasC.fillStyle = this.fillStyle;

            this.canvasC.stroke();

            // Restore fillStyle
            this.canvasC.fillStyle = tempfillStyle;
        }

        // These should be in the wrappers interface. TODO THIS IS DUPLICATE CODE!!!
        this.saveBackground = function (left, top, width, height) {


            this.backgroundPixels = this.canvasC.getImageData(left, top, width, height);
            this.bgX = left;
            this.bgY = top;
        }

        this.restoreBackground = function () {
            this.canvasC.putImageData(this.backgroundPixels, this.bgX, this.bgY);
        }
    },

   staticMethods : {
        // General purpose 2d saver/restorer.
        save2d: function (that, left, top, width, height) {
            that.backgroundPixels = that.canvasC.getImageData(left, top, width, height);
            that.bgX = left;
            that.bgY = top;
        },

        restore2d: function (that) {
            that.canvasC.putImageData(that.backgroundPixels, that.bgX, that.bgY);
        },

        reset: function (that) {
            // use clearRect instead TODO TODO TODO
            that.canvasC.width = that.canvasC.width;
        }
    }
}

var K2WRAPPER = {};

K2WRAPPER.createWrapper = function (type, args) {
    
    switch(type)
    {
    case "CANVAS_WRAPPER":
      if (args.canvas !== undefined) {
          return new canvasWrapperCreator (args.canvas);
      }
      //throw
      break;
    default:
      //throw
    }

    function canvasWrapperCreator (canvas) {
        
        // Utility functions
        // Resets the canvas
        this.reset = function () {
            this.canvas.width = this.canvas.width;
        }

        // Constructor
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.wrapper = CANVAS_WRAPPER;
        this.initObject = function (list) {
            // list: [{objName: "name", objParms: {parm1 = 1, parm2 = 2}},...]
            var ret = {};
            for (var i = 0; i < list.length; i +=1) {
                var name = list[i].objName;
                var parms = list[i].objParms;
                var func = this.wrapper[name];
                // Canvas is given to the object, so it can directly manipulate it.
                var obj = new func (this.context, parms);
                ret[name] = obj;
                ret[name]["staticMethods"] = this.wrapper.staticMethods;
            }
            return ret;
        }
    }

}