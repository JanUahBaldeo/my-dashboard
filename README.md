# Professional Dashboard Application

A modern, responsive dashboard application built with React, Vite, and Tailwind CSS. This application provides comprehensive pipeline management, task tracking, and analytics for business operations.

## 🚀 Features

- **Pipeline Management**: Visual pipeline with drag-and-drop lead management
- **Task Management**: Organized task tracking with categories and priorities
- **Real-time Analytics**: Live metrics and performance tracking
- **Role-based Access**: Different dashboards for admin, partner, and general users
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Professional Logging**: Structured logging system for debugging and monitoring

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Context API, Zustand
- **UI Components**: Headless UI, Radix UI
- **Charts**: Recharts, Chart.js, Nivo
- **Icons**: Lucide React, React Icons
- **Logging**: Custom structured logger

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🏗️ Project Structure

```
src/
├── api/                 # API integration layer
├── components/          # Reusable UI components
│   ├── features/        # Feature-specific components
│   │   ├── admin/       # Admin dashboard components
│   │   ├── general/     # General dashboard components
│   │   ├── partnership/ # Partner dashboard components
│   │   └── pipeline/    # Pipeline management components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── styles/              # Global styles
├── utils/               # Utility functions and logger
└── main.jsx            # Application entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_API_TOKEN=your_api_token
```

### API Configuration

The application integrates with LeadConnector API for pipeline management. Configure your API credentials in the pipeline API module.

## 📊 Features Overview

### Pipeline Management
- Visual pipeline with customizable stages
- Drag-and-drop lead management
- Real-time metrics and analytics
- Tag-based organization
- Lead conversion tracking

### Task Management
- Categorized task organization
- Priority-based sorting
- Due date tracking
- Progress visualization
- Task completion workflows

### Analytics Dashboard
- Real-time performance metrics
- Conversion rate tracking
- Lead velocity analysis
- Revenue forecasting
- Custom reporting

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Professional blue and gray tones
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable, accessible components
- **Animations**: Smooth, purposeful animations

## 🔍 Logging

The application includes a professional logging system:

```javascript
import { logger, apiLogger, uiLogger } from '@utils/logger';

// Different log levels
logger.info('Application started');
logger.error('Error occurred', error);
logger.debug('Debug information', { data });

// Context-specific loggers
apiLogger.info('API call successful');
uiLogger.warn('User interaction warning');
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm run test

# Run type checking
npm run type-check
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 