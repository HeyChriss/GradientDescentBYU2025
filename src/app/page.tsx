'use client';
import { useState } from 'react';
import { Mail, ArrowRight, Star } from 'lucide-react';
import PersonalAgent from '@/components/PersonalAgent';

export function Home() {
  return <PersonalAgent />;
}

export default function NoraLanding() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = () => {
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Image - Replace 'logo.png' with your actual image path */}
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
            <a href="#signup" className="text-slate-300 hover:text-white transition">Sign Up</a>
            <a href="/personal-agent" className="text-slate-300 hover:text-white transition">AI Agent</a>
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
              
              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
                  ✓ Check your email to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <a href="/personal-agent" className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-lg transition border border-slate-600">
              Explore your helper
               <ArrowRight size={18} />
              </a>
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
                {/* Logo Image - Replace 'logo.png' with your actual image path */}
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