import React, {Component} from 'react';
import {Container} from "reactstrap"
import SideBarLesson from "./SideBarLesson";
import posed, {PoseGroup} from 'react-pose';
import PropTypes from 'prop-types';
import {Button, FormText, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {connect} from "redux-zero/react";
import actions from "../store/actions";

import Element from "./Element";
import ElementAdder from './ElementAdder'
import ContentView from './ContentView'


const Item = posed.div();

class LessonMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDeleteChapterDialog: false,
        }
        // props.mergeStoreWithSessionStorage();
        this.handleChapterDeleteModal = this.handleChapterDeleteModal.bind(this);
        this.handleChapterDeleteModalClose = this.handleChapterDeleteModalClose.bind(this);
        this.handleChapterDelete = this.handleChapterDelete.bind(this);
        this.renderChapterDeleteModal = this.renderChapterDeleteModal.bind(this);
    }

    componentDidMount() {
        // this.inhaleSessionStorage();
        //api.getProjectsForUser().then()
        const that = this;
        this.autoSaver = setInterval(function () {
            that.saveStatus()
        }, 20000);

    }

    componentWillUnmount() {
        clearInterval(this.autoSaver);
    }

    saveStatus() {
        console.log('saving status....')
        //api.saveContent
    }

    handleChapterDeleteModal(){
        this.setState({
            showDeleteChapterDialog: true,
        });
    }

    handleChapterDeleteModalClose() {
        this.setState({
            showDeleteChapterDialog: false,
        });
    }

    handleChapterDelete() {

    }

    renderChapterDeleteModal(){
        const modal = (this.props.chapters.length===1)
        ? (<React.Fragment>
                <ModalHeader>
                    Cannot delete chapter
                </ModalHeader>
                <ModalBody>
                    <p>Sorry, but each lesson needs to have at least one chapter, so you 
                    cannot delete this chapter.</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleChapterDeleteModalClose}>OK</Button>
                </ModalFooter>
            </React.Fragment>
        )
        : (<React.Fragment>
                <ModalHeader>
                    Delete chapter?
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this chapter?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.handleChapterDeleteModalClose}>Cancel</Button>
                    <Button color="primary" onClick={this.handleChapterDelete}>Delete</Button>
                </ModalFooter>
            </React.Fragment>
        )
        return modal;
    }    

    render() {
        const activeChapter = this.props.chapters[this.props.activeChapterIndex];
        const {elements} = activeChapter;
        const emptyChapterAdder = elements.length > 0 ? null : <ElementAdder key={"filler"} idx={0}/>;

        return (
            <div className="app-body">
                <SideBarLesson/>
                <main className="main">
                    <Modal isOpen={this.state.showDeleteChapterDialog} toggle={this.handleChapterDeleteModalClose} backdrop={true}>
                        { this.renderChapterDeleteModal() }
                    </Modal>

                    <Container fluid className='main-width'>
                        <center>


                                    <section className='main-width' style={{
                                        display: 'flex',
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        flex: 1,
                                        flexDirection: 'row'
                                    }}>

                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Chapter Title</span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control header"
                                            placeholder="Name your Chapter"
                                            aria-label="Name this Chapter"
                                            value={activeChapter.title}
                                            onChange={(ev) => this.props.onChangeChapterTitle(ev.target.value)}
                                            aria-describedby="basic-addon1"
                                            style={{marginRight: '10px'}}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-light preview-btn"
                                            style={{width: '150px', marginRight: '50px'}}
                                            onClick={this.handleChapterDeleteModal}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className={this.props.isEditMode ? "btn btn-dark preview-btn" : "btn btn-light preview-btn"}
                                            style={{width: '150px'}}
                                            onClick={() => this.props.onToggleEditMode()}
                                        >
                                            <span className={this.props.isEditMode ? "icon-grid" : "icon-layers"}></span>
                                            {"  "}
                                            {this.props.isEditMode ? 'Preview' : '  Edit  '}
                                        </button>
                                    </section>
                            {this.props.isEditMode
                                ? (<React.Fragment>
                                <PoseGroup>
                                    {elements.map((el, idx) =>
                                        <Item key={el.id}>
                                            <Element
                                                key={el.id}
                                                data={el}
                                                isPreview={true}
                                            />

                                            {/*SHORT FORM FOR --> isEditMode ? <Adder/> : null */}
                                            {this.props.isEditMode && <ElementAdder key={el.id + 1} idx={idx}/>}
                                        </Item>
                                    )}
                                </PoseGroup>

                            </React.Fragment>)


                            : <ContentView
                                    isPreview={true}
                                    chapters={this.props.chapters}
                                    onChangeActiveChapter={this.props.onChangeActiveChapter}/>
                        }

                        {emptyChapterAdder}
                        </center>

                    </Container>
                </main>
            </div>
        )
    }
}

LessonMaker.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        links: PropTypes.array,
        id: PropTypes.string,
        elements: PropTypes.array
    })).isRequired,
    isEditMode: PropTypes.bool.isRequired,
    activeChapterIndex: PropTypes.number
};

const mapStoreToProps = ({chapters, activeChapterIndex, isEditMode}) => ({isEditMode, chapters, activeChapterIndex})
const neededActions = (store) => {
    const {onChangeActiveChapter, onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage} = actions();
    return {onChangeActiveChapter, onChangeChapterTitle, onToggleEditMode, mergeStoreWithSessionStorage}
};

export default connect(mapStoreToProps, neededActions)(LessonMaker);
