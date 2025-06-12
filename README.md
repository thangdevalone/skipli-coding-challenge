![image](https://github.com/user-attachments/assets/6771a9ba-a001-4a3f-986d-efee9feae432)# Employee Task Management System

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

### 💬 Real-time Messaging
- Direct messaging between users
- Real-time message delivery using Socket.io
- Message read receipts
- Conversation history

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore database
3. Generate a service account key
4. Add the configuration to your environment variables

### Database Collections
The application uses the following Firestore collections:
- `employees` - Employee data
- `messages` - Chat messages
- `conversations` - Message conversations
- `accessCodes` - Employee access codes

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

## 📸 Demo Screenshots


### Login Page
![image](https://github.com/user-attachments/assets/0e312d84-cccf-4c34-8cc5-439df44e5168)
![image](https://github.com/user-attachments/assets/a01b918f-8bee-4f56-892d-3d36a2b1e8a1)
![image](https://github.com/user-attachments/assets/4da4185a-1d7a-4489-bb2f-0c7e75baf757)
![image](https://github.com/user-attachments/assets/0f385411-c2e2-451e-acc0-3db6e74791e4)
![image](https://github.com/user-attachments/assets/ee6f4c9d-a735-453c-b5b3-8e14ba6b4ba8)



### Employee Management
![image](https://github.com/user-attachments/assets/099ae7a2-0f86-4739-9715-bc18e09beaa3)


### Real-time Messaging
![image](https://github.com/user-attachments/assets/86929f5d-64a4-4637-ad16-16e546a8ad0a)

---

*Built with ❤️ using Next.js, React, and Node.js* 
