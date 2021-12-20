import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

const gnb = () => {
    const activeItem = "home"
    return (
      <Menu inverted>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          //onClick={this.handleItemClick}
        />
        <Menu.Item
          name='messages'
          active={activeItem === 'messages'}
          //onClick={this.handleItemClick}
        />
      </Menu>
    )  
}

export default gnb