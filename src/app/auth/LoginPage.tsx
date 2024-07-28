import React, { useContext } from 'react';
import { AuthContext } from './UserDataProvider';

export default function LoginPage() {
  let authContextDetails = useContext(AuthContext);

  function performLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let username = formData.get('username') as string;
    let password = formData.get('password') as string;
    authContextDetails.signIn({ username, password }).then((result) => {
      if (result === 'success') {
        console.log('Login successful');
      } else {
        console.log('Login failed');
      }
    });
  }

  return (
    <div>
      <h1 className="text-9xl pt-16">Login</h1>
      <form
        aria-label={'select note or add new'}
        className="display: flex align-items: center"
        onSubmit={performLogin}
      >
        <div>
          <div>username</div>
          <input type="text" name="username"></input>
        </div>
        <div>
          <div>password</div>
          <input type="password" name="password"></input>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
