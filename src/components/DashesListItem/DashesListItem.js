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
    const iconStyleHeight = {
      height: 30,
    }
    switch(column) {
      case 'Type':
        {
          const val = dash.getIn(['DashType', 'Name'])
          const imgSRC = dash.getIn(['DashType', 'IconURL'])
          return <img src={imgSRC} alt={val}  title={val} style={iconStyleHeight}/>
        }
      case 'GameType':
        {
          const val = dash.getIn([column, 'Name'])
          const imgSRC = dash.getIn([column, 'IconURL'])
          return <img src={imgSRC} alt={val} title={val} style={iconStyleHeight}/>
        }
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
        return dash.get('ParticipantsJoined')
      case 'EstimatedRewardAmount':
        {
          let amount = dash.get(column)
          if (!amount) amount = 0
          amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          return '$' + amount
        }
      // case 'RewardsPaid':
      //   {
      //     const loadedParticipants = dash.getIn(['Participants', 'loaded'])
      //     if (loadedParticipants) {
      //       const participants = dash.getIn(['Participants', 'items'])
      //       let rewardsPaid = 0
      //       participants.map(participant => {
      //         const users = participant.get('Users')
      //         users.map(user => {
      //           rewardsPaid += user.get('RewardAmount')
      //         })
      //       })
      //       return rewardsPaid
      //     } else {
      //       return '-'
      //     }
      //   }
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
    this.props.push(`/spiffs/${dashId}`)
  }

  viewDashDetails = (dashId) => {
    this.props.push(`/spiffs/${dashId}`)
  }

  showDashReport = (dashId) => {
    this.props.push(`/spiffs/${dashId}/report`)
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

  createLinkIcon = (onClick, icon, iconStyle, tooltipText) => {
    return (
      <span className={styles.tooltipWrapper}>
        <a href="javascript:;" onClick={onClick}>
          <Icon name={icon} style={iconStyle} />
        </a>
        <div className={"slds-popover slds-nubbin--left " + styles.tooltip} role="dialog">
          <div className="slds-popover__body">
            {tooltipText}
          </div>
        </div>
      </span>
    )
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
    const { onActivate, onComplete, onDelete, onApprove } = this.props
    if (filter == 'Draft') {
      return (
        <span>
          {this.createLinkIcon(
            this.editDash.bind(this, id),
            "pencil-square-o",
            iconStyle,
            'Edit'
          )}
          {this.createLinkIcon(
            onActivate,
            "check-circle",
            { ...iconStyle, ...greenIcon },
            'Activate'
          )}
          {this.createLinkIcon(
            //this.deleteDash.bind(this, id),
            onDelete,
            "times",
            { ...iconStyle, ...redIcon },
            'Delete'
          )}
        </span>
      )
    } else if (filter == 'Upcoming') {
      return (
        <span>
          {this.createLinkIcon(
            this.editDash.bind(this, id),
            "pencil-square-o",
            iconStyle,
            'Edit'
          )}
          {/*this.createLinkIcon(
            this.cancelDash.bind(this, id),
            "times",
            { ...iconStyle, ...redIcon },
            'Cancel'
          )*/}
        </span>
      )
    } else if (filter == 'Running') {
      return (
        <span>
          {this.createLinkIcon(
            this.showDashReport.bind(this, id),
            "line-chart",
            iconStyle,
            'SPIFF Report'
          )}
          {this.createLinkIcon(
            this.viewDashDetails.bind(this, id),
            "info-circle",
            iconStyle,
            'View Details'
          )}
        </span>
      )
    } else if (filter == 'Finalizing') {
      return (
        <span>
          {this.createLinkIcon(
            this.showDashReport.bind(this, id),
            "line-chart",
            iconStyle,
            'SPIFF Report'
          )}
          {this.createLinkIcon(
            this.viewDashDetails.bind(this, id),
            "info-circle",
            iconStyle,
            'View Details'
          )}
        </span>
      )
    } /*else if (filter == 'Completed') {
      return (
        <span>
          {this.createLinkIcon(
            this.showDashReport.bind(this, id),
            "line-chart",
            iconStyle,
            'SPIFF Report'
          )}
          {this.createLinkIcon(
            null,
            "info-circle",
            iconStyle,
            'View Details'
          )}
          {this.createLinkIcon(
            null,
            "dollar",
            iconStyle,
            'Payout'
          )}
        </span>
      )
    }*/ else if (filter == 'Closed') {
      return (
        <span>
          {this.createLinkIcon(
            this.showDashReport.bind(this, id),
            "line-chart",
            iconStyle,
            'SPIFF Report'
          )}
          {this.createLinkIcon(
            this.viewDashDetails.bind(this, id),
            "info-circle",
            iconStyle,
            'View Details'
          )}
        </span>
      )
    } else if (filter == 'Review') {
      return (
        <span>
          {this.createLinkIcon(
            this.showDashReport.bind(this, id),
            "line-chart",
            iconStyle,
            'SPIFF Report'
          )}
          {this.createLinkIcon(
            this.viewDashDetails.bind(this, id),
            "info-circle",
            iconStyle,
            'View Details'
          )}
          {this.createLinkIcon(
            onApprove,
            "check",
            { ...iconStyle, ...greenIcon },
            'Approve for Payment'
          )}
        </span>
      )
    }
  }

  render() {
    const { dash, columns, filter } = this.props
    const actions = this.tableRowActions(filter, dash)
    return (
      <tr onClick={this.handleClickRow.bind(this, dash)} style={{ cursor: 'pointer' }}>
        <td className={styles.actionTd} onClick={e => e.stopPropagation()}>
          {actions}
        </td>
        {columns.map((column, index) => {
          const value = this.getFieldValue(dash, column.field)
          return (
            <td data-label={column.label} key={index} style={ index == 1 ? { textAlign: 'center' } : {} }>
              <div className="slds-truncate">{value}</div>
            </td>
          )
        })}
      </tr>
    )
  }
}

export default hoc(DashesListItem)
