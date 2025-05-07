/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@/actions/general.actions';
import { db } from '@/db/neon';
import { pitchFeedback } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function FeedbackPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const feedback = await db.query.pitchFeedback.findFirst({
    where: and(
      eq(pitchFeedback.pitchingId, Number(params.id)),
      eq(pitchFeedback.userId, user.id)
    )
  });

  if (!feedback) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Belum ada feedback</h1>
        <p className="text-gray-500">Feedback untuk sesi pitching ini belum tersedia.</p>
      </div>
    );
  }

  const categoryScores = JSON.parse(feedback.categoryScores);
  const strengths = JSON.parse(feedback.strengths);
  const areasForImprovement = JSON.parse(feedback.areasForImprovement);

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Feedback Pitching</h1>
      <div className="mb-6">
        <div className="text-lg font-semibold">Total Score: {feedback.totalScore}</div>
        <div className="mt-2">
          <h2 className="font-medium mb-2">Category Scores</h2>
          <ul className="space-y-1">
            {categoryScores.map((cat: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>{cat.name}</span>
                <span className="font-semibold">{cat.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="font-medium mb-2">Strengths</h2>
        <ul className="list-disc list-inside text-green-700">
          {strengths.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="font-medium mb-2">Areas for Improvement</h2>
        <ul className="list-disc list-inside text-red-700">
          {areasForImprovement.map((a: string, i: number) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="font-medium mb-2">Final Assessment</h2>
        <p className="bg-gray-50 p-4 rounded shadow text-gray-800">{feedback.finalAssessment}</p>
      </div>
    </div>
  );
} 