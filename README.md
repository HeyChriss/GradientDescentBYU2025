# NoraPal Multi-Agent AI Assistant for Students

A comprehensive AI-powered platform designed to enhance the first-year college experience through intelligent task automation and personalized assistance.

## 🏗️ Architecture

This project implements a **multi-agent system** with an orchestrator agent that manages workflow between four specialized agents. Each agent is designed to handle specific tasks, creating a seamless and intelligent user experience.

### Orchestrator Agent
The orchestrator serves as the central coordinator, analyzing user requests and routing them to the appropriate specialized agent. It manages:
- Request classification and routing
- Inter-agent communication
- Response aggregation
- Workflow optimization

### The Four Specialized Agents

#### 1. Research & Web Scraping Agent
- Performs intelligent web searches using Tavily API
- Scrapes and processes educational content
- Helps students understand complex concepts from their classes
- Provides curated information from reliable sources

#### 2. Canvas Integration Agent
- Connects directly to Canvas LMS
- Retrieves assignments, due dates, and grades
- Accesses course materials and announcements
- Fetches module content and learning resources
- Provides a unified view of all academic information

#### 3. Flashcard Generation Agent
- Creates custom flashcards from any topic
- Generates study materials from course content
- Supports active recall and spaced repetition learning
- Helps students prepare for exams efficiently

#### 4. Email Management Agent
- Drafts professional emails
- Composes messages based on context
- Sends emails directly through Gmail integration
- Streamlines communication with professors and peers

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Tavily API key
- Canvas access token
- Gmail app password

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd multi-agent-assistant
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
CANVAS_ACCESS_TOKEN=your_canvas_access_token_here
GMAIL_PASSWORD=your_gmail_app_password_here
GMAIL_EMAIL=your_email@gmail.com
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API keys section
4. Generate a new API key

### Tavily API Key
1. Visit [Tavily](https://tavily.com/)
2. Sign up for an account
3. Access your dashboard
4. Copy your API key

### Canvas Access Token
1. Log into your Canvas account
2. Go to Account → Settings
3. Scroll to "Approved Integrations"
4. Click "+ New Access Token"
5. Generate and copy the token

### Gmail App Password
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account settings
3. Navigate to Security → 2-Step Verification
4. Scroll to "App passwords"
5. Generate a new app password for "Mail"

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **AI/ML:** OpenAI GPT API
- **Web Search:** Tavily API
- **LMS Integration:** Canvas API
- **Email:** Gmail SMTP

## 📝 Features

-  Intelligent request routing via orchestrator agent
-  Real-time Canvas integration
-  AI-powered research assistance
-  Automated flashcard generation
-  Email composition and sending
-  User-friendly interface
-  Fast and responsive design

## Demo Link: 
- [Demo Link](https://gradient-descent-byu-2025.vercel.app/)


## 🎯 Future Enhancements

- Support for additional LMS platforms (Blackboard, Moodle)
- Calendar integration for deadline management
- Study group matching and collaboration tools
- Progress tracking and analytics
- Mobile app development
- Multi-language support


Built with ❤️ at BYU Hackathon 2025

## 📄 License

MIT License - feel free to use this project for educational purposes

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Note:** This project was built in 10 hours as part of a hackathon. While fully functional, there may be areas for optimization and improvement. We welcome contributions from the community!
