/* global BigInt */

// import { generateWitness } from "./generate_witness.js";
import { groth16 } from "snarkjs";
import generateWitness from "./generate_witness.js";

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

export async function moveCalldata(x, y, prevX, prevY) {
    // TODO set prevX and prevY to the previous position of the player
    const input = {"prevX": prevX, "prevY": prevY, "x": x, "y": y}


    let generateWitnessSuccess = true;

    //console.log(generateWitness);

    let witness = await generateWitness(input).then()
        .catch((error) => {
            console.error(error);
            generateWitnessSuccess = false;
        });
    
    //console.log(witness);

    if (!generateWitnessSuccess) { return; }

    const { proof, publicSignals } = await groth16.prove('move_0001.zkey', witness);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

    const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    return [a, b, c, Input];
}