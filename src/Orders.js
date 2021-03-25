import React, {Component} from 'react';
import {List} from 'antd';

class Orders extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <List
                size='small'
                bordered
                dataSource={this.props.items}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
        );
    }
}

export default Orders;