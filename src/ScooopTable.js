import React, {Component} from 'react';
import {Button, Typography, Drawer} from 'antd';
import Orders from './Orders';

const {Text} = Typography;

class ScooopTableChild extends Component {
    constructor(props) {
        super(props);

        this.viewOrders = this.viewOrders.bind(this);
    }

    viewOrders() {
        console.log('view orders ' + this.props.id);
        if(this.props.status === null)
        {
            console.log('this one is free');
        }
        else
        {
            console.log('this one is occupied');
        }
        this.props.showDrawer();
    }

    render() {
        // let c = 'scooop-table-child';
        // if(this.props.status != null)
        // {
        //     c += ' active';
        // }

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
            drawerVisible: false
        };
        // console.log(this.props.config);
    }

    render() {
        const onCloseDrawer = () => {
            this.setState({
                drawerVisible: false
            });
        };

        const showDrawer = (table, items) => {
            // console.info('called ' + item)
            this.setState({
                drawerTitle: 'Orders for table ' + table.toUpperCase(),
                drawerItems: items,
                drawerVisible: true
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
                    width={700}
                    placement='right'
                    onClose={onCloseDrawer}
                    visible={this.state.drawerVisible}
                >
                    <Orders items={this.state.drawerItems} />
                </Drawer>
            </div>
        );
    }
}

export default ScooopTable;