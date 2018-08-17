import React, {Component} from 'react';
import NavBar from './components/Nav/NavBar'
import Login from './components/UserActions/Login'
import Register from './components/UserActions/Register'
import Waitlists from "./components/Waitlists/Waitlists";
import SavedSchedules from './components/Main/SavedSchedules'
import GenerateSchedulesPage from './components/Main/GenerateSchedulesPage'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css'
import {Switch, Route, withRouter, Redirect} from 'react-router-dom'


const RedirectHome = () => {
    return (
        <Redirect to="/schedules/search"/>
    )
};
const NotFound = () => {
    document.title = "BobcatCourses | Not Found";
    return (
        <div className="flex-container">
            <div className="column-calendar">
                <div style={{maxWidth: '500px', margin: 'auto', marginBottom: 10, marginTop: 10}}
                     className="ui warning message">
                    <div style={{textAlign: 'center'}} className="header">
                        Route not found.
                    </div>
                </div>
            </div>
        </div>
    )
};

class App extends Component {
    render() {
        return (
            <div className="main-container">
                <NavBar/>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                <Switch>
                    <Route exact path='/schedules/search' component={GenerateSchedulesPage}/>
                    <Route exact path='/' component={RedirectHome}/>
                    <Route exact path='/schedules' component={RedirectHome}/>
                    <Route exact path='/schedules/saved' component={SavedSchedules}/>
                    <Route exact path='/login' component={Login}/>
                    <Route exact path='/register' component={Register}/>
                    <Route exact path='/waitlists' component={Waitlists}/>
                    <Route component={NotFound}/>
                </Switch>

            </div>
        );
    }
}

export default withRouter(App);
