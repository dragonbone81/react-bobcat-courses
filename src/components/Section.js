import React from 'react';

const Section = (props) => {
    return (
        <div key={props.section.crn} className="hour-slot" style={{
            width: '100%',
            opacity: .7,
            position: 'absolute',
            zIndex: 1,
            top: props.top,
            borderLeft: '3px solid black',
            backgroundColor: 'rgb(200, 150, 0)',
            height: props.height,
            display: 'block',
        }}>
            <div className="title"
                 style={{opacity: 1, fontSize: 14}}>{props.section.course_id}</div>
        </div>
    )
};
export default Section