import React, { Component } from 'react'
import {
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-lightning-design-system'
import { Link } from 'react-router'

import { formatDate } from 'utils/formatter'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import styles from './styles.module.css'
import hoc from './hoc'


class Dashes extends Component {

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { loadedList, getDashesList } = this.props
      if (!loadedList) {
        getDashesList(profile.centifyOrgId)
      }
    }
  }

  changeFilter = (filter) => {
    this.props.filterDashes(filter)
  }

  editDash = (dashId) => {
    this.props.push(`/dashes/${dashId}`)
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

  getFieldValue(dash, column) {
    if (Array.isArray(column)) {
      return dash.getIn(column)
    }
    switch(column) {
      case 'StartsAt':
      case 'EndsAt':
        return formatDate(dash.get(column))
      case 'isPublic':
      case 'isTeamDash':
        return dash.get(column) ? 'Yes' : 'No'
      case 'RewardsPaid':
        {
          const loadedParticipants = dash.getIn(['Participants', 'loaded'])
          if (loadedParticipants) {
            const participants = dash.getIn(['Participants', 'items'])
            const targetType = dash.get('IsTeamDash') ? 'Team' : 'Individual'
            let rewardsPaid = 0
            participants.forEach(participant => {
              const val = participant.get('RewardAmount')
              const amt = val ? parseInt(val) : 0
              if (participant.get('Type') == targetType) {
                rewardsPaid += amt
              }
            })
            return rewardsPaid
          } else {
            return 0
          }
        }
      case 'Winners':
        {
          const loadedParticipants = dash.getIn(['Participants', 'loaded'])
          if (loadedParticipants) {
            const participants = dash.getIn(['Participants', 'items'])
            const targetType = dash.get('IsTeamDash') ? 'Team' : 'Individual'
            let rewardsCount = 0
            participants.forEach(participant => {
              const val = participant.get('RewardAmount')
              const amt = val ? parseInt(val) : 0
              if (participant.get('Type') == targetType && amt > 0) {
                rewardsCount++
              }
            })
            return rewardsCount
          } else {
            return 0
          }
        }
      default:
        return dash.get(column)
    }
    return ''
  }

  tableColumns(filter) {
    if (filter == 'Upcoming') {
      return [
        { label: 'Name', field: 'Name' },
        { label: 'Type', field: 'Type' },
        { label: 'Game Type', field: 'GameType' },
        { label: 'Team/Individual', field: 'isTeamDash' },
        { label: 'Start Date', field: 'StartsAt' },
        { label: 'End Date', field: 'EndsAt' },
        { label: 'Public?', field: 'isPublic' },
        { label: 'Min. Participants', field: 'MinimumParticipants' },
        { label: '# Joined', field: 'ParticipantsJoined' },
        { label: 'Est. Reward Amt.', field: 'EstimatedRewardAmount' },
      ]
    } else if (filter == 'Running') {
      return [
        { label: 'Name', field: 'Name' },
        { label: 'Type', field: 'Type' },
        { label: 'Game Type', field: 'GameType' },
        { label: 'Team/Individual', field: 'isTeamDash' },
        { label: 'Start Date', field: 'StartsAt' },
        { label: 'End Date', field: 'EndsAt' },
        { label: 'Public?', field: 'isPublic' },
        { label: 'Min. Participants', field: 'MinimumParticipants' },
        { label: '# Joined', field: 'ParticipantsJoined' },
        { label: 'Est. Reward Amt.', field: 'EstimatedRewardAmount' },
        { label: 'Rewards Paid', field: 'RewardsPaid' },
        { label: 'Measure Val', field: ['Measure', 'Value'] },
      ]
    } else if (filter == 'Review' || filter == 'Completed') {
      return [
        { label: 'Name', field: 'Name' },
        { label: 'Type', field: 'Type' },
        { label: 'Game Type', field: 'GameType' },
        { label: 'Team/Individual', field: 'isTeamDash' },
        { label: 'Start Date', field: 'StartsAt' },
        { label: 'End Date', field: 'EndsAt' },
        { label: 'Completed At', field: 'CompletedAt' },
        { label: 'Public?', field: 'isPublic' },
        { label: 'Min. Participants', field: 'MinimumParticipants' },
        { label: '# Joined', field: 'ParticipantsJoined' },
        { label: 'Est. Reward Amt.', field: 'EstimatedRewardAmount' },
        { label: 'Rewards Paid', field: 'RewardsPaid' },
        { label: 'Winners', field: 'Winners' },
        { label: 'Measure Val', field: ['Measure', 'Value'] },
      ]
    } else if (filter == 'Closed') {
      return [
        { label: 'Name', field: 'Name' },
        { label: 'Type', field: 'Type' },
        { label: 'Game Type', field: 'GameType' },
        { label: 'Team/Individual', field: 'isTeamDash' },
        { label: 'Start Date', field: 'StartsAt' },
        { label: 'End Date', field: 'EndsAt' },
        { label: 'Public?', field: 'isPublic' },
        { label: 'Min. Participants', field: 'MinimumParticipants' },
        { label: '# Joined', field: 'ParticipantsJoined' },
        { label: 'Est. Reward Amt.', field: 'EstimatedRewardAmount' },
      ]
    } else {
      return [
        { label: 'Name', field: 'Name' },
        { label: 'Type', field: 'Type' },
        { label: 'Participants Joined', field: 'ParticipantsJoined' },
        { label: 'Start Date', field: 'StartsAt' },
        { label: 'End Date', field: 'EndsAt' },
        { label: 'Status', field: 'Status' },
      ];
    }
  }

  render() {
    const { dashesList, filter, loadingList } = this.props
    if (loadingList) {
      return (
        <LoadingSpinner/>
      )
    }
    const columns = this.tableColumns(filter)
    return (
      <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-top--medium">
          <Button type={filter == 'Draft' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Draft')}>Draft</Button>
          <Button type={filter == 'Upcoming' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Upcoming')}>Upcoming</Button>
          <Button type={filter == 'Running' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Running')}>Running</Button>
          {/*<Button type={filter == 'Finalizing' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Finalizing')}>Finalizing</Button>*/}
          <Button type={filter == 'Review' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Review')}>Review</Button>
          <Button type={filter == 'Completed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Completed')}>Completed</Button>
          <Button type={filter == 'Closed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Closed')}>Closed</Button>
        </div>
        <div className="slds-clearfix slds-m-vertical--x-large">
          <h2 className="slds-float--left" style={{ fontSize: 28, fontWeight: 700 }}>Dashes</h2>
          <div className="slds-float--right">
            <Link className="slds-button slds-button--brand" to="/dashes/new">Add Dash</Link>
          </div>
        </div>
        <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 85 }}>
          <table className="slds-table slds-table--bordered slds-table--cell-buffer">
            <thead>
              <tr className="slds-text-heading--label">
                {columns.map((column, index) => (
                  <th scope="col" title={column.label} key={index}>
                    <div className="slds-truncate">{column.label}</div>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dashesList.valueSeq().map((dash, index) => {
                const id = dash.get('Id')
                const status = dash.get('Status').toLowerCase()
                let menu = ''
                if (status == 'draft') {
                  menu = (<DropdownButton type='icon-border-filled' menuAlign='right' menuSize='small'>
                    <MenuItem onClick={this.editDash.bind(this, id)}>Edit</MenuItem>
                    <MenuItem onClick={this.deleteDash.bind(this, id)}>Delete</MenuItem>
                  </DropdownButton>)
                } else if (status != 'closed') {
                  menu = (<DropdownButton type='icon-border-filled' menuAlign='right' menuSize='small'>
                    <MenuItem onClick={this.cancelDash.bind(this, id)}>Cancel</MenuItem>
                  </DropdownButton>)
                }
                return filter == '' || dash.get('Status') == filter ?
                  (<tr key={id} onClick={this.editDash.bind(this, id)} style={{ cursor: 'pointer' }}>
                    {columns.map((column, index) => {
                      const value = this.getFieldValue(dash, column.field)
                      return (
                        <td title={value} data-label={column.label} key={index}>
                          <div className="slds-truncate">{value}</div>
                        </td>
                      )
                    })}
                    <td onClick={e => e.stopPropagation()}>
                      {menu}
                    </td>
                  </tr>)
                  :
                  false
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default hoc(Dashes);
