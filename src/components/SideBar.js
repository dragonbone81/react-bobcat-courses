import React, {Component} from 'react'
import {Icon, Menu, Sidebar} from 'semantic-ui-react'

export default class SideNavBar extends Component {

    render() {
        return (
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={this.props.hideSideBar}
                vertical
                visible={this.props.visible}
                width='thin'
            >
                <Menu.Item name="/schedules/search" active={this.props.activeItem === '/schedules/search'}
                           onClick={this.props.navigate}>
                    <Icon name='home'/>
                    Search Schedules
                </Menu.Item>
                <Menu.Item name="/schedules/saved" active={this.props.activeItem === '/schedules/saved'}
                           onClick={this.props.navigate}>
                    <Icon name='save'/>
                    Saved Schedules
                </Menu.Item>
                {this.props.isLoggedIn ?
                    <Menu.Item as='a' onClick={this.props.logout}>
                        <Icon name='sign out alternate'/>
                        Logout
                    </Menu.Item>
                    :
                    <Menu.Item name="/login" active={this.props.activeItem === '/login'} as='a'
                               onClick={this.props.navigate}>
                        <Icon name='sign in alternate'/>
                        Login
                    </Menu.Item>
                }
            </Sidebar>
        )
    }
}