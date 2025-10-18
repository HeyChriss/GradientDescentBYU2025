
// 'use client';
// import { useState, useEffect } from 'react';
// import { Mail, Loader, Download, FileText, LogOut } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import ProfileModal from '@/components/ProfileModal';

// type UserData = {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   phone: string;
// };

// export default function PersonalAgent() {
//   const router = useRouter();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [materials, setMaterials] = useState<{ flashcards?: Array<{ question: string; answer: string }>; studyGuide?: string } | null>(null);
//   const [agentMessage, setAgentMessage] = useState('');

//   useEffect(() => {
//     // Get user data from localStorage
//     const stored = localStorage.getItem('userData');
//     if (stored) {
//       const user = JSON.parse(stored);
//       setUserData(user);
//       setAgentMessage(`Hey ${user.firstName}! I'm Nora, your personal student agent. I can help you do research on any topic, learn topics more deeply, and help you be the best student you can be.`);
//     } else {
//       // Redirect to home if no user data
//       router.push('/');
//     }
//   }, [router]);

//   const handleSubmit = async (textToSubmit: string) => {
//     if (!textToSubmit.trim() || !userData) return;

//     setLoading(true);
//     setAgentMessage('Processing your request...');

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           message: textToSubmit,
//           userName: userData.firstName,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('API request failed');
//       }

//       const data = await response.json();

//       if (data.message) {
//         setAgentMessage(data.message);
//       }

//       if (data.flashcards || data.studyGuide) {
//         setMaterials({
//           flashcards: data.flashcards,
//           studyGuide: data.studyGuide
//         });
//       }

//     } catch (error) {
//       const demoFlashcards = [
//         {
//           question: 'What is the main concept?',
//           answer: 'The primary idea from your content.',
//         },
//         {
//           question: 'How does this relate?',
//           answer: 'It connects to other key concepts.',
//         },
//         {
//           question: 'What are the applications?',
//           answer: 'Real-world uses and examples.',
//         },
//       ];

//       const demoGuide = `Study Guide for Your Topic

// 1. Main Concepts
//    - Key point 1: Important information from your content
//    - Key point 2: Additional crucial details
//    - Key point 3: Supporting information

// 2. Key Terms
//    - Term 1: Definition and context
//    - Term 2: Definition and context

// 3. Important Takeaways
//    - Remember to focus on the core concepts
//    - Practice with the flashcards regularly
//    - Review the study guide before assessments`;

//       setAgentMessage(
//         `Great ${userData?.firstName}! I've prepared study materials for "${textToSubmit}". Check out the flashcards and study guide below!`
//       );
//       setMaterials({
//         flashcards: demoFlashcards,
//         studyGuide: demoGuide,
//       });
//     }

//     setTranscript('');
//     setLoading(false);
//   };

//   const exportFlashcards = () => {
//     if (!materials?.flashcards) return;
//     const csv = materials.flashcards
//       .map((card) => `"${card.question}","${card.answer}"`)
//       .join('\n');
//     const header = '"Question","Answer"\n';
//     const blob = new Blob([header + csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'flashcards.csv';
//     a.click();
//   };

//   const exportStudyGuide = () => {
//     if (!materials?.studyGuide) return;
//     const blob = new Blob([materials.studyGuide], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'study-guide.txt';
//     a.click();
//   };

//   if (!userData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//         <div className="text-white">
//           <Loader size={48} className="animate-spin mx-auto mb-4" />
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-2xl p-8 border-b border-blue-600/30">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-blue-200 animate-pulse"></div>
//               </div>
//               <div>
//                 <h1 className="text-white font-bold text-3xl">Nora</h1>
//                 <p className="text-blue-100 text-sm">Your personal learning companion</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-right hidden md:block">
//                 <p className="text-white font-medium">@{userData.username}</p>
//               </div>
//               <button 
//                 onClick={() => setIsProfileOpen(true)}
//                 className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white/30 hover:scale-110 transition cursor-pointer"
//               >
//                 <span className="text-white font-semibold">{userData.username[0]?.toUpperCase()}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="max-w-3xl w-full space-y-8">
//           {/* Agent Avatar and Message */}
//           <div className="text-center">
//             <div className="flex justify-center mb-8">
//               <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-2xl border-4 border-blue-400/30 ${
//                 loading ? 'animate-pulse scale-110' : 'animate-pulse'
//               } transition-transform`}>
//                 <span className="text-white text-5xl font-bold">N</span>
//               </div>
//             </div>

