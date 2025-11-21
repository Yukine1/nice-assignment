# Bank Account Dashboard - Angular SPA

A beautiful single-page application (SPA) for viewing bank account information and transaction history, built with Angular 20+ and PrimeNG.

![Angular](https://img.shields.io/badge/Angular-20.2.0-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20.3.0-blue)

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🏦 **Account Overview** - View account holder name, IBAN, and current balance
- 💳 **Transaction History** - See all incoming and outgoing transactions
- 🎨 **Beautiful UI/UX** - Modern design with PrimeNG components
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Data** - Fetches data from backend API
- 🔄 **Loading States** - Skeleton loaders for better UX
- ❌ **Error Handling** - Graceful error handling with retry functionality
- 🛡️ **Null Safety** - Robust handling of missing or incomplete data

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.19.0 or higher)
  - Download from: https://nodejs.org/
  - Check version: `node --version`

- **npm** (comes with Node.js)
  - Check version: `npm --version`

- **Backend Server** (must be running on port 8080)
  - Your backend should provide the endpoint: `http://localhost:8080/api/getbalance`

## 📦 Installation

### Step 1: Clone or Download the Project

```bash
cd E:\projects\angular-homework\angular-project-nice
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular 20+
- PrimeNG UI components
- RxJS for reactive programming
- TypeScript compiler

**Installation time:** Approximately 1-2 minutes

## 🚀 Running the Application

### Quick Start (2 Steps)

#### 1. Start Your Backend Server

Make sure your backend server is running on **port 8080** and responds at:
```
http://localhost:8080/api/getbalance
```

To verify your backend is running:
```bash
curl http://localhost:8080/api/getbalance
```

#### 2. Start the Angular Application

```bash
npm start
```

Or alternatively:
```bash
ng serve
```

**Expected output:**
```
Initial chunk files   | Names         |  Raw size
main.js               | main          | 336.30 kB | 
chunk.js              | -             | 142.42 kB |
polyfills.js          | polyfills     |  34.59 kB |

Application bundle generation complete.

Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

### Step 3: Open in Browser

Navigate to:
```
http://localhost:4200
```

The application will automatically:
- Connect to your backend via proxy
- Fetch account and transaction data
- Display the dashboard

## 📁 Project Structure

```
angular-project-nice/
├── src/
│   ├── app/
│   │   ├── core/                          # Singleton services
│   │   │   └── services/
│   │   │       └── transactions.service.ts
│   │   │
│   │   ├── shared/                        # Reusable components
│   │   │   └── components/
│   │   │       └── transactions-list/
│   │   │
│   │   ├── features/                      # Business features
│   │   │   └── account/
│   │   │       └── pages/
│   │   │           └── account-page/
│   │   │
│   │   ├── utils/                         # Interfaces & types
│   │   │   └── interfaces/
│   │   │
│   │   ├── app.ts                         # Root component
│   │   ├── app.config.ts                  # App configuration
│   │   └── app.routes.ts                  # Routing
│   │
│   ├── main.ts                            # Application entry point
│   ├── styles.scss                        # Global styles
│   └── index.html                         # HTML template
│
├── proxy.conf.json                        # API proxy configuration
├── angular.json                           # Angular CLI config
├── package.json                           # Dependencies
└── tsconfig.json                          # TypeScript config
```

## ⚙️ Configuration

### API Configuration

The application uses a **proxy** to connect to your backend server. This prevents CORS issues during development.

**File:** `proxy.conf.json`
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

**How it works:**
- Frontend requests: `http://localhost:4200/api/getbalance`
- Proxy forwards to: `http://localhost:8080/api/getbalance`

### Expected API Response Format

Your backend endpoint should return JSON in this format:

```json
{
  "account": {
    "name": "Chip Jules",
    "iban": "NL28ABNA0719200833",
    "balance": 3133.56
  },
  "currency": "EURO",
  "transactions": [
    {
      "from": "Wendy",
      "description": "Diner",
      "amount": 10.50,
      "date": "2016-01-10T09:20:00.000Z"
    },
    {
      "to": "Coffee and Cakes",
      "description": "Purchase",
      "amount": 2.50,
      "date": "2016-01-08T08:14:00.000Z"
    }
  ]
}
```

**Transaction Types:**
- **Incoming (Credit):** Has `"from"` field
- **Outgoing (Debit):** Has `"to"` field

## 💻 Development

### Available Commands

```bash
# Start development server
npm start

# Start with explicit configuration
ng serve

# Build for production
npm run build

# Run tests
npm test

# Watch mode (rebuild on changes)
npm run watch

# Check for errors
ng build
```

