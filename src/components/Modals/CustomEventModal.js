import React, {Component} from 'react'
import {Form, Checkbox, Message, Modal, Button} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";

class CustomEventModal extends Component {
    state = {
        eventName: '',
        selectedFromTime: 700,
        selectedToTime: 730,
        selectedDays: '',
        error: false,
        warning: false,
        errorMessage: '',
        warningMessage: '',
    };
    timeOptions = [
        {text: '7:00am', value: 700},
        {text: '7:30am', value: 730},
        {text: '8:00am', value: 800},
        {text: '8:30am', value: 830},
        {text: '9:00am', value: 900},
        {text: '9:30am', value: 930},
        {text: '10:00am', value: 1000},
        {text: '10:30am', value: 1030},
        {text: '11:00am', value: 1100},
        {text: '11:30am', value: 1130},
        {text: '12:00pm', value: 1200},
        {text: '12:30pm', value: 1230},
        {text: '1:00pm', value: 1300},
        {text: '1:30pm', value: 1330},
        {text: '2:00pm', value: 1400},
        {text: '2:30pm', value: 1430},
        {text: '3:00pm', value: 1500},
        {text: '3:30pm', value: 1530},
        {text: '4:00pm', value: 1600},
        {text: '4:30pm', value: 1630},
        {text: '5:00pm', value: 1700},
        {text: '5:30pm', value: 1730},
        {text: '6:00pm', value: 1800},
        {text: '6:30pm', value: 1830},
        {text: '7:00pm', value: 1900},
        {text: '7:30pm', value: 1930},
        {text: '8:00pm', value: 2000},
        {text: '8:30pm', value: 2030},
        {text: '9:00pm', value: 2100},
        {text: '9:30pm', value: 2130},
        {text: '10:00pm', value: 2200},
        {text: '10:30pm', value: 2230},
        {text: '11:00pm', value: 2300},
    ];

    componentDidMount() {
        if (this.props.editEvent) {
            const event = this.props.course_store.customEvents.find((event) => event.event_name === this.props.editEventName);
            this.setState({
                eventName: event.event_name,
                selectedFromTime: event.start_time,
                selectedToTime: event.end_time,
                selectedDays: event.days,
                error: false,
            })
        }
    }

    selectDate = (value) => {
        if (this.state.selectedDays.split('').includes(value)) {
            this.setState({selectedDays: this.state.selectedDays.split('').filter((val) => val !== value).join('')})
        } else {
            const newArr = this.state.selectedDays.split('');
            newArr.push(value);
            this.setState({selectedDays: newArr.join('')})
        }
    };
    changeFromTime = (e, {value}) => {
        this.setState({selectedFromTime: value})
    };
    changeToTime = (e, {value}) => {
        this.setState({selectedToTime: value})
    };
    submitForm = () => {
        this.setState({error: false});
        if (this.state.selectedDays === '') {
            this.setState({error: true, errorMessage: 'You must select at least one day.'});
            return;
        }
        if (this.state.selectedToTime <= this.state.selectedFromTime) {
            this.setState({error: true, errorMessage: 'The ending time must be after the starting time.'});
            return;
        }
        if (!this.props.editEvent && this.props.course_store.customEvents.filter(event => event.event_name === this.state.eventName).length > 0) {
            this.setState({warning: true, warningMessage: `You already have an event named ${this.state.eventName}.`});
            return;
        }
        this.props.submitCustomEvent();
        this.props.course_store.addCourse({
            event_name: this.state.eventName,
            start_time: this.state.selectedFromTime,
            end_time: this.state.selectedToTime,
            days: this.state.selectedDays,
        });

    };

    render() {
        return (
            <Modal size="tiny" open={this.props.open} onClose={this.props.changeModalState} closeIcon>
                <Modal.Header>Options</Modal.Header>
                <Modal.Content>
                    <Form warning={this.state.warning} error={this.state.error} onSubmit={this.submitForm}>
                        <Message
                            error
                            header={this.state.errorMessage}
                        />
                        <Message
                            warning
                            header={this.state.warningMessage}
                        />
                        <Form.Field inline>
                            <label>Event Name:</label>
                            <input required type="text" onChange={({target}) => {
                                this.setState({eventName: target.value})
                            }} value={this.state.eventName}
                                   placeholder='Event name...'/>
                        </Form.Field>
                        <Form.Group inline>
                            <label>From:</label>
                            <Form.Select fluid onChange={this.changeFromTime}
                                         value={this.state.selectedFromTime}
                                         options={this.timeOptions}/>
                            <label>To:</label>
                            <Form.Select fluid onChange={this.changeToTime}
                                         value={this.state.selectedToTime}
                                         options={this.timeOptions}/>
                        </Form.Group>
                        <Form.Group inline>
                            <label>Days:</label>
                            <Form.Field inline>
                                <Checkbox checked={this.state.selectedDays.split('').includes('M')}
                                          onClick={() => this.selectDate('M')} value='M' label='Mon'/>
                            </Form.Field>
                            <Form.Field inline>
                                <Checkbox checked={this.state.selectedDays.split('').includes('T')}
                                          onClick={() => this.selectDate('T')} value='T' label='Tue'/>
                            </Form.Field>
                            <Form.Field inline>
                                <Checkbox checked={this.state.selectedDays.split('').includes('W')}
                                          onClick={() => this.selectDate('W')} value='W' label='Wed'/>
                            </Form.Field>
                            <Form.Field inline>
                                <Checkbox checked={this.state.selectedDays.split('').includes('R')}
                                          onClick={() => this.selectDate('R')} value='R' label='Thu'/>
                            </Form.Field>
                            <Form.Field inline>
                                <Checkbox checked={this.state.selectedDays.split('').includes('F')}
                                          onClick={() => this.selectDate('F')} value='F' label='Fri'/>
                            </Form.Field>
                        </Form.Group>
                        <Button fluid type='submit'>{this.props.editEvent ? <div>Save</div> : <div>Add</div>}</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


export default inject("course_store")(observer(CustomEventModal))