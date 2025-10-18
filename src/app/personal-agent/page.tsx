// import React, { useState, useRef, useEffect } from 'react';
// import { Loader, Download, FileText } from 'lucide-react';

// export default function PersonalAgent() {
//   const [transcript, setTranscript] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [materials, setMaterials] = useState<{ flashcards?: any[]; studyGuide?: string } | null>(null);
//   const [agentMessage, setAgentMessage] = useState(
//     "Hey! I'm Nora, your personal student agent. I can help you do research on any topic, learn topics more deeply, and help you be the best student you can be."
//   );

//   const handleSubmit = async (textToSubmit: string) => {
//     if (!textToSubmit.trim()) return;

//     setLoading(true);
//     setAgentMessage('Processing your request...');

//     try {
//       const response = await fetch('/api/generate-study-materials', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ content: textToSubmit }),
//       });

//       const data = await response.json();

//       setAgentMessage(
//         `Perfect! I've created study materials based on "${textToSubmit}". I generated ${data.flashcards?.length || 10} flashcards and a comprehensive study guide. Check them out below!`
//       );
//       setMaterials(data);
//     } catch (error) {
//       console.error('Error:', error);

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
//         `Great! I've prepared study materials for "${textToSubmit}". Check out the flashcards and study guide below!`
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-2xl p-8 border-b border-blue-600/30">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center gap-4 mb-2">
//             <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-blue-200 animate-pulse"></div>
//             </div>
//             <div>
//               <h1 className="text-white font-bold text-3xl">Nora</h1>
//               <p className="text-blue-100 text-sm">Your personal learning companion</p>
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
//             {/* Text Input */}
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 value={transcript}
//                 onChange={(e) => setTranscript(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSubmit(transcript)}
//                 placeholder="Tell Nora what you want to learn..."
//                 disabled={loading}
//                 className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//               <button
//                 onClick={() => handleSubmit(transcript)}
//                 disabled={loading || !transcript.trim()}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-full font-semibold shadow-lg transition"
//               >
//                 {loading ? (
//                   <Loader size={20} className="animate-spin" />
//                 ) : (
//                   '↵'
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
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { Mail, Loader, Download, FileText, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/ProfileModal';

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
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<{ flashcards?: Array<{ question: string; answer: string }>; studyGuide?: string } | null>(null);
  const [agentMessage, setAgentMessage] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const stored = localStorage.getItem('userData');
    if (stored) {
      const user = JSON.parse(stored);
      setUserData(user);
      setAgentMessage(`Hey ${user.firstName}! I'm Nora, your personal student agent. I can help you do research on any topic, learn topics more deeply, and help you be the best student you can be.`);
    } else {
      // Redirect to home if no user data
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || !userData) return;

    setLoading(true);
    setAgentMessage('Processing your request...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSubmit,
          userName: userData.firstName,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.message) {
        setAgentMessage(data.message);
      }

      if (data.flashcards || data.studyGuide) {
        setMaterials({
          flashcards: data.flashcards,
          studyGuide: data.studyGuide
        });
      }

    } catch (error) {
      const demoFlashcards = [
        {
          question: 'What is the main concept?',
          answer: 'The primary idea from your content.',
        },
        {
          question: 'How does this relate?',
          answer: 'It connects to other key concepts.',
        },
        {
          question: 'What are the applications?',
          answer: 'Real-world uses and examples.',
        },
      ];

      const demoGuide = `Study Guide for Your Topic

1. Main Concepts
   - Key point 1: Important information from your content
   - Key point 2: Additional crucial details
   - Key point 3: Supporting information

2. Key Terms
   - Term 1: Definition and context
   - Term 2: Definition and context

3. Important Takeaways
   - Remember to focus on the core concepts
   - Practice with the flashcards regularly
   - Review the study guide before assessments`;

      setAgentMessage(
        `Great ${userData?.firstName}! I've prepared study materials for "${textToSubmit}". Check out the flashcards and study guide below!`
      );
      setMaterials({
        flashcards: demoFlashcards,
        studyGuide: demoGuide,
      });
    }

    setTranscript('');
    setLoading(false);
  };

  const exportFlashcards = () => {
    if (!materials?.flashcards) return;
    const csv = materials.flashcards
      .map((card) => `"${card.question}","${card.answer}"`)
      .join('\n');
    const header = '"Question","Answer"\n';
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.csv';
    a.click();
  };

  const exportStudyGuide = () => {
    if (!materials?.studyGuide) return;
    const blob = new Blob([materials.studyGuide], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-guide.txt';
    a.click();
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
                <h1 className="text-white font-bold text-3xl">Nora</h1>
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

            <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-8 shadow-2xl mb-8">
              <p className="text-slate-100 text-xl leading-relaxed">{agentMessage}</p>
            </div>

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
          <div className="flex flex-col gap-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(transcript)}
                placeholder={`Tell Nora what you want to learn, ${userData.firstName}...`}
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
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Materials Display */}
          {materials && (
            <div className="space-y-6 mt-12">
              {materials.flashcards && (
                <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} className="text-blue-400" />
                    <span className="text-white font-bold text-xl">
                      {materials.flashcards.length} Flashcards
                    </span>
                    <button
                      onClick={exportFlashcards}
                      className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {materials.flashcards.map((card, i) => (
                      <div key={i} className="bg-slate-600/40 rounded-lg p-4 border border-slate-500/30">
                        <p className="text-blue-300 font-semibold text-sm mb-1">Question:</p>
                        <p className="text-slate-200 mb-3">{card.question}</p>
                        <p className="text-blue-300 font-semibold text-sm mb-1">Answer:</p>
                        <p className="text-slate-300">{card.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {materials.studyGuide && (
                <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} className="text-blue-400" />
                    <span className="text-white font-bold text-xl">Study Guide</span>
                    <button
                      onClick={exportStudyGuide}
                      className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                  <div className="bg-slate-600/40 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-500/30">
                    <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {materials.studyGuide}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
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