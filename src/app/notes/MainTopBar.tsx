import React, { useContext } from 'react';
import { AuthContext } from '../auth/UserDataProvider';

export default function MainTopBar() {
  const { userStatus, signOut } = useContext(AuthContext);

  function performLogout() {
    signOut().then();
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end dark:text-white ">
            Yana (Yet another notes app)
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              {userStatus.authStatus === 'signed in' && (
                <>
                  <div>{userStatus.userDetails?.username}</div>
                  <button onClick={performLogout}>logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
