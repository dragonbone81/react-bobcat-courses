import React, {Component} from 'react'
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {observe} from 'mobx';
import ScheduleControls from './ScheduleControls'
import ScheduleDisplaySection from './ScheduleDisplaySection'
import {toast} from "react-toastify";

class SavedSchedules extends Component {
    componentDidMount() {
        document.title = "BobcatCourses | Saved";
        this.props.course_store.getSavedSchedules(this.props.auth_store.auth.token).then();
    }

    componentWillUnmount() {
        this.props.course_store.unmountSavedSchedules();
    }

    observeAuthChange = observe(this.props.auth_store.auth, "token", (change) => {
        this.props.course_store.getSavedSchedules(this.props.auth_store.auth.token).then();
    });

    deleteSchedule = async () => {
        const response = await this.props.course_store.deleteSchedule(this.props.auth_store.auth.token);
        if (response.success)
            toast.success('Schedule Deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        else if (response.error)
            toast.error('Could not delete Schedule (Might have already been deleted)', {
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
                <div className="column-calendar">
                    {this.props.auth_store.isLoggedIn ?
                        <div>
                            <div className="saved-schedules-label">Your saved schedules</div>
                            <ScheduleControls searching={this.props.course_store.searchingSaved}
                                              schedulesLength={this.props.course_store.savedSchedules.length}
                                              clickButton={this.props.course_store.scrollSavedSchedules}
                                              currentIndex={this.props.course_store.currentSavedIndex}
                                              scheduleType={'saved'}
                                              isLoggedIn={this.props.auth_store.isLoggedIn}
                                              buttonAction={this.deleteSchedule}
                                              buttonActionRunning={this.props.course_store.deletingSchedule}/>
                            <ScheduleDisplaySection searching={this.props.course_store.searchingSaved}
                                                    schedulesLength={this.props.course_store.savedSchedules.length}
                                                    scheduleInfo={this.props.course_store.getSavedSchedule.info}
                                                    schedule={this.props.course_store.getSavedSchedule}
                                                    scheduleObjectsToArray={this.props.course_store.scheduleObjectsToArray}
                                                    savedSchedulesRendering={true}/>
                        </div>
                        :
                        <div>
                            <div className="saved-schedules-label">Your saved schedules</div>
                            {this.props.auth_store.loggingIn ?
                                <div style={{maxWidth: '500px', margin: 'auto', marginBottom: 10, marginTop: 10}}
                                     className="ui warning message">
                                    <div style={{textAlign: 'center'}} className="header">
                                        Logging In
                                    </div>
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
                    }
                </div>
            </div>
        )
    }
}

SavedSchedules.propTypes = {
    course_store: PropTypes.object,
    auth_store: PropTypes.object,
};
export default inject("course_store", "auth_store")(observer(SavedSchedules));