
# GitHub User Search Interface

A responsive React-based web application that allows users to search for GitHub profiles and view their public information and repositories.

## Features

- **User Search**: Enter any GitHub username to fetch their profile
- **Profile Display**: View user's avatar, bio, location, follower count, and more
- **Repository Showcase**: Browse the user's top repositories sorted by stars
- **Responsive Design**: Mobile-first layout that works on all devices
- **Error Handling**: Comprehensive error states for invalid users or API issues
- **Loading States**: Smooth loading indicators during API calls

## Tech Stack

- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **API**: GitHub REST API
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a GitHub username in the search field
2. Click "Search User" or press Enter
3. View the user's profile information and repositories
4. Click on repository links to visit them on GitHub

## API Usage

This application uses the GitHub REST API:
- User data: `https://api.github.com/users/{username}`
- User repositories: `https://api.github.com/users/{username}/repos`

No authentication is required for public data access.

## Project Structure

```
src/
├── components/
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
└── main.tsx          # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- GitHub API for providing public user data
- Tailwind CSS for the styling framework
- Lucide React for the icon library
