import React, { Component } from 'react'
import { 
  Checkbox,
} from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import styles from './styles.module.css'
import hoc from './hoc'

class Todos extends Component {

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { loadedTodos, getTodos } = this.props
      if (!loadedTodos) {
        getTodos(profile.centifyOrgId)
      }
    }
  }

  render() {
    const { todos, loadedTodos, loadingTodos, updateTodo, auth } = this.props
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
    return (
      <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-vertical--x-large">
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>To-Dos</h2>
          Select the types of ToDos you may want your users to do in order to quality for dashes
        </div>
        <table className={styles.todosTable + ' slds-table slds-table--bordered slds-table--cell-buffer'}>
          <thead>
            <tr className="slds-text-heading--label">
              <th scope="col" style={{ width: 55 }}>
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
              const type = todo.get('Type')
              const desc = todo.get('Description')
              const status = todo.get('Status')
              return (
                <tr key={id}>
                  <td data-label="Toggle" style={tdStyle}>
                    <Checkbox
                      checked={status ? true : false}
                      onChange={(e) => {
                        const newTodo = todo.set('Status', !!e.currentTarget.checked).delete('Records')
                        updateTodo(profile.centifyOrgId, id, newTodo, index)
                      }} />
                  </td>
                  <td title={name} data-label="Name">
                    <div className="slds-truncate">{name}</div>
                    <div className={styles.tooltip + ' slds-popover slds-popover--tooltip slds-nubbin--bottom'} role="tooltip" style={tooltipStyle}>
                      <div className="slds-popover__body">
                        {desc}
                      </div>
                    </div>
                  </td>
                  <td title={category} data-label="Status">
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
