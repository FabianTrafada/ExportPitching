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
        <>
            <p>This practice id is {id}</p>
            <p>Current user is {user?.name}</p>
            <p>Current pitching is {pitching.questions}</p>

            <Agent username={user?.name} userId={user?.id} pitchingId={pitching.id} questions={pitching.questions}/>
        </>
    )
}