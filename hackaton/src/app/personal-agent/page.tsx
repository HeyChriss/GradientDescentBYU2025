"use client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AssignmentsDisplay from "@/components/AssigmentsDisplay";
import ProfileModal from "@/components/ProfileModal";

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
};

export default function PersonalAgent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [currentTaskResult, setCurrentTaskResult] = useState<
    | {
        downloadFiles?: Array<{
          format: string;
          filename: string;
          content: string;
          mimeType: string;
        }>;
        metadata?: {
          deckName?: string;
          totalCards?: number;
          difficulty?: string;
        };
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("userData");

    if (stored) {
      const user = JSON.parse(stored);
      setUserData(user);

      // Clear conversation history on initialization
      localStorage.removeItem("conversationHistory");
      setConversationHistory([]);

      // Reset all state to initial values
      setTranscript("");
      setLoading(false);
      setCurrentTaskResult(undefined);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem(
        "conversationHistory",
        JSON.stringify(conversationHistory),
      );
    }
  }, [conversationHistory]);

  const handleSubmit = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || !userData) return;

    setLoading(true);
    setCurrentTaskResult(undefined); // Clear previous task result

    try {
      // Call the orchestrator API with chat action (no API keys needed - uses .env.local)
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: textToSubmit,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      const data = await response.json();

      if (data.success) {
        // Update conversation history
        if (data.conversationHistory) {
          setConversationHistory((prev) => [
            ...prev,
            { role: "user", content: textToSubmit },
            { role: "agent", content: data.response },
          ]);
        }

        // Store task result for download links
        if (data.taskResult) {
          setCurrentTaskResult(data.taskResult);
        }

        // Log which agent was used
        if (data.agentUsed) {
          console.log(`Agent used: ${data.agentUsed}`);
          console.log("Task result:", data.taskResult);
        }
      } else {
        throw new Error(data.error || "Failed to process request");
      }
    } catch (error) {
      console.error("Error:", error);
      // Add error message to conversation history
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "agent",
          content: `I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ]);
    }

    setTranscript("");
    setLoading(false);
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">
          <Loader size={48} className="animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-2xl p-8 border-b border-blue-600/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-blue-200 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white font-bold text-3xl">NoraPal</h1>
                <p className="text-blue-100 text-sm">
                  Your personal learning companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-white font-medium">@{userData.username}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white/30 hover:scale-110 transition cursor-pointer"
              >
                <span className="text-white font-semibold">
                  {userData.username[0]?.toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex relative min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8 min-h-0">
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col min-h-0">
            {/* Scrollable Conversation Area */}
            <div className="flex-1 overflow-y-auto space-y-8 pb-8 min-h-0 custom-scrollbar">
              {/* Agent Avatar and Message */}
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-2xl border-4 border-blue-400/30 ${
                      loading ? "animate-pulse scale-110" : "animate-pulse"
                    } transition-transform`}
                  >
                    <span className="text-white text-5xl font-bold">N</span>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8">
                  <p className="text-slate-100 text-2xl leading-relaxed">
                    Welcome, {userData.firstName}! 👋
                  </p>
                  <p className="text-slate-200 text-lg leading-relaxed mt-4">
                    I&apos;m Nora, your AI college companion. I&apos;m here to
                    help you achieve your university goals and reach your full
                    student potential.
                  </p>
                </div>

                {/* Conversation History */}
                {conversationHistory.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {conversationHistory.map((msg, index) => (
                      <div
                        key={`${msg.role}-${index}-${msg.content.slice(0, 20)}`}
                        className={`max-w-3xl mx-auto ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <div className="bg-blue-600/60 text-white p-4 rounded-2xl inline-block max-w-lg">
                            {msg.content}
                          </div>
                        ) : (
                          <AssignmentsDisplay
                            message={msg.content}
                            taskResult={
                              index === conversationHistory.length - 1
                                ? currentTaskResult
                                : undefined
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center gap-2 mb-8">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Section - Fixed at bottom */}
            <div className="flex flex-col gap-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSubmit(transcript)
                  }
                  placeholder={`Tell Nora what you want, ${userData.firstName}...`}
                  disabled={loading}
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => handleSubmit(transcript)}
                  disabled={loading || !transcript.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-full font-semibold shadow-lg transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={userData}
      />
    </div>
  );
}
