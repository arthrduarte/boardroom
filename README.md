


<div align="center">

<img src="https://i.postimg.cc/9Xpc919z/boardroom.png" width="20%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# Boardroom

<em>An AI-powered boardroom simulation platform for business discussions and decision-making</em>
<br>
<em>This project won a hackathon against 10 other incredible teams. [See More](https://www.linkedin.com/posts/arthrduarte_my-team-just-placed-1st-in-a-hackathon-activity-7318296533852950529-qsTA/)

<br><br>
<em>Technology Stack</em>

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui">
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
<br>

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/OpenAI-4129919?style=flat-square&logo=openai&logoColor=white" alt="OpenAI">
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=white" alt="Swagger">
<br>
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git">
<img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest">
<br>


</div>
<br>

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Project Architecture & Structure](#project-architecture--structure)
4. [Getting Started](#getting-started)
   - [🚀 Live Application](#-live-application)
   - [💻 Local Development](#-local-development)
   - [Environment Variables](#environment-variables)
   - [Prerequisites](#prerequisites)
5. [Roadmap](#roadmap)
6. [Contributing](#contributing)
7. [License](#license)
8. [Acknowledgments](#acknowledgments)

---
<br><br>

## Overview

The Boardroom is an innovative platform that simulates a virtual boardroom environment where users can interact with AI-powered board members. The platform combines advanced AI technology with a modern, intuitive interface to create an immersive experience for business discussions and decision-making processes.

---

## Features

- 🤖 **AI-Powered Board Members**: Interact with realistic AI personalities representing different board members
- 💬 **Real-time Chat Interface**: Engage in natural conversations with board members
- 📊 **Discussion History**: Access and review past conversations and decisions
- 👥 **Member Profiles**: Detailed profiles of board members with their expertise and roles
- 🎨 **Modern UI/UX**: Clean and intuitive interface with dark mode support
- 🔒 **Secure Authentication**: User authentication and session management
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

---
<br><br>

## Project Architecture & Structure

<div style="display: flex; justify-content: center;">
  <img src="https://i.postimg.cc/kXcrbbQv/diagram-export-31-03-2025-12-59-50.png" width="60%" alt="arch-view">
</div>
<br>

```sh
├── client/                   # Frontend React application
    │   ├── public/               # Public files
    │   ├── src/
    │   │   ├── assets/           # Static assets 
    │   │   ├── components/       # React components
    │   │   │   ├── ui/           # Reusable UI components
    │   │   │   └── lib/          # Component-specific utilities
    │   │   ├── App.tsx           # Main application component
    │   │   └── ...               # Other files 
    │   └── package.json
    └── server/                   # Backend Node.js application
        ├── src/
        │   ├── config/           # Configuration files
        │   ├── controllers/      # Route controllers
        │   ├── routes/           # API route definitions
        │   ├── utils/            # Utility functions
        │   └── ...               # Other files 
        └── package.json
```

---
<br><br>
## Getting Started
<br><br>
### 🚀 Live Application
The application is available at  **→**  **[boardroom.io/](https://boardroom-app-f54ca20f8301.herokuapp.com/)**


<br><br>
---
<br><br>

### 💻 Local Development
If you want to run the application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/boardroom-team-07.git
   cd boardroom-team-07
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   
   # Install root dependencias
   cd ..
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In the server directory
   cp .env.example .env
   # Edit .env with your credentials

   # In the client directory
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Start the servers:
   ```bash
   # Start both client and server (from root directory)
   npm run dev

   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Environment Variables

#### Server (.env)
```
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Client (.env)
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (if running locally)
- OpenAI API key
- Supabase account and credentials

---
<br><br>

## Roadmap

- [X] **Initial Setup**: Project structure and basic configuration
- [X] **Authentication**: User authentication and session management
- [X] **Board Member Profiles**: Create and manage AI board member profiles
- [X] **Chat Interface**: Implement real-time chat functionality
- [X] **Discussion History**: Store and retrieve conversation history
- [ ] **Advanced AI Features**: Enhanced AI responses and personality traits
- [ ] **Analytics Dashboard**: Track and analyze user interactions
- [ ] **Mobile Optimization**: Improve mobile responsiveness
- [ ] **Internationalization**: Support multiple languages

---
<br><br>

## Contributing

We welcome contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
<br><br>

## License

This project is licensed under the MIT License - see the [LICENSE](https://mit-license.org/) file for details.

---
<br><br>

## Acknowledgments

- Thanks to all contributors who have helped shape The Boardroom;
- Thanks to Yuri Ribeiro and the Borderless Coding community;
- Special thanks to the AI technology providers (OpenAI);
- Inspired by real boardroom dynamics and business communication needs;

<div align="right">

[![][back-to-top]](#top)

</div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square


---






