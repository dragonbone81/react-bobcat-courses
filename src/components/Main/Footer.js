import React from 'react'
import {Segment, Container, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footer">
            <Segment inverted vertical style={{minHeight: '8vh'}}>
                <Container textAlign='center'>
                    <h4 className="ui inverted header">&copy; Copyright 2018 | BobcatCourses</h4>
                    Frontend: <a target="_blank" rel="noopener noreferrer"
                                 href="https://github.com/dragonbone81/react-bobcat-courses"><Icon
                    size="big" name="github square" link/></a>
                    Backend: <a target="_blank" rel="noopener noreferrer"
                                href="https://github.com/dragonbone81/bobcat-courses-backend"><Icon
                    size="big" name="github square" link/></a>
                    About: <Link to="/about"><Icon size="big" name="paw"/></Link>
                </Container>
            </Segment>
        </div>
    )
};

export default Footer