import React, { Component } from 'react';


import { InputGroup, InputGroupAddon, Input, InputGroupText, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



import PropTypes from 'prop-types';
import api from '../api'

import colors from '../colors'
import globals from '../globals'

import SelectionDropdown from './SelectionDropdown'
import QuizzEditModal from './QuizzEditModal'

import {saveToSessionStorage} from '../utils/trickBox'

const ICON = function(className, fontSize=globals.ICON_FONTSIZE_NORMAL) {
    return <i style={{fontSize:fontSize}} className={className}> </i>;
}

//this is the new "Preview" Component
class QuizzEdit extends Component {

    quizColors = [colors.WINTERSUN, colors.LOCHINVAR, colors.VELVET, colors.GREEN]


    constructor(props) {
        super(props);
        this.state = {
            isInEditMode: false,
        	question: props.data.question? props.data.question : "",
            answers: props.data.answers? props.data.answers : [],
            quizType: props.data.quizType? props.data.quizType : "single-choice",
            showsPageSelectionDropDown: false,
            selectingImageForIndex: 0,
        }
    }

    onChangeData(data) {
        console.log(data);
        this.setState({
            question: data.question,
            answers: data.answers
        }, function() {
            saveToSessionStorage(this.props.id, {
                question: this.state.question,
                answers: this.state.answers,
                quizType: this.state.quizType
            })
        });

        

    }

    onClickButton() {
        this.setState({
            isInEditMode: true
        })
    }

    onClose() {
        this.setState({
            isInEditMode: false
        })
    }

    onSelectAnswer(element) {
        console.log({element});
    }

	
    render() {

        let flexDirection = 'row';
        let flexWrap = 'nowrap';
        let elementWidth = "25%";
        let elementHeight = "50px";


        const containsLongAnswerText = this.state.answers.reduce(function(result, answer) {
            return result || answer["title"].length > 70;
        }
        , 0);

        if (containsLongAnswerText) {
            flexDirection = 'column';
            elementWidth = "100%";
        }


        const containsAtLeastOneImage = this.state.answers.reduce(function(result, answer) {
            return result || answer["image"];
        }
        , 0);

        if (containsAtLeastOneImage) {
            flexWrap = 'wrap';
            elementWidth = "50%";
        }

        const containerStyle = {
            display: "flex",
            flexDirection: flexDirection,
            flexWrap: flexWrap
        }


        const that = this; 
        return (
            <div>
                <Button color="primary" onClick={this.onClickButton.bind(this)}>Edit Quiz</Button>
                {this.state.question.title}
                <img src={this.state.question.image} />
                <center>
            	<div style={containerStyle}>
                   
            	   {this.state.answers.map(function(answer, index) {
                    
                    const quizAnswerOptionStyle = {
                        boxShadow: "1px 1px #AAAAAA",
                        borderRadius: "6px 6px 6px 6px",
                        padding: '2px',
                        textAlign: "center",
                        alignSelf: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: elementWidth,
                        minHeight: elementHeight,
                        backgroundColor: that.quizColors[index % that.quizColors.length]
                    };

                    return (
                        <div style={quizAnswerOptionStyle} onClick={that.onSelectAnswer.bind(that)}>
                        <div>{answer.title}</div>
                        <div>
                        {answer.image!=""? (
                                <center>
                                    <img src={answer.image} width="100%" style={{padding:'10px'}}/>
                                </center>
                                ) : null}
                        </div></div>
                        );
                   })}
            	</div>
                </center>


                <QuizzEditModal question={this.state.question} answers={this.state.answers} quizType={this.state.quizType} onChange={this.onChangeData.bind(this)} onClose={this.onClose.bind(this)} chapters={this.props.chapters} isInEditMode={this.state.isInEditMode} />

            </div>
        )
    }
}

QuizzEdit.modules = {
    toolbar: null
}

QuizzEdit.propTypes = {
    isEditable: PropTypes.bool
}

QuizzEdit.defaultProps = {
    answers: [],
    question: ""
}

export default QuizzEdit;
