import React, {Component} from 'react'
import {Button, Form, Input, Checkbox, Modal} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";

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
        this.props.course_store.changeSelectedEarliestTime(value);
    };
    onChangeFull = () => {
        this.props.course_store.changeSelectedFullFilter();
    };

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.changeModalState}>
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
                        <Form.Select fluid onChange={this.onChangeEarliestTime}
                                     value={this.props.course_store.changeSelectedEarliestTime}
                                     options={this.props.course_store.selectedEarliestTime}/>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default inject("course_store")(observer(OptionsModal))