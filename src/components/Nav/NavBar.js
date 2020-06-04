import React, {Component} from 'react'
import {Menu, Icon} from 'semantic-ui-react'
import logo from '../../logo/logo.png'
import SideBar from './SideBar'
import {withRouter} from 'react-router-dom'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";


class NavBar extends Component {
    state = {
        activeItem: this.props.location.pathname,
        windowWidth: window.innerWidth,
        sideBarOpen: false,
    };

    componentDidMount() {
        window.addEventListener('resize', this.resizeWindowHandler);
    }

    resizeWindowHandler = () => {
        this.setState({windowWidth: window.innerWidth});
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeWindowHandler);
    }

    handleItemClick = (e, {name}) => {
        this.props.history.push(name);
        this.setState({activeItem: name, sideBarOpen: false});
    };
    sideBarButton = () => this.setState({sideBarOpen: !this.state.sideBarOpen});

    hideSideBar = () => this.setState({sideBarOpen: false});

    render() {
        const {activeItem} = this.state;
        const isMobile = this.state.windowWidth <= 680;
        return (
            <div style={{margin: 'auto', marginTop: -10, marginBottom: 10, maxWidth: 1200}}>
                <SideBar logout={() => {
                    this.props.auth_store.logout();
                    this.hideSideBar();
                }}
                         isLoggedIn={this.props.auth_store.isLoggedIn}
                         hideSideBar={this.hideSideBar}
                         visible={this.state.sideBarOpen} navigate={this.handleItemClick}
                         activeItem={this.state.activeItem}
                         isMobile={isMobile}
                         user={this.props.auth_store.user}/>
                {!isMobile ?
                    <Menu>
                        <Menu.Item style={{fontWeight: "bolder", fontSize: 18, margin: -6}} name='/schedules/search'
                                   onClick={this.handleItemClick}>
                            <img style={{margin: -20, marginRight: 8, marginLeft: -12, width: 36}} alt="logo"
                                 src={logo}/> BobcatCourses
                        </Menu.Item>
                        <Menu.Item
                            name='/schedules/search'
                            active={activeItem === '/schedules/search'}
                            onClick={this.handleItemClick}
                        >Plan Schedules</Menu.Item>
                        <Menu.Item
                            name='/schedules/saved'
                            active={activeItem === '/schedules/saved'}
                            onClick={this.handleItemClick}
                        >Saved Schedules</Menu.Item>
                        {/*<Menu.Item*/}
                        {/*name='/waitlists'*/}
                        {/*active={activeItem === '/waitlists'}*/}
                        {/*onClick={this.handleItemClick}*/}
                        {/*>Waitlists</Menu.Item>*/}
                        <Menu.Item
                            name='/about'
                            active={activeItem === '/about'}
                            onClick={this.handleItemClick}
                        >About</Menu.Item>
                        <Menu.Menu position='right'>
                            {this.props.auth_store.isLoggedIn ?
                                <Menu.Item
                                    name='hamburger'
                                    onClick={this.sideBarButton}
                                ><Icon style={{margin: -10, marginLeft: 0, marginRight: 0, padding: 0, fontSize: 25}}
                                       name="bars"/></Menu.Item>
                                :
                                <Menu.Item
                                    name='/login'
                                    active={activeItem === '/login'}
                                    onClick={this.handleItemClick}
                                >Login</Menu.Item>
                            }
                        </Menu.Menu>
                    </Menu>
                    :
                    <Menu>
                        <Menu.Item style={{fontWeight: "bolder", fontSize: 18, margin: -6}}
                                   active={activeItem === '/schedules/search'}
                                   name='/schedules/search'
                                   onClick={this.handleItemClick}>
                            <img style={{margin: -20, marginRight: 8, marginLeft: -12, width: 36}} width="500"
                                 alt="logo" src={logo}/> BobcatCourses
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name='hamburger'
                                onClick={this.sideBarButton}
                            ><Icon style={{margin: -10, marginLeft: 0, marginRight: 0, padding: 0, fontSize: 25}}
                                   name="bars"/></Menu.Item>
                        </Menu.Menu>
                    </Menu>
                }
            </div>
        )
    }
}

NavBar.propTypes = {
    auth_store: PropTypes.object,
};
export default withRouter(inject("auth_store")(observer(NavBar)))