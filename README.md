# ai_policy_copilot

## Overview
ai_policy_copilot is a comprehensive application designed to assist users in managing and generating AI policies. It features a frontend built with Next.js and a backend powered by FastAPI, providing a seamless experience for users to interact with AI policy management tools.

## Table of Contents
- [Features](#features)
- [Prerequisites / Requirements](#prerequisites--requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API / Core Concepts](#api--core-concepts)
- [Contributing](#contributing)
- [License](#license)
- [Contact / Support](#contact--support)
- [Acknowledgments](#acknowledgments)

## Features
- 🌐 Full-stack application with a responsive frontend and robust backend.
- ⚙️ Easy deployment using Docker and Docker Compose.
- 📦 Modular architecture with clear separation between frontend and backend.
- 🔒 Environment variable management for secure configuration.
- 📊 API endpoints for policy management and data retrieval.

## Prerequisites / Requirements
- Node.js (for frontend)
- Python 3.8+ (for backend)
- Docker (for containerization)
- Docker Compose (for orchestration)

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Dcastor21/ai_policy_copilot.git
   cd ai_policy_copilot
   ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd fe
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```bash
   cd ../be
   pip install -r requirements.txt
   ```

4. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```

5. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

## Usage
Once the application is running, you can access the frontend at `http://localhost:3000`. The backend API will be available at `http://localhost:8000`.

### Example API Call
To retrieve policies, you can use the following curl command:
```bash
curl http://localhost:8000/api/policies
```

## Configuration
The application uses environment variables for configuration. You can modify the `.env` file in the backend directory to set your specific configurations, such as database URLs and API keys.

## Project Structure
```
ai_policy_copilot
├── README.md
├── .gitignore
├── docker-compose.yml
├── fe
│   ├── README.md
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── .env
│   ├── public
│   └── src
│       ├── app
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components
│       │   ├── Header.tsx
│       │   ├── QueryInput.tsx
│       │   └── ResponseCard.tsx
│       ├── lib
│       │   └── api.ts
│       └── types
│           └── index.ts
└── be
    ├── README.md
    ├── .env.example
    ├── Dockerfile
    ├── requirements.txt
    └── app
        ├── main.py
        ├── api
        │   └── routes.py
        ├── core
        │   └── config.py
        └── services
            ├── ingestion.py
            ├── llm.py
            └── retrieval.py
```

## API / Core Concepts
The backend is structured around FastAPI, providing a RESTful API for policy management. Key components include:
- **main.py**: Entry point for the FastAPI application.
- **routes.py**: Defines the API endpoints for managing policies.
- **config.py**: Contains configuration settings for the application.
- **services**: Contains business logic for policy ingestion, LLM interactions, and retrieval.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact / Support
For support or inquiries, please contact the project maintainer at [your-email@example.com].

## Acknowledgments
- Thanks to the contributors and the open-source community for their support and resources.