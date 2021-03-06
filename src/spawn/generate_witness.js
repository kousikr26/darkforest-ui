// const wc = require("./witness_calculator.js");
import { builder as wc } from "./witness_calculator.js";
//const { readFileSync } = require("fs");

export default async function generateWitness(input) {
	const response = await fetch('spawn.wasm');
	const buffer = await response.arrayBuffer();
	//console.log(buffer);
	let buff;

	await wc(buffer).then(async witnessCalculator => {
		buff = await witnessCalculator.calculateWTNSBin(input, 0);
	});
	return buff;
}