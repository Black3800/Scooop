import React, {Component} from 'react';
import {Card, Table, Button, Popconfirm} from 'antd';
import fakeDB from './fakeDB';

class Account extends Component {
    render() {
        const dataSource = fakeDB.getAllAccounts();

        const columns = [
            {
                title: 'User ID',
                dataIndex: 'uid',
                key: 'uid',
            },
            {
                title: 'Username',
                dataIndex: 'usr',
                key: 'usr',
            },
            {
                title: 'Account type',
                dataIndex: 'privilege',
                key: 'privilege',
                render: privilege => {
                    if(privilege === 0)
                    {
                        return 'Administrator'
                    }
                    else if(privilege === 1)
                    {
                        return 'Manager'
                    }
                    else if(privilege === 2)
                    {
                        return 'Employee'
                    }
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <>
                        <Button
                            style={{ marginRight: 10 }}
                            disabled={(this.props.privilege >= record.privilege)}
                            type='primary'
                            onClick={() => {
                                prompt('New password');
                            }}
                        >Change password</Button>
                        <Popconfirm
                            title='Are you sure to remove this user?'
                            okText='Yes'
                            cancelText='No'
                            disabled={(this.props.privilege >= record.privilege)}
                        >
                            <Button danger disabled={(this.props.privilege >= record.privilege)}>Remove</Button>
                        </Popconfirm>
                    </>
                )
            }
        ];

        console.log(this.props.privilege);

        return(
            <div style={{
                height: '100%',
                display: 'flex', 
                flexFlow: 'row nowrap',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                    <Card title='Manage user accounts' style={{width: '90%', overflowX: 'scroll'}}>
                        <Table dataSource={dataSource} columns={columns} />
                    </Card>
            </div>
        )
    }
}

export default Account;