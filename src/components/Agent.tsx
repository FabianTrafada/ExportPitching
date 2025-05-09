"use client";

import { createFeedback } from "@/actions/general.actions";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { AgentProps, interviewer } from "@/types/type";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, PhoneOff, Loader2 } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export default function Agent({
  username,
  userId,
  pitchingId,
  feedbackId,
  questions,
}: AgentProps) {
  const user = useUser();
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
      setCallStatus(CallStatus.INACTIVE);
      alert(`Terjadi kesalahan: ${error.message}. Silakan coba lagi nanti.`);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("Generating feedback with messages");

      const { success, feedbackId: id } = await createFeedback({
        pitchingId: pitchingId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/practice/${pitchingId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleGenerateFeedback(messages);
    }
  }, [messages, feedbackId, userId, pitchingId, callStatus, router]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
      alert(`Gagal memulai panggilan: ${error instanceof Error ? error.message : 'Unknown error'}. Silakan coba lagi nanti.`);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.INACTIVE);
    vapi.stop();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pitcher Card */}
        <div className="bg-yellow-400 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col items-center">
            <div className="relative">
              <div className="bg-white rounded-full p-8 shadow-lg">
                <div className="relative size-24">
                  <div className="absolute size-full rounded-full bg-yellow-400" 
                       style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }} />
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex size-full animate-ping rounded-full bg-white opacity-75"></span>
                    </div>
                  )}
                </div>
              </div>
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Speaking
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">Pitcher</h3>
            <p className="text-white text-sm mt-1 font-medium">AI Interview Practice</p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 max-md:hidden">
          <div className="px-6 py-8 flex flex-col items-center">
            <div className="relative">
              <div className="rounded-full p-1 bg-yellow-400">
                <Image
                  src={user.user?.imageUrl || "/placeholder.jpg"}
                  alt="User Avatar"
                  width={120}
                  height={120}
                  className="rounded-full object-cover size-24 border-2 border-white"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{username || "User"}</h3>
            <p className="text-gray-600 text-sm mt-1 font-medium">Participant</p>
          </div>
        </div>
      </div>

      {/* Transcript Display */}
      {messages.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Current Transcript</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p
              key={lastMessage}
              className={cn(
                "text-lg text-gray-700 transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              &quot;{lastMessage}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center mt-6">
        {callStatus !== "ACTIVE" ? (
          <button
            className={cn(
              "relative flex items-center gap-2 px-8 py-3 font-bold text-white rounded-full shadow-lg transition-all duration-200",
              callStatus === "CONNECTING" 
                ? "bg-yellow-500 hover:bg-yellow-600" 
                : "bg-green-500 hover:bg-green-600"
            )}
            onClick={handleCall}
            disabled={callStatus === "CONNECTING"}
          >
            {callStatus === "CONNECTING" ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Phone className="size-5" />
                <span>Start Call</span>
              </>
            )}
          </button>
        ) : (
          <button
            className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all duration-200"
            onClick={handleDisconnect}
          >
            <PhoneOff className="size-5" />
            <span>End Call</span>
          </button>
        )}
      </div>
      
      {/* Session Info */}
      {questions && questions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Questions for this Session</h3>
          <ul className="space-y-2">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-2">
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}