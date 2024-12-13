// /app/api/users/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebaseAdmin';

type UserRecord = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
};

export async function GET() {
  try {
    const listUsers = async (nextPageToken?: string): Promise<UserRecord[]> => {
      const result = await auth.listUsers(1000, nextPageToken);
      const users = result.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));

      if (result.pageToken) {
        return users.concat(await listUsers(result.pageToken));
      }
      return users;
    };

    const users = await listUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
