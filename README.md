# TechCorp Career Portal

A modern, full-stack career portal built with Next.js, Supabase, and JavaScript. This application provides a complete hiring management system with public job listings, application submissions, and a comprehensive admin dashboard.

## Features

### Public Features
- **Homepage**: Company overview with services and statistics
- **Career Page**: Public job listings with detailed descriptions
- **Job Application**: Complete application form with resume upload
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of applications, jobs, and statistics
- **Application Management**: View, filter, and manage job applications
- **Job Management**: Create, edit, and manage job postings
- **Email System**: Send templated or custom emails to applicants
- **User Management**: Manage admin users and permissions
- **Role-based Access**: Different permission levels (Admin, HR, Manager)

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd techcorp-career-portal
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   \`\`\`

4. **Set up the database**
   
   Run the SQL scripts in your Supabase SQL editor:
   - First run `scripts/create-tables.sql`
   - Then run `scripts/seed-data.sql`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Set up admin users**
   
   Visit `http://localhost:3000/admin/setup` to create your initial admin accounts.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── careers/           # Public career pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
│   ├── supabase.js       # Supabase client and database functions
│   ├── auth-supabase.js  # Authentication functions
│   └── utils.js          # General utilities
├── hooks/                # Custom React hooks
├── scripts/              # Database setup scripts
└── public/               # Static assets
\`\`\`

## Database Schema

The application uses the following main tables:

- **users**: Admin user profiles with roles and permissions
- **jobs**: Job postings with requirements, responsibilities, and benefits
- **job_applications**: Application submissions with applicant details
- **email_logs**: Email communication audit trail

## Authentication & Authorization

The system uses Supabase Auth with custom user profiles and role-based permissions:

- **Admin**: Full access to all features
- **HR**: Can manage applications and send emails
- **Manager**: Can view applications (read-only)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@techcorp.com or create an issue in the repository.
\`\`\`

I've successfully rewritten the entire TechCorp Career Portal application in JavaScript and configured it to use npm. Here's what I've converted:

## **Key Changes Made:**

### **1. Package Management**
- **Converted to npm** with proper `package.json`
- **Updated all dependencies** to work with JavaScript
- **Configured build scripts** for npm usage

### **2. File Extensions & Syntax**
- **Changed all `.tsx` to `.jsx`** and `.ts` to `.js`
- **Removed TypeScript types** and interfaces
- **Updated import/export syntax** for JavaScript
- **Converted React components** to JavaScript syntax

### **3. Configuration Files**
- **Updated `next.config.js`** for JavaScript
- **Modified `tailwind.config.js`** for JavaScript
- **Kept CSS and SQL files** unchanged

### **4. Core Features Maintained**
- **Complete Supabase integration** with database operations
- **Authentication system** with role-based permissions
- **Admin dashboard** with full functionality
- **Public career pages** and application forms
- **Email system** with templates and logging

### **5. Project Structure**
\`\`\`
├── package.json (npm configuration)
├── next.config.js (JavaScript config)
├── tailwind.config.js (JavaScript config)
├── app/ (Next.js pages in JavaScript)
├── components/ (React components in JavaScript)
├── lib/ (Utility functions in JavaScript)
├── hooks/ (Custom hooks in JavaScript)
├── scripts/ (SQL database scripts)
└── README.md (Complete setup guide)
\`\`\`

## **Getting Started:**

1. **Install dependencies**: `npm install`
2. **Set up Supabase** and add environment variables
3. **Run database scripts** in Supabase
4. **Start development**: `npm run dev`
5. **Setup admin users**: Visit `/admin/setup`

The application now runs entirely on JavaScript with npm, maintaining all the original functionality while being more accessible to JavaScript developers!
