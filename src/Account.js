import React, {Component} from 'react';
import {Card, Table, Button, Popconfirm, Modal, Form, Input, message, Select} from 'antd';

const { Option } = Select
const BASE_URL = 'http://localhost:8080/ScooopServerUltimatum_war_exploded/'

class Account extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal: 'pwd',
            loading: false,
            visible: false,
            users: null,
            self: null,
            target: ['', 0],
            pwd: ['', '', ''],
            usr: ['', '', 2]
        }
        this.newPwdForm = React.createRef()
        this.currentPwdInput = React.createRef()
        this.newPwdInput = React.createRef()
        this.newPwdConfirmInput = React.createRef()

        this.showModal = this.showModal.bind(this)
        this.showAddModal = this.showAddModal.bind(this)
        this.handlePwdChange = this.handlePwdChange.bind(this)
        this.handleUsrChange = this.handleUsrChange.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleAddUser = this.handleAddUser.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    showModal(usr, id) {
        this.setState({
            modal: 'pwd',
            visible: true,
            target: [usr, id]
        })
    }

    showAddModal() {
        this.setState({
            modal: 'usr',
            visible: true
        })
    }

    handlePwdChange(values, i) {
        let p = [...this.state.pwd]
        p[i] = values.target.value
        this.setState({
            pwd: p
        })
    }

    handleUsrChange(values, i) {
        let u = [...this.state.usr]
        // console.log(values)
        u[i] = parseInt(values) || values.target.value
        this.setState({
            usr: u
        })
    }

    async handleAddUser() {
        this.setState({loading: true});
        let p = this.state.usr[2]
        if (this.props.privilege === 1)
        {
            p = 2
        }
        let response = await fetch(BASE_URL + 'api/auth/add', {
            method: 'post',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: `usr=${this.state.usr[0]}&pwd=${this.state.usr[1]}&privilege=${p}`
        })
        if (response.ok) {
            this.setState({
                loading: false,
                visible: false
            })
            message.success('User ' + this.state.usr[0] + ' has been added')
        }
        else {
            this.setState({
                loading: false
            })
            message.error('This username has already been used')
        }
        response = await fetch(BASE_URL + 'api/users', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        this.setState({
            users: json
        })
    }

    async handleOk() {
        this.setState({loading: true});
        let response = await fetch(BASE_URL + 'api/auth/change-pwd', {
            method: 'post',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: `uid=${this.state.target[1]}&current_pwd=${this.state.pwd[0]}&new_pwd=${this.state.pwd[1]}&confirm_pwd=${this.state.pwd[2]}`
        })
        if (response.ok)
        {
            this.setState({
                loading: false,
                visible: false
            })
            message.success(this.state.target[0] + '\'s password has been changed')
        }
        else
        {
            this.setState({
                loading: false
            })
            message.error('Please check your input again')
        }
    };

    handleCancel() {
        this.setState({visible: false});
    };

    async removeUser(uid) {
        let response = await fetch(BASE_URL + 'api/auth/remove', {
            method: 'post',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: 'uid=' + uid
        })
        if (response.ok)
        {
            message.success('User has been removed')
        }
        else
        {
            message.error('Cannot remove this user')
            return
        }
        response = await fetch(BASE_URL + 'api/users', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        this.setState({
            users: json
        })
        console.log(this.state)
    }

    async componentDidMount() {
        let response = await fetch(BASE_URL + 'api/users', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        this.setState({
            users: json
        })
        console.log(this.state)
    }

    render() {
        const {visible, loading} = this.state;

        const dataSource = this.state.users;
        let currentUsr = sessionStorage.getItem('usr')
        if (dataSource !== null)
        {
            dataSource.sort(function (x, y) {return x.usr == currentUsr ? -1 : y == currentUsr ? 1 : 0})
        }

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
                            disabled={record.usr !== currentUsr && this.props.privilege >= record.privilege}
                            type='primary'
                            onClick={() => {
                                this.showModal(record.usr, record.uid)
                            }}
                        >Change password</Button>
                        <Popconfirm
                            title='Are you sure to remove this user?'
                            okText='Yes'
                            cancelText='No'
                            disabled={(this.props.privilege >= record.privilege)}
                            onConfirm={() => {
                                this.removeUser(record.uid)
                            }}
                        >
                            <Button danger disabled={(this.props.privilege >= record.privilege)}>Remove</Button>
                        </Popconfirm>
                    </>
                )
            }
        ];

        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };

        let modal;
        if (this.state.modal === 'pwd')
        {
            modal = (<Modal
                visible={this.state.visible}
                title="Change password"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        Cancel
                                    </Button>,
                    <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                        Confirm
                            </Button>
                ]}
            >
                <Form
                    {...layout}
                    name='change_pwd'
                    onFinish={this.handleSubmit}
                >
                    <Form.Item label='Your password' name='current_pwd' >
                        <Input.Password ref={this.currentPwdInput} onChange={(e) => {this.handlePwdChange(e, 0)}} />
                    </Form.Item>
                    <Form.Item label={this.state.target[0] + '\'s new password'} name='new_pwd'>
                        <Input.Password ref={this.newPwdInput} onChange={(e) => {this.handlePwdChange(e, 1)}} />
                    </Form.Item>
                    <Form.Item label='Confirm new password' name='confirm_pwd'>
                        <Input.Password ref={this.newPwdConfirmInput} onChange={(e) => {this.handlePwdChange(e, 2)}} />
                    </Form.Item>
                </Form>
            </Modal>)
        }
        else
        {
            if (this.props.privilege === 0)
            {
                modal = (<Modal
                    visible={this.state.visible}
                    title="Add new user"
                    onOk={this.handleAddUser}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleAddUser}>
                            Add
                        </Button>
                    ]}
                >
                    <Form
                        {...layout}
                        name='add_usr'
                        onFinish={this.handleAddUser}
                    >
                        <Form.Item label='Username' name='usr' >
                            <Input onChange={(e) => {this.handleUsrChange(e, 0)}} />
                        </Form.Item>
                        <Form.Item label='Password' name='pwd'>
                            <Input.Password onChange={(e) => {this.handleUsrChange(e, 1)}} />
                        </Form.Item>
                        <Form.Item label='Account type' name='privilege'>
                            <Select
                                defaultvalue='2'
                                onChange={(e) => {this.handleUsrChange(e, 2)}}
                                allowClear
                            >
                                <Option value='2'>Employee</Option>
                                <Option value='1'>Manager</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>)
            }
            else
            {
                modal = (<Modal
                    visible={this.state.visible}
                    title="Add new user"
                    onOk={this.handleAddUser}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
                                    </Button>,
                        <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleAddUser}>
                            Add
                        </Button>
                    ]}
                >
                    <Form
                        {...layout}
                        name='add_usr'
                        onFinish={this.handleAddUser}
                    >
                        <Form.Item label='Username' name='usr' >
                            <Input onChange={(e) => {this.handleUsrChange(e, 0)}} />
                        </Form.Item>
                        <Form.Item label='Password' name='pwd'>
                            <Input.Password onChange={(e) => {this.handleUsrChange(e, 1)}} />
                        </Form.Item>
                    </Form>
                </Modal>)
            }
        }

        // const [form] = Form.useForm();

        return(
            <div style={{
                height: '100%',
                display: 'flex', 
                flexFlow: 'row nowrap',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                    <Card title='Manage user accounts' style={{width: '90%', maxHeight: '90vh', overflowX: 'scroll'}}>
                        <Table dataSource={dataSource} columns={columns} sticky scroll />
                    </Card>
                <Button
                    type='primary'
                    onClick={this.showAddModal}
                    disabled={this.props.privilege === 2}
                >Add user</Button>
                {modal}
            </div>
        )
    }
}

export default Account;