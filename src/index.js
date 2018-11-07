import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import {Provider} from 'mobx-react'
import CourseStore from './stores/CourseStore'
import AuthStore from './stores/AuthStore'
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <BrowserRouter>
        <Provider course_store={CourseStore} auth_store={AuthStore}>
            <App/>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));
serviceWorker.register();