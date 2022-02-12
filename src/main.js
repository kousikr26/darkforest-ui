import { ethers } from "ethers";
import { spawnCalldata } from './spawn/spawn';
import { moveCalldata } from './move/move';
import address from './address.json'
import darkForestArtifact from './artifacts/DarkForest.json'
import {mimcHash} from "@darkforest_eth/hashing";

let darkForest;

export async function connectDarkForest() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    console.log('signer: ', await signer.getAddress());

    darkForest = new ethers.Contract(address['DarkForest'], darkForestArtifact.abi, signer);
    // darkForest.on("Spawn", (from, to, event) => {
    //     console.log({
    //         from: from,
    //         to: to,
    //         data: event
    //     });
    // });
    console.log("Connect to Dark Forest Contract:", darkForest);
}

export async function spawnPosition(x, y) {

    let calldata = await spawnCalldata(x, y);

    if (!calldata) { return [-1,"Invalid inputs to generate witness. Spawn location needs to be greater than 32 and less than 1024 units from origin."]; }

    //console.log(calldata[3]);

    let errorMsg;
    console.log(calldata);
    let spawnTxn = await darkForest.spawn_player(calldata[0], calldata[1], calldata[2], calldata[3])
        .catch((error) => {
            console.log(error);
            if (typeof error.data === 'undefined'){
                errorMsg = error.message;
                return 0;    
            }
            errorMsg = error.data.message;
            return 0;
        });

    console.log("transaction: ", spawnTxn);
    console.log("error: ", errorMsg);

    if (spawnTxn) {
        await spawnTxn.wait();
        return [1, `Spawn transaction confirmed: ${spawnTxn.hash}`];
    }

    return [-1,errorMsg];

}

export async function movePosition(x, y, prevX, prevY, resource) {

    let calldata = await (await moveCalldata(x, y, prevX, prevY));

    if (!calldata) { return [-1, "Invalid inputs to generate witness. Only moves within 2048 units distance from origin and displacement < 16 units are allowed."]; }

    //console.log(calldata[3]);
    let resources = resource;
    let errorMsg;
    console.log(calldata);
    let moveTxn = await darkForest.move_player(calldata[0], calldata[1], calldata[2], calldata[3], resources)
        .catch((error) => {
            console.log(error);
            if (typeof error.data === 'undefined'){
                errorMsg = error.message;
                return 0;    
            }
            errorMsg = error.data.message;
            return 0;
        });

    console.log("transaction: ", moveTxn);
    console.log("error: ", errorMsg);

    if (moveTxn) {
        await moveTxn.wait();
        // let leaderboard = await darkForest.get_leaderboard();
        // console.log("leaderboard: ", leaderboard);

        return [1,`Move transaction confirmed: ${moveTxn.hash}`];
    }
    
    return [-1,errorMsg];

}

export async function getLeaderboard(){
    let leaderboard = await darkForest.get_leaderboard();
    return leaderboard;
}
export async function mineLocation(x, y){
    let location_hash = (mimcHash(0)(x,y)).toString();

    console.log(location_hash);
    let errorMsg;
    let planet_details = await darkForest.get_planet_details(location_hash).catch((error) => {
        console.log(error);
        errorMsg = error.data.message;
    });
    console.log(planet_details);
    return planet_details;

}