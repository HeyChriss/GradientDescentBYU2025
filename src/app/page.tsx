

// 'use client';
// import { useState } from 'react';
// import { Mail, ArrowRight, Star, User, Phone, Loader } from 'lucide-react';
// import { useRouter } from 'next/navigation';


// // Landing Page Component
// function NoraLanding({ onEmailSubmit, onSignIn }: { 
//   onEmailSubmit: (email: string) => void; 
//   onSignIn: () => void 
// }) {
//   const [email, setEmail] = useState('');

//   const handleSignup = () => {
//     if (email) {
//       onEmailSubmit(email);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <img 
//               src="/images/NoraPallogo.png" 
//               alt="NoraPal Logo" 
//               width={50}
//               height={50}
//               className="flex-shrink-0"
//             />
//             <span className="text-2xl font-bold text-white">NoraPal</span>
//           </div>
//           <nav className="hidden md:flex gap-8 items-center">
//             <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
//             <button 
//               onClick={onSignIn}
//               className="text-slate-300 hover:text-white transition font-medium"
//             >
//               Sign In
//             </button>
//             <button 
//               onClick={() => onEmailSubmit('')}
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition"
//             >
//               Sign Up
//             </button>
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
              
//               <div className="space-y-4">
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
//                     className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                   />
//                 </div>
//                 <button
//                   onClick={handleSignup}
//                   className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
//                 >
//                   Start Free Trial
//                   <ArrowRight size={18} />
//                 </button>
//                 <div className="text-center">
//                   <p className="text-slate-400 text-sm">
//                     Already have an account?{' '}
//                     <button 
//                       onClick={onSignIn}
//                       className="text-blue-400 hover:text-blue-300 font-semibold transition"
//                     >
//                       Sign In
//                     </button>
//                   </p>
//                 </div>
//               </div>
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

// // Signup Page Component
// // Signup Page Component
// function SignupPage({ initialEmail, onSignupComplete, onBackToHome, onGoToSignIn }: { 
//   initialEmail: string; 
//   onSignupComplete: (formData: { firstName: string; lastName: string; username: string; email: string; phone: string; major: string; hobbies: string }) => void;
//   onBackToHome: () => void;
//   onGoToSignIn: () => void;
// }) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: initialEmail || '',
//     phone: '',
//     major: '',
//     hobbies: ''
//   });
//   const [errors, setErrors] = useState({
//     firstName: false,
//     lastName: false,
//     username: false,
//     email: false,
//     phone: false,
//     major: false,
//     hobbies: false
//   });

//   const majors = [
//     'Select a major...',
//     'Computer Science',
//     'Engineering',
//     'Business Administration',
//     'Economics',
//     'Finance',
//     'Marketing',
//     'Psychology',
//     'Biology',
//     'Chemistry',
//     'Physics',
//     'Mathematics',
//     'English Literature',
//     'History',
//     'Political Science',
//     'Sociology',
//     'Nursing',
//     'Medicine',
//     'Law',
//     'Architecture',
//     'Art',
//     'Music',
//     'Philosophy',
//     'Environmental Science',
//     'Geology',
//     'Astronomy',
//     'Agriculture',
//     'Mechanical Engineering',
//     'Electrical Engineering',
//     'Civil Engineering',
//     'Chemical Engineering',
//     'Aerospace Engineering',
//     'Biomedical Engineering',
//     'Communications',
//     'Journalism',
//     'Education',
//     'Criminal Justice',
//     'Public Administration',
//     'International Relations',
//     'Anthropology',
//     'Statistics',
//     'Data Science',
//     'Other'
//   ];

//   const handleChange = (field: keyof typeof formData, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value
//     });
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: false
//       });
//     }
//   };

//   const handleSubmit = () => {
//     const newErrors = {
//       firstName: !formData.firstName.trim(),
//       lastName: !formData.lastName.trim(),
//       username: !formData.username.trim(),
//       email: !formData.email.trim(),
//       phone: !formData.phone.trim(),
//       major: !formData.major || formData.major === 'Select a major...',
//       hobbies: !formData.hobbies.trim()
//     };

//     setErrors(newErrors);
//     const hasErrors = Object.values(newErrors).some(error => error);
    
//     if (!hasErrors) {
//       onSignupComplete(formData);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
//           <button onClick={onBackToHome} className="flex items-center gap-3 hover:opacity-80 transition">
//             <img 
//               src="/images/NoraPallogo.png" 
//               alt="NoraPal Logo" 
//               width={50}
//               height={50}
//               className="flex-shrink-0"
//             />
//             <span className="text-2xl font-bold text-white">NoraPal</span>
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="max-w-2xl w-full">
//           <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
//             <div className="text-center mb-8">
//               <h2 className="text-4xl font-bold text-white mb-2">Create Your Account</h2>
//               <p className="text-slate-300">Fill in your details to get started with NoraPal</p>
//             </div>

