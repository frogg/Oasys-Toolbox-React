import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

import api from '../api'
import colors from '../colors'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

library.add(faMapMarker)

class VideoEdit extends Component {

    componentDidMount(){
        //rangesliderJs.create(document.querySelectorAll('input[type="range"]'));
    }

    onSlide(render, handle, value, un, percent){
        console.log("SLIDE", render, handle, value, un, percent)
    }

    render(){
        return (
            <div>
                Favorite Food: <FontAwesomeIcon icon="map-marker" />
                {/*<input id="slider" type="range" min="0" max="5" value="1" step="1" />*/}
                <Nouislider
                    connect
                    start={[500, 4000]}
                    behaviour="tap"
                    range={{
                        min: [0],
                        // "10%": [500, 500],
                        // "50%": [4000, 1000],
                        max: [10000]
                    }}
                    onSlide={this.onSlide}
                />
            </div>
        )
    }
}

export default VideoEdit;
