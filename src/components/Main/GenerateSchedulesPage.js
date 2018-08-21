import React, {Component} from "react";
import PropTypes from "prop-types";
import ScheduleDisplaySection from '../Schedule/ScheduleDisplaySection'
import GenerateSchedules from './GenerateSchedules'
import OptionsModal from '../Modals/OptionsModal'
import SectionsModal from '../Modals/SectionsModal'
import CustomEventModal from '../Modals/CustomEventModal'
import CourseSearch from '../Courses/CourseSearch'
import CourseList from '../Courses/CourseList'
import ScheduleControls from '../Schedule/ScheduleControls'
import {Icon, Header} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {toast} from 'react-toastify';
import {Button} from 'semantic-ui-react'

class GenerateSchedulesPage extends Component {
    state = {
        modalOpen: false,
        sectionsModalOpen: false,
        customEventModalOpen: false,
        sectionSelectedForModal: '',
        editEvent: false,
        editEventName: '',
        savingScheduleToGoogle: false,
    };
    changeSectionsModalState = () => {
        if (this.state.sectionsModalOpen) {
            this.setState({sectionSelectedForModal: ''});
            this.props.course_store.filterOptionsChangedRegenerate();
        }
        this.setState({sectionsModalOpen: !this.state.sectionsModalOpen})
    };

    changeModalState = () => {
        if (this.state.modalOpen) {
            this.props.course_store.filterOptionsChangedRegenerate();
        }
        this.setState({modalOpen: !this.state.modalOpen})
    };
    openSectionsModal = (section) => {
        this.setState({sectionsModalOpen: true, sectionSelectedForModal: section})
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
        if (response.type === 'already_exists') {
            toast.warn(`Could not save Schedule (Schedule Already Exists). It is schedule number ${response.schedule_index + 1}.`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
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
    addCustomEvent = () => {
        this.setState({customEventModalOpen: true})
    };
    submitCustomEvent = () => {
        if (this.state.editEvent) {
            toast.success('Event Saved', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            toast.success('Event Added', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        this.setState({customEventModalOpen: false, editEvent: false, editEventName: ''});
        this.props.course_store.scheduleSearch().then();
    };
    closeEventModal = () => {
        this.setState({customEventModalOpen: false, editEvent: false, editEventName: ''});
    };
    editSection = (event_name) => {
        this.setState({
            editEvent: true,
            editEventName: event_name,
            customEventModalOpen: true,
        })
    };
    saveToGoogle = async () => {
        this.setState({savingScheduleToGoogle: true});
        //wait for authentication to happen
        await this.props.auth_store.authenticateGoogle();
        await this.props.course_store.saveToGoogle(
            this.props.course_store.getSchedule,
            this.props.auth_store.createGoogleCalendar,
            this.props.auth_store.googleAuth.token,
            "BobcatCourses Schedule"
        );
        this.setState({savingScheduleToGoogle: false});
        toast.success('Schedule saved to your calendar', {
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
                <SectionsModal section={this.state.sectionSelectedForModal} open={this.state.sectionsModalOpen}
                               changeModalState={this.changeSectionsModalState}/>
                {this.state.customEventModalOpen &&
                <CustomEventModal editEventName={this.state.editEventName} editEvent={this.state.editEvent}
                                  submitCustomEvent={this.submitCustomEvent} open={this.state.customEventModalOpen}
                                  changeModalState={this.closeEventModal}/>}
                <div className="cog-setting-icon">
                    <Icon style={{cursor: 'pointer'}} onClick={this.changeModalState} name="edit"/>
                </div>
                <div style={{textAlign: 'center', marginTop: 5}} className="column-search">
                    <Header
                        size='medium'>{this.props.course_store.terms.find((term) => term.value === this.props.course_store.selectedTermGenerateSchedule).text}</Header>
                    <CourseSearch/>
                    <CourseList openSectionsModal={this.openSectionsModal} editSection={this.editSection}/>
                    <GenerateSchedules
                        scheduleSearch={this.props.course_store.scheduleSearch}/>
                    <div className="course-item">
                        <Button onClick={this.addCustomEvent}>Add custom event</Button>
                    </div>
                </div>
                <div className="column-calendar">
                    <ScheduleControls searching={this.props.course_store.searching}
                                      schedulesLength={this.props.course_store.schedules.length}
                                      clickButton={this.props.course_store.scrollSchedules}
                                      currentIndex={this.props.course_store.currentIndex}
                                      scheduleType={'generate'}
                                      isLoggedIn={this.props.auth_store.isLoggedIn}
                                      buttonAction={this.saveSchedule}
                                      buttonActionRunning={this.props.course_store.savingSchedule}
                                      saveToGoogle={this.saveToGoogle}
                                      savingScheduleToGoogle={this.state.savingScheduleToGoogle}/>
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