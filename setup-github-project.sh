#!/bin/bash

# GitHub Project Setup Script for Holidaze
# Make sure you have GitHub CLI installed and authenticated

REPO_OWNER="your-username"  # Change this to your GitHub username
REPO_NAME="holidaze"        # Change this to your repo name

echo "🚀 Setting up Holidaze GitHub Project..."

# Create milestones
echo "📅 Creating milestones..."
gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 1: Foundation" \
  --field description="Project setup, routing, and basic layout" \
  --field due_on="2024-02-07T23:59:59Z"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 2: Authentication" \
  --field description="User authentication and profile management" \
  --field due_on="2024-02-14T23:59:59Z"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 3: Venue Display" \
  --field description="Venue listing, search, and filtering" \
  --field due_on="2024-02-21T23:59:59Z"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 4: Venue Details" \
  --field description="Individual venue pages and booking system" \
  --field due_on="2024-02-28T23:59:59Z"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 5: Venue Management" \
  --field description="Create/edit venues and booking management" \
  --field due_on="2024-03-07T23:59:59Z"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones \
  --method POST \
  --field title="Phase 6: Polish & Mobile" \
  --field description="Mobile optimization and code refactoring" \
  --field due_on="2024-03-14T23:59:59Z"

echo "✅ Milestones created!"

# Create labels
echo "🏷️ Creating labels..."
gh label create "critical" --color "d73a4a" --description "Critical priority"
gh label create "high" --color "fbca04" --description "High priority"
gh label create "medium" --color "0e8a16" --description "Medium priority"
gh label create "low" --color "f9d0c4" --description "Low priority"
gh label create "beginner-friendly" --color "7057ff" --description "Good for beginners"
gh label create "intermediate" --color "a2eeef" --description "Requires some experience"
gh label create "advanced" --color "d4c5f9" --description "Complex implementation"
gh label create "frontend" --color "0052cc" --description "Frontend/React work"
gh label create "styling" --color "5319e7" --description "CSS/Design work"
gh label create "mobile" --color "b60205" --description "Mobile-specific work"

echo "✅ Labels created!"

# Phase 1 Issues
echo "📝 Creating Phase 1 issues..."

gh issue create \
  --title "Initial project setup (Vite + React)" \
  --body "## Description
Set up the initial React project with Vite build tool

## Acceptance Criteria
- [ ] Create new Vite React project
- [ ] Remove default boilerplate
- [ ] Set up basic folder structure
- [ ] Verify development server runs

## Estimated Time: 2-3 hours

## Resources
- [Vite React Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)" \
  --label "beginner-friendly,frontend" \
  --milestone "Phase 1: Foundation"

gh issue create \
  --title "Install and configure Tailwind CSS" \
  --body "## Description
Add Tailwind CSS for styling and create basic configuration

## Acceptance Criteria
- [ ] Install Tailwind CSS dependencies
- [ ] Configure tailwind.config.js
- [ ] Set up CSS imports
- [ ] Test with basic utility classes

## Estimated Time: 2-3 hours

## Resources
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)" \
  --label "beginner-friendly,styling" \
  --milestone "Phase 1: Foundation"

gh issue create \
  --title "Set up folder structure" \
  --body "## Description
Create organized folder structure for components, pages, and utilities

## Acceptance Criteria
- [ ] Create src/components folder with subfolders
- [ ] Create src/pages folder
- [ ] Create src/hooks folder
- [ ] Create src/utils folder
- [ ] Add index.js files for clean imports

## Estimated Time: 1-2 hours

## Folder Structure:
\`\`\`
src/
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── venue/
│   └── booking/
├── pages/
├── hooks/
├── utils/
└── styles/
\`\`\`" \
  --label "beginner-friendly,frontend" \
  --milestone "Phase 1: Foundation"

gh issue create \
  --title "Create basic routing with React Router" \
  --body "## Description
Set up React Router for navigation between pages

## Acceptance Criteria
- [ ] Install React Router DOM
- [ ] Create main route structure
- [ ] Set up basic pages (Home, Venues, Profile, Login)
- [ ] Test navigation between pages

## Estimated Time: 3-4 hours

## Routes Needed:
- / (Home)
- /venues (Venue listing)
- /venue/:id (Individual venue)
- /profile (User profile)
- /login (Authentication)" \
  --label "intermediate,frontend" \
  --milestone "Phase 1: Foundation"

gh issue create \
  --title "Build navigation component" \
  --body "## Description
Create responsive navigation with mobile hamburger menu

## Acceptance Criteria
- [ ] Desktop navigation with logo and menu items
- [ ] Mobile hamburger menu
- [ ] Active link highlighting
- [ ] Responsive design (mobile-first)
- [ ] Touch-friendly targets (44px minimum)

## Estimated Time: 4-6 hours

## Design Requirements:
- Logo on left
- Navigation items in center/right
- Mobile: Hamburger menu
- Active state styling" \
  --label "intermediate,frontend,mobile" \
  --milestone "Phase 1: Foundation"

gh issue create \
  --title "Create responsive layout foundation" \
  --body "## Description
Set up basic responsive layout structure and CSS utilities

## Acceptance Criteria
- [ ] Create main layout component
- [ ] Set up responsive breakpoints
- [ ] Add basic CSS utilities
- [ ] Test on different screen sizes
- [ ] Ensure mobile-first approach

## Estimated Time: 3-4 hours

## Breakpoints:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+" \
  --label "intermediate,styling,mobile" \
  --milestone "Phase 1: Foundation"

echo "✅ Phase 1 issues created!"

# Phase 2 Issues
echo "📝 Creating Phase 2 issues..."

gh issue create \
  --title "Create authentication context" \
  --body "## Description
Set up React Context for managing user authentication state

## Acceptance Criteria
- [ ] Create AuthContext with React Context API
- [ ] Provide login/logout functions
- [ ] Handle user state persistence
- [ ] Add loading states
- [ ] Implement token management

## Estimated Time: 4-5 hours

## Context Should Provide:
- user (current user object)
- login(credentials)
- logout()
- loading state
- error handling" \
  --label "intermediate,frontend" \
  --milestone "Phase 2: Authentication"

gh issue create \
  --title "Build login form component" \
  --body "## Description
Create login form with validation and error handling

## Acceptance Criteria
- [ ] Email and password inputs
- [ ] Form validation
- [ ] Error message display
- [ ] Loading state during submission
- [ ] Responsive design

## Estimated Time: 3-4 hours

## Form Fields:
- Email (required, email validation)
- Password (required, min length)
- Submit button with loading state" \
  --label "beginner-friendly,frontend" \
  --milestone "Phase 2: Authentication"

gh issue create \
  --title "Build register form component" \
  --body "## Description
Create registration form for new users

## Acceptance Criteria
- [ ] All required form fields
- [ ] Form validation
- [ ] Password confirmation
- [ ] Error handling
- [ ] Success feedback

## Estimated Time: 3-4 hours

## Form Fields:
- Name, Email, Password
- Avatar URL (optional)
- Venue Manager checkbox" \
  --label "beginner-friendly,frontend" \
  --milestone "Phase 2: Authentication"

echo "✅ Phase 2 issues created!"

echo "🎉 GitHub Project setup complete!"
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click on 'Projects' tab"
echo "3. Create a new project board"
echo "4. Add the created issues to your project"
echo "5. Start coding! 🚀" 