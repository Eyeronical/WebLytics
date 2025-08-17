# WebIntel - AI-Powered Website Analyzer

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18+-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview

WebIntel is a comprehensive full-stack web application that intelligently analyzes websites using advanced AI-enhanced web scraping techniques. The application extracts essential metadata including titles, descriptions, favicons, and keywords, then leverages cutting-edge AI models through the OpenRouter API to transform basic descriptions into compelling, professional marketing copy.

This tool is perfect for developers, digital marketers, SEO specialists, and researchers who need detailed website insights combined with AI-generated content enhancement.

## Key Features

- **Intelligent URL Validation** - Robust client-side and server-side URL validation with comprehensive error handling
- **Advanced Web Scraping** - Powerful data extraction using Axios and Cheerio to gather titles, descriptions, metadata, and favicons
- **AI-Powered Content Enhancement** - Transforms basic website descriptions into engaging, professional marketing copy using state-of-the-art language models
- **Real-time Website Analytics** - Track analyzed websites, view usage trends, and comprehensive statistics dashboard
- **Smart Search & Filter** - Instantly find analyzed websites with intelligent search functionality across names, URLs, and descriptions
- **Full CRUD Operations** - Create, read, update, and delete website records with seamless data management
- **Comprehensive Error Handling** - Graceful handling of network timeouts, blocked requests, and various failure scenarios
- **Modern UI/UX Design** - Beautiful responsive interface with smooth animations, glass morphism effects, and intuitive user experience
- **IST Timestamp Support** - Proper Indian Standard Time conversion and display for all date/time information

## Technology Stack

### Backend Technologies
- **Node.js & Express.js** - Robust server-side JavaScript runtime and web framework
- **Supabase PostgreSQL** - Modern, scalable database with real-time capabilities
- **Axios & Cheerio** - HTTP client and server-side jQuery implementation for web scraping
- **OpenRouter API** - Access to multiple AI language models for content enhancement
- **Security Middleware** - Express Rate Limiting, Helmet, and CORS for comprehensive security

### Frontend Technologies
- **React 18 & Vite** - Modern React framework with lightning-fast build tool
- **Framer Motion** - Professional animations and smooth transitions
- **React Hot Toast** - Elegant notification system
- **Lucide React** - Beautiful, customizable icon library
- **Modern CSS** - Advanced styling with gradients, glass effects, and responsive design

### Database & Infrastructure
- **Supabase PostgreSQL** - Real-time database with automatic backups and scaling
- **RESTful API Design** - Clean, intuitive API endpoints following REST principles
- **Environment-based Configuration** - Secure configuration management for different deployment environments

## Installation & Setup

### Prerequisites
- Node.js version 18 or higher installed on your system
- Active Supabase account with a configured project
- OpenRouter API key for AI functionality

### Step-by-Step Installation

1. **Clone the Repository**
`git clone https://github.com/yourusername/webintel.git`
`cd webintel`

2. **Backend Configuration**
Navigate to the backend directory and install dependencies:
`cd backend`
`npm install`

3. **Environment Variables Setup**
Create a `.env` file in the backend directory with the following configuration:
`SUPABASE_URL=https://your-project-ref.supabase.co`
`SUPABASE_KEY=your-service-role-key-here`
`OPENROUTER_API_KEY=your-openrouter-api-key`
`PORT=5001`
`NODE_ENV=development`

4. **Database Schema Setup**
Execute the following SQL command in your Supabase SQL editor to create the required table:
`CREATE TABLE "Nurdd" (`
`  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,`
`  url TEXT NOT NULL,`
`  brand_name TEXT,`
`  description TEXT,`
`  ai_description TEXT,`
`  favicon_url TEXT,`
`  keywords TEXT[],`
`  language TEXT DEFAULT 'en',`
`  status TEXT DEFAULT 'active',`
`  created_at TIMESTAMPTZ DEFAULT NOW(),`
`  updated_at TIMESTAMPTZ DEFAULT NOW()`
`);`

5. **Start Backend Server**
Launch the backend development server:
`npm run dev`
The backend will be available at `http://localhost:5001`

6. **Frontend Configuration**
Open a new terminal window and navigate to the frontend directory:
`cd frontend`
`npm install`

7. **Launch Frontend Application**
Start the frontend development server:
`npm run dev`

8. **Access the Application**
Open your web browser and navigate to `http://localhost:5173` to start using WebIntel.

## Usage Guide

### Analyzing Websites
1. **Input URL**: Enter any valid website URL in the main input field
2. **Start Analysis**: Click the green "Analyze" button to begin the scraping process
3. **Review Results**: Examine both the original scraped content and the AI-enhanced descriptions
4. **Save Data**: The analyzed website is automatically saved to your database

### Managing Website Data
- **Search Functionality**: Use the search bar to quickly locate specific websites by name, URL, or description content
- **Edit Records**: Click the edit button on any website card to modify information, descriptions, or metadata
- **Delete Entries**: Remove unwanted website records with the delete functionality
- **View Analytics**: Access the dashboard to see comprehensive metrics, usage statistics, and recent activity

