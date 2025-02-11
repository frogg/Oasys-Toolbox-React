import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import history from '../history'
import api from '../utils/api'
import {connect} from "redux-zero/react";
import actions from "../store/actions";

const styles = {
    mobileTopPadding:{
        paddingTop:"100px"
    },
    pcTopPadding:{
        paddingTop:"50px"
    },
    modalOuterDiv:{
        fontFamily:"Raleway-Regular",
    },
    modalHeader:{
        fontSize:"2.5em"
    },
    modalBody:{
        display: "flex",
        flexDirection: "column",
        fontSize:"1.5em",
    },
    modalButton:{
        display:"flex",
        padding:"1em",
    },
}


//this is the new "Preview" Component
class ContentTileMenuModal extends Component {
     constructor(props) {
        super(props);
        this.state = {
            lesson: null,
        };

    }

    componentDidMount() {
        const {uid, contentId} = this.props.data;
        api.getContent(uid, contentId)
            .then(results => {
                const project = results[0];
                this.setState({lesson: project});
            })
            .catch(err => console.log(err))
    }

    toggle() {
      this.props.onClose();
    }

    handleClick(value) {
      if (value === "remix") {
          this.props.remixProject(this.state.lesson, this.props.user);
          history.push(`/create/${this.props.user.displayName || "anonymous"}/${this.props.data.title}/${this.props.data.uid}/${this.props.data.contentId}/`)
        }
        // window.location.href  = `/create/${this.state.currentUsername}/${this.state.currentTitle}`
        // else if (value === "comments")
        //     window.location.href = `/comments/${this.props.data.username}/${this.props.data.title}`
      else if (value === "user") {            
          history.push(`/user/${this.props.data.username || "anonymous"}/${this.props.data.uid}`) 
          this.toggle();
        }  
        else if (value === "delete") {
          const deleteData = {
            "uid": this.props.data.uid,
            "contentId": this.props.data.contentId,
          }
          api.deleteContent(deleteData)
            .then(results => {
              this.props.sendSnackBarMessage('Deleted Successfully');
                this.toggle();
                window.location.reload();
            })
            .catch(err => {
              console.log(err);
              this.props.sendSnackBarMessage('An error occured');
              this.toggle();
            })

        }        
      else if (value === "flag"){
          this.props.sendSnackBarMessage('Thank you for notifying us about this content');
          this.toggle();
      }
    }

    render() {
    	
        return (
            <div>
              <Modal isOpen={this.props.isOpen} toggle={()=>this.toggle()}
                           className={'modal-sm ' + this.props.className} style={styles.modalOuterDiv}>
              <ModalHeader toggle={()=>this.toggle()} style={styles.modalHeader}>{this.props.data.title}</ModalHeader>
              <ModalBody style={styles.modalBody}>
                  <Button block color="light" onClick={()=>this.handleClick("remix")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-pencil-alt"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Remix</div>
                  </Button>
                  {/*<Button block color="light" onClick={()=>this.handleClick.("comments")} style={styles.modalButton}>
                                      <div style={{flex:1}}><i className="fas fa-comment" /></div>
                                      <div style={{flex:3, textAlign:"left"}}>View Comments</div>
                                    </Button>*/}
                  <Button block color="light" onClick={()=>this.handleClick("user")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-user"/></div>
                    <div style={{flex:3, textAlign:"left"}}>{"Go To " + this.props.data.username + "'s Page"}</div>
                  </Button>
                 { /*<Button block color="light" onClick={()=>this.handleClick("collection")} style={styles.modalButton}>
                                     <div style={{flex:1}}><i className="fas fa-layer-group"/></div>
                                     <div style={{flex:3, textAlign:"left"}}>Create New Collection</div>
                                   </Button>*/}
                  <Button block color="light" onClick={()=>this.handleClick("flag")} style={styles.modalButton}>
                    <div style={{flex:1}}><i className="fas fa-flag"/></div>
                    <div style={{flex:3, textAlign:"left"}}>Flag as Inappropriate</div>
                  </Button>
                  { this.props.deletable
                    ?(<Button block color="light" onClick={()=>this.handleClick("delete")} style={styles.modalButton}>
                                          <div style={{flex:1}}><i className="fas fa-trash-alt"/></div>
                                          <div style={{flex:3, textAlign:"left"}}>Delete Content</div>
                                        </Button>)
                    : null
                }

              </ModalBody>
              </Modal>
            </div>
        )
    }
}

ContentTileMenuModal.propTypes = {

}

const mapStoreToProps = ({user}) => ({user})
const neededActions = (store) => {
    const {remixProject} = actions();
    return {remixProject}
};

export default connect(mapStoreToProps, neededActions)(ContentTileMenuModal);

