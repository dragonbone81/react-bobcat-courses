import React, {Component} from "react";
import PropTypes from "prop-types";
import ScheduleDisplaySection from './ScheduleDisplaySection'
import GenerateSchedules from './GenerateSchedules'
import OptionsModal from './OptionsModal'
import CourseSearch from './CourseSearch'
import CourseList from './CourseList'
import ScheduleControls from './ScheduleControls'
import {Icon, Header} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {toast} from 'react-toastify';

class GenerateSchedulesPage extends Component {
    state = {
        modalOpen: false,
    };
    changeModalState = () => {
        if (this.state.modalOpen) {
            this.props.course_store.filterOptionsChangedRegenerate();
        }
        this.setState({modalOpen: !this.state.modalOpen})
    };

    componentDidMount() {
        document.title = "BobcatCourses | Search";
    }

    saveSchedule = async () => {
        const response = await this.props.course_store.saveSchedule(this.props.auth_store.auth.token);
        if (response.success)
            toast.success('Schedule Saved', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        else if (response.error)
            toast.error('Could not save Schedule (Max Schedules reached)', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        else if (response.errorToken)
            toast.error('Could not perform action please login again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
    };

    render() {
        return (
            <div className="flex-container">
                <OptionsModal open={this.state.modalOpen}
                              changeModalState={this.changeModalState}/>
                <div className="cog-setting-icon">
                    <Icon style={{cursor: 'pointer'}} onClick={this.changeModalState} name="cog"/>
                </div>
                <div style={{textAlign: 'center', marginTop: 5}} className="column-search">
                    <Header
                        size='medium'>{this.props.course_store.terms.find((term) => term.value === this.props.course_store.selectedTermGenerateSchedule).text}</Header>
                    <CourseSearch/>
                    <CourseList/>
                    <GenerateSchedules scheduleSearch={this.props.course_store.scheduleSearch}/>
                </div>
                <div className="column-calendar">
                    <ScheduleControls searching={this.props.course_store.searching}
                                      schedulesLength={this.props.course_store.schedules.length}
                                      clickButton={this.props.course_store.scrollSchedules}
                                      currentIndex={this.props.course_store.currentIndex}
                                      scheduleType={'generate'}
                                      isLoggedIn={this.props.auth_store.isLoggedIn}
                                      buttonAction={this.saveSchedule}
                                      buttonActionRunning={this.props.course_store.savingSchedule}/>
                    <ScheduleDisplaySection searching={this.props.course_store.searching}
                                            schedulesLength={this.props.course_store.schedules.length}
                                            scheduleInfo={this.props.course_store.getSchedule.info}
                                            schedule={this.props.course_store.getSchedule}
                                            scheduleObjectsToArray={this.props.course_store.scheduleObjectsToArray}
                                            noSchedulesFound={this.props.course_store.noSchedulesFound}/>
                </div>
            </div>
        )
    }
}

GenerateSchedulesPage.propTypes = {
    course_store: PropTypes.object,
    auth_store: PropTypes.object,
};
export default inject("course_store", "auth_store")(observer(GenerateSchedulesPage));