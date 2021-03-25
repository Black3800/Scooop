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
import Account from './Account';
import Stats from './Stats';
import fakeDB from './fakeDB';

const {Content, Sider} = Layout;

class Home extends Component {

    state = {
        collapsed: false,
        loggedOut: false,
        page: 'scooopTable'
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({
            collapsed
        });
    };

    logout = () => {
        this.setState({
            loggedOut: true
        });
        this.props.onLogout();
    }

    render() {
        console.log('render home with priv ' + this.props.privilege);
        const {collapsed} = this.state;
        const logoutBtnText = collapsed ? '' : 'Logout';
        const p = {
            key_a: ['a', 'b', 'c'],
            key_b: ['1', '2', '3', '4'],
            status: fakeDB.getCurrent()
        };
        let page;
        if(this.state.page === 'scooopTable')
        {
            page = <ScooopTable config={p} />;
        }
        else if(this.state.page === 'account')
        {
            page = <Account privilege={this.props.privilege} />;
        }
        else if(this.state.page === 'stats')
        {
            page = <Stats />;
        }
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
                    <div className='logo'>Scooop</div>
                    <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
                        <Menu.Item key='1' icon={<HomeOutlined />} onClick={()=>{
                            this.setState({
                                page: 'scooopTable'
                            })
                        }}>
                            Home
                        </Menu.Item>
                        <Menu.Item
                            key='2'
                            icon={<UserOutlined />}
                            onClick={()=>{
                                this.setState({
                                    page: 'account'
                                })
                            }}
                            disabled={this.props.privilege === 2}
                        >
                            Manage Accounts
                        </Menu.Item>
                        <Menu.Item key='3' icon={<PieChartOutlined />} onClick={() => {
                            this.setState({
                                page: 'stats'
                            })
                        }}>
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
                    {page}
                </Content>
            </Layout>
        );
    }
}

export default Home;