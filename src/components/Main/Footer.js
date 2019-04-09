import React from 'react'
import {Segment, Container, Icon} from 'semantic-ui-react'
import {Link, withRouter} from 'react-router-dom';

const Footer = (props) => {
    return (
        <div className="footer">
            <Segment inverted vertical style={{borderRadius: 10}}>
                <Container textAlign='center'>
                    <h4 className="ui inverted header">&copy; Copyright {(new Date().getFullYear())} | BobcatCourses</h4>
                    Front: <a target="_blank" rel="noopener noreferrer"
                              href="https://github.com/dragonbone81/react-bobcat-courses"><Icon
                    size="big" name="github square" link/></a>
                    Back: <a target="_blank" rel="noopener noreferrer"
                             href="https://github.com/dragonbone81/bobcat-courses-backend"><Icon
                    size="big" name="github square" link/></a>
                    About: <Link to="/about"><Icon size="big" name="paw"/></Link>
                    {props.location.pathname === '/about' ?
                        <span>Privacy: <a rel="noopener noreferrer" target="_blank"
                                         href="https://cse120-course-planner.herokuapp.com/app/bobcat-courses/privacy"><Icon
                            size="big" name="key"/></a>
                        </span> : null}
                </Container>
            </Segment>
        </div>
    )
};

export default withRouter(Footer)
