import React from 'react';
import Box from '@mui/material/Box';
import { spawnPosition } from './main'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TimelineIcon from '@mui/icons-material/Timeline';
import Divider from '@mui/material/Divider';
import { movePosition, mineLocation, getLeaderboard } from './main';
import { connectDarkForest } from './main'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { spacing } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sky from 'react-sky';


var planet0 = require('./assets/planet0.png');
var planet1 = require('./assets/planet1.png');
  var planet2 = require('./assets/planet2.png');
  var planet3 = require('./assets/planet3.png');
  var planet4 = require('./assets/planet4.png');
var planets = [planet0, planet1, planet2, planet3, planet4];
var levels = ['I', 'II', 'III', 'IV'];

class PositionForm extends React.Component {
    constructor(props) {
        connectDarkForest();
        super(props);
        this.state = { curX: JSON.parse(localStorage.getItem('curX')) || '', curY:JSON.parse(localStorage.getItem('curY')) || '',
                        x: '', y: '', resource:'',
                        txnList:JSON.parse(localStorage.getItem('txnList')) || [],
                        showCard: false, planetimgLoc:0, moveloading:false,
                        collectedResources:JSON.parse(localStorage.getItem('collectedResources')) || 0, leaderboard:[]};
        this.toastId = React.createRef();
        this.handleChangeX = this.handleChangeX.bind(this);
        this.handleChangeY = this.handleChangeY.bind(this);
        this.handleChangePrevX = this.handleChangePrevX.bind(this);
        this.handleChangePrevY = this.handleChangePrevY.bind(this);
        this.handleChangeResource = this.handleChangeResource.bind(this);
        this.handleSpawn = this.handleSpawn.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleMine = this.handleMine.bind(this);
        this.updateLeaderboard = this.updateLeaderboard.bind(this);
        
    }

    handleChangeX(event) {
        this.setState({ x: event.target.value });
    }

    handleChangeY(event) {
        this.setState({ y: event.target.value });
    }
    handleChangePrevX(event) {
        this.setState({ curX: event.target.value });
    }

