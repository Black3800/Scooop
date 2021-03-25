import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Layout, Menu, Button} from 'antd';
import {
    HomeOutlined,
    PieChartOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import ScooopTable from './ScooopTable';

const {Content, Sider, Footer} = Layout;
const {SubMenu} = Menu;

class Home extends Component {

    state = {
        collapsed: false,
        loggedOut: false
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({
            collapsed
        });
    };

    logout = () => {
        console.log('logout');
        this.setState({
            loggedOut: true
        });
        this.props.onLogout();
    }

    render() {
        const {collapsed} = this.state;
        const logoutBtnText = collapsed ? '' : 'Logout';
        const p = {
            key_a: ['a', 'b', 'c'],
            key_b: ['1', '2', '3', '4'],
            status: {
                a1: null,
                a2: null,
                a3: [[12, 5]],
                a4: null,
                b1: null,
                b2: null,
                b3: null,
                c1: null,
                c2: null,
                c3: null,
                c4: null
            }
        };
        return (
            <Layout style={{ minHeight: '100vh', background: '#eee'}}>
                <Sider
                    id='site-sider'
                    collapsible 
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    style={{
                        position: 'relative'
                    }}
                >
                    <div className='logo' />
                    <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
                        <Menu.Item key='1' icon={<HomeOutlined />}>
                            Home
                        </Menu.Item>
                        <Menu.Item key='2' icon={<UserOutlined />}>
                            Manage Accounts
                        </Menu.Item>
                        <Menu.Item key='3' icon={<PieChartOutlined />}>
                            View statistics
                        </Menu.Item>
                    </Menu>
                    <Button
                        type='ghost'
                        className='logout-btn'
                        shape='round'
                        icon={<LogoutOutlined />}
                        loading={this.state.loggedOut}
                        onClick={this.logout}
                    >
                        {logoutBtnText}
                    </Button>
                </Sider>
                <Content style={{ margin: '0 16px' }}>
                    <ScooopTable config={p} />
                </Content>
            </Layout>
        );
    }
}

export default Home;