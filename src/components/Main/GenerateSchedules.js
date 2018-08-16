import React from 'react'

const GenerateSchedules = (props) => {
    return (
        <button style={{marginTop: 10}} className="ui button olive generate-button"
                onClick={props.scheduleSearch}>
            Generate
        </button>
    )
};

export default GenerateSchedules