import React, { Component } from 'react';
import { Statistic } from 'antd';
import { HeartOutlined, SmileOutlined } from '@ant-design/icons';

class Stats extends Component {
    render() {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <Statistic
                    title="Feedback"
                    value={1128}
                    prefix={<HeartOutlined />}
                    style={{
                        margin: 10
                    }} />
                <Statistic
                    title="Icecream sold"
                    value={1346}
                    prefix={<SmileOutlined />}
                    style={{
                        margin: 10
                    }} />
            </div>
        )
    }
}

export default Stats;