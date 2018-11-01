import React, {Component} from 'react'
import {Form, Checkbox, Modal} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";

class OptionsModal extends Component {
    onChangeTerm = (e, {value}) => {
        this.props.course_store.changeSelectedTermGenerateSchedule(value);
    };
    onChangeDays = (e, {value}) => {
        this.props.course_store.changeSelectedDaysFilter(value);
    };
    onChangeGaps = (e, {value}) => {
        this.props.course_store.changeSelectedGapsFilter(value);
    };
    onChangeEarliestTime = (e, {value}) => {
        this.props.course_store.changeFilterOptionsChanged();
        this.props.course_store.changeSelectedEarliestTime(value);
    };
    onChangeLatestTime = (e, {value}) => {
        this.props.course_store.changeFilterOptionsChanged();
        this.props.course_store.changeSelectedLatestTime(value);
    };
    onChangeFull = () => {
        this.props.course_store.changeFilterOptionsChanged();
        this.props.course_store.changeSelectedFullFilter();
    };

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.changeModalState} closeIcon>
                <Modal.Header>Options</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Select fluid onChange={this.onChangeTerm}
                                     value={this.props.course_store.selectedTermGenerateSchedule}
                                     options={this.props.course_store.terms}/>

                        <Form.Group inline>
                            <label>Gaps:</label>
                            <Form.Field>
                                <Checkbox onChange={this.onChangeGaps} checked={this.props.course_store.gaps === 'asc'}
                                          label='Min Gaps'
                                          value='asc'/>
                            </Form.Field>
                            <Form.Field>
                                <Checkbox onChange={this.onChangeGaps} checked={this.props.course_store.gaps === 'desc'}
                                          label='Max Gaps'
                                          value='desc'/>
                            </Form.Field>
                        </Form.Group>
                        <Form.Group inline>
                            <label>Days:</label>
                            <Form.Field>
                                <Checkbox onChange={this.onChangeDays} checked={this.props.course_store.days === 'asc'}
                                          label='Min Days'
                                          value='asc'/>
                            </Form.Field>
                            <Form.Field>
                                <Checkbox onChange={this.onChangeDays} checked={this.props.course_store.days === 'desc'}
                                          label='Max Days'
                                          value='desc'/>
                            </Form.Field>
                        </Form.Group>
                        <Form.Group inline>
                            <label>Include Schedules w/ Full Classes:</label>
                            <Form.Field>
                                <Checkbox onChange={this.onChangeFull} checked={this.props.course_store.full}
                                          label={this.props.course_store.full ? 'Yes' : 'No'}/>
                            </Form.Field>
                        </Form.Group>
                        <Form.Group inline>
                            <label>Time Filters:</label>
                            <div style={{paddingBottom: 5, paddingTop: 5}}>
                                <Form.Select onChange={this.onChangeEarliestTime}
                                             value={this.props.course_store.selectedEarliestTime}
                                             options={this.props.course_store.earliestTimes}/>
                            </div>
                            <div>
                                <Form.Select onChange={this.onChangeLatestTime}
                                             value={this.props.course_store.selectedLatestTime}
                                             options={this.props.course_store.latestTimes}/>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default inject("course_store")(observer(OptionsModal))