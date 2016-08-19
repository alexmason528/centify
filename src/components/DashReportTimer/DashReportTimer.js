import React, { Component } from 'react'
import styles from './styles.module.css'


class DashReportTimer extends Component {

  state = {
    days: 0,
    hours: 0,
    mins: 0,
    calculated: false,
  }

  componentDidMount() {
    this.timer = setInterval(this.timerUpdate, 10000)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  leftTime = () => {
    const { endDate } = this.props
    const now = new Date()
    const sec = (endDate - now) / 1000
    if (sec <= 0) {
      return { days: 0, hours: 0, mins: 0 }
    }
    return {
      days: parseInt(sec / 86400), 
      hours: parseInt((sec % 86400) / 3600), 
      mins: parseInt(sec % 3600 / 60)
    }
  }

  timerUpdate = () => {
    const left = this.leftTime()
    this.setState({
      calculated: true,
      ...left
    })
  }
  
  render() {
    const { days, hours, mins } = this.state.calculated ? this.state : this.leftTime()
    return (
      <div className="slds-text-align--center">
        <table className={styles.timer}>
          <tbody>
            <tr>
              <td>{days}<br/>Days</td>
              <td>:</td>
              <td>{hours}<br/>Hours</td>
              <td>:</td>
              <td>{mins}<br/>Mins</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default DashReportTimer
