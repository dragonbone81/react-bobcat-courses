import React from 'react'

const ScheduleControls = (props) => {
    const display = props.searching || props.schedulesLength === 0 ? {
        visibility: 'hidden',
        height: 0
    } : {};
    return (
        <div className="schedule-button-controls" style={display}>
            <div className="ui buttons">
                <button className="ui button brown" onClick={() => props.clickButton(-1)}><i
                    className="fas fa-arrow-left"/></button>
                <button
                    className="ui button pink disabled">{props.currentIndex + 1 + ' / ' + props.schedulesLength}</button>
                <button className="ui button brown" onClick={() => props.clickButton(1)}><i
                    className="fas fa-arrow-right"/></button>
            </div>
        </div>
    )
};

export default ScheduleControls