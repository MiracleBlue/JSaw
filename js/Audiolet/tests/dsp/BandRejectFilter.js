load('../../../../audiotest.js/trunk/audiotest.js');
load('../../src/audiofile/audiofile.js');
load('../../src/audiolet/Audiolet.js');
load('../Environment.js');

function testBRF() {
    var audiolet = new Audiolet();
    var sine = new Sine(audiolet, 300);
    var brf = new BandRejectFilter(audiolet, 300);
    var recorder = new InputRecorder(audiolet, 1);

    sine.connect(brf);
    brf.connect(recorder);

    for (var i=0; i<10; i++) {
        recorder.tick(8192, i);
    }

    var buffer = recorder.buffers[0];
    var data = buffer.getChannelData(0);
    Assert.assertContinuous(data);
    Assert.assertAudibleValues(data);
    Assert.assertValuesInRange(data);
}

test("Band Reject Filter", testBRF);

// Make sure that the lows are getting filtered
// Make sure that the lows aren't getting filtered
function testPassingLows() {
    var audiolet = new Audiolet();
    var sine = new Sine(audiolet, 300); // Shouldn't be filtered
    var brf = new BandRejectFilter(audiolet, 5000);
    var recorder = new InputRecorder(audiolet, 1);

    sine.connect(brf);
    brf.connect(recorder);

    for (var i=0; i<10; i++) {
        recorder.tick(8192, i);
    }

    var buffer = recorder.buffers[0];
    var data = buffer.getChannelData(0);
    Assert.assertAudibleValues(data);
    Assert.assertValuesReach(data); // Check for high amplitude
}

test("Is Passing Lows", testPassingLows);

// Make sure that the center frequencies are getting filtered
function testFilteringCenter() {
    var audiolet = new Audiolet();
    var sine = new Sine(audiolet, 300); // Should be filtered
    var brf = new BandRejectFilter(audiolet, 300);
    var recorder = new InputRecorder(audiolet, 1);

    sine.connect(brf);
    brf.connect(recorder);

    for (var i=0; i<10; i++) {
        recorder.tick(8192, i);
    }

    var buffer = recorder.buffers[0];
    var data = buffer.getChannelData(0);
    Assert.assertContinuous(data);
    Assert.assertAudibleValues(data);
    Assert.assertValuesInRange(data, -0.5, 0.5); // Check for low amplitude
}

test("Is Filtering Center", testFilteringCenter);

// Make sure that the lows aren't getting filtered
function testPassingHighs() {
    var audiolet = new Audiolet();
    var sine = new Sine(audiolet, 5000); // Shouldn't be filtered
    var brf = new BandRejectFilter(audiolet, 300);
    var recorder = new InputRecorder(audiolet, 1);

    sine.connect(brf);
    brf.connect(recorder);

    for (var i=0; i<10; i++) {
        recorder.tick(8192, i);
    }

    var buffer = recorder.buffers[0];
    var data = buffer.getChannelData(0);
    Assert.assertAudibleValues(data);
    Assert.assertValuesReach(data); // Check for high amplitude
}

test("Is Passing Highs", testPassingHighs);

function testEmpty() {
    var audiolet = new Audiolet();
    var brf = new BandRejectFilter(audiolet);
    var node = new Introspector(audiolet, 1, 0);
    brf.connect(node);

    node.tick(8192, 0);

    Assert.assertEquals(node.inputBuffers[0].isEmpty, true, "Buffer empty");
}

test("Empty input", testEmpty);
