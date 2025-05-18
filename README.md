# Africa Bitcoin Lightning Bootcamp Website

A platform for showcasing Bitcoin Lightning bootcamps across Africa, their participants, instructors, projects, and sponsors.

## Features

- Browse bootcamps by location and date
- View bootcamp participants, instructors, and projects
- Participants can add their profiles to bootcamps they attended
- Submit projects built during bootcamps
- GitHub-based contribution system using Pull Requests

## Prerequisites

- Node.js (v20 or newer)
- npm or yarn
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/extheoisah/afr-btc-ln-bootcamp.git
cd afr-lightning-bootcamp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root and add:

```bash
# GitHub credentials for PR creation (optional, needed for profile/project submissions)
GITHUB_TOKEN=your_github_personal_access_token
REPO_OWNER=repo_owner_username
REPO_NAME=repo_name
```

If you don't add GitHub credentials, the profile/project submission features will not work.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```bash
├── public/
│   ├── data/                   # JSON data files for bootcamps, students, projects, etc.
│   ├── images/                 # Static images
│   └── uploads/                # Uploaded images (profiles, projects)
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # UI components
│   ├── lib/                    # Utility functions and services
│   │   ├── data.ts             # Data fetching functions
│   │   ├── github.ts           # GitHub API interactions
│   │   ├── profile-service.ts  # Profile submission logic
│   │   └── project-service.ts  # Project submission logic
│   └── types/                  # TypeScript type definitions
```

## Development

### Code Formatting

This project uses Prettier for code formatting. To format your code:

```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check
```

### Spell Checking

We use `typos` for spell checking. To install:

```bash
# Install typos CLI (macOS/Linux)
brew install typos-cli

# Or with cargo
cargo install typos-cli
```

Then run:

```bash
# Check for spelling errors
typos

# Fix spelling errors automatically
typos --write-changes
```

### CI/CD

This project uses GitHub Actions for continuous integration:

- **Code Quality**: Automatically checks code formatting with Prettier and linting with ESLint
- **Spell Check**: Validates spelling across the codebase using typos-cli

These checks run automatically on pull requests and pushes to the main branch.

## Contributing

### Data Structure

The application uses JSON files in the `public/data` directory:

- `bootcamps.json` - Information about bootcamps
- `students.json` - Student/participant profiles
- `instructors.json` - Instructor profiles
- `projects.json` - Projects created during bootcamps
- `sponsors.json` - Bootcamp sponsors

### Adding Content

The recommended way to add content is through the UI:

1. To add a participant profile: Navigate to `/profile`
2. To add a project: Navigate to `/projects/submit`

These will create Pull Requests that can be reviewed and merged.

### Feature Suggestions

If you have ideas for improving this project or have found issues, we welcome your contributions:

1. **Reporting Issues**:

   - Open an issue on GitHub with a clear description
   - Include steps to reproduce the bug
   - Add screenshots if applicable
   - Mention your environment (browser, OS, etc.)

2. **Proposing Features**:

   - Open an issue with the tag "enhancement"
   - Describe the feature and its benefits
   - Include mockups or examples if possible

3. **Contributing Code**:
   - Fork the repository
   - Create a new branch (`git checkout -b feature/your-feature-name`)
   - Make your changes
   - Run tests and ensure they pass
   - Submit a pull request with a clear description of changes
   - Link related issues in your PR description

We follow a simple development workflow:

- Issues are triaged and labeled
- PRs are reviewed by maintainers
- Approved changes are merged to main

Please follow the existing code style and structure when making contributions.

## License

[MIT](LICENSE)
