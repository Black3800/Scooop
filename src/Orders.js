import React, {Component} from 'react'
import {List, Avatar, Typography, InputNumber, Button} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'

const {Text} = Typography

class Orders extends Component {

    constructor(props) {
        super(props)

        this.onInputNumberChange = this.onInputNumberChange.bind(this)
    }

    onInputNumberChange(id, value) {
        this.props.updateItemCount(id, value)
    }

    render() {
        if(this.props.items === null)
        {
            return(
                <div>This table is empty!</div>
            )
        }

        return (
            <div>
                <List
                    size='small'
                    bordered
                    dataSource={this.props.items}
                    rowKey='abc'
                    renderItem={(item) => (
                        <List.Item 
                        key={item.id}
                        actions={
                            this.props.isEditing ?
                                [
                                    <InputNumber
                                        min={1} max={100}
                                        defaultValue={this.props.items.find(x => x.id === item.id).count}
                                        onChange={(value) => {
                                            this.onInputNumberChange(item.id, value)
                                        }}
                                    />,
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            this.props.removeItem(item.id)
                                        }}
                                    />
                                ] :
                                [<Text>{this.props.items.find(x => x.id === item.id).count}</Text>]
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
            </div>
        )
    }
}

export default Orders