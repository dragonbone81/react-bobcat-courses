import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'

const Auth = () => {
    return (
        <div>
            <Dimmer active>
                <Loader/>
            </Dimmer>
        </div>
    )
};

export default Auth