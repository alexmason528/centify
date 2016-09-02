import React, { Component } from 'react'
import {
  Button,
  ButtonGroup,
} from 'react-lightning-design-system'
import { Link } from 'react-router'

import { formatDate } from 'utils/formatter'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashesListItem from 'components/DashesListItem/DashesListItem'
import DashesListActionDialog from 'components/DashesListActionDialog/DashesListActionDialog'
import styles from './styles.module.css'
import hoc from './hoc'


class Dashes extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  state = {
    actionDialogOpen: false,
    actionDialogAction: '',
    actionDialogDash: false,
    actionDialogSubmitting: false,
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { loadedList, getDashesList } = this.props
      if (!loadedList) {
        getDashesList(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get dash list from server', 'error')
        })
      }
    }
  }

  changeFilter = (filter) => {
    this.props.filterDashes(filter)
  }

  tableColumns(filter) {
    return [
      { label: 'Type', field: 'Type' },
      { label: 'Game Type', field: 'GameType' },
      { label: 'Name', field: 'Name' },
      { label: 'Participants', field: 'ParticipantsJoined' },
      { label: 'Reward Amount', field: 'EstimatedRewardAmount' },
      { label: 'Rewards Paid', field: 'RewardsPaid' },
      { label: 'Start Date', field: 'StartsAt' },
      { label: 'Completed Date', field: 'CompletedAt' },
    ]
  }

  onActivateDash = (dash) => {
    this.setState({
      actionDialogOpen: true,
      actionDialogAction: 'activate',
      actionDialogDash: dash,
    });
  }

  onDeleteDash = (dash) => {
    this.setState({
      actionDialogOpen: true,
      actionDialogAction: 'delete',
      actionDialogDash: dash,
    });
  }

  onCompleteDash = (dash) => {
    this.setState({
      actionDialogOpen: true,
      actionDialogAction: 'complete',
      actionDialogDash: dash,
    });
  }

  onClose = () => {
    this.setState({
      actionDialogOpen: false,
    })
  }

  onDoAction = () => {
    const { actionDialogAction, actionDialogDash } = this.state
    let actionDispatcher = null
    if (actionDialogAction == 'activate') {
      actionDispatcher = this.props.activateDash
    } else if (actionDialogAction == 'complete') {
      actionDispatcher = this.props.completeDash
    }
    else if (actionDialogAction == 'delete') {
      actionDispatcher = this.props.deleteDash
    }

    if (actionDispatcher) {
      const auth = this.props.auth
      if (auth) {
        const dashId = actionDialogDash.get('Id')
        const profile = auth.getProfile()
        this.setState({
          actionDialogSubmitting: true,
        })
        actionDispatcher(profile.centifyOrgId, dashId)
        .then(() => {
          this.setState({
            actionDialogOpen: false,
            actionDialogSubmitting: false,
          })
          this.context.notify('Successfully ' + actionDialogAction + 'd dash', 'success')
        })
        .catch(() => {
          this.setState({
            actionDialogOpen: false,
            actionDialogSubmitting: false,
          })
          this.context.notify('Failed to ' + actionDialogAction + ' dash', 'error')
        })
      }
    }
  }

  render() {
    const { dashesList, filter, loadingList } = this.props
    // console.log('rendering: ', dashesList)
    if (loadingList) {
      return (
        <LoadingSpinner/>
      )
    }
    const { actionDialogAction, actionDialogDash, actionDialogOpen, actionDialogSubmitting } = this.state
    const columns = this.tableColumns(filter)
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <div className="slds-m-top--medium">
          <ButtonGroup>
            <Button type={filter == 'Draft' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Draft')}>Draft</Button>
            <Button type={filter == 'Upcoming' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Upcoming')}>Upcoming</Button>
            <Button type={filter == 'Running' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Running')}>Running</Button>
            <Button type={filter == 'Finalizing' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Finalizing')}>Finalizing</Button>
            {/*<Button type={filter == 'Completed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Completed')}>Completed</Button>*/}
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
                const participantCount = dash.get('ParticipantCount')
                return filter == '' || dash.get('Status') == filter ?
                  <DashesListItem
                    key={index}
                    id={id}
                    filter={filter}
                    columns={columns}
                    participantCount={participantCount ? participantCount : 0}
                    onActivate={this.onActivateDash.bind(this, dash)}
                    onDelete={this.onDeleteDash.bind(this, dash)}
                    onComplete={this.onCompleteDash.bind(this, dash)} />
                  :
                  false
              })}
            </tbody>
          </table>
        </div>
        <DashesListActionDialog
          open={actionDialogOpen}
          submitting={actionDialogSubmitting}
          action={actionDialogAction}
          dash={actionDialogDash}
          onClose={this.onClose}
          onYes={this.onDoAction} />
      </div>
    )
  }

}

export default hoc(Dashes);
