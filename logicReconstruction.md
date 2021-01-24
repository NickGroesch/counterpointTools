# Refactoring is immanent, but requires understanding

At the time this app was initially developed I was focusing on web tech but thinking about working with arrays in terms of signal processessing. Many functions have been attempted to be refactored so far into maps quite effectively. 
*There is a  possibility of rethinking this terms of streams, will it be better or worse?*
the layers of the translator utility have some distinctions of whether they process atoms or lists. but the interface (from `transandbox.js`) seems to only expose list methods in `utils/tests.js` and `controller/` as well as mapObjects.

## TYPES
SCIENTIFIC pitchNotations, and their [], as strings eg. `"C.4"`
MIDINOTE pitchNotations, and their [], as integers eg. `60`
DUAL [], which zip SCIENTIFIC and MIDINOTE notations into objects
DELTA [], which are arrays of ingeters representing relative motion within a voice
INTERVAL[], which are ***UGLY NOW*** [prefixSTR, qualitySTR, %b7doff, b7diff] eg. `["asc","perf",4,4]`
MOTION [], which are arrays of str e.g "parallel"

## INTERFACE METHODS (actually used) and their stacks
- **transposeMidiArray()**
- **pitchArrayToMidi()**<=pitchToMidi()<=pitchClassToMidi()<=pitchClassMidi{}
- **evalPitchArray()**<=evalPitch()<=pitchClass()<=midiPitchClass{}
- *formatDual()*
- *deltaDual()*<=measureInterval<=deltaIntervalArray(),pitchBase() `might be part of assessmotion`
- **intervalCompare()**<=measureInterval...
- **assessMotion**
- **abcify()<=stupifier()<=keySignatures{}