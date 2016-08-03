import React, { Component } from 'react'
import { 
  Input, Datepicker
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

  onInputFocus = () => {
    this.setState({
      datepickerVisible: true
    })
  }

  onSelectDate = (date) => {
    const ymd = date.split('-')
    const _date = new Date(ymd[0], ymd[1], ymd[2])
    this.setState({
      date: _date,
      datepickerVisible: false
    })
    if (this.props.onChange) {
      this.props.onChange(_date.toISOString())
    }
  }

  render() {
    const { date, datepickerVisible } = this.state
    const { onChange } = this.props
    const formattedDate = date ? formatDate(date, false) : ''
    const selectedDate = date ? date.getFullYear() 
      + '-' + format2Digits(date.getMonth())
      + '-' + format2Digits(date.getDate())
      :
      ''
    return (
      <div className={styles.dateInputClass}>
        <Input
          type="text"
          readOnly
          value={formattedDate}
          onFocus={this.onInputFocus} />
        <Datepicker
          className={styles.datepicker + (datepickerVisible ? ' ' + styles.datepickerVisible : '')}
          selectedDate={selectedDate}
          onSelect={this.onSelectDate} />
      </div>
    )
  }

}

export default DateInput
