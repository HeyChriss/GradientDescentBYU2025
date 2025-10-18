'use client';
// import { useState } from 'react';
// import { Mail, ArrowRight, Star } from 'lucide-react';
// import PersonalAgent from '@/components/PersonalAgent';

// export function Home() {
//   return <PersonalAgent />;
// }

// export default function NoraLanding() {
//   const [email, setEmail] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const handleSignup = () => {
//     if (email) {
//       setSubmitted(true);
//       setEmail('');
//       setTimeout(() => setSubmitted(false), 3000);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             {/* Logo Image - Replace 'logo.png' with your actual image path */}
//             <img 
//               src="/images/NoraPallogo.png" 
//               alt="NoraPal Logo" 
//               width={50}
//               height={50}
//               className="flex-shrink-0"
//             />
//             <span className="text-2xl font-bold text-white">NoraPal</span>
//           </div>
//           <nav className="hidden md:flex gap-8">
//             <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
//             <a href="#signup" className="text-slate-300 hover:text-white transition">Sign Up</a>
//             <a href="/personal-agent" className="text-slate-300 hover:text-white transition">AI Agent</a>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1">
//         {/* Hero Section */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
//           <div className="text-center">
//             <div className="mb-6 inline-block">
//               <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
//                 Welcome to NoraPal
//               </span>
//             </div>
            
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
//               Your AI Study Partner
//             </h1>
            
//             <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
//               Experience the future of intelligent learning. NoraPal is your personal AI study companion, ready to help you master any subject.
//             </p>

//             {/* Sign Up Section */}
//             <div id="signup" className="mt-12 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 max-w-md mx-auto">
//               <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
              
//               {submitted ? (
//                 <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
//                   ✓ Check your email to get started!
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
//                     <input
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                     />
//                   </div>
//                   <button
//                     onClick={handleSignup}
//                     className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
//                   >
//                     Start Free Trial
//                     <ArrowRight size={18} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* CTA Button */}
//             <div className="mt-12">
//               <a href="/personal-agent" className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-lg transition border border-slate-600">
//               Explore your helper
//                <ArrowRight size={18} />
//               </a>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30">
//           <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose NoraPal?</h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { title: 'Smart Learning', desc: 'Advanced AI tutoring powered by cutting-edge technology' },
//               { title: 'Always Available', desc: '24/7 study support whenever you need it' },
//               { title: 'Personalized', desc: 'Adapts to your learning style and pace' }
//             ].map((feature, i) => (
//               <div key={i} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 hover:border-blue-500/50 transition">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Star className="text-blue-500" size={24} />
//                   <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
//                 </div>
//                 <p className="text-slate-300">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="bg-slate-950/50 border-t border-slate-700/50 mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid md:grid-cols-2 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-3 mb-4">
//                 {/* Logo Image - Replace 'logo.png' with your actual image path */}
//                 <img 
//                   src="/images/NoraPallogo.png" 
//                   alt="NoraPal Logo" 
//                   width={40}
//                   height={40}
//                   className="flex-shrink-0"
//                 />
//                 <span className="text-xl font-bold text-white">NoraPal</span>
//               </div>
//               <p className="text-slate-400">Your personal AI study companion for intelligent learning.</p>
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//               <a href="#" className="text-slate-400 hover:text-white transition">Privacy</a>
//               <a href="#" className="text-slate-400 hover:text-white transition">Terms</a>
//               <a href="#" className="text-slate-400 hover:text-white transition">Contact</a>
//             </div>
//           </div>
//           <div className="border-t border-slate-700/50 pt-8">
//             <p className="text-slate-400 text-center">© 2025 NoraPal. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { Mail, ArrowRight, Star, User, Phone, Loader, Download, FileText } from 'lucide-react';

