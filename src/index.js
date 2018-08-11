import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'mobx-react'
import CourseStore from './stores/CourseStore'

ReactDOM.render(
    <Provider course_store={CourseStore}>
        <App/>
    </Provider>
    , document.getElementById('root'));