//             <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8">
//               <p className="text-slate-100 text-xl leading-relaxed">{agentMessage}</p>
//             </div>

//             {loading && (
//               <div className="flex justify-center gap-2 mb-8">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.1s' }}
//                 ></div>
//                 <div
//                   className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.2s' }}
//                 ></div>
//               </div>
//             )}
//           </div>

//           {/* Input Section */}
//           <div className="flex flex-col gap-6">
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 value={transcript}
//                 onChange={(e) => setTranscript(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSubmit(transcript)}
//                 placeholder={`Tell Nora what you want to learn, ${userData.firstName}...`}
//                 disabled={loading}
//                 className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//               <button
//                 onClick={() => handleSubmit(transcript)}
//                 disabled={loading || !transcript.trim()}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-full font-semibold shadow-lg transition flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className="animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   'Generate'
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Materials Display */}
//           {materials && (
//             <div className="space-y-6 mt-12">
//               {materials.flashcards && (
//                 <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
//                   <div className="flex items-center gap-2 mb-4">
//                     <FileText size={24} className="text-blue-400" />
//                     <span className="text-white font-bold text-xl">
//                       {materials.flashcards.length} Flashcards
//                     </span>
//                     <button
//                       onClick={exportFlashcards}
//                       className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
//                     >
//                       <Download size={18} />
//                       Export
//                     </button>
//                   </div>
//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {materials.flashcards.map((card, i) => (
//                       <div key={i} className="bg-slate-600/40 rounded-lg p-4 border border-slate-500/30">
//                         <p className="text-blue-300 font-semibold text-sm mb-1">Question:</p>
//                         <p className="text-slate-200 mb-3">{card.question}</p>
//                         <p className="text-blue-300 font-semibold text-sm mb-1">Answer:</p>
//                         <p className="text-slate-300">{card.answer}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {materials.studyGuide && (
//                 <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
//                   <div className="flex items-center gap-2 mb-4">
//                     <FileText size={24} className="text-blue-400" />
//                     <span className="text-white font-bold text-xl">Study Guide</span>
//                     <button
//                       onClick={exportStudyGuide}
//                       className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
//                     >
//                       <Download size={18} />
//                       Export
//                     </button>
//                   </div>
//                   <div className="bg-slate-600/40 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-500/30">
//                     <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
//                       {materials.studyGuide}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Profile Modal */}
//       <ProfileModal 
//         isOpen={isProfileOpen}
//         onClose={() => setIsProfileOpen(false)}
//         userData={userData}
//       />
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/ProfileModal';

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
};

type AgentType = 'study' | 'research' | 'email' | 'canvas';

