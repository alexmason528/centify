import React, { Component } from 'react'
import { Link } from 'react-router'
import { Icon } from 'react-fa'

import { formatDate } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'

class DashesListItem extends Component {

  getFieldValue(dash, column) {
    if (Array.isArray(column)) {
      return dash.getIn(column)
    }
    const typeIconStyle = {
      fontSize: 18,
    }
    const gameTypeIconStyle = {
      fontSize: 22,
    }
    switch(column) {
      case 'Type':
        {
          const val = dash.get(column)
          switch(val) {
            case 'TugOfWar':
              return <Icon name="exchange" style={typeIconStyle} />
            case 'OverTheLine':
              return <Icon name="long-arrow-right" style={typeIconStyle} />
            case 'Timebomb':
              return <Icon name="bomb" style={typeIconStyle} />
            case 'Countdown':
              return <Icon name="clock-o" style={typeIconStyle} />
            default:
              return undefined
          }
        }
      case 'GameType':
        return <Icon name="rocket" style={gameTypeIconStyle} />
      case 'StartsAt':
      case 'EndsAt':
      case 'CompletedAt':
        {
          const val = dash.get(column)
          return val ? formatDate(val) : '-'
        }
      case 'isPublic':
      case 'isTeamDash':
        return dash.get(column) ? 'Yes' : 'No'
      case 'ParticipantsJoined':
        {
          // const participants = dash.getIn(['Participants', 'items'])
          if (participants) {
            return dash.get('ParticipantsJoined') + ' / ' + dash.get('MinimumParticipants')
          } else {
            return '-'
          }
        }
      case 'RewardsPaid':
        {
          const loadedParticipants = dash.getIn(['Participants', 'loaded'])
          if (loadedParticipants) {
            const participants = dash.getIn(['Participants', 'items'])
            let rewardsPaid = 0
            participants.map(participant => {
              const users = participant.get('Users')
              users.map(user => {
                rewardsPaid += user.get('RewardAmount')
              })
            })
            return rewardsPaid
          } else {
            return '-'
          }
        }
      default:
        return dash.get(column)
    }
    return ''
  }

  handleClickRow = (dash) => {
    const status = dash.get('Status')
    const id = dash.get('Id')
    if (status == 'Draft' || status == 'Upcoming') {
      this.editDash(id)
    } else {
      this.showDashReport(id)
    }
  }

  editDash = (dashId) => {
    this.props.push(`/dashes/${dashId}`)
  }

  showDashReport = (dashId) => {
    this.props.push(`/dashes/${dashId}/report`)
  }

  deleteDash = (dashId) => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      this.props.deleteDash(profile.centifyOrgId, dashId)
    }
  }

  cancelDash = (dashId) => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      this.props.cancelDash(profile.centifyOrgId, dashId)
    }
  }

  tableRowActions(filter, dash) {
    const greenIcon = {
      color: '#00e000'
    }
    const redIcon = {
      color: '#e00000'
    }
    const iconStyle = {
      fontSize: 15,
      marginRight: 7,
    }
    const id = dash.get('Id')
    if (filter == 'Draft') {
      return (
        <span>
          <a href="javascript:;" onClick={this.editDash.bind(this, id)}>
            <Icon name="pencil-square-o" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="check-circle" style={{ ...iconStyle, ...greenIcon }} />
          </a>
          <a href="javascript:;" onClick={this.deleteDash.bind(this, id)}>
            <Icon name="times" style={{ ...iconStyle, ...redIcon }} />
          </a>
        </span>
      )
    } else if (filter == 'Upcoming') {
      return (
        <span>
          <a href="javascript:;" onClick={this.editDash.bind(this, id)}>
            <Icon name="pencil-square-o" style={iconStyle} />
          </a>
          <a href="javascript:;" onClick={this.deleteDash.bind(this, id)}>
            <Icon name="times" style={{ ...iconStyle, ...redIcon }} />
          </a>
        </span>
      )
    } else if (filter == 'Running') {
      return (
        <span>
          <a href="javascript:;" onClick={this.showDashReport.bind(this, id)}>
            <Icon name="line-chart" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="info-circle" style={iconStyle} />
          </a>
          <a href="javascript:;" onClick={this.cancelDash.bind(this, id)}>
            <Icon name="times" style={{ ...iconStyle, ...redIcon }} />
          </a>
        </span>
      )
    } else if (filter == 'Finalizing') {
      return (
        <span>
          <a href="javascript:;" onClick={this.showDashReport.bind(this, id)}>
            <Icon name="line-chart" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="info-circle" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="check-circle" style={{ ...iconStyle, ...greenIcon }} />
          </a>
        </span>
      )
    } else if (filter == 'Completed') {
      return (
        <span>
          <a href="javascript:;" onClick={this.showDashReport.bind(this, id)}>
            <Icon name="line-chart" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="info-circle" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="dollar" style={iconStyle} />
          </a>
        </span>
      )
    } else if (filter == 'Closed') {
      return (
        <span>
          <a href="javascript:;" onClick={this.showDashReport.bind(this, id)}>
            <Icon name="line-chart" style={iconStyle} />
          </a>
          <a href="javascript:;">
            <Icon name="info-circle" style={iconStyle} />
          </a>
        </span>
      )
    }
  }

  render() {
    const { dash, columns, filter } = this.props
    const actions = this.tableRowActions(filter, dash)
    return (
      <tr onClick={this.handleClickRow.bind(this, dash)} style={{ cursor: 'pointer' }}>
        <td onClick={e => e.stopPropagation()}>
          {actions}
        </td>
        {columns.map((column, index) => {
          const value = this.getFieldValue(dash, column.field)
          return (
            <td data-label={column.label} key={index} style={ index == 1 ? { textAlign: 'center' } : {}}>
              <div className="slds-truncate">{value}</div>
            </td>
          )
        })}
      </tr>
    )
  }
}

export default hoc(DashesListItem)
