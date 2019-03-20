import React from 'react'
import {Button} from 'semantic-ui-react'

const GenerateSchedules = (props) => {
    return (
        <Button fluid style={{marginTop: 10, textAlign: 'center'}} color="olive"
                onClick={props.scheduleSearch}>
            Generate
        </Button>
    )
};

export default GenerateSchedules