import React, {Component} from 'react'
import 'antd/dist/antd.css'
import {Layout, Menu, Button} from 'antd'
import {
    HomeOutlined,
    PieChartOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import ScooopTable from './ScooopTable'
import Account from './Account'
import Stats from './Stats'

const {Content, Sider} = Layout

const screenWidth = window.screen.width
const BASE_URL = 'http://localhost:8080/ScooopServerUltimatum_war_exploded/'
const ws = new WebSocket("ws://localhost:8080/ScooopServerUltimatum_war_exploded/ws")
// ws.onmessage = function (event) {
//     console.log(event.data)
//     // this.props.onSocketMessage()
// }

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            collapsed: (screenWidth <= 320),
            loggedOut: false,
            page: 'scooopTable',
            currentOrder: null
        }
        ws.onmessage = (event) => {
            console.log(event.data)
            this.getCurrentOrder()
        }

        this.onCollapse = this.onCollapse.bind(this)
        this.logout = this.logout.bind(this)
    }

    onCollapse(collapsed) {
        // console.log(collapsed)
        this.setState({
            collapsed
        })
    }

    logout() {
        this.setState({
            loggedOut: true
        })
        this.props.onLogout()
    }

    async getCurrentOrder() {
        let response = await fetch(BASE_URL + 'api/order/current', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        this.setState({
            currentOrder: json
        })
    }

    async componentDidMount() {
        this.getCurrentOrder()
    }

    render() {
        console.log('render home with priv ' + this.props.privilege)
        const {collapsed} = this.state
        const logoutBtnText = collapsed ? '' : 'Logout'
        let page
        if(this.state.page === 'scooopTable')
        {
            page = <ScooopTable config={this.state.currentOrder} ws={ws} />
        }
        else if(this.state.page === 'account')
        {
            page = <Account privilege={this.props.privilege} />
        }
        else if(this.state.page === 'stats')
        {
            page = <Stats />
        }
        return (
            <Layout style={{ minHeight: '100vh', background: '#eee'}}>
                <Sider
                    id='site-sider'
                    collapsible 
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    style={{
                        position: 'relative',
                        zIndex: 2
                    }}
                >
                    <div className='logo'>{ collapsed ? 'S' : 'Scooop' }</div>
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
                <Content style={{ margin: '0 16px', zIndex: 1 }}>
                    {page}
                </Content>
            </Layout>
        )
    }
}

export default Home