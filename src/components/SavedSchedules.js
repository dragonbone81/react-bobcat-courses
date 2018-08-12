import React, {Component} from 'react'
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import ScheduleControls from './ScheduleControls'
import ScheduleDisplaySection from './ScheduleDisplaySection'

class SavedSchedules extends Component {
    componentDidMount() {
        this.props.course_store.getSavedSchedules(this.props.auth_store.auth.token).then()
    }

    componentWillUnmount() {
        this.props.course_store.unmountSavedSchedules();
    }

    render() {
        return (
            <div className="flex-container">
                <div className="column-calendar">
                    {this.props.auth_store.isLoggedIn ?
                        <div>
                            <div className="saved-schedules-label">Your saved schedules</div>
                            <ScheduleControls searching={this.props.course_store.searchingSaved}
                                              schedulesLength={this.props.course_store.savedSchedules.length}
                                              clickButton={this.props.course_store.scrollSavedSchedules}
                                              currentIndex={this.props.course_store.currentSavedIndex}/>
                            <ScheduleDisplaySection searching={this.props.course_store.searchingSaved}
                                                    schedulesLength={this.props.course_store.savedSchedules.length}
                                                    scheduleInfo={this.props.course_store.getSavedSchedule.info}
                                                    schedule={this.props.course_store.getSavedSchedule}
                                                    scheduleObjectsToArray={this.scheduleObjectsToArray}/>
                        </div>
                        :
                        <div style={{maxWidth: '500px', margin: 'auto', marginBottom: 10, marginTop: 10}}
                             className="ui warning message">
                            <div style={{textAlign: 'center'}} className="header">
                                Please Login
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
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
}

SavedSchedules.propTypes = {
    course_store: PropTypes.object,
    auth_store: PropTypes.object,
};
export default inject("course_store", "auth_store")(observer(SavedSchedules));