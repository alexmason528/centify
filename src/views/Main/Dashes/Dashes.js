import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'
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

  render() {
    const { dashesList, filter, loadingList } = this.props
    if (loadingList) {
      return (
        <LoadingSpinner/>
      )
    }
    return (
      <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-top--medium">
          <Button type={filter == '' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, '')}>All</Button>
          <Button type={filter == 'Draft' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Draft')}>Draft</Button>
          <Button type={filter == 'Upcoming' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Upcoming')}>Upcoming</Button>
          <Button type={filter == 'Running' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Running')}>Running</Button>
          <Button type={filter == 'Finalizing' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Finalizing')}>Finalizing</Button>
          <Button type={filter == 'Review' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Review')}>Review</Button>
          <Button type={filter == 'Closed' ? 'brand' : 'neutral'} onClick={this.changeFilter.bind(this, 'Closed')}>Closed</Button>
        </div>
        <div className="slds-clearfix slds-m-vertical--x-large">
          <h2 className="slds-float--left" style={{ fontSize: 28, fontWeight: 700 }}>Dashes</h2>
          <div className="slds-float--right">
            <Link className="slds-button slds-button--brand" to="/dashes/new">Add Dash</Link>
          </div>
        </div>
        <table className="slds-table slds-table--bordered slds-table--cell-buffer">
          <thead>
            <tr className="slds-text-heading--label">
              <th scope="col" title="Name">
                <div className="slds-truncate">Name</div>
              </th>
              <th scope="col" title="Type">
                <div className="slds-truncate">Type</div>
              </th>
              <th scope="col" title="Participants Joined">
                <div className="slds-truncate">Participants Joined</div>
              </th>
              <th scope="col" title="Start Date">
                <div className="slds-truncate">Start Date</div>
              </th>
              <th scope="col" title="End Date">
                <div className="slds-truncate">End Date</div>
              </th>
              <th scope="col" title="Status">
                <div className="slds-truncate">Status</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dashesList.map((dash) => {
              const id = dash.get('Id')
              const startDate = formatDate(dash.get('StartsAt'));
              const endDate = formatDate(dash.get('EndsAt'));
              return filter == '' || dash.get('Status') == filter ?
                (<tr key={id} onClick={this.editDash.bind(this, id)}>
                  <th title={dash.get('Name')} data-label="Name">
                    <div className="slds-truncate">{dash.get('Name')}</div>
                  </th>
                  <td title={dash.get('Type')} data-label="Type">
                    <div className="slds-truncate">{dash.get('Type')}</div>
                  </td>
                  <td title={dash.get('ParticipantsJoined')} data-label="Participants Joined">
                    <div className="slds-truncate">{dash.get('ParticipantsJoined')}</div>
                  </td>
                  <td title={startDate} data-label="Start Date">
                    <div className="slds-truncate">{startDate}</div>
                  </td>
                  <td title={endDate} data-label="End Date">
                    <div className="slds-truncate">{endDate}</div>
                  </td>
                  <td title={dash.get('Status')} data-label="Status">
                    <div className="slds-truncate">{dash.get('Status')}</div>
                  </td>
                </tr>)
                :
                false
            })}
          </tbody>
        </table>
      </div>
    )
  }

}

export default hoc(Dashes);
