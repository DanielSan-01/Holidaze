#!/usr/bin/env node

// Complete GitHub Project Setup for Holidaze
// Run with: node complete-project-setup.js

const { Octokit } = require('@octokit/rest');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const CONFIG = {
  owner: '', // Will be set by user input
  repo: '',  // Will be set by user input
  token: '' // Will be set by user input
};

// All issues data
const ISSUES_DATA = {
  milestones: [
    {
      title: "Phase 1: Foundation",
      description: "Project setup, routing, and basic layout",
      due_on: "2024-02-07T23:59:59Z"
    },
    {
      title: "Phase 2: Authentication", 
      description: "User authentication and profile management",
      due_on: "2024-02-14T23:59:59Z"
    },
    {
      title: "Phase 3: Venue Display",
      description: "Venue listing, search, and filtering", 
      due_on: "2024-02-21T23:59:59Z"
    },
    {
      title: "Phase 4: Venue Details",
      description: "Individual venue pages and booking system",
      due_on: "2024-02-28T23:59:59Z"
    },
    {
      title: "Phase 5: Venue Management",
      description: "Create/edit venues and booking management",
      due_on: "2024-03-07T23:59:59Z"
    },
    {
      title: "Phase 6: Polish & Mobile",
      description: "Mobile optimization and code refactoring",
      due_on: "2024-03-14T23:59:59Z"
    }
  ],
  
  labels: [
    { name: "critical", color: "d73a4a", description: "Critical priority" },
    { name: "high", color: "fbca04", description: "High priority" },
    { name: "medium", color: "0e8a16", description: "Medium priority" },
    { name: "low", color: "f9d0c4", description: "Low priority" },
    { name: "beginner-friendly", color: "7057ff", description: "Good for beginners" },
    { name: "intermediate", color: "a2eeef", description: "Requires some experience" },
    { name: "advanced", color: "d4c5f9", description: "Complex implementation" },
    { name: "frontend", color: "0052cc", description: "Frontend/React work" },
    { name: "styling", color: "5319e7", description: "CSS/Design work" },
    { name: "mobile", color: "b60205", description: "Mobile-specific work" },
    { name: "api", color: "1d76db", description: "API integration" },
    { name: "refactor", color: "e99695", description: "Code refactoring" }
  ],

  issues: [
    // Phase 1: Foundation
    {
      title: "Initial project setup (Vite + React)",
      body: `## Description
Set up the initial React project with Vite build tool

## Acceptance Criteria
- [ ] Create new Vite React project
- [ ] Remove default boilerplate  
- [ ] Set up basic folder structure
- [ ] Verify development server runs
- [ ] Install essential dependencies

## Estimated Time: 2-3 hours

## Resources
- [Vite React Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

## Commands to run:
\`\`\`bash
npm create vite@latest holidaze -- --template react
cd holidaze
npm install
npm run dev
\`\`\``,
      labels: ["beginner-friendly", "frontend", "high"],
      milestone: "Phase 1: Foundation"
    },
    
    {
      title: "Install and configure Tailwind CSS",
      body: `## Description
Add Tailwind CSS for styling and create basic configuration

## Acceptance Criteria
- [ ] Install Tailwind CSS dependencies
- [ ] Configure tailwind.config.js
- [ ] Set up CSS imports in main CSS file
- [ ] Test with basic utility classes
- [ ] Remove default CSS

## Estimated Time: 2-3 hours

## Resources
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)

## Commands:
\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\``,
      labels: ["beginner-friendly", "styling", "high"],
      milestone: "Phase 1: Foundation"
    },

    {
      title: "Set up organized folder structure",
      body: `## Description
Create organized folder structure for scalable development

## Acceptance Criteria
- [ ] Create component folders with logical grouping
- [ ] Set up pages directory
- [ ] Create hooks and utils directories
- [ ] Add index.js files for clean imports
- [ ] Document folder structure in README

## Estimated Time: 1-2 hours

## Folder Structure:
\`\`\`
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── navigation/   # Navigation components
│   ├── venue/        # Venue-related components
│   ├── booking/      # Booking components
│   ├── auth/         # Authentication components
│   └── forms/        # Form components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── contexts/         # React contexts
└── styles/           # CSS files
\`\`\``,
      labels: ["beginner-friendly", "frontend", "medium"],
      milestone: "Phase 1: Foundation"
    },

    {
      title: "Create basic routing with React Router",
      body: `## Description
Set up React Router for navigation between pages

## Acceptance Criteria
- [ ] Install React Router DOM
- [ ] Create main route structure
- [ ] Set up basic page components
- [ ] Test navigation between pages
- [ ] Add 404 page handling

## Estimated Time: 3-4 hours

## Routes Needed:
- \`/\` - Home page
- \`/venues\` - Venue listing
- \`/venue/:id\` - Individual venue details
- \`/profile\` - User profile
- \`/login\` - Authentication
- \`/register\` - User registration
- \`/venues/create\` - Create new venue
- \`/venues/edit/:id\` - Edit venue

## Resources
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)`,
      labels: ["intermediate", "frontend", "high"],
      milestone: "Phase 1: Foundation"
    },

    {
      title: "Build responsive navigation component",
      body: `## Description
Create responsive navigation with mobile hamburger menu

## Acceptance Criteria
- [ ] Desktop navigation with logo and menu items
- [ ] Mobile hamburger menu with smooth animation
- [ ] Active link highlighting
- [ ] Responsive design (mobile-first)
- [ ] Touch-friendly targets (44px minimum)
- [ ] Accessibility features (ARIA labels)

## Estimated Time: 4-6 hours

## Design Requirements:
- Logo on left side
- Navigation items (Home, Venues, About)
- User menu (Login/Profile) on right
- Mobile: Hamburger menu overlay
- Active state styling
- Smooth transitions

## Mobile UX Considerations:
- Minimum 44px touch targets
- Easy thumb navigation
- Clear visual feedback`,
      labels: ["intermediate", "frontend", "mobile", "high"],
      milestone: "Phase 1: Foundation"
    },

    {
      title: "Create responsive layout foundation",
      body: `## Description
Set up basic responsive layout structure and CSS utilities

## Acceptance Criteria
- [ ] Create main layout component
- [ ] Set up responsive breakpoints
- [ ] Add CSS utility classes
- [ ] Test on different screen sizes
- [ ] Ensure mobile-first approach
- [ ] Add CSS custom properties for theming

## Estimated Time: 3-4 hours

## Breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px+

## CSS Variables to add:
- Primary colors
- Font sizes
- Spacing scale
- Border radius values`,
      labels: ["intermediate", "styling", "mobile", "medium"],
      milestone: "Phase 1: Foundation"
    },

    // Phase 2: Authentication
    {
      title: "Create authentication context",
      body: `## Description
Set up React Context for managing user authentication state

## Acceptance Criteria
- [ ] Create AuthContext with React Context API
- [ ] Provide login/logout functions
- [ ] Handle user state persistence (localStorage)
- [ ] Add loading and error states
- [ ] Implement token management
- [ ] Add protected route wrapper

## Estimated Time: 4-5 hours

## Context Should Provide:
- \`user\` - Current user object
- \`login(credentials)\` - Login function
- \`logout()\` - Logout function
- \`loading\` - Loading state
- \`error\` - Error messages
- \`isAuthenticated\` - Boolean auth status

## API Integration:
- Login endpoint
- User profile endpoint
- Token refresh logic`,
      labels: ["intermediate", "frontend", "api", "high"],
      milestone: "Phase 2: Authentication"
    },

    {
      title: "Build login form component",
      body: `## Description
Create login form with validation and error handling

## Acceptance Criteria
- [ ] Email and password inputs with proper types
- [ ] Client-side form validation
- [ ] Error message display
- [ ] Loading state during submission
- [ ] Responsive design
- [ ] Accessibility features

## Estimated Time: 3-4 hours

## Form Fields:
- Email (required, email validation)
- Password (required, min 8 characters)
- Remember me checkbox
- Submit button with loading state

## Validation Rules:
- Email format validation
- Password minimum length
- Show specific error messages
- Prevent multiple submissions`,
      labels: ["beginner-friendly", "frontend", "medium"],
      milestone: "Phase 2: Authentication"
    },

    {
      title: "Build register form component", 
      body: `## Description
Create registration form for new users

## Acceptance Criteria
- [ ] All required form fields
- [ ] Form validation with real-time feedback
- [ ] Password confirmation matching
- [ ] Error handling and display
- [ ] Success feedback and redirect
- [ ] Avatar URL preview

## Estimated Time: 3-4 hours

## Form Fields:
- Name (required, min 2 characters)
- Email (required, email validation)
- Password (required, min 8 characters)
- Confirm Password (must match)
- Avatar URL (optional, URL validation)
- Venue Manager checkbox

## Features:
- Real-time validation feedback
- Password strength indicator
- Avatar preview when URL provided`,
      labels: ["beginner-friendly", "frontend", "medium"],
      milestone: "Phase 2: Authentication"
    },

    // Phase 3: Venue Display
    {
      title: "Create venue card component",
      body: `## Description
Build reusable venue card component for listings

## Acceptance Criteria
- [ ] Display venue image, name, location, price
- [ ] Responsive card layout
- [ ] Hover effects and interactions
- [ ] Rating display
- [ ] Amenities preview
- [ ] Click to view details

## Estimated Time: 3-4 hours

## Card Elements:
- Hero image with fallback
- Venue name (with text wrapping)
- Location display
- Price per night
- Star rating
- Key amenities (max 3)
- "View Details" button

## Mobile Considerations:
- Touch-friendly card size
- Readable text on small screens
- Proper image aspect ratios`,
      labels: ["intermediate", "frontend", "mobile", "high"],
      milestone: "Phase 3: Venue Display"
    },

    {
      title: "Build venue listing page",
      body: `## Description
Create main venue listing page with grid layout

## Acceptance Criteria
- [ ] Responsive grid layout
- [ ] Loading states with skeletons
- [ ] Error handling
- [ ] Pagination or infinite scroll
- [ ] Empty state handling
- [ ] Performance optimization

## Estimated Time: 4-5 hours

## Layout:
- Hero section with search
- Filter sidebar (desktop) / drawer (mobile)
- Venue grid (responsive columns)
- Load more / pagination
- Results count display

## Performance:
- Image lazy loading
- Virtual scrolling for large lists
- Debounced search`,
      labels: ["intermediate", "frontend", "api", "high"],
      milestone: "Phase 3: Venue Display"
    },

    {
      title: "Implement search and filtering",
      body: `## Description
Add search functionality and filtering options

## Acceptance Criteria
- [ ] Search by venue name/location
- [ ] Date range picker for availability
- [ ] Guest count selector
- [ ] Price range filter
- [ ] Amenities filter checkboxes
- [ ] Clear all filters option

## Estimated Time: 5-6 hours

## Search Features:
- Real-time search with debouncing
- Search suggestions/autocomplete
- Search history (optional)

## Filters:
- Date picker (check-in/check-out)
- Guest count (+ and - buttons)
- Price range slider
- Amenities checkboxes
- Location/region filter

## UX:
- Filter count badges
- Applied filters display
- Mobile filter drawer`,
      labels: ["advanced", "frontend", "api", "high"],
      milestone: "Phase 3: Venue Display"
    }
  ]
};

