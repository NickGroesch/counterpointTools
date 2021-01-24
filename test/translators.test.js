const { it, expect } = require("@jest/globals");
const Translators = require("../translators");
// STYLEGUIDE: use single quotes for javascript string values and 
// double to delimit console strings (that may contain such values)
describe("Translators", () => {
    describe("Should translate SCIENTIFIC PITCH strings to MIDINOTE numbers", () => {
        describe(".pitchClassToMidi (SCIENTIFIC) => MIDINOTE ", () => {
            it("should map 'C' to 0", () => {
                //arrange
                const pitchClass = 'C'
                //APPLY is what i call it (I guess I'm thinking in functions) but most call it ACT
                const midi = Translators.pitchClassToMidi(pitchClass)
                //assert
                expect(midi).toBe(0);
            });
        });
        describe(".pitchToMidi (SCIENTIFIC) => MIDINOTE", () => {
            it("should map 'C.4' to 60", () => {
                const pitch = 'C.4'
                const midi = Translators.pitchToMidi(pitch)
                expect(midi).toBe(60);
            });
        });
        describe(".pitchArrayToMidi ([]SCIENTIFIC) => []MIDINOTE", () => {
            it("should map ['C.4', 'D.4', 'E.4'] to [60 ,62 , 64]", () => {
                const pitches = ['C.4', 'D.4', 'E.4']
                const midis = Translators.pitchArrayToMidi(pitches)
                expect(midis).toEqual([60, 62, 64]);
            });
        });
    })
    describe(".transposeMidiArray ([]MIDINOTE) => []MIDINOTE", () => {
        it("should map [60 ,62 , 64] to [65, 67, 69]", () => {
            const inC = [60, 62, 64]
            const inF = Translators.transposeMidiArray(inC, 5)
            expect(inF).toEqual([65, 67, 69]);
        });
    });
    describe("Should translate from MIDINOTE numbers to SCIENTIFIC strings", () => {
        describe(".pitchClass (MIDINOTE, KEY) => SCIENTIFIC", () => { //TODO: these need work
            it("should map 60 in the key of C to 'C'", () => {
                const midinote = 60
                const key = "C"
                const sixtyInKeyOfC = Translators.pitchClass(midinote, key)
                expect(sixtyInKeyOfC).toEqual('C');
            });
            it("should map 60 in the key of A to 'Bs'", () => {
                const midinote = 60
                const key = "A"
                const sixtyInKeyOfA = Translators.pitchClass(midinote, key)
                expect(sixtyInKeyOfA).toEqual('Bs');
            });
        });
        describe(".evalPitch (MIDINOTE) => SCIENTIFIC", () => {
            it("should map 60  in the key of C to 'C.4'", () => {
                const midinote = 60
                const key = "C"
                const sixtyInKeyOfC = Translators.evalPitch(midinote, key)
                expect(sixtyInKeyOfC).toEqual('C.4');
            });
        });
        describe(".evalPitchArray ([]MIDINOTE) => []SCIENTIFIC", () => {
            it("should map [60, 62, 64, 66] in the key of C to ['C.4', 'D.4', 'E.4', 'Fs.4']", () => {
                const midinotes = [60, 62, 64, 66]
                const key = "G"
                const phraseInG = Translators.evalPitchArray(midinotes, key)
                expect(phraseInG).toEqual(['C.4', 'D.4', 'E.4', 'Fs.4']);
            });
        });
    })
    describe("Should allow us to work with both SCIENTIFIC and MIDINOTE representations concurrently as arrays of DUALS ", () => {
        describe(".formatDual ([]MIDINOTE, []SCIENTIFIC]) => []DUAL", () => {
            it("should zip [60, 62, 64, 66]  and ['C.4', 'D.4', 'E.4', 'Fs.4'] into an array of objects", () => {
                const midinotes = [60, 62, 64, 66]
                const dualsPhrase = Translators.formatDual(midinotes,
                    Translators.evalPitchArray(midinotes, "G"))
                expect(dualsPhrase).toEqual([
                    { midi: 60, pitch: 'C.4' },
                    { midi: 62, pitch: 'D.4' },
                    { midi: 64, pitch: 'E.4' },
                    { midi: 66, pitch: 'Fs.4' }]);
            });//TODO: revise descriptions above in light of new typology
        });
    })
    describe("Should provide a nuanced way to work with intervals, both simultaneously and successively ", () => {
        describe(".deltaIntervalArray []MIDINOTE => []DELTAS", () => {
            it("should take [60, 62, 64, 66] and return [2,2,2]", () => {
                const midinotes = [60, 62, 64, 66]
                const deltas = Translators.deltaIntervalArray(midinotes)
                expect(deltas).toEqual([2, 2, 2]);
                expect(deltas.length).toBe(midinotes.length - 1)
            });
        });
        describe(".pitchBase SCIENTIFIC => BASE7", () => { //TODO: add a base 7 type
            it("should take 'E.4' and return 30", () => {
                const scientific = 'E.4'
                const base7 = Translators.pitchBase(scientific)
                expect(base7 % 7).toBe(2);
                expect(base7).toBe(30);
            });
        });
        describe(".measureInter SCIENTIFIC => BASE7", () => { //TODO: add a base 7 type
            it(`should take [{ midi: 60, pitch: 'C.4' },{ midi: 62, pitch: 'D.4' }] and return ["asc", "maj", "second", 2]`, () => {
                const duals = [
                    { midi: 60, pitch: 'C.4' },
                    { midi: 62, pitch: 'D.4' }]
                const interval = Translators.measureInterval(...duals)
                expect(interval).toEqual(["asc", "maj", "second", 2]);
            });
        });
    })
})