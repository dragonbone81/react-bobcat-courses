import React, {Component} from 'react'
import {Button, Icon, Popup, List} from 'semantic-ui-react'
import {inject, observer} from "mobx-react";

class ScheduleControls extends Component {
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = ({key}) => {
        if (key === "ArrowLeft")
            this.props.clickButton(-1);
        else if (key === "ArrowRight")
            this.props.clickButton(1);
    };

    render() {
        const display = this.props.searching || this.props.schedulesLength === 0 ? {
            visibility: 'hidden',
            height: 0
        } : {};
        return (
            <div className="schedule-button-controls" style={display}>
                {this.props.isLoggedIn ?
                    this.props.scheduleType === 'generate' ?
                        <div className="delete-option">
                            <Button className="save-button-control" loading={this.props.buttonActionRunning}
                                    onClick={this.props.buttonAction}
                                    color="teal">Save</Button>
                        </div>
                        : this.props.scheduleType === 'saved' ?
                        <div className="delete-option">
                            <Button className="save-button-control" loading={this.props.buttonActionRunning}
                                    onClick={this.props.buttonAction}
                                    color="pink">Delete</Button>
                        </div>
                        : null
                    :
                    null}
                <div className="ui buttons">
                    <Button color="grey" icon onClick={() => this.props.clickButton(-1)}><Icon
                        name="arrow left"/></Button>
                    <Button color="black" disabled>
                        <div
                            style={{color: 'white'}}>{this.props.currentIndex + 1 + ' / ' + this.props.schedulesLength}</div>
                    </Button>
                    <Button color="grey" icon onClick={() => this.props.clickButton(1)}><Icon
                        name="arrow right"/></Button>
                </div>
                <div className="calendar-option">
                    <Popup position="right center" on='click' trigger={
                        <Button loading={this.props.savingSchedule} icon className="save-button-control"

                                color="teal"><Icon name="calendar alternate outline"/></Button>
                    }>
                        <Popup.Header>Add to you calendar</Popup.Header>
                        <Popup.Content>
                            <List selection divided relaxed>
                                <List.Item onClick={this.props.saveToGoogle}>
                                    <List.Icon name='google' size='large' verticalAlign='middle'/>
                                    <List.Content>
                                        <List.Description>Add to Google Calendar</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item onClick={this.props.saveToMicrosoft}>
                                    <List.Icon name='microsoft' size='large' verticalAlign='middle'/>
                                    <List.Content>
                                        <List.Description>Add to Outlook</List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                </div>
            </div>
        )
    }
}

export default inject("auth_store", "course_store")(observer(ScheduleControls))