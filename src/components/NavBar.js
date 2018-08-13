import React, {Component} from 'react'
import {Menu} from 'semantic-ui-react'
import logo from '../logo/logo.png'
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
        this.setState({activeItem: name});
    };
    sideBarButton = () => this.setState({sideBarOpen: !this.state.sideBarOpen});

    hideSideBar = () => this.setState({sideBarOpen: false});


    render() {
        const {activeItem} = this.state;
        const isMobile = this.state.windowWidth <= 500;
        return (
            <div style={{marginBottom: 10}}>
                <SideBar logout={this.props.auth_store.logout} isLoggedIn={this.props.auth_store.isLoggedIn}
                         hideSideBar={this.hideSideBar}
                         visible={this.state.sideBarOpen} navigate={this.handleItemClick}
                         activeItem={this.state.activeItem}/>
                {!isMobile ?
                    <Menu>
                        <Menu.Item name='/schedules/search' active={activeItem === '/schedules/search'}
                                   onClick={this.handleItemClick}>
                            <img style={{paddingRight: 10}} width="500" alt="logo" src={logo}/> BobcatCourses
                        </Menu.Item>
                        <Menu.Item
                            name='/schedules/saved'
                            active={activeItem === '/schedules/saved'}
                            onClick={this.handleItemClick}
                        >Saved Schedules</Menu.Item>
                        <Menu.Menu position='right'>
                            {this.props.auth_store.isLoggedIn ?
                                <Menu.Item
                                    onClick={this.props.auth_store.logout}
                                >Logout</Menu.Item>
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
                        <Menu.Item active={activeItem === '/schedules/search'} name='/schedules/search'
                                   onClick={this.handleItemClick}>
                            <img style={{paddingRight: 10}} width="500" alt="logo" src={logo}/> BobcatCourses
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name='hamburger'
                                onClick={this.sideBarButton}
                            ><i className="fas fa-bars"/></Menu.Item>
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