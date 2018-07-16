import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, RadioButton, RadioButtonGroup } from 'material-ui';
import { browserHistory } from 'react-router';
import { loadUsers, updateUser } from './actions';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

class AdminUsers extends React.PureComponent {
    constructor(props) {
        super(props);
        // this.state = {
            
        // };
        this.props.loadUsers();
    }
    componentDidMount() {
        if (!localStorage.getItem('token')) {
          browserHistory.push('/auth/login');
        }
      }


    componentWillReceiveProps(nextProps) {
        if (nextProps.isUpdated === true) {
          window.location.reload()
        }
      }

    updateUser(userId){
        this.props.updateUser(userId);
    }

    render() {
        return (
            <div className="admin-users">
              <Table selectable={false}>
              <TableHeader displaySelectAll={false} enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>first name</TableHeaderColumn>
                  <TableHeaderColumn>last name</TableHeaderColumn>
                  <TableHeaderColumn>role</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.props.users && this.props.users.users ? this.props.users.users.map((user, key) =>
                    <TableRow key={key}>
                      <TableRowColumn>{user.firstName}</TableRowColumn>
                      <TableRowColumn>{user.lastName}</TableRowColumn>
                      <TableRowColumn>{user.role}</TableRowColumn>
                      {user.role !== 'Admin' ?
                        <TableRowColumn>    
                            <Button fullWidth={true} onClick={() => this.updateUser(user._id)}>set to admin</Button>
                        </TableRowColumn>
                    :''}
                    </TableRow>
                ):''}
              </TableBody>
            </Table>
            </div>
        );
    }
}

AdminUsers.propTypes = {
   
};
  
export function mapStateToProps(state) {
    return {
        users: state.adminUsers.data,
        isUpdated: state.adminUsers.isUpdated
    }
}

  
export function mapDispatchToProps(dispatch) {
    return {
    loadUsers: () => {
        dispatch(loadUsers());
        },
    updateUser: (userId)  => {
        dispatch(updateUser(userId))
    }
        
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
  











