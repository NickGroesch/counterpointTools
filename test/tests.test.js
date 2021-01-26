const Tests = require("../tests");

describe("Counterpoint Tests", () => {
    describe("Should test for notes out of the key", () => {
        describe(".keyComb ([]DUAL,KEY) => TESTRES ", () => {
            it("should pass if notes are in the key", () => {
                const passingPitches = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 71, pitch: 'B.4' },
                    { midi: 73, pitch: 'Cs.5' },
                    { midi: 75, pitch: 'Ds.5' }
                ]
                const key = "E"
                const result = Tests.keyComb(passingPitches, key)
                expect(result).toEqual([true, "pass key comb", []]);
            });
            it("should return notes outside the key when it fails", () => {
                const allChromatics = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 65, pitch: 'Es.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 67, pitch: 'Fss.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 70, pitch: 'As.4' },
                    { midi: 71, pitch: 'B.4' },
                    { midi: 72, pitch: 'Bs.5' },
                    { midi: 73, pitch: 'Cs.5' },
                    { midi: 74, pitch: 'D.5' },
                    { midi: 75, pitch: 'Ds.5' }
                ]
                const key = "E"
                const result = Tests.keyComb(allChromatics, key)
                expect(result).toEqual([false, ["key comb fail position 1",
                    "key comb fail position 3",
                    "key comb fail position 6",
                    "key comb fail position 8",
                    "key comb fail position 10",], [1, 3, 6, 8, 10]]);
            });
        });
        describe(".lengthCF ([]DUAL)=> TESTRES", () => {
            it("should fail when too long", () => {
                const tooManyDuals = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 65, pitch: 'Es.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 67, pitch: 'Fss.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 70, pitch: 'As.4' },
                    { midi: 71, pitch: 'B.4' },
                    { midi: 72, pitch: 'Bs.5' },
                    { midi: 73, pitch: 'Cs.5' },
                    { midi: 74, pitch: 'D.5' },
                    { midi: 75, pitch: 'Ds.5' },
                    { midi: 76, pitch: 'E.5' },
                    { midi: 77, pitch: 'Es.5' },
                    { midi: 78, pitch: 'Fs.5' },
                    { midi: 79, pitch: 'Fss.5' },
                    { midi: 80, pitch: 'Gs.5' }
                ]
                const result = Tests.lengthCF(tooManyDuals)
                expect(result).toEqual([false, "CF Length must be between 8-16 notes"])
            })
            it("should fail when too short", () => {
                const tooFewDuals = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 65, pitch: 'Es.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 67, pitch: 'Fss.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 70, pitch: 'As.4' },
                ]
                const result = Tests.lengthCF(tooFewDuals)
                expect(result).toEqual([false, "CF Length must be between 8-16 notes"])
            })
            it("should pass when not too long ", () => {
                const manyDuals = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 65, pitch: 'Es.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 67, pitch: 'Fss.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 70, pitch: 'As.4' },
                    { midi: 71, pitch: 'B.4' },
                    { midi: 72, pitch: 'Bs.5' },
                    { midi: 73, pitch: 'Cs.5' },
                    { midi: 74, pitch: 'D.5' },
                    { midi: 75, pitch: 'Ds.5' },
                    { midi: 76, pitch: 'E.5' },
                    { midi: 77, pitch: 'Es.5' },
                    { midi: 78, pitch: 'Fs.5' },
                    { midi: 79, pitch: 'Fss.5' },
                ]
                const result = Tests.lengthCF(manyDuals)
                expect(result).toEqual([true, "pass: length"])
            })
            it("should pass when not too short ", () => {
                const fewDuals = [
                    { midi: 64, pitch: 'E.4' },
                    { midi: 65, pitch: 'Es.4' },
                    { midi: 66, pitch: 'Fs.4' },
                    { midi: 67, pitch: 'Fss.4' },
                    { midi: 68, pitch: 'Gs.4' },
                    { midi: 69, pitch: 'A.4' },
                    { midi: 70, pitch: 'As.4' },
                    { midi: 71, pitch: 'B.4' },
                ]
                const result = Tests.lengthCF(fewDuals)
                expect(result).toEqual([true, "pass: length"])
            })
        })
        describe(".deltaRange ([]INTERVAL)=>TESTRES", () => { //TODO: replace stubs
            it("should pass voices that don't move more than an octace at a time", () => {
                const passStubs = [
                    ["", "", "", [12]],
                    ["", "", "", [0]],
                    ["", "", "", [-12]]
                ]
                const result = Tests.deltaRange(passStubs)
                expect(result).toEqual([true, ["pass: all deltas within octave"], []])
            })
            it("should fail voices that move more than an octace at a time", () => {
                const passStubs = [
                    ["", "", "", [13]],
                    ["", "", "", [0]],
                    ["", "", "", [-13]]
                ]
                const result = Tests.deltaRange(passStubs)
                expect(result).toEqual([false, [`delta 0 greater than octave`, `delta 2 greater than octave`], [0, 2]])
            })
        })
    });
});