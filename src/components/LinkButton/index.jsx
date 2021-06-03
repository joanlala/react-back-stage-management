import React, { Component } from 'react'

import './index.less'

export default class LinkButtom extends Component {
    render() {
        return (
            <button className='link-button' {...this.props}></button>
        )
    }
}
