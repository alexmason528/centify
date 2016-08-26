import React, { Component } from 'react'
import { Button, Grid, Row, Col } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashReportTimer from 'components/DashReportTimer/DashReportTimer'
import { numWithSurfix } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'


class DashReport extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  sumOfOneField(participant, field) {
    let sum = 0
    participant.get('Users').map(user => {
      sum += parseInt(user.get(field) ? user.get(field) : 0)
    })
    return sum
  }

  renderJoinedParticipants = () => {
    const { currentDash, users } = this.props
    const joinedParticipants = currentDash.get('Participants').filter(p => p.get('Status').toLowerCase() == 'joined').sortBy(p => p.get('Position') ? p.get('Position') : 9999)
    const participantStyle = {
      maxWidth: 450,
    }
    return (
      <div className="slds-m-top--medium">
        <table className="slds-table slds-table--bordered slds-table--cell-buffer">
          <thead>
            <tr className="slds-text-heading--label">
              <th scope="col">
                <div className="slds-truncate" title="Position">Position</div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Participant">Participant</div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Score">Score</div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Reward">Reward Earned</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {joinedParticipants.valueSeq().map((participant, index) => {
              const user = users.get(participant.getIn(['Users', 0, 'UserId']))
              if (!user) {
                return undefined
              }
              const username = user.get('FirstName') + ' ' + user.get('LastName')
              return (
                <tr key={index}>
                  <td data-label="Position">
                    {participant.get('Position') ? numWithSurfix(participant.get('Position')) : '-'}
                  </td>
                  <td data-label="Participant">
                    <div className="slds-tile slds-media" style={participantStyle}>
                      <div className="slds-media__figure">
                        <span className="slds-avatar slds-avatar--circle slds-avatar--small">
                          <img src={user.get('AvatarURL')} alt={username} />
                        </span>
                      </div>
                      <div className="slds-media__body">
                        <h3 className="slds-truncate" title={username}>{username}</h3>
                        <div className="slds-tile__detail slds-text-body--small">
                          <dl className="slds-dl--horizontal">
                            <dt className="slds-dl--horizontal__label" style={{ maxWidth: 50 }}>
                              <p className="slds-truncate" title="Email">Email:</p>
                            </dt>
                            <dd className="slds-dl--horizontal__detail slds-tile__meta">
                              <p className="slds-truncate" title={user.get('Email')}>{user.get('Email')}</p>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Score">
                    {this.sumOfOneField(participant, 'Score')}
                  </td>
                  <td data-label="Reward Amount">
                    {this.sumOfOneField(participant, 'RewardAmount')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  renderNotJoinedParticipants = () => {
    const { currentDash, users } = this.props
    const notJoinedParticipants = currentDash.get('Participants').filter(p => p.get('Status').toLowerCase() != 'joined')
    const participantStyle = {
      maxWidth: 450,
    }
    if (!notJoinedParticipants.size) {
      return undefined
    }
    return (
      <div className="slds-p-top--large">
        <h2 className={styles.pageTitle1 + ' slds-m-vertical--large'}>Not Joined</h2>
        <table className="slds-table slds-table--bordered slds-table--cell-buffer">
          <thead>
            <tr className="slds-text-heading--label">
              <th scope="col">
                <div className="slds-truncate" title="Participant">Participant</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {notJoinedParticipants.valueSeq().map((participant, index) => {
              const user = users.get(participant.getIn(['Users', 0, 'UserId']))
              if (!user) {
                return undefined
              }
              const username = user.get('FirstName') + ' ' + user.get('LastName')
              return (
                <tr key={index}>
                  <td data-label="Participant">
                    <div className="slds-tile slds-media" style={participantStyle}>
                      <div className="slds-media__figure">
                        <span className="slds-avatar slds-avatar--circle slds-avatar--small">
                          <img src={user.get('AvatarURL')} alt={username} />
                        </span>
                      </div>
                      <div className="slds-media__body">
                        <h3 className="slds-truncate" title={username}>{username}</h3>
                        <div className="slds-tile__detail slds-text-body--small">
                          <dl className="slds-dl--horizontal">
                            <dt className="slds-dl--horizontal__label" style={{ maxWidth: 50 }}>
                              <p className="slds-truncate" title="Email">Email:</p>
                            </dt>
                            <dd className="slds-dl--horizontal__detail slds-tile__meta">
                              <p className="slds-truncate" title={user.get('Email')}>{user.get('Email')}</p>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  estimatedRewardAmount = () => {
    const { currentDash } = this.props
    let amt = 0
    const rewards = currentDash.get('Rewards')
    rewards.map(reward => {
      amt += parseInt(reward.get('EstimatedRewardAmount'))
    })
    return amt
  }

  refresh = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get dash
      if (this.props.params.dashId) {
        this.props.getDash(profile.centifyOrgId, this.props.params.dashId)
      }
    }
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get users
      const { getUsers, loadedUsers, getDash } = this.props
      if (!loadedUsers) {
        getUsers(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get users from server', 'error')
        })
      }
      // Get dash
      if (this.props.params.dashId) {
        getDash(profile.centifyOrgId, this.props.params.dashId)
        .catch(res => {
          this.context.notify('Failed to get dashes from server', 'error')
        })
      }
    }
  }

  render() {
    const { currentDash, loading, loaded, loadingParticipants, loadingRewards, loadingUsers, users } = this.props
    if (loading || loadingParticipants || loadingRewards || loadingUsers || !loaded) {
      return (
        <LoadingSpinner/>
      )
    }
    const containerStyle = {
      maxWidth: 1200,
    }
    const headerContainerStyle = {
      display: 'flex',
      alignItems: 'center',
    }
    const midPartStyle = {
      flexGrow: 1,
    }
    const endDate = new Date(currentDash.get('EndsAt'))
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium" style={containerStyle}>
        <Grid>
          <Row cols={6}>
            <Col padded cols={6}>
              <div className="slds-p-vertical--large" style={headerContainerStyle}>
                <h2 className={styles.pageTitle} style={{ flexGrow: 1 }}>{currentDash.get('Name')}</h2>
                <DashReportTimer endDate={endDate} />
                <h2 className={styles.pageTitle1 + ' slds-text-align--right'} style={{ flexGrow: 1 }}>Estimated Reward: ${currentDash.get('EstimatedRewardAmount')}</h2>
              </div>
              <div className="slds-p-vertical--medium slds-text-align--right">
                <Button
                  type="brand"
                  onClick={() => this.refresh()}>Refresh Dash</Button>
              </div>
              {this.renderJoinedParticipants()}
              {this.renderNotJoinedParticipants()}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

}

export default hoc(DashReport)