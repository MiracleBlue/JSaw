JSaw - the JavaScript Audio Workstation
========

The UI is still totally non-functional, so test cases are only in code at the moment.  There are two tests you can run in your javascript console: JSAW.Test.Instrument.synth() and JSAW.Test.Instrument.sampler()

Voice creation in Instrument objects are what handle the playback of individual notes.  When a pattern or sequence of notes is being parsed over, each note object gets sent to the create method of the instrument voices object.

Firefox 8.0 - 8.1 breaks Sink.js!  This has been fixed in Firefox 9 Beta (allegedly)