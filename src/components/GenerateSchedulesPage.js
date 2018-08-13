import React, {Component} from "react";
import PropTypes from "prop-types";
import ScheduleDisplaySection from './ScheduleDisplaySection'
import GenerateSchedules from './GenerateSchedules'
import CourseSearch from './CourseSearch'
import CourseList from './CourseList'
import ScheduleControls from './ScheduleControls'
import {inject, observer} from "mobx-react/index";

class GenerateSchedulesPage extends Component {
    componentDidMount() {
        document.title = "BobcatCourses | Search";
    }

    render() {
        return (
            <div className="flex-container">
                <div className="column-search">
                    <CourseSearch/>
                    <CourseList/>
                    <GenerateSchedules scheduleSearch={this.props.course_store.scheduleSearch}/>
                </div>
                <div className="column-calendar">
                    <ScheduleControls searching={this.props.course_store.searching}
                                      schedulesLength={this.props.course_store.schedules.length}
                                      clickButton={this.props.course_store.scrollSchedules}
                                      currentIndex={this.props.course_store.currentIndex}/>
                    <ScheduleDisplaySection searching={this.props.course_store.searching}
                                            schedulesLength={this.props.course_store.schedules.length}
                                            scheduleInfo={this.props.course_store.getSchedule.info}
                                            schedule={this.props.course_store.getSchedule}
                                            scheduleObjectsToArray={this.scheduleObjectsToArray}/>
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

GenerateSchedulesPage.propTypes = {
    course_store: PropTypes.object,
};
export default inject("course_store")(observer(GenerateSchedulesPage));