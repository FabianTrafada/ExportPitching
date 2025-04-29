"use client";

import { createFeedback } from "@/actions/general.actions";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { AgentProps, interviewer } from "@/types/type";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      console.log("Error:", error);
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
        router.push(`/pitching/${pitchingId}/feedback`);
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
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.INACTIVE);
    vapi.stop();
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
        <div className="flex items-center justify-center flex-col gap-2 p-7 h-[400px] bg-yellow-400 rounded-lg border-2 border-white flex-1 sm:basis-1/2 w-full">
          <div className="z-10 flex items-center justify-center rounded-full size-[120px] relative bg-white">
            <div
              className="absolute size-15 rounded-full bg-yellow-400 object-cover"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
            />
            {isSpeaking && (
              <span className="absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75"></span>
            )}
          </div>
          <h3 className="text-2xl text-white mt-2">Pitcher</h3>
        </div>

        <div className="p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden">
          <div className="flex flex-col gap-2 justify-center items-center bg-yellow-400 p-7 rounded-2xl min-h-full">
            <Image
              src={user.user?.imageUrl || ""}
              alt="User Avatar"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3 className="text-2xl text-white mt-2">{username}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="border-gradient p-0.5 rounded-2xl w-full">
          <div className="rounded-2xl min-h-12 px-5 py-3 flex items-center justify-center">
            <p
              key={lastMessage}
              className={cn(
                "text-lg text-center text-yellow-400 transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="mt-2 relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-green-500 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-green-500 hover:bg-green-500/80 min-w-28 cursor-pointer items-center justify-center overflow-visible" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-red-500 hover:bg-destructive-500/80 min-w-28" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
}
