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

class TodosEdit extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  state = {
    submitting: false,
    updatingTodoCount: 0,
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

  handleSave = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { todos, updateTodo, push } = this.props
      let updatingTodoCount = 0
      {todos.map((todo, index) => {
        const status = todo.get('Status')
        const orgStatus = todo.get('OrgStatus')
        if (typeof orgStatus != 'undefined' && status != orgStatus) {
          updatingTodoCount += 1
          updateTodo(profile.centifyOrgId, todo.get('Id'), todo, index)
          .then(() => {
            let submitting = this.state.submitting
            let updatingTodoCount = this.state.updatingTodoCount
            updatingTodoCount -= 1
            if (!updatingTodoCount) {
              submitting = false
            }
            this.setState({
              submitting,
              updatingTodoCount
            })
            push('/todos')
          })
          .catch(res => {
            this.context.notify('Failed to update a todo status', 'error')
          })
        }
      })}
      this.setState({
        submitting: true,
        updatingTodoCount
      })
    }
  }

  render() {
    const { todos, loadedTodos, loadingTodos, auth, setTodoStatus } = this.props
    const { submitting } = this.state
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
          <Link to="/todos">
            <Button type="neutral">Cancel</Button>
          </Link>
          <Button
            type="brand"
            style={{ marginLeft: 10 }}
            onClick={this.handleSave}
            disabled={submitting}>Save</Button>
        </div>
        <table className={styles.todosTable + ' slds-table slds-table--bordered slds-table--cell-buffer'}>
          <thead>
            <tr className="slds-text-heading--label">
              <th style={{ width: 35 }} />
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
                  <td data-label="Toggle" style={tdStyle}>
                    <Checkbox
                      checked={status ? true : false}
                      onChange={(e) => {
                        setTodoStatus(index, !!e.currentTarget.checked)
                      }} />
                  </td>
                  {/*
                      */}
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
        <div className="slds-m-top--large slds-text-align--right">
          <Link to="/todos">
            <Button type="neutral">Cancel</Button>
          </Link>
          <Button
            type="brand"
            style={{ marginLeft: 10 }}
            onClick={this.handleSave}
            disabled={submitting}>Save</Button>
        </div>
      </div>
    )
  }

}

export default hoc(TodosEdit);