### Advanced Features
- **Bulk Operations**: Manage multiple website records efficiently
- **Export Data**: Download your analyzed websites in various formats
- **Filter Options**: Sort and filter websites based on different criteria
- **Real-time Updates**: See live updates as new websites are analyzed

## API Documentation

### Available Endpoints

| HTTP Method | Endpoint Path | Description | Parameters |
|-------------|---------------|-------------|------------|
| `GET` | `/` | Application health check and status | None |
| `POST` | `/api/analyze` | Analyze a new website URL | `{ url: string }` |
| `GET` | `/api/websites` | Retrieve all analyzed websites | `?page, ?limit, ?search` |
| `GET` | `/api/websites/:id` | Get specific website by ID | `id: number` |
| `PUT` | `/api/websites/:id` | Update existing website record | `id: number, body: object` |
| `DELETE` | `/api/websites/:id` | Delete website from database | `id: number` |
| `GET` | `/api/stats` | Get comprehensive analytics data | None |

### Example API Requests

**Analyze a New Website:**
`POST /api/analyze`
`Content-Type: application/json`
`{`
`  "url": "https://example.com"`
`}`

**Response Format:**
`{`
`  "success": true,`
`  "data": {`
`    "id": 1,`
`    "url": "https://example.com",`
`    "brand_name": "Example Website",`
`    "description": "Original scraped description",`
`    "ai_description": "AI-enhanced professional description",`
`    "favicon_url": "https://example.com/favicon.ico",`
`    "keywords": ["technology", "web", "example"],`
`    "created_at": "2025-08-17T16:09:00.000Z"`
`  }`
`}`

## Error Handling & Security

### Comprehensive Error Management
- **URL Validation**: Multi-layer validation on both client and server sides
- **Network Timeouts**: 15-second timeout limits with graceful fallback mechanisms
- **HTTP Error Handling**: Proper handling of 400, 403, 404, 500, and other HTTP status codes
- **AI Service Failures**: Automatic fallback to original descriptions when AI enhancement fails
- **Database Errors**: Graceful handling of connection issues and query failures

### Security Features
- **Rate Limiting**: Intelligent request limiting to prevent abuse and ensure fair usage
- **Input Sanitization**: Comprehensive validation and sanitization of all user inputs
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Helmet Integration**: Security headers for enhanced protection
- **Environment Variables**: Secure configuration management for sensitive data


## Development Roadmap

### Upcoming Features
- [ ] **User Authentication System** - Secure login and personalized dashboards
- [ ] **Bulk URL Processing** - Upload and analyze multiple URLs simultaneously  
- [ ] **Advanced Export Options** - PDF reports, CSV exports, and data visualization
- [ ] **Multiple AI Models** - Choose from different AI providers and models
- [ ] **Website Monitoring** - Track changes and receive notifications
- [ ] **API Rate Limiting Dashboard** - Monitor and manage API usage
- [ ] **Advanced Search Filters** - Category-based filtering and advanced sorting options
- [ ] **Website Categorization** - Automatic tagging and classification system
- [ ] **Dark/Light Theme** - User preference-based theme switching
- [ ] **Mobile Application** - Native iOS and Android apps

### Performance Improvements
- [ ] **Caching Layer** - Redis integration for improved response times
- [ ] **Database Optimization** - Query optimization and indexing strategies
- [ ] **CDN Integration** - Asset delivery optimization
- [ ] **Lazy Loading** - Progressive loading for better user experience

## Contributing Guidelines

We welcome contributions from developers of all skill levels! Here's how you can contribute:

### Getting Started
1. **Fork the Repository** - Create your own copy of the project
2. **Create Feature Branch** - `git checkout -b feature/amazing-new-feature`
3. **Make Changes** - Implement your improvements or fixes
4. **Test Thoroughly** - Ensure all existing tests pass and add new tests for your features
5. **Commit Changes** - `git commit -m 'Add amazing new feature'`
6. **Push to Branch** - `git push origin feature/amazing-new-feature`
7. **Create Pull Request** - Submit your changes for review

### Development Standards
- **Code Quality**: Follow existing code style and conventions
- **Documentation**: Update documentation for any new features or changes
- **Testing**: Maintain or improve test coverage
- **Performance**: Consider performance implications of changes
- **Security**: Follow security best practices

## License & Legal

This project is licensed under the MIT License, which means you are free to use, modify, and distribute the software. See the `LICENSE` file for complete terms and conditions.

## Acknowledgments & Credits

- **OpenRouter Team** - For providing excellent AI model access and APIs
- **Supabase Community** - For the outstanding database platform and real-time features
- **React & Vite Teams** - For the incredible development tools and frameworks
- **Cheerio Maintainers** - For the reliable server-side HTML parsing library
- **Framer Motion** - For beautiful animation capabilities
- **Lucide React** - For the comprehensive icon library
- **Open Source Community** - For the countless libraries and tools that make this project possible

---

**Created by Parth Goyal** | Demonstrating full-stack development expertise, AI integration capabilities, and modern web technologies.

⭐ **If you find WebIntel useful, please consider giving it a star on GitHub!**

*Last Updated: August 17, 2025*


