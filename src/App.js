import React, {Component} from 'react';
import NavBar from './components/Nav/NavBar'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css'
import {Icon} from 'semantic-ui-react'
import {Switch, Route, withRouter, Redirect} from 'react-router-dom'
import Loadable from 'react-loadable';


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

const Loading = () => <div style={{color: 'grey', textAlign: 'center', marginTop: 50}}><Icon size="huge" name="spinner"
                                                                                             loading/>
</div>;

const Login = Loadable({
    loader: () => import('./components/UserActions/Login'),
    loading: Loading,
});
const GenerateSchedulesPage = Loadable({
    loader: () => import('./components/Main/GenerateSchedulesPage'),
    loading: Loading,
});
const SavedSchedules = Loadable({
    loader: () => import('./components/Main/SavedSchedules'),
    loading: Loading,
});
const Register = Loadable({
    loader: () => import('./components/UserActions/Register'),
    loading: Loading,
});
const Waitlists = Loadable({
    loader: () => import('./components/Waitlists/Waitlists'),
    loading: Loading,
});

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
