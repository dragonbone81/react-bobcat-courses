import React, {Component} from 'react'

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
                <div className="ui buttons">
                    <button className="ui button grey" onClick={() => this.props.clickButton(-1)}><i
                        className="fas fa-arrow-left"/></button>
                    <button
                        className="ui button disabled black">
                        <div
                            style={{color: 'white'}}>{this.props.currentIndex + 1 + ' / ' + this.props.schedulesLength}</div>
                    </button>
                    <button className="ui button grey" onClick={() => this.props.clickButton(1)}><i
                        className="fas fa-arrow-right"/></button>
                </div>
            </div>
        )
    }
}

export default ScheduleControls