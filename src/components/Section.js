import React from 'react';

const Section = (props) => {
    return (
        <div key={props.section.crn} className="hour-slot" style={{
            width: '100%',
            opacity: .8,
            position: 'absolute',
            zIndex: 1,
            top: props.top,
            borderLeft: '1px solid gray',
            backgroundColor: props.color,
            height: props.height,
            display: 'block',
            borderRadius: 5,
            cursor: 'pointer'
        }}>
            <div className="title"
                 style={{opacity: 1, fontSize: 14}}>{props.section.course_id}</div>
        </div>
    )
};
export default Section