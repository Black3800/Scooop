import React, {Component} from 'react';
import {List, Avatar, Typography, InputNumber, Button} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import fakeDB from './fakeDB';

const {Text} = Typography;

class Orders extends Component {

    constructor(props) {
        super(props);
    }

    removeItem(it, ind) {
        let x = JSON.parse(JSON.stringify(it));
        x.splice(ind, 1);
        let orders = [];
        for(let item of x)
        {
            // console.log('[' + fakeDB.getItemIdFromName(ii.name) + ', ' + ii.amount + ']');
            orders.push([fakeDB.getItemIdFromName(item.name), item.amount])
        }
        console.log(orders);
        fakeDB.updateOrder(this.props.orderId, JSON.stringify(orders));
    }

    render() {
        if(this.props.items === null)
        {
            return(
                <div>This table is empty!</div>
            )
        }

        return(
            <List
                size='small'
                bordered
                dataSource={this.props.items}
                rowKey='abc'
                renderItem={(item, index) => (
                    <List.Item 
                    key={index}
                    actions={
                        this.props.isEditing ?
                        [
                            <InputNumber min={1} max={100} value={item.amount} />,
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    this.removeItem(this.props.items, index)
                                }}
                            />
                        ] :
                        [<Text>{item.amount}</Text>]
                    }>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    shape='square'
                                    size={64}
                                    src={item.img}
                                    style={{/*boxShadow: '1px 1px 4px 0.5px rgba(0,0,0,0.3)'*/ }} />
                            }
                            title={item.name}
                            description={item.price + 'THB each'}
                        />
                    </List.Item>
                )}
            />
        );
    }
}

export default Orders;