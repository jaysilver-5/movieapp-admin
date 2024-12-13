import React, { useEffect, useState } from "react";

type UserListProps = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserListProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: UserListProps[] = await response.json();
        setUsers(data);
      } catch (error) {
        // setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleCopyUID = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000); // Reset after 2 seconds
  };

  const truncateUID = (uid: string) =>
    `${uid.slice(0, 4)}...${uid.slice(-4)}`;

  return (
    <div className="w-4/5 max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-gray-100">
              <td
                className="border px-4 py-2 text-blue-500 cursor-pointer"
                onClick={() => handleCopyUID(user.uid)}
                title="Click to copy UID"
              >
                {copiedUid === user.uid ? (
                  <span className="text-sm text-white bg-green-600 px-2 py-1 rounded-full">
                    Copied!
                  </span>
                ) : (
                  truncateUID(user.uid)
                )}
              </td>
              <td className="border px-4 py-2">{user.displayName}</td>
              <td className="border px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
