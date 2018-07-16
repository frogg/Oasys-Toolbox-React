import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { firebase } from './firebase';
import CircularProgress from '@material-ui/core/CircularProgress';

var QRCode = require('qrcode.react');


class Wallet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showsSendDialog: false,
			showsDepositDialog: false
		};

		firebase.auth.onAuthStateChanged(authUser => {
            this.setState({
            	userID: authUser.uid
            })
        });
	}


	sendTokens() {
		this.setState({
			showsSendDialog: true
		})
	}

	makeDeposit() {
		this.setState({
			showsDepositDialog: true
		})
	}

	handleClose() {
		this.setState({
			showsSendDialog: false,
			showsDepositDialog: false
		});
	}

	render() {
		let qrCode = <CircularProgress style={{ color: 'orange' }} thickness={7} />
		if (this.state.userID) {
            qrCode = <QRCode value={this.state.userID} />
        }
		
		return (
			<Card style={{maxWidth:'500px', minWidth:'300px', position:'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
				<CardContent>
					<center>
						<Typography style={{marginTop:'20px', marginBottom: '5px', fontSize: '15px'}} color="textSecondary">
			            	Balance
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '5px',fontSize: '30px', fontFamily: 'monospace'}} color="textPrimary">
			            	1 OASYS
				        </Typography>
				        <Typography style={{marginTop:'5px', marginBottom: '10px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	2.5 USD
				        </Typography>
				        {qrCode}
				        <Typography style={{marginTop:'7px', marginBottom: '5px', fontSize: '15px', fontFamily: 'monospace'}} color="textSecondary">
			            	{this.state.userID}
				        </Typography>
					</center>
				</CardContent>

				
				<CardActions style={{marginTop:'5px', textAlign: "center"}}>
					<Button variant="raised" color="primary" onClick={this.sendTokens.bind(this)} >
						Send
					</Button>
					<Button variant="raised" color="primary" onClick={this.makeDeposit.bind(this)} >
						Make Deposit
					</Button>
				</CardActions>
				

		        <Dialog
		          open={this.state.showsSendDialog}
		          onClose={this.handleClose.bind(this)}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">Sending OASYS Tokens</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Enter the Oasys Wallet Address of the receiver to send them OASYS tokens.
		            </DialogContentText>
		            <TextField
		              label="OASYS Address"
		              style={{width:'100%'}} 
		            />
		            <TextField
		              label="Amount"
		              style={{width:'100%'}} 
		              type="number"
		              autocomplete="number"
		              required step="0.000001"
		            />
		            <TextField
		              label="Password"
		              style={{width:'100%'}} 
		              type="password"
		              autocomplete="password-current"
		            />
		          </DialogContent>
		          <DialogActions>
		          	<Button onClick={this.handleClose.bind(this)} color="secondary">
		              Cancel
		            </Button>
		            <Button onClick={this.handleClose.bind(this)} color="primary">
		              Send
		            </Button>
		          </DialogActions>
		        </Dialog>



		        <Dialog
		          open={this.state.showsDepositDialog}
		          onClose={this.handleClose.bind(this)}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">Deposit ETH to your Oasys Wallet</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Send ETH to this address and it will be converted to OASYS Token immediately.
		            </DialogContentText>
		            <TextField
		              style={{width:'100%'}} 
		              value="0xE6B653141C0BD1913A973e915BE1D1b1E9372aD8"
		            />
		          </DialogContent>
		          <DialogActions>
		          	<Button onClick={this.handleClose.bind(this)} color="secondary">
		              Close
		            </Button>
		          </DialogActions>
		        </Dialog>

			</Card>
			)
	}
}

export default Wallet;
