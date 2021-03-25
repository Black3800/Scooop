import React, {Component} from 'react';
import {Button, Typography, Drawer, Divider, Card} from 'antd';
import Orders from './Orders';
import fakeDB from './fakeDB';

const {Text} = Typography;
const {Meta} = Card;

const allItems = fakeDB.getAllItems();
const allItemsDOM = allItems.map((item, index) => (
    <Card
        hoverable
        className='addDrawer-card'
        cover={
            <img
                style={{ width: 'auto', height: 300 }}
                src={process.env.PUBLIC_URL + '/' + item.img}
            />
        }
        onClick={() => {
            console.log(index)
        }}
    >
        <Meta title={item.name} description={item.price + 'THB'} />
    </Card>
));
const screenWidth = window.screen.width;

class ScooopTableChild extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.status === undefined)
        {
            return (
                <Button type='primary' disabled className='scooop-table-child'>
                    {this.props.id.toUpperCase()}
                    <br />
                    Unavailable
                </Button>
            );
        }

        if(this.props.status !== null)
        {
            return(
                <Button onClick={this.props.handler} className='scooop-table-child'>
                    {this.props.id.toUpperCase()}
                    <br/>
                    <Text type='secondary'>Occupied</Text>
                </Button>
            );
        }

        return(
            <Button type='primary' onClick={this.props.handler} className='scooop-table-child'>
                {this.props.id.toUpperCase()}
            </Button>
        );
    }
}

class ScooopTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerTitle: 'none',
            drawerItems: null,
            drawerVisible: false,
            drawerIsEditing: false,
            drawerOrderId: -1,
            addDrawerVisible: false,
            addDrawerValue: null
        };
        // console.log(this.props.config);
    }

    render() {
        const onCloseDrawer = () => {
            this.setState({
                drawerVisible: false
            });
            setTimeout( () => {
                this.setState({
                    drawerTitle: 'none',
                    drawerItems: null,
                    drawerIsEditing: false,
                    drawerOrderId: -1,
                    addDrawerVisible: false,
                    addDrawerValue: null
                });
            }, 500);
        };

        const onCloseAddDrawer = (i) => {
            this.setState({
                addDrawerVisible: false,
                addDrawerValue: (typeof i === 'number') ? i : null
            });
            // console.log('add item ' + this.state.addDrawerValue)
            callSth(i);
        };

        const callSth = (i) => {
            console.log('item' + i)
        }

        const showDrawer = (table, items, orderId) => {
            // console.info('called ' + item)
            this.setState({
                drawerTitle: 'Orders for table ' + table.toUpperCase(),
                drawerItems: items,
                drawerVisible: true,
                drawerOrderId: orderId
            });
            console.log(items);
        }

        const showAddDrawer = () => {
            this.setState({
                addDrawerVisible: true,
            });
        }

        const toggleEditOrders = () => {
            this.setState({
                drawerIsEditing: !this.state.drawerIsEditing
            });
        }

        const conf = this.props.config;
        let childs = conf.key_a.map((item_a, index_a) => (
                    <div className='scooop-table-row'>
                        {
                            conf.key_b.map((item_b, index_b) => (
                                <ScooopTableChild
                                    id={item_a + item_b}
                                    status={conf.status[item_a + item_b]}
                                    handler={(e) => {
                                        showDrawer(
                                            item_a + item_b,
                                            fakeDB.getCurrentOrders(conf.status[item_a + item_b]),
                                            conf.status[item_a + item_b]
                                        );
                                    }}
                                />
                            ))
                        }
                    </div>
                ));

        return(
            <div className='scooop-table' style={{ padding: 24 }}>
                {childs}
                <Drawer
                    title={this.state.drawerTitle}
                    width={(screenWidth < 768) ? '100%' : '70%'}
                    placement='right'
                    onClose={onCloseDrawer}
                    visible={this.state.drawerVisible}
                    className='scooop-drawer'
                >
                    <Orders
                        items={this.state.drawerItems}
                        isEditing={this.state.drawerIsEditing}
                        orderId={this.state.drawerOrderId}
                    />
                    <Divider />
                    <>
                        <Button
                            type='primary'
                            size='large'
                            style={{ marginRight: 10 }}
                            onClick={showAddDrawer}
                        >Add</Button>
                        <Button
                            size='large'
                            disabled={this.state.drawerItems === null}
                            style={{ marginRight: 10 }}
                            onClick={toggleEditOrders}
                        >
                            { this.state.drawerIsEditing ? 'Save' : 'Edit' }
                        </Button>
                        <Button
                            size='large'
                            disabled={this.state.drawerItems === null}
                        >
                            Check bill
                        </Button>
                    </>
                    <Drawer
                        title='Add an order'
                        width={(screenWidth < 768) ? '100%' : '60%'}
                        placement='right'
                        onClose={onCloseAddDrawer}
                        visible={this.state.addDrawerVisible}
                    >
                        <div style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            {
                                allItems.map((item, index) => (
                                    <Card
                                        hoverable
                                        className='addDrawer-card'
                                        cover={
                                            <img
                                                style={{ width: 'auto', height: 300 }}
                                                src={process.env.PUBLIC_URL + '/' + item.img}
                                            />
                                        }
                                        onClick={() => {
                                            onCloseAddDrawer(index)
                                        }}
                                    >
                                        <Meta title={item.name} description={item.price + 'THB'} />
                                    </Card>
                                ))
                            }
                        </div>
                    </Drawer>
                </Drawer>
            </div>
        );
    }
}

export default ScooopTable;