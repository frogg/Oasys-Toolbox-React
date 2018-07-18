import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import FolderIcon from '@material-ui/icons/Folder';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import IconArrowForward from '@material-ui/icons/ArrowForward';
import Popover from '@material-ui/core/Popover';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input'
//import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import OpenContentDialog from './OpenContentDialog';
import UploadPicContentDialog from './UploadPicContentDialog'
import logo from './logo.jpg'
import UploadingDialog from './UploadingDialog'



const BG = "#5C8B8E";

//var username = "test";

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

const buttonStyle = {
  padding: '0',
}


class MenuBarView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    // this.completeFetch = this.completeFetch.bind(this);
    this.contentId = 0;
    this.onOpen = this.onOpen.bind(this);

    this.state = {
            showsSaveDialog: false,
            saveAction: null,
            link: null,
            slides: this.props.slides,
            snackBarMessage: null,
            showsOpenDialog: false,
            showsUploadPicDialog: false,
            pictureURL: '',
            hashtags:'',
            description:'',
            loading:false,
            isUploading: false
        }
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


  prepareSlides(slides, oncomplete) {
    
    let imagesToSave = [];
    let m;
    const findImageTagsRegEx = /<img src="?([^"\s]+)"(.*?)>/g;
    slides.forEach(function(slide) {
      if (slide.type == 0) {
        //quill content
        while ( m = findImageTagsRegEx.exec( unescape(slide.content) ) ) {
            let found = m[1];
            if (!found.includes("http")) {
              imagesToSave.push(found);
            }
        }
      }
    });


    slides.map(function(slide) {
      slide.thumb = null;
    });

    if (imagesToSave.length == 0) {
      //this.sendToServer(contentId, published, hashtags, description, slides);
      oncomplete(slides);
      return;
    }

    var semaphore = 0;
    var that = this;
    imagesToSave.forEach(function(base64Image) {
    semaphore++;
      const spacesEndpoint = 'https://api.imgur.com/3/image'

      let newBase64Image = base64Image.split(",")[1];

      
      fetch(spacesEndpoint, {
        method: 'POST',
        body: newBase64Image,
        headers: new Headers({
         'Authorization': 'Client-ID dab43e1ba5b9c27',
         'Accept': 'application/json'
        }),
      }).then((response) => {
        response.json()
        .catch(error => {
        console.error('Error:', error);
      }).then((body) => {
          console.log(body);
          if (body) {
            console.log('IMGUR LINK: ' + body.data.link);
            slides.map(function(slide) {
              if (slide.type == 0) {
                //quill content
                slide.content = slide.content.replace(base64Image, body.data.link);
              }
            });

            semaphore--;

            if (semaphore == 0) {
              oncomplete(slides);
            }

          }
        });
      });
    });    
  }

  sendToServer(contentId, published, hashtags, description, slides) {
    var username = this.props.authUser.displayName;
    var saveEndpoint = 'https://api.joinoasys.org/save/'+username+'/'+contentId;
    var data = {
      "data":slides,
      "published":published,
      "title":contentId,
      "description":description,
      "tags":hashtags,
    }

    console.log(data);


    fetch(saveEndpoint, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers: new Headers({
       'Content-Type': 'application/json',
     })
    }).then(res => res.json())
    .catch(error => {
      console.error('Error:', error);
      this.setState({
          snackBarMessage: 'Error Saving. If this continues, please contact info@joinoasys.org',
          isUploading: false
      })
    })
    .then(response => {
      this.setState({
        showsSaveDialog: false
      });

      console.log(response);
      if (response) {
        if (this.state.saveAction == 'save') {
          this.setState({
            snackBarMessage: 'Saved Draft',
            isUploading: false
          })
        }

        if (this.state.saveAction == 'publish') {
          this.setState({
            snackBarMessage: 'Published',
            isUploading: false
          })
        }
      }
      });
  }

  onSubmit() {
    this.setState({
      isUploading: true
    });
    var that = this;
    this.prepareSlides(this.props.slides, function(slides) {
      if (that.state.saveAction == 'save') {
        that.sendToServer(that.props.contentTitle, 0, that.state.hashtags, that.state.description, slides);
      }
      if (that.state.saveAction == 'publish') {
        that.sendToServer(that.props.contentTitle, 1, that.state.hashtags, that.state.description, slides);
      }
    });
  }

  onOpen(event) {


    this.setState({
      showsOpenDialog: true,
    });
  }

  onLoad(event) {
    this.setState({
        snackBarMessage: 'Opening…'
      })
    var loadContent = this.state.link;
    loadContent = loadContent.replace("app.joinoasys.org", "api.joinoasys.org");

    console.log(loadContent);
    var that = this;

    fetch(loadContent, {
      method: 'GET'
    }).then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        that.setState({
          slides:myJson[0]
        })
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
      case "hashtags": 
        this.setState({
          hashtags: event.target.value,
        });
        break;
      default:

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

  closeSnackBar() {
    this.setState({
      snackBarMessage: null
    });
  }

  closeOpenDialog(selectedContent) {
    if(selectedContent){
      console.log(selectedContent);
      const link = "https://app.joinoasys.org/user/"+selectedContent.userId+"/"+selectedContent.contentId;
      this.setState({
        showsOpenDialog: false,
        link: link
      });
      this.props.onLoad("user/"+selectedContent.userId+"/"+selectedContent.contentId);
    }
    else{
      this.setState({
        showsOpenDialog:false,
      })
    }
  }

  updateURL(){
    const allData = 'https://api.joinoasys.org/user/'+this.props.authUser.displayName+'/'+this.props.contentTitle
    console.log(allData);
    fetch(allData, {
      method: 'GET',
    }).then((response) => {
      console.log(response);
        response.json().then((body) => {
          console.log(body);
          if(body)
            this.setState({ pictureURL: body[0].picture });
          else{
            this.setState({ pictureURL: logo });
          }
       });
        });
  }

  onUpload() {
      this.setState({
        showsUploadPicDialog: true,
      });
    }

  closeUploadDialog() {
    this.setState({
      showsUploadPicDialog: false,
    });
  }

  updateSnackbar(message) {
    this.setState({
      snackBarMessage: message,
    });
  }

  render() {
    const {
      description,
      hashtags
    } = this.state;
    const isInvalid = !description || !hashtags;
    return (
    	<div>
      <UploadingDialog open={this.state.isUploading} />
      <Toolbar style={{backgroundColor: BG}}>

      <Tooltip enterDelay={500} id="tooltip-bottom" title="Open an existing content" placement="bottom">
      <Button onClick={this.onOpen} style={{color: 'white'}} >
        <FolderIcon />
          Open
      </Button>
      </Tooltip>

      <Tooltip enterDelay={500} id="tooltip-bottom" title="Save content in your account but don't publish it yet. You can open drafts later again and continue editing." placement="bottom">
    	<Button onClick={this.onSave} style={{color: 'white'}} >
        <SaveIcon />
	        Save Draft
	    </Button>
      </Tooltip>

      <Tooltip enterDelay={500} id="tooltip-bottom" title="Publish your content on the Oasys platform. Other users then can explore, use, share, edit, comment, and remix your content." placement="bottom">
      <Button onClick={this.onPublish.bind(this)} style={{color: 'orange'}} >
        <PublishIcon />
          Publish on Oasys
      </Button>
      </Tooltip>

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
              id="description"
              placeholder="Description"
              style={{width:'100%'}} 
              value={this.state.description} 
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <TextField
              id="hashtags"
              placeholder="Hashtags"
              style={{width:'100%'}} 
              value={this.state.hashtags}
              onChange={this.onChange.bind(this)}
              margin="normal"
            />
            <br/>
            <br/>
            <Button style={buttonStyle} variant="contained" color="primary" onClick={this.onUpload.bind(this)}>
            Upload Cover Picture 
            </Button>
            <UploadPicContentDialog titleUpload={true} url={this.updateURL.bind(this)} authUser={this.props.authUser} contentId={this.props.contentTitle} open={this.state.showsUploadPicDialog} onClose={this.closeUploadDialog.bind(this)} snackBarControl={this.updateSnackbar.bind(this)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveDialog.bind(this)} color="primary">
            Cancel
          </Button>
          <Button disabled={isInvalid} onClick={this.onSubmit.bind(this)} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>



      <OpenContentDialog userId={
        this.props.authUser
        ?this.props.authUser.displayName
        :null
      }
      open={this.state.showsOpenDialog} onClose={this.closeOpenDialog.bind(this)}/>

      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackBarMessage}
          autoHideDuration={6000}
          onClose={this.closeSnackBar.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackBar.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

	    </div>
	)
  }
}


export default MenuBarView;
