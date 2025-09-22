[![Demo Video](https://img.shields.io/badge/🎥-Demo_Video-blue)](https://your-demo-video-link.com)
[![Download APK](https://img.shields.io/badge/📱-Download_APK-green)](https://expo.dev/accounts/manuth/projects/Biztrack/builds/0825b08d-02c7-41a0-9f65-3cbbde17f519)
# 💰 Revenue App - Personal Finance Management

A modern React Native application for managing your personal finances with real-time tracking of income and expenses. Built with Firebase backend and featuring a beautiful dark theme UI.

## 🚀 Features

- **📊 Financial Dashboard**: Real-time overview of your financial status
- **💵 Income Tracking**: Record and manage multiple income sources
- **💸 Expense Management**: Track spending patterns and control expenses
- **📈 Profit Analysis**: Automatic calculation of net profit and profit margins
- **📅 Monthly Reports**: View current month financial summaries
- **🔐 Secure Authentication**: Firebase-powered user authentication
- **👤 User Profiles**: Personal account management
- **📱 Modern UI**: Beautiful dark theme with smooth animations
- **🔄 Real-time Sync**: Data synced across devices instantly
- **📋 Data Sorting**: Latest entries appear first automatically

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Firestore + Authentication)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Expo Vector Icons (Ionicons)
- **Gradients**: Expo Linear Gradient
- **Navigation**: Expo Router

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RevenueApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

## ⚙️ Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore Database

2. **Configure Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Set up Firestore Database**
   - Go to Firestore Database
   - Create database in test mode
   - Set up the following collections:
     - `users` (for user profiles)
     - `incomes` (for income records)
     - `expenses` (for expense records)

4. **Update Firebase Configuration**
   - Copy your Firebase config from Project Settings
   - Update `firebase.ts` with your configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

## 🏃‍♂️ Running the App

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on device/simulator**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan QR code with Expo Go app

## 📱 App Structure

```
RevenueApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard/Home screen
│   │   ├── income.tsx         # Income management
│   │   ├── expenses.tsx       # Expense management
│   │   ├── profile.tsx        # User profile
│   │   └── _layout.tsx        # Tab navigation layout
│   ├── login.tsx              # Login screen
│   ├── register.tsx           # Registration screen
│   └── _layout.tsx            # Root layout
├── components/
│   ├── IncomeForm.tsx         # Income entry form
│   └── ExpenseForm.tsx        # Expense entry form
├── context/
│   ├── AuthContext.tsx        # Authentication context
│   ├── IncomeContext.tsx      # Income state management
│   └── ExpensesContext.tsx    # Expense state management
├── services/
│   ├── authService.ts         # Authentication services
│   ├── incomeService.ts       # Income CRUD operations
│   ├── expenseService.ts      # Expense CRUD operations
│   └── userService.ts         # User profile services
├── firebase.ts                # Firebase configuration
└── package.json
```

## 🎨 Key Features Explained

### 🏠 Dashboard
- Real-time financial overview
- Net profit/loss calculations
- Monthly profit analysis
- Quick action buttons
- Visual profit/loss indicators

### 💰 Income Management
- Add multiple income sources
- Edit and delete entries
- Automatic total calculations
- Monthly income summaries
- Date-sorted entries (latest first)

### 💸 Expense Tracking
- Categorize expenses
- Track spending patterns
- Monthly expense analysis
- Budget monitoring
- Visual spending indicators

### 👤 User Profile
- Secure user authentication
- Profile information display
- Account creation date
- Logout functionality

## 🔐 Security Features

- Firebase Authentication integration
- User-specific data isolation
- Secure data transmission
- Session management
- Auto-logout on security events

## 📊 Data Management

- **Real-time sync**: All data synced instantly across devices
- **Offline support**: Basic offline functionality
- **Data validation**: Input validation on all forms
- **Error handling**: Comprehensive error management
- **Date sorting**: Automatic chronological sorting

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark color scheme
- **Smooth Animations**: Fluid transitions and interactions
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Visual feedback during operations
- **Error Messages**: User-friendly error notifications
- **Touch Interactions**: Intuitive touch gestures

## 🚀 Building for Production

1. **Build the app**
   ```bash
   npx expo build:android
   # or
   npx expo build:ios
   ```

2. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "Revenue App",
       "slug": "revenue-app",
       "version": "1.0.0",
       "platforms": ["ios", "android"],
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png"
       }
     }
   }
   ```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for backend services
- **Expo** for development platform
- **React Native** for mobile framework
- **NativeWind** for styling
- **Ionicons** for beautiful icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include error logs and screenshots

## 🔄 Version History

- **v1.0.0** - Initial release
  - User authentication
  - Income/Expense tracking
  - Dashboard analytics
  - Profile management

---

**Made with ❤️ using React Native & Firebase**

*Happy budgeting! 💰📊*
