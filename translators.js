// To maximize tonal functionality when translating chromatics into pitch classes we adopt the convention that
// relative to a minor key we will include b2, #4, #7, #3, #6 //TODO: should #3 be #2?
// relative to a major key we will include b7, #1, #2, #4, #5
// which allows for maximum use of secondary dominants and mixture of major mode into minor

// object maps scientific pitch classes to midi mod 12 (by Key is not necessary)
const pitchClassMidi = {
    C: 0,
    Cb: 11,
    Cbb: 10,
    Cs: 1,
    Css: 2,
    D: 2,
    Db: 1,
    Dbb: 0,
    Ds: 3,
    Dss: 4,
    E: 4,
    Eb: 3,
    Ebb: 2,
    Es: 5,
    Ess: 6,
    F: 5,
    Fs: 6,
    Fss: 7,
    Fb: 4,
    Fbb: 3,
    G: 7,
    Gb: 6,
    Gbb: 5,
    Gs: 8,
    Gss: 9,
    A: 9,
    Ab: 8,
    Abb: 7,
    As: 10,
    Ass: 11,
    B: 11,
    Bs: 0,
    Bss: 1,
    Bb: 10,
    Bbb: 9
};

// Object maps midi note values mod12 to their pitch class equivalents by key
const midiPitchClass = { //TODO:this might need to be rethought, some seem wrong according to line2,3
    Fb: ["C", "Db", "Ebb", "Eb", "Fb", "F", "Gb", "G", "Ab", "Bbb", "Bb", "Cb"],
    Cb: ["C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "Bbb", "Bb", "Cb"],
    Gb: ["C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"],
    Db: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"],
    Ab: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    Eb: ["C", "Db", "D", "Eb", "E", "F", "Fs", "G", "Ab", "A", "Bb", "B"],
    Bb: ["C", "Cs", "D", "Eb", "E", "F", "Fs", "G", "Ab", "A", "Bb", "B"],
    F: ["C", "Cs", "D", "Eb", "E", "F", "Fs", "G", "Gs", "A", "Bb", "B"],
    C: ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "Bb", "B"],
    G: ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"],
    D: ["C", "Cs", "D", "Ds", "E", "Es", "Fs", "G", "Gs", "A", "As", "B"],
    A: ["Bs", "Cs", "D", "Ds", "E", "Es", "Fs", "G", "Gs", "A", "As", "B"],
    E: ["Bs", "Cs", "D", "Ds", "E", "Es", "Fs", "Fss", "Gs", "A", "As", "B"],
    B: ["Bs", "Cs", "Css", "Ds", "E", "Es", "Fs", "Fss", "Gs", "A", "As", "B"],
    Fs: ["Bs", "Cs", "Css", "Ds", "E", "Es", "Fs", "Fss", "Gs", "Gss", "As", "B"],
    Cs: [
        "Bs",
        "Cs",
        "Css",
        "Ds",
        "Dss",
        "Es",
        "Fs",
        "Fss",
        "Gs",
        "Gss",
        "As",
        "B"
    ],
    Gs: [
        "Bs",
        "Cs",
        "Css",
        "Ds",
        "Dss",
        "Es",
        "Fs",
        "Fss",
        "Gs",
        "Gss",
        "As",
        "Ass"
    ]
};

// We will require translators between midi note values and scientific pitch notation, as well as scientific pitch to lilypond

// //transposes a midi array (returns midi array)
const transposeMidiArray = (inputArray, semitones) => inputArray.map(note => parseInt(note) + parseInt(semitones));

// //converts pitch class to midi note value
const pitchClassToMidi = pitchClass => pitchClassMidi[pitchClass]

// converts a scientificly notated pitch to midi
const pitchToMidi = pitch => {
    let x = pitch.split(".");
    return pitchClassToMidi(x[0]) + 12 * (parseInt(x[1]) + 1);
};

// // converts a pitch array to midi array
const pitchArrayToMidi = pitchArray => pitchArray.map(pitch => pitchToMidi(pitch))

//// converts a midi note to it's pitch class in a given key
const pitchClass = (noteIn, key) => midiPitchClass[key][noteIn % 12];

// //   converts a midi note to it's scientific pitch
const evalPitch = (noteIn, key) => { return `${pitchClass(noteIn, key)}.${Math.floor(noteIn / 12) - 1}` }

