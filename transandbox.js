const translators = require("./translators.js");

let duals = translators.formatDualFromMidi([64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]
    , "E");

console.log(duals)

// let play = [
//     "C.5",
//     "C.6",
//     "G.5",
//     "G.5",
//     "A.5",
//     "A.5",
//     "G.5",
//     "G.5",
//     "F.5",
//     "F.5",
//     "E.5",
//     "E.5",
//     "D.5",
//     "D.5",
//     "C.5"
// ];
// let test = [
//     "A.4",
//     "C.5",
//     "C.5",
//     "E.5",
//     "F.5",
//     "Bb.5",
//     "A.5",
//     "G.5",
//     "F.5",
//     "D.5",
//     "C.5",
//     "E.5",
//     "D.5",
//     "E.5",
//     "F.5"
// ];
// let midiPlay = translators.pitchArrayToMidi(play);
// let midiTest = translators.pitchArrayToMidi(test);
// midiPlay = translators.transposeMidiArray(midiPlay, -7);
// play = translators.evalPitchArray(midiPlay, "F");
// test = translators.evalPitchArray(midiTest, "F");
// let dualPlay = translators.formatDual(midiPlay, play);
// let dualTest = translators.formatDual(midiTest, test);
// // console.log("dP", dualPlay);
// // console.log("dT", dualTest);
// let playDeltas = translators.deltaDual(dualPlay);
// let testDeltas = translators.deltaDual(dualTest);
// let intervals = translators.intervalCompare(dualPlay, dualTest);
// // console.log("pD", playDeltas);
// // console.log("tD", testDeltas);
// // console.log("compareIntervals", intervals);
// // TEST COMMAND $node --experimental-modules transandbox.mjs
// // console.log(playDeltas);
// // console.log(testDeltas);

// translators.assessMotion(playDeltas, testDeltas) 