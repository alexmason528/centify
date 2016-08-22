import React, { Component } from 'react'
import {
  Button,
  ButtonGroup,
  DropdownButton,
  MenuItem,
} from 'react-lightning-design-system'
import { Link } from 'react-router'
import { Icon } from 'react-fa'

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
            return 0
          }
        }
      default:
        return dash.get(column)
    }
    return ''
  }

  tableColumns(filter) {
    return [
      { label: 'Type', field: 'Type' },
      { label: 'Game Type', field: 'GameType' },
      { label: 'Name', field: 'Name' },
      { label: 'Participants', field: 'ParticipantsJoined' },
      { label: 'Reward Amount.', field: 'EstimatedRewardAmount' },
      { label: 'Rewards Paid', field: 'RewardsPaid' },
      { label: 'Start Date', field: 'StartsAt' },
      { label: 'Completed Date', field: 'CompletedAt' },
    ]
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
          <a href="javascript:;" onClick={this.deleteDash.bind(this, id)}>
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
          <ButtonGroup>
            <Button type={filter == 'Draft' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Draft')}>Draft</Button>
            <Button type={filter == 'Upcoming' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Upcoming')}>Upcoming</Button>
            <Button type={filter == 'Running' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Running')}>Running</Button>
            {/*<Button type={filter == 'Finalizing' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Finalizing')}>Finalizing</Button>*/}
            <Button type={filter == 'Finalizing' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Finalizing')}>Finalizing</Button>
            <Button type={filter == 'Completed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Completed')}>Completed</Button>
            <Button type={filter == 'Closed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Closed')}>Closed</Button>
          </ButtonGroup>
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
                <th title="Actions">Actions</th>
                {columns.map((column, index) => (
                  <th scope="col" title={column.label} key={index} style={ index == 1 ? { textAlign: 'center' } : {}}>
                    <div className="slds-truncate">{column.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashesList.valueSeq().map((dash, index) => {
                const id = dash.get('Id')
                const status = dash.get('Status').toLowerCase()
                /*let menu = ''
                if (status == 'draft') {
                  menu = (<DropdownButton type='icon-border-filled' menuAlign='right' menuSize='small'>
                    <MenuItem >Edit</MenuItem>
                    <MenuItem onClick={this.deleteDash.bind(this, id)}>Delete</MenuItem>
                  </DropdownButton>)
                } else if (status != 'closed') {
                  menu = (<DropdownButton type='icon-border-filled' menuAlign='right' menuSize='small'>
                    <MenuItem onClick={this.cancelDash.bind(this, id)}>Cancel</MenuItem>
                  </DropdownButton>)
                }*/
                const actions = this.tableRowActions(filter, dash)
                return filter == '' || dash.get('Status') == filter ?
                  (<tr key={id} onClick={this.handleClickRow.bind(this, dash)} style={{ cursor: 'pointer' }}>
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
