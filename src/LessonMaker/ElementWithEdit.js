import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import FadeableCard from './FadeableCard'


const styles = {
    normal: {
        cursor: 'pointer',
        border: `1px solid blue`
    },
    highlight: {
        cursor: 'pointer',
        background: 'lightyellow',
        border: `1px solid blue`

    },
    edit: {}

};


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

const sessionStorageKey = `__OASYS_ID__`;

class ElementWithEdit extends Component {
    constructor(props) {
        super();
        this.saveToSessionStorage = this.saveToSessionStorage.bind(this);
    }

    state = {
        mode: styles.normal,
        isEditing: false
    };
    onSetCondition() {
        //save eventId linked with chapterId
    }

    saveToSessionStorage(value) {
        console.log('props', this.props.id)

        //webStorage API only saves strings
        sessionStorage.setItem(
            sessionStorageKey + this.props.id,
            JSON.stringify({content: value, timestamp: Date.now()})
        )
    }

    render() {
        const id = this.props.id;
        return (
            <div>

                <section style={this.state.mode}
                         onMouseEnter={() => this.setState({mode: styles.highlight})}
                         onMouseLeave={() => this.setState({mode: styles.normal})}
                         onClick={() => this.setState({isEditing: true})}
                >
                    <FadeableCard>
                        <Element content={this.props.content}
                                 type={0}
                                 id={id}
                                 isEditable={true}
                                 onProgress={this.saveToSessionStorage}
                        />
                    </FadeableCard>

                    {this.state.isEditing ? (<div>
                        <button onClick={() => this.props.onMove(id, -1)}> UP</button>
                        <button onClick={() => this.props.onMove(id, +1)}> Down</button>
                        <button onClick={() => this.props.onDelete(id)}>DELETE</button>
                        <button onClick={(ev) => {
                            //otherwise the parent sets editmode back to true
                            ev.stopPropagation();
                            this.setState({isEditing: false})
                        }
                        }

                        >DONE
                        </button>
                    </div>) : null}


                </section>
            </div>
        );
    }
}

ElementWithEdit.propTypes = {
    id: PropTypes.string,
    // content: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onMove: PropTypes.func
};

export default ElementWithEdit;