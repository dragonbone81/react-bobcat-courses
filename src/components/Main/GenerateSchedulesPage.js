import React, {Component} from "react";
import PropTypes from "prop-types";
import ScheduleDisplaySection from '../Schedule/ScheduleDisplaySection'
import GenerateSchedules from './GenerateSchedules'
import OptionsModal from '../Modals/OptionsModal'
import SectionsModal from '../Modals/SectionsModal'
import CourseSearch from '../Courses/CourseSearch'
import CourseList from '../Courses/CourseList'
import ScheduleControls from '../Schedule/ScheduleControls'
import {Icon, Header} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";
import {toast} from 'react-toastify';

class GenerateSchedulesPage extends Component {
    state = {
        modalOpen: false,
        sectionsModalOpen: false,
        sectionSelectedForModal: '',
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

    render() {
        return (
            <div className="flex-container">
                <OptionsModal open={this.state.modalOpen}
                              changeModalState={this.changeModalState}/>
                <SectionsModal section={this.state.sectionSelectedForModal} open={this.state.sectionsModalOpen}
                               changeModalState={this.changeSectionsModalState}/>
                <div className="cog-setting-icon">
                    <Icon style={{cursor: 'pointer'}} onClick={this.changeModalState} name="edit"/>
                </div>
                <div style={{textAlign: 'center', marginTop: 5}} className="column-search">
                    <Header
                        size='medium'>{this.props.course_store.terms.find((term) => term.value === this.props.course_store.selectedTermGenerateSchedule).text}</Header>
                    <CourseSearch/>
                    <CourseList openSectionsModal={this.openSectionsModal}/>
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