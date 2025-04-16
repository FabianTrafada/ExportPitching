import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="text-center">
                <Loader2 className="size-12 animate-spin text-yellow-400 mx-auto" />
                <p className="mt-4 text-lg font-medium text-gray-700">Loading ExportPitch AI...</p>
            </div>
        </div>
    )
}