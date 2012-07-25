// this demo shows how to create sounds
// using a `Generator` and how to manipulate it
require([
  'dsp/gen/synth'
], function(Synth) {

  var audiolet = new Audiolet(),
    gen = new Synth({ audiolet: audiolet, frequency: 300 });

  // route graph
  gen.connect(audiolet.output);

  // demonstrate `Model` api
  setTimeout(function() {
    gen.set('frequency', 200);
  }, 2000);

});