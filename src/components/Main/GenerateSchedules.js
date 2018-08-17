import React from 'react'
import {Button} from 'semantic-ui-react'

const GenerateSchedules = (props) => {
    return (
        <Button style={{marginTop: 10}} color="olive"
                onClick={props.scheduleSearch}>
            Generate
        </Button>
    )
};

export default GenerateSchedules