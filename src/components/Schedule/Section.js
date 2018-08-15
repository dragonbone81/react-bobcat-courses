import React from 'react';

const Section = (props) => {
    return (
        <div key={props.section.crn} className="hour-slot" style={{
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            top: props.top,
            borderLeft: `3px solid ${props.color ? props.color.slice(0, -6) + ')' : null}`,
            backgroundColor: props.color,
            height: props.height,
            display: 'block',
            borderRadius: 5,
            cursor: 'pointer',
            color: '#5b5b5b'
        }}>
            <div className="title"
                 style={{fontSize: 14}}>{props.section.course_id}</div>
        </div>
    )
};
export default Section