import React from 'react'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import styles from './styles.module.css'

const Home = () => {
  return (
    <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-vertical--x-large">
          <h2 className="slds-m-bottom--small" style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h2>
        </div>
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>SPIFF</h3>
          <div className="slds-m-bottom--large"> SPIFF is a short term contest that pits staff against each other, or encourages them to collaborate depending on the environment you want to engender. Centify uses games to radically change the way a company motivates their staff through the SPIFF process. </div>
        </div>
        
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>GAME TYPES</h3>
          <div className="slds-m-bottom--large"> The Centify Game Types are used to encourage positive behaviors in sales and service people. These behaviors are usually related to activities or tasks they should complete as part of their job and the closing of sales or cases (for service people). The Games encourage individuals or teams and can promote collaboration amongst a team of people to raise the performance levels of all staff.
          <br/><br/>
          1. Over the line<br/>
          2. The Race<br/>
          3. Tug of War<br/>
          4. Countdown
          </div>
        </div>

        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>Over the line</h3>
          <div className="slds-m-bottom--large">Has multiple participants and they can be individuals or teams. There are two ways an Over the Line finishes:  
            <br/>1. When the first individual or Team (aggregate score of all team members) reaches the target.
            <br/>2. When all individual participants or all Team members reach the target.
          </div>
        </div>

          
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>The Race</h3>
          <div className="slds-m-bottom--large">Has multiple individual participants. The Race finishes when the winners (usually First, Second and Third ) reach the target. The Sales Manager or Game Administrator can set up how many placed winners there are and if the is for individuals or teams.
          </div>
        </div>

        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>Tug of War</h3>
          <div className="slds-m-bottom--large">The Tug of War is between two Teams. The Game finishes when one team reaches or exceeds the target measure and there is a specified Gap between the score of the two Teams.
          </div>
        </div>
        
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>Countdown</h3>
          <div className="slds-m-bottom--large">Is an elimination game that focuses on poor performers within the Game criteria. At random intervals spread the person in last place is eliminated.Countdown ends when there is only one participant left. A Countdown Game may have a minimum threshold target that the winner must achieve in order to receive the reward. A Countdown may provide a Second Chance Life to a participant who has been eliminated.
          </div>
        </div>

        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>GAME THEMES</h3>
          <div className="slds-m-bottom--large"> We offer many game themes, such as:<br/>
            <br/>
            Race to the Moon - This is a Race Game game with the number of positions defined by the Sales Manager. You would normally have three places with different rewards for each placing. This game is most likely to be used to increase sales closed rates at month/quarter or year end. It is also applicable to lifting activities amongst reps mid month in order to drive the likelihood of a sale by month end. 
            <br/><br/>
            Carnival Ducks - This is a Countdown Game with a theme reminiscent of the Duck Game at a Carnival. The players move across the screen and at random time intervals the lowest performer is eliminated and their avatar is greyed out. An added level of interactivity is provide by players being able to tap on a duck and it disappears in a puff of smoke.  THis game shows you the poor performers very quickly and allows an early intervention by the manager to address concerns. 
            </div>
        </div>
        
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>REWARDS</h3>
          <div className="slds-m-bottom--large">Rewards are the prize for winning or placing in a SPIFF. In the first release of CEntify these rewards are all Dollars based. </div>
        </div>


      </div>
  )
}

export default Home;