### Development Server

The dev server runs on **port 4200** with:
- ✅ Hot Module Replacement (auto-reload on changes)
- ✅ Source maps for debugging
- ✅ Proxy configuration for API calls
- ✅ Live compilation

### Making Changes

1. Edit files in `src/app/`
2. Save your changes
3. Browser automatically reloads
4. Check console for any errors

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
```

**Output location:** `dist/angular-project-nice/`

The production build includes:
- ✅ Minified and optimized code
- ✅ Tree-shaking (removes unused code)
- ✅ Ahead-of-Time (AOT) compilation
- ✅ CSS optimization
- ✅ Asset optimization

### Build Output

```
Initial chunk files    Names           Raw size
main.js                main           336.29 kB
chunk.js               -              142.42 kB
polyfills.js           polyfills       34.59 kB
styles.css             styles          13.48 kB

Initial total: 526.78 kB
```

### Deploying Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/angular-project-nice/` folder to your web server

3. Configure your web server to:
   - Serve `index.html` for all routes
   - Forward `/api/*` requests to your backend server

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

This will:
- Execute Karma test runner
- Run all `*.spec.ts` files
- Show code coverage report
- Watch for file changes

### Test Files

- `src/app/**/*.spec.ts` - Component and service tests

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. **Backend Server Not Running**

**Error Message:**
```
Failed to load bank statement. Please try again.
```

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8080/api/getbalance

# Verify port 8080 is in use
netstat -ano | findstr :8080
```

#### 2. **Port 4200 Already in Use**

**Error Message:**
```
Port 4200 is already in use.
```

**Solution:**
```bash
# Option 1: Kill the process using port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Option 2: Use a different port
ng serve --port 4300
```

#### 3. **npm install Fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json

# Reinstall
npm install
```

#### 4. **CORS Errors**

**Error in Console:**
```
Access to fetch at 'http://localhost:8080/api/getbalance' has been blocked by CORS policy
```

**Solution:**
- Ensure `proxy.conf.json` exists in project root
- Restart the Angular dev server: `npm start`
- Verify proxy configuration in `angular.json`

#### 5. **Module Not Found Errors**

**Solution:**
```bash
# Reinstall dependencies
npm install

# Check for typos in import paths
# Verify file exists at the import path
```

#### 6. **Backend Returns 503 Error**

The application handles this gracefully:
- Shows error message to user
- Provides retry button
- Uses cached data if available (from previous successful request)

**Note:** The service automatically retries 3 times before showing an error.

### Getting Help

If you encounter issues:

1. Check the browser console for errors (F12)
2. Check the terminal for Angular CLI errors
3. Verify your backend server is responding correctly
4. Review the documentation files:
   - `ARCHITECTURE.md` - Project structure
   - `NULL-SAFETY.md` - Error handling
   - `API-SETUP.md` - API configuration

## 📚 Additional Documentation

- **`ARCHITECTURE.md`** - Detailed project architecture and folder structure
- **`NULL-SAFETY.md`** - How null/undefined cases are handled
- **`API-SETUP.md`** - API configuration and proxy setup
- **`IMPLEMENTATION.md`** - Implementation details and features
- **`QUICK-START.md`** - Quick reference guide

## 🔒 Environment

- **Development:** `http://localhost:4200`
- **Backend API:** `http://localhost:8080`
- **Proxy Path:** `/api/*` → `http://localhost:8080/api/*`

## 📝 Notes

- The application uses **Angular Signals** for state management (modern Angular best practice)
- All components are **standalone** (no NgModules)
- The UI uses **PrimeNG Aura theme** with custom styling
- **Null safety** is implemented throughout - no unsafe `!` operators
- The application follows **Angular Style Guide** and best practices

## ✅ Checklist Before Running

- [ ] Node.js installed (v18.19.0+)
- [ ] Backend server running on port 8080
- [ ] Backend endpoint `/api/getbalance` accessible
- [ ] Dependencies installed (`npm install`)
- [ ] Port 4200 is available

## 🎉 Success!

Once running, you should see:
1. **Account Banner** - User information and balance with gradient background
2. **Transaction List** - All transactions with color-coded amounts
   - Green (+) for incoming payments
   - Red (-) for outgoing payments
3. **Responsive Design** - Works on all screen sizes

---

**Built with Angular 20+ and PrimeNG** 🚀

For questions or issues, refer to the troubleshooting section or check the additional documentation files.