//             <div className="space-y-6">
//               {/* First Name and Last Name */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-slate-300 text-sm font-medium mb-2">
//                     First Name <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 text-slate-400" size={20} />
//                     <input
//                       type="text"
//                       value={formData.firstName}
//                       onChange={(e) => handleChange('firstName', e.target.value)}
//                       placeholder="John"
//                       className={`w-full bg-slate-700/50 border ${errors.firstName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                     />
//                   </div>
//                   {errors.firstName && (
//                     <p className="text-red-500 text-sm mt-1">* First name is required</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-slate-300 text-sm font-medium mb-2">
//                     Last Name <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 text-slate-400" size={20} />
//                     <input
//                       type="text"
//                       value={formData.lastName}
//                       onChange={(e) => handleChange('lastName', e.target.value)}
//                       placeholder="Doe"
//                       className={`w-full bg-slate-700/50 border ${errors.lastName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                     />
//                   </div>
//                   {errors.lastName && (
//                     <p className="text-red-500 text-sm mt-1">* Last name is required</p>
//                   )}
//                 </div>
//               </div>

//               {/* Username */}
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   Username <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 text-slate-400" size={20} />
//                   <input
//                     type="text"
//                     value={formData.username}
//                     onChange={(e) => handleChange('username', e.target.value)}
//                     placeholder="johndoe"
//                     className={`w-full bg-slate-700/50 border ${errors.username ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                   />
//                 </div>
//                 {errors.username && (
//                   <p className="text-red-500 text-sm mt-1">* Username is required</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange('email', e.target.value)}
//                     placeholder="you@example.com"
//                     className={`w-full bg-slate-700/50 border ${errors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">* Email address is required</p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleChange('phone', e.target.value)}
//                     placeholder="+1 (555) 123-4567"
//                     className={`w-full bg-slate-700/50 border ${errors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1">* Phone number is required</p>
//                 )}
//               </div>

//               {/* Major Dropdown */}
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   What is your major? <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.major}
//                   onChange={(e) => handleChange('major', e.target.value)}
//                   className={`w-full bg-slate-700/50 border ${errors.major ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition appearance-none cursor-pointer`}
//                 >
//                   {majors.map((major, index) => (
//                     <option key={index} value={major} disabled={major === 'Select a major...'} className="bg-slate-700">
//                       {major}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.major && (
//                   <p className="text-red-500 text-sm mt-1">* Please select a major</p>
//                 )}
//               </div>

//               {/* Hobbies */}
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   What are your hobbies? <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.hobbies}
//                   onChange={(e) => handleChange('hobbies', e.target.value)}
//                   placeholder="e.g., Reading, Gaming, Photography, Sports..."
//                   className={`w-full bg-slate-700/50 border ${errors.hobbies ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
//                 />
//                 {errors.hobbies && (
//                   <p className="text-red-500 text-sm mt-1">* Please tell us your hobbies</p>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 onClick={handleSubmit}
//                 className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 Complete Signup
//                 <ArrowRight size={18} />
//               </button>

//               {/* Sign In Link */}
//               <div className="text-center">
//                 <p className="text-slate-400 text-sm">
//                   Already have an account?{' '}
//                   <button 
//                     onClick={onGoToSignIn}
//                     className="text-blue-400 hover:text-blue-300 font-semibold transition"
//                   >
//                     Sign In
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Sign In Page Component
// function SignInPage({ onSignInComplete, onBackToHome, onGoToSignup }: {
//   onSignInComplete: (userData: { firstName: string; lastName: string; username: string; email: string; phone: string }) => void;
//   onBackToHome: () => void;
//   onGoToSignup: () => void;
// }) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({
//     email: false,
//     password: false
//   });
//   const [loginError, setLoginError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (field: keyof typeof formData, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value
//     });
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: false
//       });
//     }
//     setLoginError('');
//   };

//   const handleSubmit = async () => {
//     const newErrors = {
//       email: !formData.email.trim(),
//       password: !formData.password.trim()
//     };

//     setErrors(newErrors);
//     const hasErrors = Object.values(newErrors).some(error => error);
    
//     if (!hasErrors) {
//       setLoading(true);
//       try {
//         const response = await fetch('/api/auth/signin', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//         });

//         if (!response.ok) {
//           throw new Error('Invalid credentials');
//         }

//         const userData = await response.json();
        
//         // Store user data in localStorage
//         localStorage.setItem('userData', JSON.stringify(userData));
        
//         // Redirect to agent page
//         router.push('/personal-agent');
//       } catch (error) {
//         setLoginError('Invalid email or password. Please try again.');
        
