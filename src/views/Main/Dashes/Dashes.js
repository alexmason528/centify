import React, { Component } from 'react'
import {
  Button,
  ButtonGroup,
} from 'react-lightning-design-system'
import { Link } from 'react-router'

import { formatDate } from 'utils/formatter'
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashesListItem from 'components/DashesListItem/DashesListItem'
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
                return filter == '' || dash.get('Status') == filter ?
                  <DashesListItem
                    key={index}
                    id={id}
                    filter={filter}
                    columns={columns} />
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
