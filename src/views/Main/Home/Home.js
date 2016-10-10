import React from 'react'

import styles from './styles.module.css'

class Section extends React.Component {
  render () {
    return (
      <div className='slds-m-vertical--x-large'>
        <h3 className='slds-text-title--caps' style={{ fontSize: 18, fontWeight: 600 }}>{this.props.header}</h3>
        <div className='slds-m-bottom--large'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const Home = () => {
  return (
    <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
      <div className='slds-m-vertical--x-large'>
        <h2 className='slds-m-bottom--small' style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h2>
      </div>
      <Section header='SPIFF'>
        SPIFF is a short term contest that pits staff against each other, or encourages them to collaborate depending on the environment you want to engender. Centify uses games to radically change the way a company motivates their staff through the SPIFF process.
      </Section>

      <Section header='Competitions'>
        The Centify Competitions are used to encourage positive behaviors in sales and service people. These behaviors are usually related to activities or tasks they should complete as part of their job and the closing of sales or cases (for service people). The Competitions encourage individuals or teams and can promote collaboration amongst a team of people to raise the performance levels of all staff.
        <div className='slds-m-top--small'>
          <ol className='slds-list--ordered'>
            <li>Collaborate</li>
            <li>Places</li>
            <li>Eliminate</li>
            <li>Time</li>
          </ol>
        </div>
      </Section>

      <Section header='Collaborate'>
        Has multiple participants and they can be individuals or teams. The goal of the collaboration is to get everyone to hit a target.  The competition doesn't end until everyone is done if someone doesn't make it, no one gets rewarded.  The goal is to encourage collaboration between team members and get everyone cheering together!
      </Section>

      <Section header='Places'>
        Has multiple individual participants. Places finishes when the winners, usually First, Second and Third but that's up to you, reach the target. The Sales Manager or Game Administrator can set up how many placed winners there are and if the is for individuals or teams.
      </Section>

      <Section header='Eliminate'>
        Is an elimination game that focuses on poor performers within the Game criteria. At random intervals spread across the game the person in last place is eliminated. The competition ends when there is only one participant left. An Elimination competition may have a minimum threshold target that the winner must achieve in order to receive the reward.
      </Section>

      <Section header='Time'>
        Is an individual participant or team competition where the goal is to hit a target in the given time.  The focus is on your own targets and doesn't require everyone to get across the line to win.
      </Section>

      <Section header='Games'>
        We offer many games, such as:
        <br/>
        Race to the Moon - This is a Race Game game with the number of positions defined by the Sales Manager. You would normally have three places with different rewards for each placing. This game is most likely to be used to increase sales closed rates at month/quarter or year end. It is also applicable to lifting activities amongst reps mid month in order to drive the likelihood of a sale by month end.
        <br/><br/>
        Carnival Ducks - This is a Countdown Game with a theme reminiscent of the Duck Game at a Carnival. The players move across the screen and at random time intervals the lowest performer is eliminated and their avatar is grayed out. An added level of interactivity is provide by players being able to tap on a duck and it disappears in a puff of smoke.  This game shows you the poor performers very quickly and allows an early intervention by the manager to address concerns.
      </Section>

      <Section header='Rewards'>
        Rewards are the prize for winning or placing in a SPIFF. In the first release of Centify these rewards are all Dollars based.
      </Section>
    </div>
  )
}

export default Home
