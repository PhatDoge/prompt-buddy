# AI Prompt Studio

AI Prompt Studio is a web application designed to help users craft, manage, and share Artificial Intelligence (AI) prompts effectively. It provides tools for generating, refining, and organizing prompts to unlock the full potential of AI models.

## Project Links

- **Live Demo:** [https://prompt-buddy-azure.vercel.app/](https://prompt-buddy-azure.vercel.app/)
- **GitHub Repository:** [https://github.com/PhatDoge/prompt-buddy](https://github.com/PhatDoge/prompt-buddy)

## Key Features

- **AI-Powered Prompt Generation:** Leverage AI to create and experiment with prompts.
- **Prompt History:** Keep track of your previously generated prompts.
- **Favorites:** Save your most used or effective prompts for quick access.
- **Community Prompts:** Share your prompts with the community and discover prompts created by others.
- **User Authentication:** Secure access to your personal dashboard and prompts.

## AI Integration

This project utilizes **OpenAI's API** to power intelligent prompt generation. By integrating OpenAI, users can receive high-quality suggestions, completions, and enhancements for their prompts in real time, streamlining the prompt engineering workflow.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
- **Backend & Database:** [Convex](https://www.convex.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Integration:** [OpenAI API](https://platform.openai.com/)
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
    git clone https://github.com/PhatDoge/prompt-buddy.git
    cd prompt-buddy
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
    This project uses Convex, Clerk, and OpenAI. You will need to set up accounts and obtain API keys for each. Create a `.env.local` file in the root of your project and add your environment variables.

    - Convex: [https://docs.convex.dev/getting-started/nextjs](https://docs.convex.dev/getting-started/nextjs)
    - Clerk: [https://clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)
    - OpenAI: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

4.  **Run the Convex development server:**

    ```bash
    npx convex dev
    ```

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
- And other amazing developers!

## Learn More

To learn more about the technologies used in this project, check out their documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
