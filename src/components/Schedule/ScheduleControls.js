import React, {Component} from 'react'
import {Button, Icon} from 'semantic-ui-react'

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
                    <Button color="grey" icon onClick={() => this.props.clickButton(1)}><Icon name="arrow right"/></Button>
                </div>
            </div>
        )
    }
}

export default ScheduleControls