# 🚀 Holidaze GitHub Project Setup

Automatically create a complete GitHub project with issues, milestones, and project board for the Holidaze development plan.

## 📋 What This Creates

- **6 Milestones** - One for each development phase
- **12+ Labels** - Priority, skill level, and component labels  
- **20+ Issues** - Detailed development tasks with acceptance criteria
- **Project Board** - Kanban board with Backlog, In Progress, Review, Done columns

## 🛠️ Setup Options

### Option 1: Node.js Script (Recommended)

**Prerequisites:**
- Node.js installed
- GitHub Personal Access Token
- GitHub repository created

**Steps:**

1. **Install dependencies:**
```bash
npm install @octokit/rest
```

2. **Run the setup script:**
```bash
node complete-project-setup.js
```

3. **Follow the prompts:**
- Enter your GitHub username
- Enter your repository name  
- Enter your GitHub Personal Access Token

### Option 2: GitHub CLI Script

**Prerequisites:**
- GitHub CLI installed and authenticated

**Steps:**

1. **Edit the script variables:**
```bash
# Edit setup-github-project.sh
REPO_OWNER="your-username"
REPO_NAME="your-repo-name"
```

2. **Make executable and run:**
```bash
chmod +x setup-github-project.sh
./setup-github-project.sh
```

## 🔑 Getting a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `repo` (Full control of private repositories)
   - `project` (Full control of projects)
4. Copy the token (you won't see it again!)

## 📊 Project Structure Created

### Milestones (6 weeks)
- **Phase 1: Foundation** - Project setup, routing, layout
- **Phase 2: Authentication** - User auth and profiles  
- **Phase 3: Venue Display** - Listing and search
- **Phase 4: Venue Details** - Individual pages and booking
- **Phase 5: Venue Management** - CRUD operations
- **Phase 6: Polish & Mobile** - Optimization and refactoring

### Labels
**Priority:**
- 🔴 `critical` - Must fix immediately
- 🟡 `high` - Important features
- 🟢 `medium` - Standard features
- ⚪ `low` - Nice to have

**Skill Level:**
- 🟣 `beginner-friendly` - Good first issues
- 🔵 `intermediate` - Some experience needed
- 🟪 `advanced` - Complex implementation

**Components:**
- `frontend` - React/UI work
- `styling` - CSS/design
- `mobile` - Mobile-specific
- `api` - Backend integration
- `refactor` - Code cleanup

### Sample Issues Created

**Phase 1 Examples:**
- Initial project setup (Vite + React)
- Install and configure Tailwind CSS
- Set up folder structure
- Create basic routing
- Build navigation component
- Responsive layout foundation

**Each Issue Includes:**
- Detailed description
- Acceptance criteria checklist
- Time estimates
- Resources and links
- Code examples where helpful
- Mobile considerations

## 🎯 Using Your Project

### Daily Workflow

1. **Morning:**
   - Check project board
   - Move current issue to "In Progress"
   - Review acceptance criteria

2. **During Development:**
   - Check off completed criteria
   - Add time tracking comments
   - Ask questions in issue comments

3. **End of Day:**
   - Update progress
   - Move completed issues to "Done"
   - Plan tomorrow's work

### Issue Comments for Time Tracking

```markdown
## Time Log
**Estimated:** 4 hours
**Day 1:** 2 hours - Set up basic component
**Day 2:** 2.5 hours - Added responsive design
**Total:** 4.5 hours (+0.5 hours over estimate)

## Notes
- Spent extra time on mobile menu animation
- Learned about CSS transforms
- Ready for review
```

### Branch Naming

```bash
# Feature branches
git checkout -b feature/issue-1-project-setup
git checkout -b feature/issue-7-auth-context

# Bug fixes  
git checkout -b bugfix/issue-15-mobile-menu

# Refactoring
git checkout -b refactor/issue-25-extract-components
```

## 📈 Project Benefits

### For Learning:
- **Structured approach** - Clear progression from basic to advanced
- **Time awareness** - Learn to estimate development time
- **Best practices** - Issues teach proper development workflow
- **Portfolio piece** - Shows project management skills

### For Development:
- **Clear roadmap** - Never wonder what to build next
- **Progress tracking** - Visual progress with project board
- **Documentation** - Issues serve as development documentation
- **Collaboration ready** - Easy to add team members later

## 🔧 Customization

### Adding More Issues

Edit `complete-project-setup.js` and add to the `ISSUES_DATA.issues` array:

```javascript
{
  title: "Your new feature",
  body: `## Description
Your feature description

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Estimated Time: X hours`,
  labels: ["frontend", "medium"],
  milestone: "Phase X: Name"
}
```

### Modifying Milestones

Update the `ISSUES_DATA.milestones` array with your preferred dates and descriptions.

### Custom Labels

Add to `ISSUES_DATA.labels` array:

```javascript
{ 
  name: "your-label", 
  color: "ff0000", 
  description: "Your description" 
}
```

## 🚨 Troubleshooting

**"Milestone already exists" errors:**
- Normal if re-running script
- Script will continue with existing milestones

**"Label already exists" errors:**  
- Normal if re-running script
- Script will continue with existing labels

**Authentication errors:**
- Check your Personal Access Token
- Ensure token has `repo` and `project` scopes
- Verify repository name and owner are correct

**Permission errors:**
- Make sure you have admin access to the repository
- Organization repos may need additional permissions

## 🎉 What's Next?

After running the setup:

1. **Visit your GitHub repository**
2. **Go to Projects tab** - See your new project board
3. **Go to Issues tab** - Browse all created issues
4. **Start with Phase 1** - Begin with foundation issues
5. **Move issues through board** - Track your progress

## 📚 Learning Resources

- [GitHub Projects Guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

Happy coding! 🚀 