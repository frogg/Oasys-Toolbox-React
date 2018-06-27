import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import FolderIcon from '@material-ui/icons/Folder';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import Popover from '@material-ui/core/Popover';
import Notifications, {notify} from 'react-notify-toast';
import OpenProjectDialog from './OpenProjectDialog'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input'
//import Grid from '@material-ui/core/Grid';

const BG = "#5C8B8E";



const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class MenuBarView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.completeFetch = this.completeFetch.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.contentId = 0;
    this.onOpen = this.onOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
            anchorEl: null,
            showsSaveDialog: false,
            saveAction: null,
            link: null
        }

    this.show = notify.createShowQueue();
  }

  onSave() {
    this.setState({
      saveAction: 'save',
      showsSaveDialog: true,
    });
  }

  onPublish() {
    this.setState({
      saveAction: 'publish',
      showsSaveDialog: true
    });
  }

  completeFetch(contentId, published, username, hashtags, pictureURL, description) {

    var saveEndpoint = 'https://api.joinoasys.org/'+username+'/'+contentId+'/save';
    var data = {
      "data":"Still a test",
      "published":published,
      "picture":pictureURL,
      "title":contentId,
      "description":description,
      "tags":hashtags,
      "url":'/'+username+'/'+contentId
    }

    fetch(saveEndpoint, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: new Headers({
       'Content-Type': 'application/json',
     })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      console.log('Success:', response);
      this.setState({
        showsSaveDialog: false
      });

      });


  }

  onSubmit() {
    if (this.state.saveAction == 'save') {
      this.show('Saved Draft');
      this.completeFetch(this.state.title, 0, this.state.username, this.state.hashtags, this.state.pictureURL, this.state.description);
    }
    if (this.state.saveAction == 'publish') {
      this.show('Published');
      this.completeFetch(this.state.title, 1, this.state.username, this.state.hashtags, this.state.pictureURL, this.state.description);
    }
  }

  onOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  };

  onLoad(event) {
    this.show('Opening…');
    // this.props.onLoad(this.contentId);
    
    var loadContent = this.state.link;

    console.log(loadContent);

    fetch(loadContent, {
      method: 'GET'
    }).then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
      });


    this.handleClose();


  }

  onChange(event) { 
    switch (event.target.id){
      case "title": 
        this.setState({
          title: event.target.value,
        });
        break;
      case "username": 
        this.setState({
          username: event.target.value,
        });
        break;
      case "pictureURL": 
        this.setState({
          pictureURL: event.target.value,
        });
        break;
      case "description": 
        this.setState({
          description: event.target.value,
        });
        break;
      default:

    }
  }

  onClosePopup() {
    this.setState({
      anchorEl: null,
    });
  };

  handleChange(chips) {
    if(this.state.hashtags)
      this.setState({ hashtags: [...this.state.hashtags, chips] })
    else{
       this.setState({
          hashtags: [chips]
        });
    }
  }

  handleLoadChange(event) {
    this.setState({
      link: event.target.value
    })
  }

  closeSaveDialog() {
    this.setState({
      showsSaveDialog: false
    });
  }

  render() {
    return (
    	<div>
      <Notifications />
      <Toolbar style={{backgroundColor: BG}}>
      <Button onClick={this.onOpen} style={{color: 'white'}} >
        <FolderIcon />
          Open
      </Button>
      <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.onClosePopup.bind(this)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          
        <Input
          placeholder="Link to Content"
          value={this.state.title}
          onChange={this.handleLoadChange.bind(this)}
          inputProps={{
            'aria-label': 'Description',
          }}
          endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Open Content"
                  onClick={this.onLoad}
                  onClose={this.onClosePopup}
                >
                <IconArrowForward />
                </IconButton>
              </InputAdornment>
            }
        />

      </Popover>
    	<Button onClick={this.onSave} style={{color: 'white'}} >
        <SaveIcon />
	        Save Draft
	    </Button>
      <Button onClick={this.onPublish.bind(this)} style={{color: 'orange'}} >
        <PublishIcon />
          Publish on Oasys
        </Button>
      </Toolbar>

      <Dialog
        open={this.state.showsSaveDialog}
        onClose={this.closeSaveDialog.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >        

        <DialogTitle id="alert-dialog-title">{"You are almost done!"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We need a little more information to properly save your content. 
          </DialogContentText>
            <TextField
              id="title"
              placeholder="Title"
              style={{width:'100%'}} 
              value={this.props.contentTitle} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="username"
              placeholder="Username"
              style={{width:'100%'}} 
              value={this.props.username} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="pictureURL"
              placeholder="Picture URL"
              style={{width:'100%'}} 
              value={this.props.pictureURL} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="description"
              placeholder="Description"
              style={{width:'100%'}} 
              value={this.props.description} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <ChipInput
              id="hashtags"
              placeholder="Hashtags"
              style={{width:'100%'}} 
              onChange={(chips) => this.handleChange(chips)}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit.bind(this)} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

	    </div>
	)
  }
}


export default MenuBarView;
