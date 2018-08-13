import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {typeToIcon} from "../utils/trickBox";
import globals from '../globals'

const styling = {
    all: {
        display: 'flex',
        flexGrow: 0,
        flexDirection: "row",
        justifyContent: "center",
        height: 4 + 'rem',
    },
    image: {
        height: 2.5 + "rem",
        objectFit: "cover",
        cursor: 'pointer',
        borderRadius: 8+ "px",
        margin: 0.5 + 'rem',
        opacity: 0.85
    }
};

const {EDIT_QUILL, EDIT_QUIZ, EDIT_SYSTEM, EDIT_GAME} = globals;

const types = [
    EDIT_QUILL,
    EDIT_QUIZ,
    EDIT_GAME,
    EDIT_SYSTEM
]


class ElementAdder extends Component {

    state = {
        isHovered: false
    }

    render() {
        const that = this;
        return (
            <section style={styling.all} className={'card-header'}
                     onMouseEnter={() => this.setState({isHovered: true})}
                     onMouseLeave={() => this.setState({isHovered: false})}
            >
                <section hidden={!this.state.isHovered}>
                    {types.map(type =>
                        <img style={styling.image}
                             key={Math.random()}
                             src={typeToIcon(type)}
                             onClick={() => that.props.onAddElement(type, that.props.idx)}
                             alt=""
                        />)}
                </section>
                <section style={{alignSelf:'center', display: 'flex', 'justifyContent': 'center', alignItems: 'center'}} hidden={this.state.isHovered}>
                    <i style={{color: '#A2ABB8', fontSize:'30px'}} className='icon-plus'> </i>
                    {this.props.nElems<=1 
                    ?
                      <span style={{color: '#626970', marginLeft: '15px', fontStyle: 'italic'}}>You can add more content by clicking or tapping the plus icon.</span>
                    : null
                    }
                    
                </section>
            </section>

        );
    }
}

ElementAdder.propTypes = {
    onAddElement: PropTypes.func.isRequired
};

export default ElementAdder;
