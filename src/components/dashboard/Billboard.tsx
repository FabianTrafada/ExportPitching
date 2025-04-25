import { getCurrentUser } from "@/actions/general.actions";
import Image from "next/image";

export default async function Billboard() {
    const user = await getCurrentUser();

    if(!user) {
        return null
    }
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 md:p-8 rounded-2xl mb-6 md:mb-8">
      <div className="flex flex-wrap items-center gap-4 mb-2 md:mb-4">
        <div className="p-2 md:p-3">
          <Image 
            src={user.imageUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Welcome back, {user.name}!</h1>
      </div>
      <p className="text-sm md:text-base text-gray-600">
        Ready to improve your pitch? Start practicing with our AI-powered templates.
      </p>
    </div>
  );
};