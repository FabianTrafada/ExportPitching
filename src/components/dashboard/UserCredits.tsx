import { getCurrentUser } from '@/actions/general.actions';
import { Coins } from 'lucide-react';
import Link from 'next/link';

export default async function UserCredits() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Coins className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Available Credits</h3>
            <p className="text-2xl font-bold">{user.credit}</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Get More
        </Link>
      </div>
    </div>
  );
} 