const tests = require("./tests")
// given an analytical object, run the appropriate tests

// cantus only tests-- DO WE NEED MORE SPECIFICITY IN THE RETURN TO USE THE graphs.table?
const cantusFirmusSuite = anOb => {
    // result is boolean pass/fail, pass array of arrays, fail array of arrays
    // let result = [false, [], []]
    let keyComb = tests.keyComb(anOb.voices.duals[0].voice1, anOb.key)
    if (keyComb[0]) {
        let lengthCF = tests.lengthCF(anOb.voices.duals[0].voice1)
        if (lengthCF[0]) {
            let rangeCF = tests.rangeCF(anOb.voices.duals[0].voice1)
            if (rangeCF[0]) {
                let deltaRange = tests.deltaRange(anOb.voices.deltas[0].delta1)
                if (deltaRange[0]) {
                    let deltaDissLeaps = tests.deltaDissonantLeaps(anOb.voices.deltas[0].delta1)
                    if (deltaDissLeaps[0]) {
                        let dissOut = tests.dissonantOutlines(anOb.voices.duals[0].voice1, anOb.voices.deltas[0].delta1)
                        if (dissOut[0]) {
                            let noRep = tests.noRepetition(anOb.voices.duals[0].voice1)
                            if (noRep[0]) {
                                //     result[0] = true
                                //  result[2].push("cantusSuite passed")
                                return [true, "cantusSuite passed"]
                            } else { return noRep }
                        } else { return dissOut }
                    } else { return deltaDissLeaps }
                } else { return deltaRange }
            } else { return rangeCF }
        } else { return lengthCF }
    } else { return keyComb }
}

