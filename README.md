# FleetX Partner Hub

A comprehensive web application designed for delivery partners to manage their fleet operations, track orders, handle billing, and optimize their delivery services. Built for the Kuwait market with multi-language support and real-time tracking capabilities.

## 🚀 Key Features

### **Dashboard & Analytics**
- Real-time dashboard with key performance metrics
- Delivery fees, cash collection, and payment tracking
- Failed orders monitoring and analysis
- Driver performance insights
- Custom date range filtering and driver-specific reports

### **Order Management**
- **Live Order Tracking**: Real-time order status updates with WebSocket integration
- **Order History**: Complete order archive with detailed tracking information
- **Bulk Insights**: Advanced analytics for bulk delivery operations
- **Multi-delivery Models**: Support for on-demand, grouped, and bulk deliveries
- **Payment Processing**: COD and online payment method handling

### **Fleet Configuration**
- **Operation Timing**: Configure business hours and operational schedules
- **Area Restrictions**: Set delivery radius and time-based restrictions
- **Geofencing**: Enable location-based controls for drivers and app users
- **Warning Messages**: Custom notifications and alerts system
- **Busy Mode**: Zone-based availability management

### **Driver & Vendor Management**
- Comprehensive driver profiles and performance tracking
- Vendor onboarding and management system
- Branch-specific operations and reporting
- Driver filtering and selection tools

### **Billing & Financial Management**
- Integrated wallet system with transaction history
- Automated billing calculations and invoice generation
- Cash collection tracking and reconciliation
- Tax handling and financial reporting

### **Rating & Feedback System**
- Customer rating collection and analysis
- Service quality monitoring and improvement insights
- Partner performance evaluation tools

### **Maps & Location Services**
- Google Maps integration for route optimization
- React Leaflet for advanced mapping features
- Real-time location tracking and geofencing
- Address validation and area coverage mapping

## 🛠 Technology Stack

### **Frontend Framework**
- **Next.js 15.5.3** - React framework with App Router and server-side rendering
- **React 19.1.1** - Component-based UI library
- **TypeScript** - Type-safe development environment
- **Tailwind CSS 4.1.13** - Utility-first styling framework

### **UI Components & Design**
- **Radix UI** - Accessible, unstyled component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions
- **Class Variance Authority** - Component variant management

### **State Management & Data Fetching**
- **Zustand** - Lightweight state management solution
- **Axios** - HTTP client for API communication
- **React Hook Form** - Performant form handling with validation
- **Zod** - TypeScript-first schema validation

### **Internationalization**
- **next-intl** - Internationalization for Next.js
- **Arabic & English** support with RTL layout handling
- Dynamic locale switching and content translation

### **Maps & Location**
- **Google Maps API** - Primary mapping service
- **React Leaflet** - Alternative mapping solution
- **@vis.gl/react-google-maps** - Advanced Google Maps integration

### **Utilities & Tools**
- **date-fns** - Date manipulation and formatting
- **jsPDF & jsPDF-AutoTable** - PDF generation and export
- **Lodash** - Utility functions and data manipulation
- **UUID** - Unique identifier generation
- **XLSX** - Excel file processing and export

## 📁 Project Architecture

```
├── app/                          # Next.js App Router
│   ├── (protected)/             # Authenticated routes
│   │   ├── dashboard/           # Main analytics dashboard
│   │   ├── order/              # Order management pages
│   │   ├── billing/            # Financial management
│   │   ├── config/             # Fleet configuration
│   │   ├── insights/           # Advanced analytics
│   │   ├── rating/             # Rating system
│   │   ├── vendor/             # Vendor management
│   │   ├── wallet/             # Wallet and transactions
│   │   └── busy-mode/          # Zone availability
│   └── (not-protected)/        # Public routes
│       └── auth/               # Authentication pages
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication logic
│   ├── orders/                 # Order management
│   ├── billing/                # Billing operations
│   ├── config/                 # Configuration settings
│   ├── insights/               # Analytics features
│   ├── rating/                 # Rating functionality
│   ├── vendor/                 # Vendor operations
│   └── wallet/                 # Wallet management
├── shared/                      # Shared resources
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── Layout/            # Layout components
│   │   ├── MyMap/             # Map components
│   │   ├── selectors/         # Form selectors
│   │   └── icons/             # Icon components
│   ├── services/              # API service layer
│   ├── types/                 # TypeScript definitions
│   ├── constants/             # Application constants
│   └── lib/                   # Utility functions
├── store/                       # Zustand store definitions
├── locales/                     # Internationalization
│   └── translation/            # Language files (ar.json, en.json)
└── styles/                      # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Bun** package manager (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleetx-partner-hub
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file with required environment variables:
   ```env
   API_GATEWAY_BASE_URL=your_api_url
   GOOGLE_KEY=your_google_maps_key
   WSS_ENDPOINT=your_websocket_url
   FRESHCHAT_TOKEN=your_freshchat_token
   # ... other environment variables
   ```

4. **Run development server**
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production
- `bun build:prod` - Production build with Turbopack
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun format` - Format code with Prettier

## 🌍 Internationalization

The application supports both Arabic and English languages with complete RTL (Right-to-Left) layout support for Arabic. Language switching is handled dynamically with proper text direction and font loading.

## 🔧 Configuration

The application is highly configurable through environment variables and admin settings:

- **Multi-region support** with country-specific configurations
- **Google Analytics & Tag Manager** integration
- **Freshchat** customer support integration
- **WebSocket** real-time communication
- **Tax calculations** and regional compliance
- **Feature flags** for conditional functionality

## 🏗 Development Guidelines

### Code Organization
- **Feature-based architecture** - Each feature is self-contained with its own components, hooks, types, and services
- **Shared resources** - Common components and utilities are centralized in the `/shared` directory
- **Type safety** - Full TypeScript coverage with strict type checking
- **Component composition** - Reusable components with proper prop interfaces

### State Management
- **Zustand stores** for global state management
- **React Hook Form** for form state and validation
- **Server state** managed through API services with proper error handling

### Styling
- **Tailwind CSS** for utility-first styling
- **CSS-in-JS** patterns for dynamic styling
- **Responsive design** with mobile-first approach
- **Theme support** with dark/light mode capabilities

## 📱 Deployment

The application is containerized with Docker and configured for standalone deployment:

```bash
# Build production image
docker build -t fleetx-partner-hub .

# Run container
docker run -p 3000:3000 fleetx-partner-hub
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions about the FleetX Partner Hub, please contact our development team or refer to the internal documentation.

---

Built with ❤️ for efficient fleet management and delivery operations.