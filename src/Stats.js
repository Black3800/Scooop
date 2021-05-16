import React, { Component } from 'react';
import { Typography, Space, DatePicker } from 'antd';
import {HeartOutlined, SmileOutlined} from '@ant-design/icons';

const {RangePicker} = DatePicker
const {Title} = Typography
const BASE_URL = 'http://localhost:8080/ScooopServerUltimatum_war_exploded/'

class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 0
        }

        this.onChange = this.onChange.bind(this)
    }

    async onChange(e) {
        let range = [e[0]._d, e[1]._d]
        let d = new Date(range[0])
        range[0] = d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' + (d.getMonth()+1) : d.getMonth()+1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
        d = new Date(range[1])
        range[1] = d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' + (d.getMonth()+1) : d.getMonth()+1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
        let response = await fetch(BASE_URL + 'api/stats?from=' + range[0] + '&to=' + range[1], {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            credentials: 'include'
        })
        let json = await response.json()
        if (json.length === 0)
        {
            this.setState({
                total: 0
            })
        }
        else
        {
            this.setState({
                total: json.reduce((a, b) => a + (b['total'] || 0), 0)
            })
        }
    }

    render() {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <Title>{this.state.total} THB</Title>
                <Space direction="vertical" size={12}>
                    <RangePicker
                        dateRender={current => {
                            const style = {};
                            if (current.date() === 1) {
                                style.border = '1px solid #1890ff';
                                style.borderRadius = '50%';
                            }
                            return (
                                <div className="ant-picker-cell-inner" style={style}>
                                    {current.date()}
                                </div>
                            );
                        }}
                        onChange={this.onChange}
                    />
                </Space>
            </div>
        )
    }
}

export default Stats;