'use client';

import { useEffect, useState } from 'react';

type UserRecord = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
};

const UserList = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: UserRecord[] = await response.json();
        setUsers(data);
      } catch (error) {
        // setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            {user.uid} - {user.email} - {user.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
