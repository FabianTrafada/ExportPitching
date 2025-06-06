import { getCurrentUser, getUserPitchFeedback } from '@/actions/general.actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export default async function MyFeedbackPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return notFound();
  }

  const feedbackList = await getUserPitchFeedback(user.id);

  if (feedbackList.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Feedback</h1>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-xl font-medium mb-2">No feedback yet</h2>
          <p className="text-gray-600 mb-6">You haven&apos;t completed any pitching sessions yet.</p>
          <Link 
            href="/practice" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Practice Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Feedback</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {feedbackList.map((feedback) => {
          const { pitchingSession } = feedback;
          const template = pitchingSession?.template;
          const strengths = JSON.parse(feedback.strengths);
          
          return (
            <div key={feedback.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                {template?.imageUrl && (
                  <div className="md:flex-shrink-0">
                    <div className="relative h-48 w-full md:h-full md:w-48">
                      <Image
                        src={template.imageUrl}
                        alt={template?.title || "Pitching template"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {template?.title || "Pitching Session"}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {template?.industry} • {template?.targetMarket}
                      </p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 font-semibold text-lg px-3 py-1 rounded-md">
                      {feedback.totalScore}/100
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed on</h3>
                    <p className="text-gray-800">
                      {feedback.createdAt ? format(new Date(feedback.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Key Strengths ({strengths.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {strengths.slice(0, 2).map((strength: string, idx: number) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {strength.length > 40 ? strength.substring(0, 40) + '...' : strength}
                        </span>
                      ))}
                      {strengths.length > 2 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          +{strengths.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link
                      href={`/practice/${pitchingSession.id}/feedback`}
                      className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      View Full Feedback
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 