# AI Prompt Studio

AI Prompt Studio is a web application designed to help users craft, manage, and share AI prompts effectively. It provides tools for generating, refining, and organizing prompts to unlock the full potential of AI models.

## Key Features

- **Intuitive Prompt Generation:** Easily create and experiment with AI prompts.
- **Prompt History:** Keep track of your previously generated prompts.
- **Favorites:** Save your most used or effective prompts for quick access.
- **Community Prompts:** Share your prompts with the community and discover prompts created by others.
- **AI-Powered Suggestions:** (Assumed based on project nature - can be verified/refined) Get smart suggestions to improve your prompts.
- **User Authentication:** Secure access to your personal dashboard and prompts.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
- **Backend & Database:** [Convex](https://www.convex.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later recommended)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up environment variables:**
    This project uses Convex and Clerk. You will need to set up accounts and obtain API keys/credentials for both. Create a `.env.local` file in the root of your project and add your environment variables. Refer to the Convex and Clerk documentation for details on the required variables.

    - Convex: [https://docs.convex.dev/getting-started/nextjs](https://docs.convex.dev/getting-started/nextjs)
    - Clerk: [https://clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)

4.  **Run the Convex development server:**
    In a separate terminal, run:

    ```bash
    npx convex dev
    ```

    This will also guide you through schema deployment if it's your first time.

5.  **Run the Next.js development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Credits

This project was developed with contributions from:

- **Alonso Castillo**

## Learn More

To learn more about the technologies used in this project, check out their documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