// Landing Page Component
function NoraLanding({ onEmailSubmit }: { onEmailSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = () => {
    if (email) {
      onEmailSubmit(email);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/images/NoraPallogo.png" 
              alt="NoraPal Logo" 
              width={50}
              height={50}
              className="flex-shrink-0"
            />
            <span className="text-2xl font-bold text-white">NoraPal</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
            <button 
              onClick={() => onEmailSubmit('')}
              className="text-slate-300 hover:text-white transition"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                Welcome to NoraPal
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI Study Partner
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience the future of intelligent learning. NoraPal is your personal AI study companion, ready to help you master any subject.
            </p>

            {/* Sign Up Section */}
            <div id="signup" className="mt-12 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
                <button
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-800/30">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose NoraPal?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Smart Learning', desc: 'Advanced AI tutoring powered by cutting-edge technology' },
              { title: 'Always Available', desc: '24/7 study support whenever you need it' },
              { title: 'Personalized', desc: 'Adapts to your learning style and pace' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 hover:border-blue-500/50 transition">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-blue-500" size={24} />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/50 border-t border-slate-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/NoraPallogo.png" 
                  alt="NoraPal Logo" 
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
                <span className="text-xl font-bold text-white">NoraPal</span>
              </div>
              <p className="text-slate-400">Your personal AI study companion for intelligent learning.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-slate-400 text-center">© 2025 NoraPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Signup Page Component
function SignupPage({ initialEmail, onSignupComplete, onBackToHome }: { 
  initialEmail: string; 
  onSignupComplete: (formData: { firstName: string; lastName: string; email: string; phone: string }) => void;
  onBackToHome: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: initialEmail || '',
    phone: ''
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim(),
      phone: !formData.phone.trim()
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (!hasErrors) {
      onSignupComplete(formData);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={onBackToHome} className="flex items-center gap-3 hover:opacity-80 transition">
            <img 
              src="/images/NoraPallogo.png" 
              alt="NoraPal Logo" 
              width={50}
              height={50}
              className="flex-shrink-0"
            />
            <span className="text-2xl font-bold text-white">NoraPal</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-slate-300">Fill in your details to get started with NoraPal</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="John"
                      className={`w-full bg-slate-700/50 border ${errors.firstName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">* First name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Doe"
                      className={`w-full bg-slate-700/50 border ${errors.lastName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">* Last name is required</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full bg-slate-700/50 border ${errors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">* Email address is required</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full bg-slate-700/50 border ${errors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">* Phone number is required</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Complete Signup
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Personal Agent Component
function PersonalAgent({ userData }: { 
  userData: { firstName: string; lastName: string; email: string; phone: string } 
}) {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<{ flashcards?: Array<{ question: string; answer: string }>; studyGuide?: string } | null>(null);
  const [agentMessage, setAgentMessage] = useState(
    `Hey ${userData.firstName}! I'm Nora, your personal student agent. I can help you do research on any topic, learn topics more deeply, and help you be the best student you can be.`
  );
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);

  const handleSubmit = async (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setAgentMessage('Processing your request...');

    // Add user message to conversation history
    const newHistory = [...conversationHistory, { role: 'user', content: textToSubmit }];
    setConversationHistory(newHistory);

    try {
      // Call your API endpoint that integrates with OpenAI or Claude
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSubmit,
          userName: userData.firstName,
          conversationHistory: newHistory
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Handle AI response
      if (data.message) {
        setAgentMessage(data.message);
        
        // Add assistant message to conversation history
        setConversationHistory([...newHistory, { role: 'assistant', content: data.message }]);
      }

      // If the response includes study materials
      if (data.flashcards || data.studyGuide) {
        setMaterials({
          flashcards: data.flashcards,
          studyGuide: data.studyGuide
        });
      }

    } catch (error) {
      console.error('Error:', error);

      // Fallback demo response if API fails
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
        `Great ${userData.firstName}! I've prepared study materials for "${textToSubmit}". Check out the flashcards and study guide below!`
      );
      setMaterials({
        flashcards: demoFlashcards,
        studyGuide: demoGuide,
      });

      // Add fallback to conversation history
      setConversationHistory([...newHistory, { 
        role: 'assistant', 
        content: `Great ${userData.firstName}! I've prepared study materials for "${textToSubmit}".` 
      }]);
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
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-white font-medium">{userData.firstName} {userData.lastName}</p>
                <p className="text-blue-100 text-sm">{userData.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-semibold">{userData.firstName[0]}</span>
              </div>
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
            {/* Text Input */}
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
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-full font-semibold shadow-lg transition"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  '↵'
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
    </div>
  );
}

// Main App Component (Router)
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string; phone: string } | null>(null);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setCurrentPage('signup');
  };

  const handleSignupComplete = (formData: { firstName: string; lastName: string; email: string; phone: string }) => {
    setUserData(formData);
    setCurrentPage('agent');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    setEmail('');
    setUserData(null);
  };

  return (
    <>
      {currentPage === 'landing' && (
        <NoraLanding onEmailSubmit={handleEmailSubmit} />
      )}
      {currentPage === 'signup' && (
        <SignupPage 
          initialEmail={email} 
          onSignupComplete={handleSignupComplete}
          onBackToHome={handleBackToHome}
        />
      )}
      {currentPage === 'agent' && userData && (
        <PersonalAgent userData={userData} />
      )}
    </>
  );
}