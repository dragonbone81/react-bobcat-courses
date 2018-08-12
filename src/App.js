import React, {Component} from 'react';
import Schedule from './components/Schedule'
import CourseSearch from './components/CourseSearch'
import CourseList from './components/CourseList'
import './App.css'
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {Button} from 'semantic-ui-react'

class App extends Component {
    render() {
        const display = this.props.course_store.searching || this.props.course_store.schedules.length === 0 ? {
            visibility: 'hidden',
            height: 0
        } : {};
        return (
            <div className="main-container">
                <div className="top-div"/>
                <div className="flex-container">
                    <div className="column-search">
                        <CourseSearch/>
                        <CourseList/>
                        <button style={{marginTop: 10}} className="ui button violet generate-button"
                                onClick={this.props.course_store.scheduleSearch}>
                            Generate
                        </button>
                    </div>
                    <div className="column-calendar">
                        <div className="schedule-button-controls" style={display}>
                            <div className="ui buttons">
                                <button className="ui button brown" onClick={() => this.clickButton(-1)}><i
                                    className="fas fa-arrow-left"/></button>
                                <button
                                    className="ui button pink disabled">{this.props.course_store.currentIndex + 1 + ' / ' + this.props.course_store.schedules.length}</button>
                                <button className="ui button brown" onClick={() => this.clickButton(1)}><i
                                    className="fas fa-arrow-right"/></button>
                            </div>
                        </div>
                        <div className="schedule-column">
                            {this.props.course_store.searching ?
                                (<i className="spinner fas fa-spinner fa-spin"/>) :
                                this.props.course_store.schedules.length > 0 ?
                                    <Schedule scheduleInfo={this.props.course_store.getSchedule.info}
                                              sections={this.scheduleObjectsToArray(this.props.course_store.getSchedule)}/>
                                    :
                                    <div style={{maxWidth: '500px'}} className="ui warning message">
                                        <div style={{textAlign: 'center'}} className="header">
                                            Search for courses then generate schedules
                                        </div>
                                    </div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    scheduleObjectsToArray = (schedule) => {
        const scheduleArr = [];
        for (let course of Object.keys(schedule.schedule)) {
            for (let section of Object.keys(schedule.schedule[course])) {
                scheduleArr.push(schedule.schedule[course][section]);
            }
        }
        return scheduleArr;
    };

    clickButton = (way) => {
        this.props.course_store.scrollSchedules(way);
    }

}

App.propTypes = {
    course_store: PropTypes.object,
};
export default inject("course_store")(observer(App));
