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
                    Home
                </Menu.Item>
                <Menu.Item name="/schedules/saved" active={this.props.activeItem === '/schedules/saved'}
                           onClick={this.props.navigate}>
                    <Icon name='gamepad'/>
                    Games
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='camera'/>
                    Channels
                </Menu.Item>
            </Sidebar>
        )
    }
}