export default function PersonalAgent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentType>('study');
  const [showOptions, setShowOptions] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string; content: string}>>([]);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    
    if (stored) {
      const user = JSON.parse(stored);
      setUserData(user);
      
      setAgentMessage(`Hey ${user.firstName}! I'm Nora, your personal student agent. I can help you do research on any topic, learn topics more deeply, and help you be the best student you can be.`);
      // Show greeting for 5 seconds then transition to options
      setTimeout(() => {
        setShowOptions(true);
      }, 5000);
    } else {
      router.push('/');
    }
  }, [router]);

  const getAgentDescription = () => {
    switch (activeAgent) {
      case 'study':
        return `Ready to study? Ask me to explain difficult concepts, help with homework, or answer questions about any subject.`;
      case 'research':
        return `Let's research! Ask me to find information, analyze data, or search for sources on any topic.`;
      case 'email':
        return `Need help with writing? Ask me to draft emails, compose letters, or improve your message.`;
      case 'canvas':
        return `Connect to Canvas! Ask me about your assignments, courses, announcements, and grades.`;
      default:
        return `How can I help you today?`;
    }
  };

  const getAgentExamples = () => {
    switch (activeAgent) {
      case 'study':
        return [
          '"Explain the theory of relativity"',
          '"Help me understand photosynthesis"',
          '"What is machine learning?"',
          '"How does the water cycle work?"'
        ];
      case 'research':
        return [
          '"Research artificial intelligence trends"',
          '"Find information about climate change"',
          '"What are the latest developments in renewable energy?"',
          '"What are the reviews for Professor Jensen at BYU?"'
        ];
      case 'email':
        return [
          '"Draft a professional email to my professor"',
          '"Write a cover letter for a job"',
          '"Compose a thank you message"',
          '"Improve the tone of this message"'
        ];
      case 'canvas':
        return [
          '"What are my upcoming assignments?"',
          '"What courses do I have?"',
          '"Show me assignments due this week"',
          '"What are my grades?"',
          '"Show me Week 1 content for Deep Learning"'
        ];
      default:
        return [];
    }
  };

  const handleAgentSwitch = (agent: AgentType) => {
    setActiveAgent(agent);
    setAgentMessage(getAgentDescription());
    setTranscript('');
  };

  const handleSubmit = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || !userData) return;

    setLoading(true);
    setAgentMessage('Processing your request...');

    try {
      // Call the orchestrator API with chat action (no API keys needed - uses .env.local)
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'chat',
          message: textToSubmit
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();

      if (data.success) {
        // Update conversation history
        if (data.conversationHistory) {
          setConversationHistory(data.conversationHistory);
        }

        // Set the response message
        setAgentMessage(data.response);

        // Log which agent was used
        if (data.agentUsed) {
          console.log(`Agent used: ${data.agentUsed}`);
          console.log('Task result:', data.taskResult);
        }
      } else {
        throw new Error(data.error || 'Failed to process request');
      }

    } catch (error) {
      console.error('Error:', error);
      setAgentMessage(`I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }

    setTranscript('');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
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
                <p className="text-blue-100 text-sm">Your personal learning companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-white font-medium">@{userData.username}</p>
              </div>
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white/30 hover:scale-110 transition cursor-pointer"
              >
                <span className="text-white font-semibold">{userData.username[0]?.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex relative">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full space-y-8">
            {/* Agent Avatar and Message */}
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-2xl border-4 border-blue-400/30 ${
                  loading ? 'animate-pulse scale-110' : 'animate-pulse'
                } transition-transform`}>
                  <span className="text-white text-5xl font-bold">N</span>
                </div>
              </div>

              <div className={`bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8 transition-opacity duration-1000 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md ${
                showOptions ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}>
                <p className="text-slate-100 text-2xl leading-relaxed">Welcome, {userData.firstName}! 👋</p>
                <p className="text-slate-200 text-lg leading-relaxed mt-4">I'm Nora, your AI college companion. I'm here to help you achieve your university goals and reach your full student potential.</p>
              </div>

              <div className={`bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8 transition-opacity duration-1000 ${
                showOptions ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-100 text-lg leading-relaxed mb-6">{getAgentDescription()}</p>
                    <div className="flex justify-center gap-2 mb-6">
                      <button
                        onClick={() => handleAgentSwitch('study')}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          activeAgent === 'study'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        📚 Study
                      </button>
                      <button
                        onClick={() => handleAgentSwitch('research')}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          activeAgent === 'research'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        🔍 Research
                      </button>
                      <button
                        onClick={() => handleAgentSwitch('email')}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          activeAgent === 'email'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        ✉️ Email
                      </button>
                      <button
                        onClick={() => handleAgentSwitch('canvas')}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          activeAgent === 'canvas'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        📚 Canvas
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-semibold">Example usage of NoraPal:</p>
                    <div className="space-y-2">
                      {getAgentExamples().map((example, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const cleanExample = example.replace(/"/g, '');
                            setTranscript(cleanExample);
                          }}
                          className="w-full text-left px-4 py-3 bg-slate-600/30 hover:bg-slate-600/50 rounded-lg text-slate-200 text-sm transition border border-slate-500/30 hover:border-blue-500/50"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Message Display */}
              {showOptions && agentMessage && agentMessage !== getAgentDescription() && (
                <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-slate-100 text-left leading-relaxed whitespace-pre-wrap">{agentMessage}</div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-center gap-2 mb-8">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className={`flex flex-col gap-6 transition-opacity duration-1000 ${
              showOptions ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(transcript)}
                  placeholder={`Tell Nora what you want, ${userData.firstName}...`}
                  disabled={loading}
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
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
                    'Generate'
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