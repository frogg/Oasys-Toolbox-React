import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FadeableCard from './FadeableCard'
import globals from "../globals";
import TextView from '../CoreElements/TextView'



const styles = {
    normal: {
        cursor: 'pointer',
        border: `1px solid blue`
    },
    highlight: {
        cursor: 'pointer',
        background: 'lightyellow',
        border: `1px solid green`

    },
    edit: {}

};


//TODO
//put Fade from CoreUI --> Wrap it in component to manage IN/Out state!

const sessionStorageKey = `__OASYS_ID__`;

class Element extends Component {
    constructor(props) {
        super(props);
        this.saveToSessionStorage = this.saveToSessionStorage.bind(this);
    }

    state = {
        mode: styles.normal,
        isEditing: false
    };

    onSetCondition() {
        //save eventId linked with chapterId
    }
    onInteractionEvent() {

    }

    typeToComponent(type) {

        let render = <div>NO ELEMENT TYPE YET HERE</div>;

        console.log("TYPE", type)
        switch (type) {
            case globals.EDIT_QUILL:
                render = <TextView content={this.props.data.content}/>
                break;

            default:
                return (<div key={"1223"}>not yet implemented ☹️</div>)
        }
        return render;
    }

    saveToSessionStorage(value) {
        console.log('props', this.props.data.id)

        //webStorage API only saves strings
        sessionStorage.setItem(
            sessionStorageKey + this.props.data.id,
            JSON.stringify({content: value, timestamp: Date.now()})
        )
    }

    render() {
        const {id, content} = this.props.data;
        return (
            <div>

                <section style={this.state.mode}
                         onMouseEnter={() => this.setState({mode: styles.highlight})}
                         onMouseLeave={() => this.setState({mode: styles.normal})}
                         onClick={() => this.setState({isEditing: true})}
                >
                    <FadeableCard deleteMe={() => this.props.onDelete(id)}>
                        <textarea value={this.state.content || content || "NO CONTENT"}
                                  onChange={(ev) => {
                                      this.setState({content: ev.target.value});
                                      this.saveToSessionStorage(ev.target.value)
                                  }}>
                        </textarea>
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

Element.propTypes = {
    id: PropTypes.string,
    // content: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onMove: PropTypes.func
};

export default Element;
