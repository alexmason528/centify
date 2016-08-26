import React, { Component } from 'react'
import { 
  Checkbox,
  Button,
} from 'react-lightning-design-system'
import { Link } from 'react-router'
import { Icon } from 'react-fa'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import styles from './styles.module.css'
import hoc from './hoc'

class Todos extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { loadedTodos, getTodos } = this.props
      if (!loadedTodos) {
        getTodos(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get todos from server', 'error')
        })
      }
    }
  }

  render() {
    const { todos, loadedTodos, loadingTodos, auth } = this.props
    const profile = auth.getProfile()
    if (loadingTodos) {
      return (
        <LoadingSpinner/>
      )
    }
    const tdStyle = {
      paddingLeft: 20,
      paddingRight: 15,
      position: 'relative',
    }
    const tooltipStyle = {
      position: 'absolute',
      left: '50%',
      bottom: '100%',
      transform: 'translate3d(-50%, -5px, 0)',
      whiteSpace: 'normal',
      visibility: 'hidden',
    }
    const activeIconStyle = {
      color: '#7cc94c',
      fontSize: 16,
    }
    const inactiveIconStyle = {
      color: '#ef572f',
      fontSize: 16,
    }
    return (
      <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-vertical--x-large">
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>ToDos</h2>
          The following are ToDos that are allowed to be selected as prerequisites for dashes.  Once they are activated you are then able to select them when creating a dash.
        </div>
        <div className="slds-m-bottom--large slds-text-align--right">
          <Link to="/todos/edit">
            <Button type="brand">Edit Todos</Button>
          </Link>
        </div>
        <table className={styles.todosTable + ' slds-table slds-table--bordered slds-table--cell-buffer'}>
          <thead>
            <tr className="slds-text-heading--label">
              <th scope="col" title="Status">
                <div className="slds-truncate">Status</div>
              </th>
              <th scope="col" title="Name">
                <div className="slds-truncate">Name</div>
              </th>
              <th scope="col" title="Category">
                <div className="slds-truncate">Category</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => {
              const id = todo.get('Id')
              const name = todo.get('Name')
              const category = todo.get('Category')
              const desc = todo.get('Description')
              const status = todo.get('Status')
              return (
                <tr key={id}>
                  <td title={category} data-label="Status">
                    <div className="slds-truncate">
                      {status ? <Icon name="check" style={activeIconStyle}/> : <Icon name="times" style={inactiveIconStyle}/>}
                    </div>
                  </td>
                  <td title={name} data-label="Name">
                    {name}
                    <div className={styles.tooltip + ' slds-popover slds-popover--tooltip slds-nubbin--bottom'} role="tooltip" style={tooltipStyle}>
                      <div className="slds-popover__body">
                        {desc}
                      </div>
                    </div>
                  </td>
                  <td title={category} data-label="Category">
                    <div className="slds-truncate">{category}</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

}

export default hoc(Todos);