// full counterpoint tests -- WILL WE NEED TO MAKE A ROUGHLY EQUIVALENT testOB to the anOb?
// this first iteration will only run the relative tests, not the voice (cantus) tests
const counterpointSuite = anOb => {
    let testOb = { testResults: [] }
    // testing vertical intervals
    let duals = anOb.voices.duals
    let intervals = anOb.relations.intervals
    let motions = anOb.relations.motions
    intervals.forEach((value, index) => {
        let bass = false
        let obKey = Object.keys(value)[0]
        // check to see if interval contains the bass
        if (Object.keys(value)[0][9] == 1) { bass = true }
        if (bass) {
            console.log("bassFail")
            testOb.testResults.push({ [`vertDissBass${obKey}`]: tests.verticalDissonanceBass(intervals[index][obKey]) })
        }
        else {
            testOb.testResults.push({ [`vertDissUpper${obKey}`]: tests.verticalDissonanceUpper(intervals[index][obKey]) })
        }
    })
    console.log("after bass")
    // detect voice crossing
    for (let i = 0; i < duals.length - 1; i++) {
        testOb.testResults.push({ [`detectVoiceCrossing${i + 1}-${i + 2}`]: tests.detectVoiceCrossing(duals[i][`voice${i + 1}`], duals[i + 1][`voice${i + 2}`]) })
    }

    // detect unisons
    intervals.forEach((value, index) => {
        let obKey = Object.keys(value)[0]
        if (obKey[11] - obKey[9] == 1) {
            testOb.testResults.push({ [`detectUnisons${obKey}`]: tests.detectUnisons(intervals[index][obKey]) })
        }
    })
    // test vertSpaceRed
    intervals.forEach((value, index) => {
        let obKey = Object.keys(value)[0]
        if (obKey[11] - obKey[9] == 1) {
            testOb.testResults.push({ [`vertSpaceRed${obKey}`]: tests.verticalSpacingRed(intervals[index][obKey]) })
        }
    })
    // test vertSpaceYellow
    intervals.forEach((value, index) => {
        let obKey = Object.keys(value)[0]
        if (obKey[11] - obKey[9] == 1) {
            testOb.testResults.push({ [`vertSpaceYellow${obKey}`]: tests.verticalSpacingYellow(intervals[index][obKey]) })
        }
    })
    // parallel5or8--*motions&intervals
    motions.forEach((value, index) => {
        let intObKey = Object.keys(intervals[index])[0]
        let obKey = Object.keys(value)[0]
        console.log(intObKey, obKey)
        testOb.testResults.push({ [`parallel5or8${obKey}`]: tests.parallel5or8(intervals[index][intObKey], motions[index][obKey]) })
    })
    // direct5or8--*motions&intervals
    motions.forEach((value, index) => {
        let intObKey = Object.keys(intervals[index])[0]
        let obKey = Object.keys(value)[0]
        // console.log(intObKey, obKey)
        testOb.testResults.push({ [`direct5or8${obKey}`]: tests.direct5or8(intervals[index][intObKey], motions[index][obKey]) })
    })
    //independenceRed--motions
    motions.forEach((value, index) => {
        let obKey = Object.keys(value)[0]
        testOb.testResults.push({ [`independenceRed${obKey}`]: tests.independenceRed(motions[index][obKey]) })
    })
    //independenceYellow--motions
    motions.forEach((value, index) => {
        let obKey = Object.keys(value)[0]
        testOb.testResults.push({ [`independenceYellow${obKey}`]: tests.independenceYellow(motions[index][obKey]) })
    })
    return testOb
}
const quickSuite = anOb => {
    // naming conventions
    let duals = anOb.voices.duals
    // console.log("yyy", duals)
    let deltas = anOb.voices.deltas
    let intervals = anOb.relations.intervals
    let motions = anOb.relations.motions
    // first lets run the one dimensional tests
    for (let p = 0; p < duals.length; p++) {
        // console.log("qSa", p, duals)
        // console.log("qS", p, duals[p])
        // console.log("qSx", duals[p][`voice${p + 1}`])
        if (!tests.keyComb(duals[p][`voice${p + 1}`], anOb.key)[0]) {
            return false
        }
        // console.log("KC")
        // if(tests.lengthCF(anOb.voices.duals[0].voice1)//this will return false negatives
        if (!tests.rangeCF(duals[p][`voice${p + 1}`])[0]) {
            return false
        }
        // console.log("RCF")
        if (deltas.length > 1) {
            if (!tests.deltaRange(deltas[p][`delta${p + 1}`])[0]) {
                return false
            }
            // console.log("DR")
            if (!tests.deltaDissonantLeaps(deltas[p][`delta${p + 1}`])[0]) {
                return false
            }
        }
        // console.log("DDL")

        // if (!tests.dissonantOutlines(duals[i][`voice${i + 1}`], deltas[i][`delta${i + 1}`])[0]) { return false }//this one is premature,must only run at last time
        if (!tests.noRepetition(duals[p][`voice${p + 1}`])[0]) {
            return false
        }
        // console.log("NR")

    }
    // testing vertical intervals

    // intervals.forEach((value, index) => {// TODO refactor to for loop
    for (let p = 0; p < intervals.length; p++) {
        let bass = false
        let obKey = Object.keys(intervals[p])[0]
        // check to see if interval contains the bass
        if (Object.keys(intervals[p])[0][9] == 1) { bass = true }
        if (bass) {
            // console.log("bassFail")
            if (!tests.verticalDissonanceBass(intervals[p][obKey])[0]) { return false }
        }
        else {
            if (!tests.verticalDissonanceUpper(intervals[p][obKey])[0]) { return false }
        }
    }
    // console.log("after bass")
    // detect voice crossing
    for (let p = 0; p < duals.length - 1; p++) {
        if (!tests.detectVoiceCrossing(duals[p][`voice${p + 1}`], duals[p + 1][`voice${p + 2}`])[0]) { return false }
    }

    // detect unisons
    // intervals.forEach((value, index) => {// TODO refactor to for loop
    for (let p = 0; p < intervals.length; p++) {
        let obKey = Object.keys(intervals[p])[0]
        if (obKey[11] - obKey[9] == 1) {
            if (!tests.detectUnisons(intervals[p][obKey])[0]) { return false }
        }
    }
    // test vertSpaceRed
    // intervals.forEach((value, index) => {
    //     let obKey = Object.keys(value)[0]
    //     if (obKey[11] - obKey[9] == 1) {
    //         if (!tests.verticalSpacingRed(intervals[index][obKey])[0]) { return false }
    //     }
    // })
    // test vertSpaceYellow
    // intervals.forEach((value, index) => {// TODO refactor to for loop
    for (let p = 0; p < intervals.length; p++) {
        let obKey = Object.keys(intervals[p])[0]
        if (obKey[11] - obKey[9] == 1) {
            if (!tests.verticalSpacingYellow(intervals[p][obKey])[0]) { return false }
        }
    }
    // parallel5or8--*motions&intervals
    // motions.forEach((value, index) => {// TODO refactor to for loop
    for (let p = 0; p < motions.length; p++) {
        let intObKey = Object.keys(intervals[p])[0]
        let obKey = Object.keys(motions[p])[0]
        //TODO// console.log(tests.parallel5or8(intervals[p][intObKey], motions[p][obKey])[0])
        //TODO// console.log(tests.parallel5or8(intervals[p][intObKey], motions[p][obKey]))
        if (!tests.parallel5or8(intervals[p][intObKey], motions[p][obKey])[0]) { return false }
    }
    // direct5or8--*motions&intervals
    // motions.forEach((value, index) => {
    //     let intObKey = Object.keys(intervals[index])[0]
    //     let obKey = Object.keys(value)[0]
    //     // console.log(intObKey, obKey)
    //     if (!tests.direct5or8(intervals[index][intObKey], motions[index][obKey])[0]) { return false }
    // })
    //independenceRed--motions
    // motions.forEach((value, index) => {
    //     let obKey = Object.keys(value)[0]
    //     if (!tests.independenceRed(motions[index][obKey])[0]) { return false }
    // })
    //independenceYellow--motions
    // motions.forEach((value, index) => {// TODO refactor to for loop
    for (let p = 0; p < motions.length; p++) {
        let obKey = Object.keys(motions[p])[0]
        if (!tests.independenceYellow(motions[p][obKey])[0]) { return false }
    }
    return true
}

const testSuites = {
    cantusFirmusSuite,
    counterpointSuite,
    quickSuite
}
module.exports = testSuites