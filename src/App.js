import './App.css';
import PositionForm from "./positionForm"
import { useEffect, useState } from 'react';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Sky from 'react-sky';
import { Typography } from '@mui/material';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';



var planet1 = require('./assets/planet1.png');
var planet2 = require('./assets/planet2.png');
var planet3 = require('./assets/planet3.png');
var planet4 = require('./assets/planet4.png');


function App() {
  const chainID = 1666600000; 

  const [currentAccount, setCurrentAccount] = useState(null);
  const [correctChain, setCorrectChain] = useState(null);
  const [alertText, setAlertText] = useState(null);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      // alert("Make sure you have Metamask installed!");
      setAlertText("Please install Metamask to play.");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Metamask not found.");
    }
    else{
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (err) {
        console.log(err)
      }
    }
    
  }

  const connectWalletButton = () => {
    return (
      <div>
      {alertText ? <Alert  align="center" style = {{margin:'auto', width:300 }} variant="filled" severity="warning"> 
        {alertText}
                          </Alert>
                          : null}
      <Button style={{margin:50}} onClick={connectWalletHandler} variant="contained">
        Connect Wallet
      </Button>
      
      </div>
    )
  }
  const background = () => {
    return (
        <div>
          <Typography variant="h1" component="h2" sx = {{ color:'white' }}>
        Dark Forest
      </Typography>;
      <Sky
        images={{
          0: planet1, 
          1: planet2,
          2: planet3,
          3: planet4

        }}
        how={50} /* Pass the number of images Sky will render chosing randomly */
        time={40} /* time of animation */
        size={'50px'} /* size of the rendered images */
        background={'black'} /* color of background */
      />
      </div>
      )
  }

  const checkChainId = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Chain ID:", chainId, parseInt(chainId));
    setCorrectChain(parseInt(chainId) == chainID);
    if (parseInt(chainId) != chainID) {
      setAlertText(`Please make sure you are connected to the correct network (Chain ID: ${chainID}) in MetaMask.`);
    }
  }

  useEffect(() => {
    checkWalletIsConnected();
    checkChainId();
  }, [])

  return (

    <div className="App">
      <div>
        { (currentAccount && correctChain) ? <PositionForm /> 
                      : <div> {background()}  {connectWalletButton()} </div>}
      </div>
    </div>

  );
}

export default App;
