import React from 'react';
import {Component} from 'react';
import SimpleMediaCard from './SimpleMediaCard'
import styled from "styled-components"
import api from './tools'

const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

class UserProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: []
        };

        console.log("username is: " + this.props.userId);
        api.getUserContentsPreview(this.props.userId)
            .then(myJson => {
            console.log(myJson);
            this.setState({content: myJson});
        });

    }

    render() {
        const userContents = this.state.content.filter(content => content.published == 1);
        const contentList = userContents.map((d, i) => <SimpleMediaCard key={i} contentData={d}/>);

        return (
            <Flexer>
                {contentList}
            </Flexer>
        )
    }
}

export default UserProjects;