//         // Demo login for testing
//         const userData = {
//           firstName: 'Demo',
//           lastName: 'User',
//           username: 'demouser',
//           email: formData.email,
//           phone: '+1 (555) 000-0000'
//         };
//         localStorage.setItem('userData', JSON.stringify(userData));
//         router.push('/agent');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
//           <button onClick={onBackToHome} className="flex items-center gap-3 hover:opacity-80 transition">
//             <img 
//               src="/images/NoraPallogo.png" 
//               alt="NoraPal Logo" 
//               width={50}
//               height={50}
//               className="flex-shrink-0"
//             />
//             <span className="text-2xl font-bold text-white">NoraPal</span>
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
//             <div className="text-center mb-8">
//               <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
//               <p className="text-slate-300">Sign in to continue your learning journey</p>
//             </div>

//             {loginError && (
//               <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
//                 {loginError}
//               </div>
//             )}

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange('email', e.target.value)}
//                     placeholder="you@example.com"
//                     disabled={loading}
//                     className={`w-full bg-slate-700/50 border ${errors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">* Email is required</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-slate-300 text-sm font-medium mb-2">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => handleChange('password', e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
//                     placeholder="Enter your password"
//                     disabled={loading}
//                     className={`w-full bg-slate-700/50 border ${errors.password ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50`}
//                   />
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">* Password is required</p>
//                 )}
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70"
//               >
//                 {loading ? (
//                   <>
//                     <Loader size={18} className="animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>

//               <div className="text-center">
//                 <p className="text-slate-400 text-sm">
//                   Don't have an account?{' '}
//                   <button 
//                     onClick={onGoToSignup}
//                     disabled={loading}
//                     className="text-blue-400 hover:text-blue-300 font-semibold transition disabled:opacity-50"
//                   >
//                     Sign Up
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Main App Component
// export default function App() {
//   const router = useRouter();
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [email, setEmail] = useState('');

// const handleEmailSubmit = (submittedEmail: string) => {
//   setEmail(submittedEmail);
//   setCurrentPage('signup');
// };

// const handleSignupComplete = (formData: { firstName: string; lastName: string; username: string; email: string; phone: string }) => {
//   // Store user data in localStorage
//   localStorage.setItem('userData', JSON.stringify(formData));
  
//   // Redirect to personal-agent page
//   router.push('/personal-agent');
// };

//   const handleSignIn = () => {
//     setCurrentPage('signin');
//   };

//   const handleBackToHome = () => {
//     setCurrentPage('landing');
//     setEmail('');
//   };

//   const handleGoToSignup = () => {
//     setCurrentPage('signup');
//     setEmail('');
//   };

//   return (
//     <>
//       {currentPage === 'landing' && (
//         <NoraLanding onEmailSubmit={handleEmailSubmit} onSignIn={handleSignIn} />
//       )}
//       {currentPage === 'signup' && (
//         <SignupPage 
//           initialEmail={email} 
//           onSignupComplete={handleSignupComplete}
//           onBackToHome={handleBackToHome}
//           onGoToSignIn={handleSignIn}
//         />
//       )}
//       {currentPage === 'signin' && (
//         <SignInPage
//           onSignInComplete={handleSignupComplete}
//           onBackToHome={handleBackToHome}
//           onGoToSignup={handleGoToSignup}
//         />
//       )}
//     </>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Star, User, Phone, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';


