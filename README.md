# Employee Task Management System

A full-stack web application for managing employees and tasks with real-time messaging capabilities. Built with Next.js 15, React 19, and Node.js with Firebase integration.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Zustand** for state management
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **Firebase Firestore** database
- **Firebase Admin SDK** for authentication
- **Socket.io** for real-time messaging
- **JWT** for authentication tokens

## 📁 Project Structure

```
skipli-coding-challenge/
├── employee-task-management/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                      # Next.js App Router pages
│   │   │   ├── auth/                 # Authentication pages
│   │   │   ├── admin/                # Admin panel
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   │   ├── employees/        # Employee management
│   │   │   │   ├── tasks/            # Task management
│   │   │   │   └── messages/         # Messaging system
│   │   │   └── setup/                # Initial setup
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── data-table/           # Data table components
│   │   │   ├── manager/              # Manager-specific components
│   │   │   └── validations/          # Form validation schemas
│   │   ├── lib/                      # Utility libraries
│   │   ├── stores/                   # Zustand state stores
│   │   └── types/                    # TypeScript type definitions
│   ├── public/                       # Static assets
│   └── package.json
│
└── employee-task-management-api/      # Backend (Node.js)
    ├── routes/                       # API route handlers
    │   ├── ownerRoutes.js           # Owner-related endpoints
    │   ├── employeeRoutes.js        # Employee-related endpoints
    │   └── messageRoutes.js         # Messaging endpoints
    ├── config/                       # Configuration files
    ├── utils/                        # Utility functions
    └── index.js                      # Main server file
```

## ⚡ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase project with Firestore enabled

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skipli-coding-challenge
```

### 2. Backend Setup
```bash
# Navigate to API directory
cd employee-task-management-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Add your Firebase service account key and other configs
```

**Required Environment Variables (.env):**
```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
JWT_SECRET=your-jwt-secret
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../employee-task-management

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Configure your environment variables
```

**Required Environment Variables (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 4. Running the Application

**Start Backend Server:**
```bash
cd employee-task-management-api
npm run dev
```

**Start Frontend Development Server:**
```bash
cd employee-task-management
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## 🎯 Features

### 🔐 Authentication & Authorization
- Role-based authentication (Owner/Employee)
- JWT token-based security
- Firebase Authentication integration
- Protected routes and middleware

### 👥 Employee Management
- Create, read, update, and delete employees
- Employee profile management
- Department-based organization
- Access code generation for new employees

### 📋 Task Management
- Create and assign tasks to employees
- Task status tracking (pending, in-progress, completed)
- Real-time task updates
- Task filtering and search capabilities

### 💬 Real-time Messaging
- Direct messaging between users
- Real-time message delivery using Socket.io
- Message read receipts
- Conversation history

### 📊 Dashboard Features
- Role-specific dashboards
- Employee overview and statistics
- Task progress tracking
- Recent activities feed

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme support
- Modern component library (Shadcn UI)
- Smooth animations and transitions

## 🛠️ Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore database
3. Generate a service account key
4. Add the configuration to your environment variables

### Database Collections
The application uses the following Firestore collections:
- `employees` - Employee data
- `tasks` - Task information
- `messages` - Chat messages
- `conversations` - Message conversations
- `accessCodes` - Employee access codes

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment
```bash
# Set production environment variables
# Deploy to your preferred cloud provider (Railway, Heroku, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

## 📸 Demo Screenshots

*Add your demo images below:*

### Login Page
<!-- Paste your login page screenshot here -->

### Dashboard Overview
<!-- Paste your dashboard screenshot here -->

### Employee Management
<!-- Paste your employee management screenshot here -->

### Task Management
<!-- Paste your task management screenshot here -->

### Real-time Messaging
<!-- Paste your messaging interface screenshot here -->

---

*Built with ❤️ using Next.js, React, and Node.js* 