async function getUserInput() {
  return new Promise((resolve) => {
    console.log('🚀 Holidaze GitHub Project Setup\n');
    
    rl.question('GitHub username/organization: ', (owner) => {
      rl.question('Repository name: ', (repo) => {
        rl.question('GitHub Personal Access Token: ', (token) => {
          CONFIG.owner = owner;
          CONFIG.repo = repo;
          CONFIG.token = token;
          rl.close();
          resolve();
        });
      });
    });
  });
}

async function createProject(octokit) {
  try {
    console.log('📋 Creating GitHub Project...');
    
    // Create project
    const { data: project } = await octokit.rest.projects.createForRepo({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      name: 'Holidaze Development',
      body: 'Complete development roadmap for Holidaze venue booking platform'
    });

    // Create columns
    const columns = ['📋 Backlog', '🏗️ In Progress', '👀 Review', '✅ Done'];
    
    for (const columnName of columns) {
      await octokit.rest.projects.createColumn({
        project_id: project.id,
        name: columnName
      });
    }

    console.log('✅ Project board created!');
    return project;
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
  }
}

async function createMilestones(octokit) {
  console.log('📅 Creating milestones...');
  
  const milestones = {};
  
  for (const milestone of ISSUES_DATA.milestones) {
    try {
      const { data } = await octokit.rest.issues.createMilestone({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        title: milestone.title,
        description: milestone.description,
        due_on: milestone.due_on
      });
      
      milestones[milestone.title] = data.number;
      console.log(`✅ Created milestone: ${milestone.title}`);
    } catch (error) {
      console.log(`⚠️  Milestone "${milestone.title}" might already exist`);
    }
  }
  
  return milestones;
}