// Landing Page Component
function NoraLanding({ onEmailSubmit, onSignIn }: { 
  onEmailSubmit: (email: string) => void; 
  onSignIn: () => void 
}) {
  const [email, setEmail] = useState('');
  const [rotatingWord, setRotatingWord] = useState('Study');
  
  // Rotate words every 2 seconds
  useEffect(() => {
    const words = ['Study', 'Research', 'Email'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      setRotatingWord(words[currentIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

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
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
            <button 
              onClick={onSignIn}
              className="text-slate-300 hover:text-white transition font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => onEmailSubmit('')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition"
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
              Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500">{rotatingWord}</span> Partner
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
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    Already have an account?{' '}
                    <button 
                      onClick={onSignIn}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
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
function SignupPage({ initialEmail, onSignupComplete, onBackToHome, onGoToSignIn }: { 
  initialEmail: string; 
  onSignupComplete: (formData: { firstName: string; lastName: string; username: string; email: string; phone: string; major: string; hobbies: string }) => void;
  onBackToHome: () => void;
  onGoToSignIn: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: initialEmail || '',
    phone: '',
    major: '',
    hobbies: ''
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    phone: false,
    major: false,
    hobbies: false
  });

  const majors = [
    'Select a major...',
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Economics',
    'Finance',
    'Marketing',
    'Psychology',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'English Literature',
    'History',
    'Political Science',
    'Sociology',
    'Nursing',
    'Medicine',
    'Law',
    'Architecture',
    'Art',
    'Music',
    'Philosophy',
    'Environmental Science',
    'Geology',
    'Astronomy',
    'Agriculture',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biomedical Engineering',
    'Communications',
    'Journalism',
    'Education',
    'Criminal Justice',
    'Public Administration',
    'International Relations',
    'Anthropology',
    'Statistics',
    'Data Science',
    'Other'
  ];

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
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
      username: !formData.username.trim(),
      email: !formData.email.trim(),
      phone: !formData.phone.trim(),
      major: !formData.major || formData.major === 'Select a major...',
      hobbies: !formData.hobbies.trim()
    };

    setErrors(newErrors);
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
              {/* First Name and Last Name */}
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

              {/* Username */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="johndoe"
                    className={`w-full bg-slate-700/50 border ${errors.username ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">* Username is required</p>
                )}
              </div>

              {/* Email */}
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

              {/* Phone */}
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

              {/* Major Dropdown */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  What is your major? <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  className={`w-full bg-slate-700/50 border ${errors.major ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition appearance-none cursor-pointer`}
                >
                  {majors.map((major, index) => (
                    <option key={index} value={major} disabled={major === 'Select a major...'} className="bg-slate-700">
                      {major}
                    </option>
                  ))}
                </select>
                {errors.major && (
                  <p className="text-red-500 text-sm mt-1">* Please select a major</p>
                )}
              </div>

              {/* Hobbies */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  What are your hobbies? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => handleChange('hobbies', e.target.value)}
                  placeholder="e.g., Reading, Gaming, Photography, Sports..."
                  className={`w-full bg-slate-700/50 border ${errors.hobbies ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition`}
                />
                {errors.hobbies && (
                  <p className="text-red-500 text-sm mt-1">* Please tell us your hobbies</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Complete Signup
                <ArrowRight size={18} />
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{' '}
                  <button 
                    onClick={onGoToSignIn}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sign In Page Component
function SignInPage({ onSignInComplete, onBackToHome, onGoToSignup }: {
  onSignInComplete: (userData: { firstName: string; lastName: string; username: string; email: string; phone: string }) => void;
  onBackToHome: () => void;
  onGoToSignup: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false
      });
    }
    setLoginError('');
  };

  const handleSubmit = async () => {
    const newErrors = {
      email: !formData.email.trim(),
      password: !formData.password.trim()
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (!hasErrors) {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const userData = await response.json();
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect to agent page
        router.push('/personal-agent');
      } catch (error) {
        setLoginError('Invalid email or password. Please try again.');
        
        // Demo login for testing
        const userData = {
          firstName: 'Demo',
          lastName: 'User',
          username: 'demouser',
          email: formData.email,
          phone: '+1 (555) 000-0000'
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        router.push('/agent');
      } finally {
        setLoading(false);
      }
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
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300">Sign in to continue your learning journey</p>
            </div>

            {loginError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {loginError}
              </div>
            )}

            <div className="space-y-6">
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
                    disabled={loading}
                    className={`w-full bg-slate-700/50 border ${errors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">* Email is required</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter your password"
                    disabled={loading}
                    className={`w-full bg-slate-700/50 border ${errors.password ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">* Password is required</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={onGoToSignup}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition disabled:opacity-50"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App Component
export default function App() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('landing');
  const [email, setEmail] = useState('');

const handleEmailSubmit = (submittedEmail: string) => {
  setEmail(submittedEmail);
  setCurrentPage('signup');
};

const handleSignupComplete = (formData: { firstName: string; lastName: string; username: string; email: string; phone: string }) => {
  // Store user data in localStorage
  localStorage.setItem('userData', JSON.stringify(formData));
  // Redirect to personal-agent page
  router.push('/personal-agent');
};

  const handleSignIn = () => {
    setCurrentPage('signin');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    setEmail('');
  };

  const handleGoToSignup = () => {
    setCurrentPage('signup');
    setEmail('');
  };

  return (
    <>
      {currentPage === 'landing' && (
        <NoraLanding onEmailSubmit={handleEmailSubmit} onSignIn={handleSignIn} />
      )}
      {currentPage === 'signup' && (
        <SignupPage 
          initialEmail={email} 
          onSignupComplete={handleSignupComplete}
          onBackToHome={handleBackToHome}
          onGoToSignIn={handleSignIn}
        />
      )}
      {currentPage === 'signin' && (
        <SignInPage
          onSignInComplete={handleSignupComplete}
          onBackToHome={handleBackToHome}
          onGoToSignup={handleGoToSignup}
        />
      )}
    </>
  );
}