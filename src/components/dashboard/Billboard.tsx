import { getCurrentUser } from "@/actions/general.actions";
import Image from "next/image";

export default async function Billboard() {
    const user = await getCurrentUser();

    if(!user) {
        return null
    }
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-8 rounded-2xl mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3">
          <Image 
            src={user.imageUrl}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
      </div>
      <p className="text-gray-600">
        Ready to improve your pitch? Start practicing with our AI-powered templates.
      </p>
    </div>
  );
};