// // converts midi to scientific pitch
const evalPitchArray = (midiArray, key) => midiArray.map(pitch => evalPitch(pitch, key))

// // we want to work with our data in dual form, both scientific pitch and midi concurrently
const formatDual = (midiArray, pitchArray) => midiArray.map((mv, i) => { return { midi: mv, pitch: pitchArray[i] } })
const formatDualFromMidi = (midiArray, key) => formatDual(midiArray, evalPitchArray(midiArray, key))
const formatDualFromScientific = scientificArray => formatDual(pitchArrayToMidi(scientificArray), scientificArray)

const deltaIntervalArray = midiArray => {//THIS IS ACTUALLY ONLY BEING USED TO MEASURE 2unit ( or `twunit`) lists, but it is extensible
    let deltaArray = [];
    for (let i = 0; i + 1 < midiArray.length; i++) {
        let midiDelta = parseInt(midiArray[i + 1]) - parseInt(midiArray[i]);
        deltaArray.push(midiDelta);
    }
    return deltaArray;
};
const deltaInterval = (firstMidi, secondMidi) => parseInt(secondMidi) - parseInt(firstMidi)

// to measure intervals we need to assess them in base7
const pitchBase = scientific => {
    let x = scientific.split(".");
    let letter = x[0].split("")[0];
    let octave = x[1];
    let pitchMap = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    let base = pitchMap[letter] + 7 * octave;
    return base;
};
// we need to be able to measure an interval in both midi and scientific pitch (for simultaneous firstDual is lower pitch)
const measureInterval = (firstDual, secondDual) => {//THIS OUTPUT IS UGLY
    let pitchDiff = pitchBase(secondDual.pitch) - pitchBase(firstDual.pitch);
    let prefix = "";
    let intervalMap = [
        "unison",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "octave",
        "ninth",
        "tenth"
    ];
    if (pitchDiff > 0) {
        prefix = "asc";
    }
    if (pitchDiff < 0) {
        prefix = "desc";
        pitchDiff = Math.abs(pitchDiff);
    }
    // presently considering allowing the intervals up to tenth, even though octave is a compound unison, etc.
    if (pitchDiff > 9) {
        prefix += " comp";
        pitchDiff = pitchDiff % 7;
    }
    let midiDiff = deltaInterval(firstDual.midi, secondDual.midi)
    let quality = {
        unison: { 0: "perf", 1: "aug", 11: "dim" },
        second: { 0: "dim", 1: "min", 2: "maj", 3: "aug" },
        third: { 4: "maj", 3: "min", 2: "dim", 5: "aug" },
        fourth: { 5: "perf", 4: "dim", 6: "aug" },
        fifth: { 7: "perf", 8: "aug", 6: "dim" },
        sixth: { 9: "maj", 8: "min", 7: "dim", 10: "aug" },
        seventh: { 11: "maj", 10: "min", 9: "dim", 0: "aug" },
        octave: { 0: "perf", 1: "aug", 11: "dim" },
        ninth: { 0: "dim", 1: "min", 2: "maj", 3: "aug" },
        tenth: { 4: "maj", 3: "min", 2: "dim", 5: "aug" }
    };
    let tempMidiDiff = midiDiff;
    if (midiDiff < 0) {
        midiDiff = Math.abs(midiDiff);
    }
    if (midiDiff > 11) {
        midiDiff = midiDiff % 12;
    }
    let interval = intervalMap[pitchDiff];
    //   return prefix, quality[interval][midiDiff], interval;
    return [prefix, quality[interval][midiDiff], interval, tempMidiDiff];
};

const deltaDual = dualArray => {
    let dualDeltaArray = [];
    for (let i = 0; i + 1 < dualArray.length; i++) {
        let value = measureInterval(dualArray[i], dualArray[i + 1]);
        dualDeltaArray.push(value);
    }
    return dualDeltaArray;
};

