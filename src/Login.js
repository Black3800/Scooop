import React, {Component} from 'react'
import {Card, Input, Button, Form} from 'antd'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: false
        }

        this.onFinish = this.onFinish.bind(this)
        this.onFinishFailed = this.onFinishFailed.bind(this)
    }

    onFinish(values) {
        this.setState({
            login: true
        });
        this.props.setToken(values.usr, values.pwd, this.onFinishFailed)
    }

    onFinishFailed(e) {
        this.setState({
            login: false
        })
    }

    render() {
        const layout = {
            labelCol: { span:8 },
            wrapperCol: { span: 16 },
        }
        return (
            <div
                className='login-card-wrapper'
                style={{
                    backgroundImage: `url('${process.env.PUBLIC_URL}/icecream-bg2.jpg')`
                }}
            >
                <Card
                    title='Login to Scooop POS System'
                    id='login-card'
                    className='login-card'
                    hoverable={true}
                >
                    <Form
                        {...layout}
                        name='login'
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishedFailed}
                    >
                        <Form.Item
                            label='Username'
                            name='usr'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            name='pwd'
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                loading={this.state.login}
                            >Login</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Login;