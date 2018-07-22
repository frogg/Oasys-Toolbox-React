import React from 'react';
import {Component} from 'react';
import styled from "styled-components"
import SimpleMediaCard from "./SimpleMediaCard"
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';


const Flexer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`



class ContentSelection extends Component {
    constructor(props) {
        super();
        const loadContent = 'https://api.joinoasys.org/GetContentsPreview';
        const that = this;
        this.state = {
            content: [],
            filteredContent: [],
            searchText: '',
            searchAnchor: null,
            searchResults: [],
            category: 'Featured'
            // isLoading: true
        }

        fetch(loadContent, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            that.setState({
                content: myJson
            }, function() {
                that.setState({
                    filteredContent: that.filteredContentForCategory(that.state.category)
                })
            });

        });
    }

    componentDidMount() {
        // setTimeout(() => this.setState({isLoading: false }), 1500); // simulates async loading
    }

    didChangeSearchText(textfield) {
        this.setState({
            searchText: textfield.target.value,
            searchAnchor: textfield.currentTarget,
            searchResults: this.state.content.filter(content => this.contentMatchesSearchString(content, textfield.target.value))
        })
    }

    contentMatchesSearchString(content, searchString) {
        searchString = searchString.trim();
        const titleMatched = content.title.toLowerCase().includes(searchString.toLowerCase());
        const hashTagsMatched = content.tags.toLowerCase().includes(searchString.toLowerCase());
        const usernameMatched = content.userId.toLowerCase().includes(searchString.toLowerCase());
        return (titleMatched || hashTagsMatched || usernameMatched);
    }

    closeSearchPopup() {
        this.setState({
            searchText: ''
        })
    }

    handleCategoryChange(event) {
        this.setState({
         category: event.target.value,
         filteredContent: this.filteredContentForCategory(event.target.value)
     });
    }


    filteredContentForCategory(category) {
        if (category === 'Featured') {
            return this.state.content;
        }

        if (category === 'Recently Added') {
            return this.state.content;
        }

        var keywords = [];
        if (category === 'Chemistry') {
            keywords = ['chemistry', 'atom', 'molecule'];
        }

        if (category === 'Physics') {
            keywords = ['physic', 'simulation', 'work'];   
        }

        if (category === 'Computer Science') {
            keywords = ['object', 'programming', 'ml', 'swift', 'code'];
        }

        var that = this;
        return this.state.content.filter(function(content) {
            return that.stringContainsKeywords(content.tags, keywords);
        })
    }

    stringContainsKeywords(string, keywords) {
        var includesKeyword = false;
        keywords.forEach(function(keyword) {
            const lowercaseString = string.toLowerCase();
            const lowercaseKeyword = keyword.toLowerCase();
            if (lowercaseString.includes(lowercaseKeyword)) {
                console.log(string);
                includesKeyword = true;
                return;
            }
        });

        return includesKeyword;
    }


    render(){
        // if (this.state.isLoading) {
        //     return <img style={{transform: 'rotate(180deg)'}} src={'https://media.giphy.com/media/xsE65jaPsUKUo/giphy.gif'}></img>
        // }
        let searchListContent = (
            <ListItem>
                 <ListItemText primary="No Contents Found" />
            </ListItem>
            )

        if (this.state.searchResults.length > 0) {
             searchListContent = this.state.searchResults.map(content => (
                  <ListItem button onClick={function(event) {event.preventDefault(); window.location.href = '/user/' + content.userId + '/' + content.contentId; }} key={content.contentId}>
                    <Avatar alt="Remy Sharp" src={content.picture} />
                    <ListItemText primary={content.title} secondary={"Created by " + content.userId}/>
                  </ListItem>
             ))
        }

        // no content was loaded form the server at all
        if (!this.state.content) {
            searchListContent = <CircularProgress style={{ color: 'orange' }} thickness={7} />
        }


        return (
            <div>
                <Paper style={{margin:'16px', padding:'16px'}}>

                    <FormControl style={{position:'absoulte', top:'0', left:'0'}}>
                      <Select
                        onChange={this.handleCategoryChange.bind(this)}
                        displayEmpty
                        value={this.state.category}
                      >
                        <MenuItem value="Featured">
                          <em>Featured Content</em>
                        </MenuItem>
                        <MenuItem value="Recently Added">Recently Added</MenuItem>
                        <MenuItem value="Physics">Physics</MenuItem>
                        <MenuItem value="Chemistry">Chemistry</MenuItem>
                        <MenuItem value="Computer Science">Computer Science</MenuItem>
                      </Select>
                    </FormControl>

                    <center>
                    <h2> Welcome to Oasys! </h2>
                    <p style={{maxWidth:'450px'}}>
                    Start your educational journey here. Search for topics you're interested in or select one of the personally curated contents below.
                    </p>

                    

                    <TextField
                      id="search"
                      label="Search…"
                      style={{width:'15rem'}} 
                      type="text"
                      margin="normal"
                      onChange={this.didChangeSearchText.bind(this)}
                      fullWidth
                    />
                    <Popover
                      open={this.state.searchText.length>0}
                      anchorEl={this.state.searchAnchor}
                      onClose={this.closeSearchPopup.bind(this)}
                      disableAutoFocus={true}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                    <List>
                    {searchListContent}
                    </List>
                    </Popover>

                    </center>
                </Paper>
                <Flexer>
                    {this.state.content.length===0? (
                            <CircularProgress style={{ color: 'orange' }} thickness={7} />
                        ) : (
                            this.state.filteredContent.map((d, i) => <SimpleMediaCard key={i} contentData={d}/>)
                        )
                    }
                </Flexer>
            </div>
        )
    }
}

export default ContentSelection;