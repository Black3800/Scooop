import db from './db.json';

class fakeDB {

    static login(usr, pwd) {
        for(let acc of db.account)
        {
            if(acc.usr === usr && acc.pwd === pwd)
            {
                return acc;
            }
        }
        return null;
    }

    static getCurrent() {
        return db.current;
    }

    static getCurrentOrders(table) {
        // return db.orders[table] || null;
        if(db.orders[table] !== undefined)
        {
            return db.orders[table].ordered_items.map( (item, index) => {
                return {
                    ...db.items[item[0]],
                    amount: item[1]
                }
            });
        }
        return null;
    }

    static getItemIdFromName(name) {
        for (let item of db.items) {
            if (item.name == name) {
                return db.items.indexOf(item);
            }
        }
        return -1;
    }

    static updateOrder(orderId, orders) {
        // db.orders[orderId].ordered_items = JSON.parse(orders);
        // const fs = require('fs');
        // fs.writeFile('db.json', JSON.stringify(db));
    }

    static getAllItems() {
        return db.items;
    }

    static getAllAccounts() {
        return db.account;
    }

}

export default fakeDB;