import { getCurrentUser, getPracticeById } from "@/actions/general.actions";
import Agent from "@/components/Agent";
import { RouteParams } from "@/types/type";
import { redirect } from "next/navigation";

export default async function PracticePage({ params }: RouteParams) {
    const user = await getCurrentUser();
    const { id } = await params;
    const pitching = await getPracticeById(parseInt(id));

    if(!pitching) {
        redirect('/');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-yellow-400 p-6 rounded-xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Practice Session</h1>
                <div className="flex flex-wrap gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg">
                        <span className="font-medium text-gray-800">Session ID:</span> <span className="text-gray-800">{id}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg">
                        <span className="font-medium text-gray-800">User:</span> <span className="text-gray-800">{user?.name}</span>
                    </div>
                </div>
            </div>

            <Agent 
                username={user?.name} 
                userId={user?.id} 
                pitchingId={pitching.id} 
                questions={pitching.questions}
            />
        </div>
    )
}