    handleChangePrevY(event) {
        this.setState({ curY: event.target.value });
    }
    handleChangeResource(event) {
        this.setState({ resource: event.target.value });
    }
    handleSpawn = async event => {
        //alert('Position was submitted: (' + this.state.x + ',' + this.state.y + ')');
        this.setState({moveloading:true});
        this.toastId.current = toast.info("Processing spawn transaction...", {position: "top-left", autoClose:false});
        console.log('Spawn was submitted: (' + this.state.x + ',' + this.state.y + ')');
        event.preventDefault();
        let [responseCode, response] = await spawnPosition(parseInt(this.state.x), parseInt(this.state.y));
        // let [responseCode, response] = [1, "Spawn transaction confirmed: 0x0"]; // TODO: Remove this line
        if (responseCode === 1) {
            this.setState({ curX: this.state.x, curY: this.state.y }, () => {localStorage.setItem('curX', JSON.stringify(this.state.curX)); localStorage.setItem('curY', JSON.stringify(this.state.curY))});
            this.setState(prevState => ({
                txnList: [...prevState.txnList, {txnX: this.state.x, txnY:this.state.y, txnType:'Spawn', txnStatus:'Success'}]
            }), () => {localStorage.setItem('txnList', JSON.stringify(this.state.txnList))});   
            toast.update(this.toastId.current, {type:toast.TYPE.SUCCESS, position: "top-left", autoClose:5000, render: "Move Successful"});
        }
        else{
            this.setState(prevState => ({
                txnList: [...prevState.txnList, {txnX: this.state.x, txnY:this.state.y, txnType:'Spawn', txnStatus:'Failed'}]
            }), () => {localStorage.setItem('txnList', JSON.stringify(this.state.txnList))})
            toast.update(this.toastId.current, {type:toast.TYPE.ERROR, position: "top-left", autoClose:5000, render: "Move Failed - "+response});
        }
        console.log("response: ", response);
        event.preventDefault();
        this.setState({moveloading:false});
    }
    handleMove = async event => {
        //alert('Position was submitted: (' + this.state.x + ',' + this.state.y + ')');
        this.setState({moveloading:true});
        this.toastId.current = toast.info("Processing move transaction...", {position: "top-left", autoClose:false});
        console.log('Move was submitted: (' + this.state.x + ',' + this.state.y + ') (' + this.state.curX + ',' + this.state.curY + ' ) '+this.state.resource);
        event.preventDefault();
        let [responseCode, response] = await movePosition(parseInt(this.state.x), parseInt(this.state.y), parseInt(this.state.curX), parseInt(this.state.curY), parseInt(this.state.resource));
        let [newX, newY] = [this.state.x, this.state.y];

        
        if (responseCode === 1) {
            this.setState({ curX: newX, curY: newY, collectedResources: this.state.collectedResources + parseInt(this.state.resource) }, () => {localStorage.setItem('curX', JSON.stringify(this.state.curX));
                                                                                                                                                localStorage.setItem('curY', JSON.stringify(this.state.curY));
                                                                                                                                                localStorage.setItem('collectedResources', JSON.stringify(this.state.collectedResources))});
            this.setState(prevState => ({
                txnList: [...prevState.txnList, {txnX: newX, txnY:newY, txnType:'Move', txnStatus:'Success'}]
            }), () => {localStorage.setItem('txnList', JSON.stringify(this.state.txnList))})
            toast.update(this.toastId.current, {type:toast.TYPE.SUCCESS, position: "top-left", autoClose:5000, render: "Move Successful"});
        }
        else{
            this.setState(prevState => ({
                txnList: [...prevState.txnList, {txnX: newX, txnY:newY, txnType:'Move', txnStatus:'Failed'}]
            }), () => {localStorage.setItem('txnList', JSON.stringify(this.state.txnList))})
            toast.update(this.toastId.current, {type:toast.TYPE.ERROR, position: "top-left", autoClose:5000, render: "Move Failed: "+response});
        }
        
        console.log("response: ", response);
        event.preventDefault();
        this.setState({moveloading:false});
    }
    handleMine = async event => {
        console.log("Mining location: ", this.state.x, this.state.y);
        event.preventDefault();
        let response = await mineLocation(parseInt(this.state.x), parseInt(this.state.y));
        console.log("response: ", response);
        if(!response[0]){
            this.setState({ showCard: true, planetimgLoc:0 });
        }
        else{
            this.setState({ showCard: true, planetimgLoc:parseInt(response[1].toString())+1 });
        }
    }
    updateLeaderboard = async event => {

        let leaderboard = await getLeaderboard();
        console.log(leaderboard);
        let newLeaderboard =[];
        if (typeof leaderboard !== 'undefined') {
            for(let i=0; i<leaderboard.length;i+=2){
                if (leaderboard[i+1]>0){

                    newLeaderboard = [...newLeaderboard, {pid:leaderboard[i].toString(), res:leaderboard[i+1].toString()}];
                }
            }
        }
        console.log("newLeaderboard",   newLeaderboard);
        this.setState({ leaderboard: newLeaderboard });
        
    }
    render() {
        return (
            <div>
            <Typography variant="h3" component="h3" sx = {{ color:'black' }}>
                Dark Forest
             </Typography>
             <div style={{padding:30}}> </div>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />

                <ToastContainer />
                    <Box sx={{ flexGrow: 1 }}>
                    <Grid container rowSpacing={10} columnSpacing={2}>
                        <Grid item xs={3}>
                        <Typography gutterBottom variant="h5" component="span" align='left'> Resources collected:  </Typography>
                        
                        <Typography gutterBottom variant="h4" component="span" align='left' style={{color:'green'}}>{this.state.collectedResources}  </Typography>
                        
                        <div  style={{ padding: 70 }} ></div>
                        <Button variant="outlined" color="info" onClick={this.updateLeaderboard}> Update Leaderboard </Button>
                        <div  style={{ padding: 10 }} ></div>
                        {this.state.leaderboard.length>0 &&
                            <Box component ="span" sx={{display:'flex', flexDirection:'column', alignItems:'center', border:'1px solid grey'}}>
                            <div>
                            
                            
                            
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style = {{ margin:'auto'}}>

                            <ListItem alignItems="flex-start" style = {{ margin:'auto'}}>               
                            <Stack direction="row" spacing={10}>
                            <Typography gutterBottom  variant="h6" component="span" align="left"> <u>Player ID </u></Typography>
                            <Typography gutterBottom  variant="h6" component="span"> <u>Resources</u> </Typography>

                            </Stack>

                            </ListItem>
                            {this.state.leaderboard.map(pos => (<ListItem alignItems="flex-start" style = {{ margin:'auto'}}>

                                
                                <Stack direction="row" spacing={10}>
                                <Typography gutterBottom  variant="h6" component="span"> {pos.pid} </Typography>
                                <span style={{padding:20}}></span>
                                <Typography gutterBottom  variant="h6" component="span" align="right" style={{color:'green'}}> {pos.res} </Typography>
                                
                                </Stack>
                                
                                </ListItem>))}
                            </List>
                            </div>
                            </Box>
                        }
                        </Grid>
                        <Grid item xs={6}>

            
                {this.state.curX === ''
                ? <div>
                    <Typography gutterBottom variant="h5" component="div"> Spawn </Typography>
                    <div style={{ padding:20 }}>
                    <TextField label = "X" size="small" style = {{width: 100}} type = "number" onChange={this.handleChangeX} InputProps={{inputProps: {min: 0 }}} />
                    <TextField label = "Y" size="small" style = {{width: 100}} type = "number" onChange={this.handleChangeY} InputProps={{inputProps: {min: 0 }}} />
                    </div>
                    
                    <Button variant="contained" size="small" onClick={this.handleSpawn}> Spawn </Button>
                    
                </div>
                :<br/>}


                <div  style={{ padding: 50 }} >
                <div style={{padding:20}}><Typography gutterBottom variant="h5" component="div"> Current Coordinates </Typography></div>
                <TextField label = "Current X" size="small" style = {{width: 100}} type = "number" value={this.state.curX} onChange={this.handleChangePrevX} InputProps={{inputProps: {min: 0 }}} />
                <TextField label = "Current Y" size="small" style = {{width: 100}} type = "number" value={this.state.curY} onChange={this.handleChangePrevY} InputProps={{inputProps: {min: 0 }}} /><br/>
                </div>
                
                {this.state.curX !== '' && <div>
                    <Typography gutterBottom variant="h5" component="div"> Move </Typography>
                    <div style={{ padding:20 }}>
                    <TextField label = "X" size="small" style = {{width: 100}} type = "number" onChange={this.handleChangeX} InputProps={{inputProps: {min: 0 }}} >this.state.x </TextField>
                    <TextField label = "Y" size="small" style = {{width: 100}} type = "number" onChange={this.handleChangeY} InputProps={{inputProps: {min: 0 }}} />
                    </div>
                    <TextField label = "Resources" size="small" style = {{width: 100}} type = "number" defaultValue = '0' onChange={this.handleChangeResource} InputProps={{inputProps: {min: 0 }}} />
                    <div style = {{padding:20}}>
                    <span style = {{padding:20}}>
                    <LoadingButton
                        onClick={this.handleMove}
                        loading={this.state.moveloading}
                        loadingPosition="end"
                        size = "small"
                        variant="contained"
                    >
                        Move
                    </LoadingButton>
                    </span>
                    <Button variant="contained" onClick={this.handleMine} size="small">Mine</Button>
                    </div>
                
                </div>
                }

            
        </Grid>
        <Grid item xs={3}>
        {this.state.showCard && <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    height="200"                   
                    sx = {{width:'50%', height:'50%'}}
                    style = {{ margin:'auto'}}
                    image={planets[this.state.planetimgLoc]}
                    alt="Planet"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {this.state.planetimgLoc === 0 ? "Empty Space" : "Level "+levels[this.state.planetimgLoc-1] + " Planet"}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                    Location: ({this.state.x}, {this.state.y})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {this.state.planetimgLoc === 0 ? "No resources to mine" : "Planet found with " + (this.state.planetimgLoc-1) + " units of resources"}

                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                </CardActions>
                </Card>}
        
        </Grid>

        <Grid item xs={3}>
          
        </Grid>
        <Grid item xs={6}>
        
        {this.state.txnList.length>0 && <div>
            <Typography variant="h6" component="div">
            Transaction History
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style = {{ margin:'auto'}}>
                {this.state.txnList.map((txn, index) => (<ListItem alignItems="flex-start" style = {{ margin:'auto'}}>

                    <Stack direction = "column" divider={<Divider orientation="horizontal" flexItem />} spacing={2}>
                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} justifyContent="space-around" spacing={4}>
                    <Typography gutterBottom variant="h6" component="div"> {index} </Typography>
                    <div >

                    {txn.txnType === "Spawn" ? <Chip
                                                avatar={<Avatar sx={{ bgcolor: "white" }}><AddCircleOutlineIcon/></Avatar>}
                                                label={txn.txnType + ' (' + txn.txnX + ',' + txn.txnY + ')'}
                                                variant="outlined"
                                                style = {{ margin:'auto'}}
                                                />
                                                :<Chip
                                                avatar={<Avatar sx={{ bgcolor: "white" }}><TimelineIcon/></Avatar>}
                                                label={txn.txnType + ' (' + txn.txnX +'  '+ txn.txnY + ')'}
                                                variant="outlined"
                                                style = {{ margin:'auto'}}
                                                />
                                            }
                    </div>
                    {txn.txnStatus === "Success" ? <Chip label = {txn.txnStatus} color="success" />
                                                    :<Chip label={txn.txnStatus} color="warning" /> }
                    </Stack>
                    </Stack>
                    </ListItem>))}
            </List>
        </div>
        }
        <Button variant="contained" size="small" onClick={()=> {localStorage.clear(); window.location.reload();}}> Clear </Button>
        </Grid>
        <Grid item xs={3}>
          
        </Grid>

      </Grid>
    </Box>


        
        </div>
        );
    }
}

export default PositionForm;