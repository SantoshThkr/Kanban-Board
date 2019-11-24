import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Only renders the page when a user is logged in,
 * otherwise sends the visitor to the login screen.
 */
function PrivateRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container loading">Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={function (props) {
        return user ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
}

export default PrivateRoute;