async function createLabels(octokit) {
  console.log('🏷️  Creating labels...');
  
  for (const label of ISSUES_DATA.labels) {
    try {
      await octokit.rest.issues.createLabel({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        name: label.name,
        color: label.color,
        description: label.description
      });
      
      console.log(`✅ Created label: ${label.name}`);
    } catch (error) {
      console.log(`⚠️  Label "${label.name}" might already exist`);
    }
  }
}

async function createIssues(octokit, milestones) {
  console.log('📝 Creating issues...');
  
  for (const issue of ISSUES_DATA.issues) {
    try {
      const milestoneNumber = milestones[issue.milestone];
      
      await octokit.rest.issues.create({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        milestone: milestoneNumber
      });
      
      console.log(`✅ Created issue: ${issue.title}`);
    } catch (error) {
      console.error(`❌ Error creating issue "${issue.title}":`, error.message);
    }
  }
}

async function main() {
  try {
    await getUserInput();
    
    const octokit = new Octokit({
      auth: CONFIG.token
    });

    console.log(`\n🎯 Setting up project for ${CONFIG.owner}/${CONFIG.repo}\n`);

    // Create project board
    const project = await createProject(octokit);
    
    // Create milestones
    const milestones = await createMilestones(octokit);
    
    // Create labels
    await createLabels(octokit);
    
    // Create issues
    await createIssues(octokit, milestones);

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit your GitHub repository');
    console.log('2. Go to Projects tab to see your board');
    console.log('3. Go to Issues tab to see all created issues');
    console.log('4. Start with Phase 1 issues');
    console.log('5. Move issues through the project board as you work');
    console.log('\n🚀 Happy coding!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Check if required package is installed
try {
  require('@octokit/rest');
} catch (error) {
  console.log('📦 Installing required dependencies...');
  console.log('Run: npm install @octokit/rest');
  console.log('Then run this script again.');
  process.exit(1);
}

main(); 