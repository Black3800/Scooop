import React, {Component} from 'react';
import {Card, Table, Button, Popconfirm, Modal, Form, Input, message} from 'antd';
import fakeDB from './fakeDB';

class Account extends Component {
    state = {
        loading: false,
        visible: false
    };

    constructor(props) {
        super(props);
        this.newPwdForm = React.createRef();
        this.newPwdInput = React.createRef();
        this.newPwdConfirmInput = React.createRef();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false, visible: false});
            message.info('Password changed');
        }, 1000);
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const {visible, loading} = this.state;

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
                            onClick={this.showModal}
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

        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };

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
                    <Modal
                        visible={this.state.visible}
                        title="Title"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Cancel
                                    </Button>,
                            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                                Change password
                            </Button>
                        ]}
                    >
                        <Form
                            {...layout}
                            name='change_pwd'
                        >
                            <Form.Item
                                label='New password'
                                name='new_pwd'
                            >
                                <Input.Password ref={this.newPwdInput} />
                            </Form.Item>
                            <Form.Item
                                label='Confirm password'
                                name='new_pwd_confirm'
                            >
                                <Input.Password ref={this.newPwdConfirmInput} />
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        )
    }
}

export default Account;