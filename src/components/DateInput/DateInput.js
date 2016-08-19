import React, { Component } from 'react'
import { 
  Input, Datepicker, Icon,
  Select, Option
} from 'react-lightning-design-system'

import styles from './styles.module.css'
import { formatDate, format2Digits } from 'utils/formatter'

class DateInput extends Component {

  constructor(props) {
    super(props)

    this.state = {
      date: this.props.value ? new Date(this.props.value) : null,
      datepickerVisible: false
    }
  }

  onDateIconClick = () => {
    setTimeout(() => {
      this.setState({
        datepickerVisible: true
      })
    }, 10);
  }

  cutValue(val, limit) {
    if (!val) {
      return 0
    }
    const _val = val.substr(0, 2)
    if (parseInt(_val) >= limit) {
      return parseInt(val.substr(0, 1))
    } else {
      return parseInt(_val)
    }
  }

  onDateInputChange = (e) => {
    const newDate = e.currentTarget.value
    const _date = this.state.date
    const newTime = (newDate.split(' '))[3]
    const newTimeParts = newTime.split(':')
    _date.setHours(this.cutValue(newTimeParts[0], 24))
    _date.setMinutes(this.cutValue(newTimeParts[1], 60))
    this.setState({
      date: _date
    })
  }

  onSelectDate = (date) => {
    const ymd = date.split('-')
    const _date = new Date(ymd[0], ymd[1] - 1, ymd[2])
    this.setState({
      date: _date,
      datepickerVisible: false
    })
    if (this.props.onChange) {
      this.props.onChange(_date.toISOString())
    }
  }

  onCloseDatepicker = () => {
    this.setState({
      datepickerVisible: false
    })
  }

  render() {
    const dateInputContainerStyle = {
      display: 'flex',
      alignItems: 'center',
    }
    const dateInputStyle = {
      flexGrow: 1,
    }
    const hmSelectStyle = {
      width: 60,
    }
    const hmDividerStyle = {
      width: 15,
      textAlign: 'center',
      verticalAlign: 'middle',
    }
    const { date, datepickerVisible } = this.state
    const { onChange } = this.props
    const formattedDate = date ? formatDate(date, false) : ''
    const selectedDate = date ? date.getFullYear() 
      + '-' + format2Digits(date.getMonth() + 1)
      + '-' + format2Digits(date.getDate())
      :
      ''
    const hours = []
    for(let i = 0; i < 24; i++) {
      hours.push(i)
    }
    const minutes = []
    for(let i = 0; i < 60; i++) {
      minutes.push(i)
    }
    return (
      <div className={styles.dateInputClass} style={dateInputContainerStyle}>
        <div className='slds-input-has-icon slds-input-has-icon--right' style={dateInputStyle}>
          <Input
            type="text"
            value={formattedDate}
            onChange={ this.onDateInputChange } />
          <Icon
            icon='event'
            className='slds-input__icon'
            style={ { cursor: 'pointer' } }
            onClick={ this.onDateIconClick } />
        </div>
        <div style={{ marginLeft: 15, ...hmSelectStyle }}>
          <Select
            value={date ? date.getHours() : 0}
            onChange={e => {
              date.setHours(e.currentTarget.value)
              this.setState({
                date
              })
            }} >
            {hours.map(h => (
              <Option key={h} value={h}>{format2Digits(h)}</Option>
            ))}
          </Select>
        </div>
        <div style={hmDividerStyle}>:</div>
        <div style={hmSelectStyle}>
          <Select
            value={date ? date.getMinutes() : 0}
            onChange={e => {
              date.setMinutes(e.currentTarget.value)
              this.setState({
                date
              })
            }} >
            {minutes.map(m => (
              <Option key={m} value={m}>{format2Digits(m)}</Option>
            ))}
          </Select>
        </div>
        {
          datepickerVisible ?
          <Datepicker
            className={styles.datepicker}
            selectedDate={selectedDate}
            autoFocus
            onSelect={this.onSelectDate}
            onBlur={this.onCloseDatepicker}
            onClose={this.onCloseDatepicker} />
          :
          <div />
        }
      </div>
    )
  }

}

export default DateInput
