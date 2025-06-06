import { getCurrentUser, getPracticeById } from "@/actions/general.actions";
import { startPracticeSession } from "@/actions/practice.actions";
import Agent from "@/components/Agent";
import { RouteParams } from "@/types/type";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PracticePage({ params }: RouteParams) {
  const user = await getCurrentUser();
  const { id } = await params;
  const templateId = parseInt(id);
  const pitching = await getPracticeById(templateId);

  if (!pitching || !user) {
    redirect("/");
  }

  // Create a pitching session for this practice
  const { success, pitchingId, message } = await startPracticeSession(templateId);
  
  if (!success) {
    // If error is due to insufficient credits, show a message
    if (message === "Not enough credits to start a practice session") {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Insufficient Credits</h1>
            <p className="text-gray-600 mb-6">
              You need at least 1 credit to start a practice session. Please purchase more credits to continue.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/pricing"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Get Credits
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    console.error("Failed to create pitching session:", message);
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-400 p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">{pitching.title}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="font-medium text-gray-800">Template ID:</span>{" "}
            <span className="text-gray-800">{id}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="font-medium text-gray-800">Session ID:</span>{" "}
            <span className="text-gray-800">{pitchingId}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="font-medium text-gray-800">User:</span>{" "}
            <span className="text-gray-800">{user?.name}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="font-medium text-gray-800">Credits Left:</span>{" "}
            <span className="text-gray-800">{user.credit}</span>
          </div>
        </div>
      </div>

      <Agent
        username={user?.name}
        userId={user?.id}
        pitchingId={pitchingId}
        questions={pitching.questions}
      />
    </div>
  );
}
