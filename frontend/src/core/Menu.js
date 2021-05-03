import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';

const isActive = (history, path) => {
  return history.location.pathname === path
    ? { color: '#ff9900' }
    : { color: '#000000' };
};

const Menu = ({ history }) => (
  <div>
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link className='nav-link' style={isActive(history, '/')} to='/'>
          Home
        </Link>
      </li>

      <li className='nav-item'>
        <Link
          className='nav-link'
          style={isActive(history, '/users')}
          to='/users'
        >
          Users
        </Link>
      </li>

      <li className='nav-item'>
        <Link
          className='nav-link'
          to={`/post/create`}
          style={isActive(history, `/post/create`)}
        >
          Create Post
        </Link>
      </li>

      {!isAuthenticated() && (
        <>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signin')}
              to='/signin'
            >
              Signin
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signup')}
              to='/signup'
            >
              Signup
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className='nav-item'>
            <Link
              className='nav-link'
              to={`/findpeople`}
              style={isActive(history, `/findpeople`)}
            >
              Find People
            </Link>
          </li>

          <li className='nav-item'>
            <Link
              className='nav-link'
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              to=''
              style={
                (isActive(history, '/'),
                {
                  cursor: 'pointer',
                  color: '#000',
                })
              }
              onClick={() => signout(() => history.push('/'))}
            >
              Signout
            </Link>
          </li>
        </>
      )}
    </ul>
    ;
  </div>
);

export default withRouter(Menu);
