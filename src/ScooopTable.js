import React, {Component} from 'react'
import {Button, Typography, Drawer, Divider, Card, message} from 'antd'
import Orders from './Orders'

const {Text} = Typography
const {Meta} = Card

const screenWidth = window.screen.width
const BASE_URL = 'http://localhost:8080/ScooopServerUltimatum_war_exploded/'

class ScooopTableChild extends Component {

    constructor(props) {
        super(props)
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
            )
        }

        if(this.props.status !== -1)
        {
            return(
                <Button onClick={this.props.handler} className='scooop-table-child'>
                    {this.props.id.toUpperCase()}
                    <br/>
                    <Text type='secondary'>Occupied</Text>
                </Button>
            )
        }

        return(
            <Button type='primary' onClick={this.props.handler} className='scooop-table-child'>
                {this.props.id.toUpperCase()}
            </Button>
        )
    }
}

class ScooopTable extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            allItems: null,
            drawerTitle: 'none',
            drawerItems: null,
            drawerTable: null,
            drawerVisible: false,
            isEditingDrawer: false,
            drawerOrderId: -1,
            addDrawerVisible: false,
            addDrawerValue: null,
            isAddingNewOrder: false
        }
        // console.log(this.props.config)

        // this.getAllItems = this.getAllItems.bind(this)
        this.addItem = this.addItem.bind(this)
        this.showDrawer = this.showDrawer.bind(this)
        this.showAddDrawer = this.showAddDrawer.bind(this)
        this.onCloseDrawer = this.onCloseDrawer.bind(this)
        this.onCloseAddDrawer = this.onCloseAddDrawer.bind(this)
        this.toggleEditOrders = this.toggleEditOrders.bind(this)
        this.updateItemCount = this.updateItemCount.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.confirmOrder = this.confirmOrder.bind(this)
        this.cancelOrder = this.cancelOrder.bind(this)
        this.updateOrder = this.updateOrder.bind(this)
        this.checkOrder = this.checkOrder.bind(this)
    }

    // async getAllItems() {
    //     if (allItems !== null) {
    //         return allItems
    //     }
    //     else {
    //         await fetch(BASE_URL + '/api/items', {
    //             headers: {
    //                 'content-type': 'application/x-www-form-urlencoded charset=UTF-8'
    //             },
    //             credentials: 'true'
    //         }).then(response => {
    //             allItems = response.json()
    //         })
    //         return allItems
    //     }
    // }

    addItem(i) {
        let newItems
        if (this.state.drawerItems === null)
        {
            newItems = []
        }
        else
        {
            newItems = [...this.state.drawerItems]
        }
        if (newItems.find(x => x.id === i) === undefined)
        {
            newItems.push({...this.state.allItems.find(x => x.id === i)})
        }
        newItems.find(x => x.id === i).count += 1
        this.setState({
            drawerItems: newItems
        })
        if (this.state.drawerOrderId !== -1)
        {
            this.updateOrder()
        }
    }

    async showDrawer(table, orderId) {
        if (orderId === -1)
        {
            this.setState({
                drawerTitle: 'Orders for table ' + table.toUpperCase(),
                drawerItems: null,
                drawerTable: table,
                drawerOrderId: orderId,
                drawerVisible: true
            })
            return
        }
        let response = await fetch(BASE_URL + 'api/order/get?id=' + orderId, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        console.log(json)
        this.setState({
            drawerTitle: 'Orders for table ' + table.toUpperCase(),
            drawerItems: json.items,
            drawerTable: table,
            drawerOrderId: orderId,
            drawerVisible: true,
            isAddingNewOrder: false
        })
    }

    showAddDrawer() {
        this.setState({
            addDrawerVisible: true
        })
    }

    onCloseDrawer() {
        console.log(this.state.isEditingDrawer)
        console.log(this.state.drawerOrderId !== -1)
        console.log(this.state.drawerItems === null)
        if (this.state.isEditingDrawer)
        {
            // suppose save any edit
            // if edit and have item left -> save
            // if edit and null -> cancel
            // if add and item -> confirm
            // if add and null -> nothing
            if (this.state.drawerOrderId !== -1)
            {
                if (this.state.drawerItem === null)
                {
                    this.cancelOrder()
                }
                else
                {
                    this.updateOrder()
                }
            }
        }
        this.setState({
            drawerVisible: false
        })
        setTimeout(() => {
            this.setState({
                drawerTitle: 'none',
                drawerItems: null,
                drawerTable: null,
                isEditingDrawer: false,
                drawerOrderId: -1,
                addDrawerVisible: false,
                addDrawerValue: null,
                isAddingNewOrder: false
            })
        }, 500)
    }

    onCloseAddDrawer(i) {
        this.setState({
            addDrawerVisible: false,
            addDrawerValue: (typeof i === 'number') ? i : null
        })
        if (this.state.drawerOrderId === -1)
        {
            this.setState({
                isAddingNewOrder: true
            })
        }
        // console.log('add item ' + this.state.addDrawerValue)
        if(typeof i === 'number') this.addItem(i)
    }

    toggleEditOrders() {
        if (this.state.isEditingDrawer)
        {
            this.updateOrder()
        }
        this.setState({
            isEditingDrawer: !this.state.isEditingDrawer
        })
    }

    confirmOrder() {
        console.log('try confirm')
        this.onCloseDrawer()
        let data = {
            table: this.state.drawerTable,
            items: [...this.state.drawerItems]
        }
        fetch(BASE_URL + 'api/order/add', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: 'data=' + JSON.stringify(data)
        }).then(res => {
            console.log(res)
            this.props.ws.send('updated')
            message.success('Order for table ' + data.table.toUpperCase() + ' has been received')
        })
    }

    cancelOrder() {
        console.log('try cancel')
        this.onCloseDrawer()
        let table = this.state.drawerTable.toUpperCase()
        fetch(BASE_URL + 'api/order/remove', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: 'id=' + this.state.drawerOrderId
        }).then(res => {
            console.log(res)
            this.props.ws.send('updated')
            message.info('Order for table ' + table + ' has been canceled')
        })
    }

    async updateOrder() {
        console.log('try update')
        if (this.state.drawerItems === null)
        {
            return
        }
        let response = await fetch(BASE_URL + 'api/order/get?id=' + this.state.drawerOrderId, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        let data = {
            orderId: this.state.drawerOrderId,
            table: this.state.drawerTable,
            items: [...this.state.drawerItems]
        }
        for (let item of json.items)
        {
            let index = data.items.findIndex(x => x.id === item.id)   
            if (index === -1)
            {
                
                item.count = -1
                // delete item.name
                // delete item.price
                // delete item.img
                data.items.push(item)
            }
            // let obj = {
            //     id: item.id,
            //     count: item.count
            // }
            // data.items[index]
        }
        console.log(JSON.stringify(data))
        fetch(BASE_URL + 'api/order/update', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: 'data=' + JSON.stringify(data)
        }).then(res => {
            console.log(res)
            this.props.ws.send('updated')
            message.info('Order for table ' + data.table.toUpperCase() + ' has been updated')
        })
    }

    checkOrder() {
        console.log('try check')
        this.onCloseDrawer()
        let table = this.state.drawerTable.toUpperCase()
        fetch(BASE_URL + 'api/order/check', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include',
            body: 'id=' + this.state.drawerOrderId
        }).then(res => {
            console.log(res)
            this.props.ws.send('updated')
            message.success('Bill for table ' + table + ' has been checked')
        })
    }

    updateItemCount(id, count) {
        // assert(this.drawerItems !== null)
        let newItems = [...this.state.drawerItems]
        newItems.find(x => x.id === id).count = count
        this.setState({
            drawerItems: newItems
        })
    }

    removeItem(id) {
        // assert(this.drawerItems !== null)
        let newItems = [...this.state.drawerItems]
        newItems.splice(newItems.findIndex(x => x.id === id), 1)
        if (newItems.length === 0)
        {
            this.setState({
                drawerItems: null
            })
        }
        else
        {
            this.setState({
                drawerItems: newItems
            })
        }
    }

    async componentDidMount() {
        
        let response = await fetch(BASE_URL + 'api/items', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        this.setState({
            allItems: json
        })
    }

    render() {
        const conf = this.props.config
        // console.log(conf)
        let childs
        if (conf === null) {
            childs = <div></div>
        }
        else {
            childs = conf.x.map((item_a, index_a) => (
                <div className='scooop-table-row' key={index_a}>
                    {
                        conf.y.map((item_b, index_b) => (
                            <ScooopTableChild
                                id={item_a + item_b}
                                status={conf.order[item_a + item_b]}
                                handler={(e) => {
                                    this.showDrawer(
                                        item_a + item_b,
                                        conf.order[item_a + item_b]
                                    )
                                }}
                                key={index_b}
                            />
                        ))
                    }
                </div>
            ))
        }
        let allItemsDrawer = null
        if (this.state.allItems !== null) {
            allItemsDrawer = this.state.allItems.map((item) => (
                <Card
                    hoverable
                    className='addDrawer-card'
                    cover={
                        <img
                            style={{width: 'auto', height: 300}}
                            src={process.env.PUBLIC_URL + '/' + item.img}
                        />
                    }
                    onClick={() => {
                        this.onCloseAddDrawer(item.id)
                    }}
                    key={item.id}
                >
                    <Meta title={item.name} description={item.price + 'THB'} />
                </Card>
            ))
        }

        let buttons
        // if (this.state.drawerItems === null)
        // {
        //     buttons = <div>
        //         <Button
        //             type='primary'
        //             size='large'
        //             style={{marginRight: 10}}
        //             onClick={this.showAddDrawer}
        //         >Add</Button>
        //     </div>
            
        //     // if (this.state.isAddingNewOrder)
        //     // {
        //     //     buttons = <div>
        //     //         <Button
        //     //             type='primary'
        //     //             size='large'
        //     //             style={{marginRight: 10}}
        //     //             onClick={this.showAddDrawer}
        //     //         >Confirm</Button>
        //     //         <Button
        //     //             size='large'
        //     //             style={{marginRight: 10}}
        //     //             onClick={this.showAddDrawer}
        //     //         >Add</Button>
        //     //     </div>
        //     // }
        //     // else
        //     // {
        //     //     buttons = <div>
        //     //         <Button
        //     //             type='primary'
        //     //             size='large'
        //     //             style={{marginRight: 10}}
        //     //             onClick={this.showAddDrawer}
        //     //         >Add</Button>
        //     //     </div>
        //     // }
        // }
        // else
        // {
        //     buttons = <div>
        //         <Button
        //             type='primary'
        //             size='large'
        //             style={{marginRight: 10}}
        //             onClick={this.showAddDrawer}
        //         >Add</Button>
        //         <Button
        //             size='large'
        //             disabled={this.state.drawerItems === null}
        //             style={{marginRight: 10}}
        //             onClick={this.toggleEditOrders}
        //         >
        //             {this.state.isEditingDrawer ? 'Save' : 'Edit'}
        //         </Button>
        //         {
        //             if(this)
        //         }
        //         <Button
        //             size='large'
        //             disabled={this.state.drawerItems === null}
        //         >
        //             Check bill
        //         </Button>
        //     </div>
        // }

        /*
        (this.state.drawerItems !== null)
        (this.state.drawerOrderId !== -1)
        (this.state.isAddingNewOrder === true)

        1. new order, no add 
            => (this.state.drawerOrderId === -1 && this.state.drawerItems === null)
        2. new order, added (test for removed until none too)
            => (this.state.drawerOrderId === -1 && this.state.drawerItems !== null)
        3. old order, view/edit
            => (this.state.drawerOrderId !== -1 && this.state.drawerItems !== null)
        4. old order, edit til empty
            => (this.state.drawerOrderId !== -1 && this.state.drawerItems === null)
        */
        const buttonStyles = {marginRight: 10, marginBottom: 10}
        const confirmButton = <Button
            type='primary'
            size='large'
            style={buttonStyles}
            onClick={this.confirmOrder}
        >Confirm</Button>
        const addButton = <Button
            type={this.state.drawerItems === null ? 'primary' : 'default'}
            size='large'
            style={buttonStyles}
            onClick={this.showAddDrawer}
        >Add</Button>
        const editSaveButton = <Button
            size='large'
            disabled={this.state.drawerItems === null}
            style={buttonStyles}
            onClick={this.toggleEditOrders}
        >
            {this.state.isEditingDrawer ? 'Save' : 'Edit'}
        </Button>
        const checkButton = <Button
            type='primary'
            size='large'
            style={buttonStyles}
            onClick={this.checkOrder}
        >
            Check bill
        </Button>
        const cancelButton = <Button
            type={(this.state.drawerItems === null) ? 'primary' : 'default'}
            danger
            size='large'
            style={buttonStyles}
            onClick={this.cancelOrder}
        >
            Cancel order
        </Button>
        
        if (this.state.drawerOrderId === -1) {
            if (this.state.drawerItems === null) {
                buttons = <div>
                    {addButton}
                </div>
            }
            else {
                buttons = <div>
                    {confirmButton}
                    {addButton}
                    {editSaveButton}
                </div>
            }
        }
        else {
            if (this.state.drawerItems === null)
            {
                buttons = <div>
                    {cancelButton}
                    {addButton}
                    {editSaveButton}
                </div>
            }
            else
            {
                buttons = <div>
                    {checkButton}
                    {addButton}
                    {editSaveButton}
                    {cancelButton}
                </div>
            }
        }
        
        
        

            // buttons = <div>
            //     {addButton}
            //     {
            //         (this.state.drawerItems !== null) &&
            //         (<div style={{display: 'inline-block'}}>
            //             {editSaveButton}
            //             {
            //                 (this.state.drawerOrderId !== -1) &&
            //                 (<div style={{display: 'inline-block'}}>
            //                     {checkButton}
            //                 </div>)
            //             }
            //         </div>)
            //     }
            // </div>
        let total = 0
        if (this.state.drawerItems !== null)
        {
            for (let item of this.state.drawerItems)
            {
                total += item.price * item.count
            }
            total = <div>
                <Divider />
                <Text style={{fontSize: '1.5em'}} strong>Total: {total} THB</Text>
            </div>
        }
        else
        {
            total = null
        }

        return(
            <div className='scooop-table' style={{ padding: 24 }}>
                {childs}
                <Drawer
                    title={this.state.drawerTitle}
                    width={(screenWidth < 768) ? '100%' : '70%'}
                    placement='right'
                    onClose={this.onCloseDrawer}
                    visible={this.state.drawerVisible}
                    className='scooop-drawer'
                >
                    <Orders
                        items={this.state.drawerItems}
                        isEditing={this.state.isEditingDrawer}
                        orderId={this.state.drawerOrderId}
                        updateItemCount={this.updateItemCount}
                        removeItem={this.removeItem}
                    />
                    {total}
                    <Divider />
                    {buttons}
                    <Drawer
                        title='Add an order'
                        width={(screenWidth < 768) ? '100%' : '60%'}
                        placement='right'
                        onClose={this.onCloseAddDrawer}
                        visible={this.state.addDrawerVisible}
                    >
                        <div style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            {allItemsDrawer}
                        </div>
                    </Drawer>
                </Drawer>
            </div>
        )
    }
}

export default ScooopTable