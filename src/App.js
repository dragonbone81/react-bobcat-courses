import React, {Component} from 'react';
import NavBar from './components/NavBar'
import Login from './components/Login'
import SavedSchedules from './components/SavedSchedules'
import GenerateSchedulesPage from './components/GenerateSchedulesPage'
import './App.css'
import {Switch, Route, withRouter} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="main-container">
                <div className="top-div"/>
                <NavBar/>
                <Switch>
                    <Route exact path='/schedules/search' component={GenerateSchedulesPage}/>
                    <Route exact path='/schedules/saved' component={SavedSchedules}/>
                    <Route exact path='/login' component={Login}/>
                </Switch>

            </div>
        );
    }
}

export default withRouter(App);