// *
const intervalCompare = (dualArray1, dualArray2) => {
    let shorterArray = dualArray1.length >= dualArray2.length ? dualArray2 : dualArray1
    let intervalArray = [];
    shorterArray.forEach((note, index) => {
        let interval = measureInterval(dualArray1[index], dualArray2[index]);
        intervalArray.push(interval);
    });
    return intervalArray;
};
//*
const assessMotion = (deltasArray1, deltasArray2) => {
    let shorterArray = deltasArray1.length <= deltasArray2.length ? deltasArray1 : deltasArray2

    let motionArray = []
    shorterArray.forEach((delta, index) => {
        let motion = "yet undefined"
        // console.log(`arr1[${index}]`, delta[3])
        // console.log("arr2", deltasArray2[index][3])
        // TOMS crazy conditional, why doesit work?????????????? DO I WANT IT??????????//NO WAY
        // console.log('this is the index', index)
        // if (index < 2) {
        // console.log('do we have this arrayyyyyyyy', deltasArray1)
        let move1 = deltasArray1[index][3]
        let move2 = deltasArray2[index][3]
        if (move1 === 0 && move2 === 0) {
            motion = "Not Motion"
        } else if (move1 == 0 || move2 == 0) {
            motion = "oblique"
        } else if ((move1 > 0 && move2 < 0) || move1 < 0 && move2 > 0) {
            motion = "contrary"
        } else {
            // both similar and parallel
            let interval1 = delta[2]
            let interval2 = deltasArray2[index][2]
            // console.log(interval1)
            // console.log(interval2)
            if (interval1 === interval2) {
                motion = "parallel"
            } else {
                motion = "similar"
            }
        }
        motionArray.push(motion)
        // }
    })
    return motionArray
}
// keySignature needs to convey information about both the key signature and the unaltered pitches
// abc notation makes this a mess compared to lilypond
// double sharps and flats will not yet be supported for MVP
const keySignature = {
    C: [[], ["A", "B", "C", "D", "E", "F", "G"]],
    G: [["Fs"], ["C", "G", "D", "A", "E", "B"]],
    D: [["Fs", "Cs"], ["G", "D", "A", "E", "B"]],
    A: [["Fs", "Cs", "Gs"], ["D", "A", "E", "B"]],
    E: [["Fs", "Cs", "Gs", "Ds"], ["A", "E", "B"]],
    B: [["Fs", "Cs", "Gs", "Ds", "As"], ["E", "B"]],
    Fs: [["Fs", "Cs", "Gs", "Ds", "As", "Es"], ["B"]],
    Cs: [["Fs", "Cs", "Gs", "Ds", "As", "Es", "Bs"], []],
    F: [["Bb"], ["E", "A", "D", "G", "C", "F"]],
    Bb: [["Bb", "Eb"], ["A", "D", "G", "C", "F"]],
    Eb: [["Bb", "Eb", "Ab"], ["D", "G", "C", "F"]],
    Ab: [["Bb", "Eb", "Ab", "Db"], ["G", "C", "F"]],
    Db: [["Bb", "Eb", "Ab", "Db", "Gb"], ["C", "F"]],
    Gb: [["Bb", "Eb", "Ab", "Db", "Gb", "Cb"], ["F"]],
    Cb: [["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"], []]
}
// this function is so named because abc notation format removes musically significant information
const stupifier = (sciPitch, keySign) => {
    // console.log("trans", sciPitch)
    let abc = sciPitch.split(".")
    // we remove the accidentals in the key signature if the note belongs to kS[kS][0]
    if (keySignature[keySign][0].indexOf(abc[0]) >= 0) {
        abc[0] = abc[0].substring(0, 1)
        //if it is a normal natural it belongs to kS[kS][1], else we'll pass it on to render an accidental
    } else if (keySignature[keySign][1].indexOf(abc[0]// HOW CONDITION?
    )) {
        // WHAT DO WE DO HERE?
    }
    const octaveAdjust = [",,,,", ",,,", ",,", ",", "", "'", "''", "'''", "''''", "'''''"]
    let abcReturn = abc[0].concat(octaveAdjust[parseInt(abc[1])])
    return abcReturn
}

const abcify = (dualsArray, keySign) => dualsArray.map(dual => stupifier(dual.pitch, keySign))

const translators = {
    midiPitchClass,
    pitchClassMidi,
    transposeMidiArray,
    pitchClassToMidi,
    pitchToMidi,
    pitchClass,
    pitchArrayToMidi,
    evalPitch,
    evalPitchArray,
    formatDual,
    formatDualFromMidi,
    formatDualFromScientific,
    deltaIntervalArray,
    deltaInterval,
    pitchBase,
    deltaDual,
    measureInterval,
    intervalCompare,
    assessMotion,
    keySignature,
    stupifier,
    abcify
};
// WE NEED THIS ON EXCEPT FOR TESTS
module.exports = translators;
