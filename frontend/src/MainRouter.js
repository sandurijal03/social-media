import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import Profile from './user/Profile';
import Signin from './user/Signin';
import Signup from './user/Signup';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import FindPeople from './user/FindPeoeple';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import EditPost from './post/EditPost';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <PrivateRoute exact path='/post/create' component={NewPost} />
        <Route exact path='/post/:postId' component={SinglePost} />
        <PrivateRoute exact path='/post/edit/:postId' component={EditPost} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/signin' component={Signin} />
        <PrivateRoute path='/user/edit/:userId' exact component={EditProfile} />
        <PrivateRoute exact path='/findpeople' component={FindPeople} />
        <PrivateRoute exact path='/user/:userId' component={Profile} />
      </Switch>
    </div>
  );
};

export default MainRouter;
