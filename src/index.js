import {Component} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import {withRouter} from 'react-router'
import LessonMaker from './LessonMaker/LessonMaker'
import ContentSelection from './ContentSelection'
import DataViewCreator from './DataView/DataViewCreator'
import Account from './Account'

import {AppHeader} from '@coreui/react';

import "simple-line-icons/css/simple-line-icons.css"
import "./assets/fontAwesome/css/all.min.css"
import "./styles/coreui/coreui.css"
import "@coreui/icons/css/coreui-icons.css"
import './styles/index.css';

import Header from './Header';
import Navbar from './Navbar';
import Footer from "./Footer";
import About from "./About"
import LandingPageController from "./ExploreContent/LandingPageController"

import FontAwesomeImports from "./FontAwesomeImports"

import {Provider} from "redux-zero/react";

import ConcludingContentPage from './ConcludingContentPage'


import store from "./store/store";
import ContentView from "./LessonMaker/ContentView";

import Bitmoji from './Bitmoji'
import Authentication from "./Authentication/Authentication";
import actions from "./store/actions";
import {connect} from "redux-zero/react";


// in the coreui template, the following four 4 lines are imported globally in App.js
// import '@coreui/icons/css/coreui-icons.min.css';
// import 'flag-icon-css/css/flag-icon.min.css';
// import 'font-awesome/css/font-awesome.min.css';


//logs unnecessary rerenders in the console
// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update');
//     whyDidYouUpdate(React);
// }

const history = createBrowserHistory();

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            category:"",
        }
    }

    handleChangeSearchBar(newVal){
        this.setState({category:newVal})
    }

    render() {
        return (
            <div className="oasys app">
                <Provider store={store}>
                    <Router history={history}>
                        <div>
                            {<Navbar onChange={this.handleChangeSearchBar.bind(this)}/>}
                            <Switch>
                                <Route exact path="/" render={() => <LandingPageController category={this.state.category}/>}/>
                                <Route exact path="/create" render={(props) => <LessonMaker {...props} />}/>
                                <Route exact path="/auth"
                                       render={(props) => <Authentication/>}/>
                                <Route exact path="/view" render={() => <ContentView project={store.getState()}/>}/>
                                <Route exact path="/learn" render={(props) => <LandingPageController {...props} />}/>
                                <Route exact path="/create" render={(props) => <LessonMaker {...props} />}/>
                                <Route exact path="/data" render={(props) => <DataViewCreator {...props} />}/>
                                <Route exact path="/about" render={(props) => <About {...props} />}/>
                                <Route exact path="/account" render={(props) => <Account {...props} />}/>
                                <Route exact path="/conclusion"
                                       render={(props) => <ConcludingContentPage url="https://joinoasys.org"
                                                                                 author="Mark22" title="Feet and Cotion"
                                                                                 description="I am explaining to you how feet and cotion works." {...props} />}/>
                                <Route exact path="/bitmoji" render={(props) => <Bitmoji {...props} />}/>
                                {/*<Route path="/data" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />*/}
                                {/*<Route path="/data/preview" render={(props)=>( this.state.authUser ? <DataViewCreator authUser={this.state.authUser} /> : null)} />*/}
                                {/*<Route path="/explore" render={(props)=>( this.state.authUser ? <ContentSelection authUser={this.state.authUser} /> : null)} />*/}
                                {/*<Route path="/create/:userId/:contentId" render={(props)=>(<Editor authUser={this.state.authUser} {...props}/>)} />*/}
                                {/*<Route path="/create" render={(props)=>(<Editor authUser={this.state.authUser}/>)} />*/}

                                {/*<Route path="/games/:name" component={GameEmbedder} />*/}
                                {/*<Route path="/games" component={ContentViewTest} />*/}
                                {/*<Route path="/login" component={LoginPage} />*/}
                                {/*<Route path="/signup" component={SignupPage} />*/}

                                {/*<Route path="/user/:username/:contentname" render={(props)=>(<ContentView authUser={this.state.authUser}/>)} />*/}
                                {/*<Route path="/user/:username" component={UserPage}/>*/}
                                {/*<Route path="/user" render={(props)=>(<MyAccountPage authUser={this.state.authUser}/>)} />*/}
                                {/*<Route path="/forgotPassword" component={PasswordForget}/>*/}
                                {/*<Route path="/resetPassword" component={PasswordReset}/>*/}

                                {/*<Route path="/wallet" component={Wallet}/>*/}

                                {/*<Route path="/help" component={Help}/>*/}

                                {/*<Route path="/comments/:userId/:contentId" render={(props)=>(<Comment name={this.state.authUser}/>)} />*/}


                                {/*<Route component={NotFoundPage}/>*/}
                            </Switch>
                            <Footer/>
                        </div>
                    </Router>
                </Provider>
            </div>
        )
    }
}



export default withRouter(Index);



ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();