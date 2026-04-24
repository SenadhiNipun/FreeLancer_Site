# Project Hub

A modern Next.js healthcare application built with TypeScript, Tailwind CSS, and Shadcn UI for comprehensive medical care management. This project strictly adheres to **W3C web standards** ensuring accessibility, semantic markup, and cross-browser compatibility.

## 🚀 Features

- **Next.js 15+** - React framework with App Router and Turbopack
- **TypeScript** - Full type safety and developer experience
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Shadcn UI** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide Icons** - Beautiful, consistent icon library
- **Authentication** - Built-in auth routing structure
- **Responsive Design** - Mobile-first approach
- **ESLint & Prettier** - Code quality and formatting with accessibility checks
- **Type-safe Components** - Fully typed React components
- **W3C Compliance** - Adheres to web standards for accessibility and semantic markup

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.0 or higher
- npm (or pnpm)
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd medicare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Configure your environment variables as needed.

### 4. Run the development server

```bash
npm run dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── (auth)/         # Authentication routes
│   │   └── sign-in/    # Sign-in page
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   └── ui/             # Shadcn UI components
├── hooks/              # Custom React hooks
├── actions/            # Server actions
├── services/           # API services and integrations
├── widgets/            # Complex UI widgets
├── config/             # Application configuration
├── constants/          # Application constants
├── lib/                # Utility libraries
├── utils/              # Utility functions
└── styles/             # Additional styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## 🎨 Styling

This project uses Tailwind CSS v4 with Shadcn UI:

- **Tailwind CSS** - Utility-first CSS with CSS variables
- **Shadcn UI** - Pre-built accessible components (New York style)
- **CVA** - Class Variance Authority for component variants
- **Tailwind Merge** - Intelligent class merging
- **Custom Configuration** - Neutral base color with CSS variables

### Component Library

The project uses Shadcn UI components with:
- **Style**: New York
- **Icon Library**: Lucide React
- **Base Color**: Neutral
- **CSS Variables**: Enabled for theme customization

## 🔐 Authentication

The application includes authentication infrastructure:

- **Auth Routes** - Dedicated authentication route group
- **Sign-in** - User authentication page
- **Protected Routes** - Route-level guards (ready to implement)

## 🌐 W3C Standards Compliance

This project maintains strict adherence to W3C web standards:

- **Semantic HTML5** - Proper use of semantic elements
- **WCAG 2.1 AA** - Web Content Accessibility Guidelines compliance
- **Valid Markup** - HTML and CSS validation
- **Cross-browser Compatibility** - Consistent behavior across modern browsers
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Accessibility Linting** - ESLint plugin for JSX accessibility

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Follow single responsibility principle
- Use Tailwind classes for styling

### Component Guidelines

- Create reusable components in `src/components/`
- Use Shadcn UI components from `src/components/ui/`
- Implement proper TypeScript interfaces
- Follow accessibility best practices
- Use semantic HTML structure

### Adding New Components

Install Shadcn UI components:

```bash
npx shadcn@latest add <component-name>
```

### Accessibility Standards

- Include proper ARIA labels and roles
- Ensure keyboard navigation support
- Maintain color contrast ratios
- Provide alternative text for images
- Use ESLint accessibility plugin recommendations

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Configure required environment variables in `.env.local`

## 🧩 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **Build Tool**: Turbopack
- **Linting**: ESLint 9 with Prettier
- **Accessibility**: ESLint JSX A11y Plugin

## 🤝 Contributing

1. Create a feature branch
2. Make your changes with proper TypeScript types
3. Run `npm run lint` and fix any issues
4. Ensure W3C compliance and accessibility standards
5. Submit a pull request

### Commit Convention

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `config:` - Configuration changes
- `a11y:` - Accessibility improvements

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the project documentation

## 🔄 Version History

### v0.1.0 - Initial Setup

- Initial Next.js 15 project setup
- TypeScript & ESLint configuration
- Tailwind CSS v4 configuration
- Shadcn UI integration
- Authentication routing structure
- Accessibility linting setup
- W3C standards compliance implementation

---

**Built with care for healthcare**
