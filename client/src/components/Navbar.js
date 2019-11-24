import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const history = useHistory();

  function handleLogout() {
    logout();
    history.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/login'} className="navbar-brand">
          Kanban Board
        </Link>

        {user && (
          <div className="navbar-right">
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="btn btn-small btn-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
