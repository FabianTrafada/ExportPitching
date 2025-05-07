/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@/actions/general.actions';
import { db } from '@/db/neon';
import { pitchFeedback } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { RouteParams } from '@/types/type';

export default async function FeedbackPage({ params }:  RouteParams) {
  const user = await getCurrentUser();
  const {id} = await params;
  if (!user) return notFound();

  const feedback = await db.query.pitchFeedback.findFirst({
    where: and(
      eq(pitchFeedback.pitchingId, Number(id)),
      eq(pitchFeedback.userId, user.id)
    )
  });

  if (!feedback) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No Feedback Available</h1>
          <p className="text-gray-500">Feedback for this pitching session is not yet available.</p>
        </div>
      </div>
    );
  }

  const categoryScores = JSON.parse(feedback.categoryScores);
  const strengths = JSON.parse(feedback.strengths);
  const areasForImprovement = JSON.parse(feedback.areasForImprovement);

  return (
    <div className="container mx-auto px-4 py-12 transition-all duration-300">
      <Suspense fallback={<FeedbackSkeleton />}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl shadow-lg mb-8">
            <h1 className="text-3xl font-bold text-white">Pitching Feedback</h1>
            <p className="text-white opacity-90 mt-2">Session ID: {id}</p>
          </div>
          
          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Overall Score</h2>
              <div className="text-2xl font-bold bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                {feedback.totalScore}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-3">Category Scores</h3>
              <div className="space-y-3">
                {categoryScores.map((cat: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{cat.name}</span>
                      <span className="font-semibold bg-gray-200 px-3 py-1 rounded-md">{cat.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Strengths Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Strengths</h2>
            <ul className="space-y-2">
              {strengths.map((s: string, i: number) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-800">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Areas for Improvement Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Areas for Improvement</h2>
            <ul className="space-y-2">
              {areasForImprovement.map((a: string, i: number) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-gray-800">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Final Assessment Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Final Assessment</h2>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 text-gray-800 leading-relaxed">
              {feedback.finalAssessment}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center mt-8">
            <Link
              href={`/dashboard`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <Skeleton className="h-32 w-full rounded-xl mb-8" />
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
        
        <div className="mt-4">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-12 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Skeleton className="h-64 w-full rounded-xl mb-6" />
      <Skeleton className="h-64 w-full rounded-xl mb-6" />
      <Skeleton className="h-80 w-full rounded-xl mb-6" />
      
      <div className="flex justify-center mt-8">
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );
}