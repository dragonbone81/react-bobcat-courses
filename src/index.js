import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'mobx-react'
import CourseStore from './stores/CourseStore'
import AuthStore from './stores/AuthStore'
import {BrowserRouter} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    <BrowserRouter>
        <Provider course_store={CourseStore} auth_store={AuthStore}>
            <App/>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();