import React, {Component} from 'react'
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {observe} from 'mobx';
import ScheduleControls from '../Schedule/ScheduleControls'
import ScheduleDisplaySection from '../Schedule/ScheduleDisplaySection'
import {toast} from "react-toastify";

class SavedSchedules extends Component {
    state = {
        observeAuth: null,
        savingSchedule: false,
    };

    componentDidMount() {
        document.title = "BobcatCourses | Saved";
        if (this.props.auth_store.isLoggedIn)
            this.props.course_store.getSavedSchedules(this.props.auth_store.auth.token).then();

        const observeAuthChange = observe(this.props.auth_store.auth, "token", (change) => {
            this.props.course_store.getSavedSchedules(this.props.auth_store.auth.token).then();
        });
        this.setState({observeAuth: observeAuthChange})
    }

    componentWillUnmount() {
        this.props.course_store.unmountSavedSchedules();
        this.state.observeAuth();
    }

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
    saveToGoogle = async () => {
        this.setState({savingSchedule: true});
        //wait for authentication to happen
        await this.props.auth_store.authenticateGoogle();
        await this.props.course_store.saveToGoogle(
            this.props.course_store.getSavedSchedule,
            this.props.auth_store.createGoogleCalendar,
            this.props.auth_store.googleAuth.token,
            "BobcatCourses Schedule"
        );
        this.setState({savingSchedule: false});
        toast.success('Schedule saved to your calendar', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };
    saveToMicrosoft = async () => {
        this.setState({savingSchedule: true});
        //wait for authentication to happen
        await this.props.auth_store.authenticateMicrosoft();
        await this.props.course_store.saveToMicrosoft(
            this.props.course_store.getSavedSchedule,
            this.props.auth_store.createMicrosoftCalendar,
            this.props.auth_store.microsoftAuth.token,
            "BobcatCourses Schedule"
        );
        this.setState({savingSchedule: false});
        toast.success('Schedule saved to your calendar', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };
    saveToApple = () => {
        this.props.course_store.createICS(this.props.course_store.getSavedSchedule);
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
                                              buttonActionRunning={this.props.course_store.deletingSchedule}
                                              saveToGoogle={this.saveToGoogle}
                                              saveToMicrosoft={this.saveToMicrosoft}
                                              saveToApple={this.saveToApple}
                                              savingSchedule={this.state.savingSchedule}
                            />
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