import React, { Component } from 'react';
import { list } from './apiUser';
import photo from '../images/user.png';
import { Link } from 'react-router-dom';

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = (users) => (
    <div className='row'>
      {users.map((user, i) => (
        <div className='card col-md-4' key={i} style={{ width: '18rem' }}>
          <img
            src={`http://localhost:4000/user/photo/${user._id}`}
            alt={photo}
            onError={(i) => (i.target.src = `${photo}`)}
            style={{ height: '200px', width: 'auto' }}
            className='img-thumbnail'
          />

          <div className='card-body'>
            <h5 className='card-title'>{user.name}</h5>
            <p className='card-text'>{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className='btn btn-primary btn-raised btn-smooth '
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}
