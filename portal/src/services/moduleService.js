'use strict';

/** @typedef {{ id: string, number: number, title: string, duration: number, format: string, description: string, objectives: string[], languages: string[], path: string, optional: boolean }} WorkshopModule */

/** @type {WorkshopModule[]} */
const MODULES = [
  {
    id: 'module-00-welcome',
    number: 0,
    title: 'Welcome & Foundations',
    duration: 15,
    format: 'Presentation',
    description: 'Introduction to the workshop, GitHub Copilot overview, and setting expectations for the day. Learn about the AI-powered coding assistant and how it integrates into your development workflow.',
    objectives: [
      'Understand what GitHub Copilot is and how it works',
      'Learn about the workshop structure and agenda',
      'Set up your development environment',
      'Understand the difference between Copilot Individual, Business, and Enterprise',
    ],
    languages: [],
    path: '../modules/module-00-welcome',
    optional: false,
  },
  {
    id: 'module-01-core-experience',
    number: 1,
    title: 'Copilot in VS Code Core Experience',
    duration: 45,
    format: 'Demo + Hands-on',
    description: "Deep dive into GitHub Copilot's core features within VS Code. Learn inline completions, ghost text, and how to effectively work with AI suggestions to boost your productivity.",
    objectives: [
      'Use inline code completions effectively',
      'Understand ghost text and how to accept/reject suggestions',
      'Learn keyboard shortcuts for Copilot interactions',
      'Practice writing code with Copilot assistance',
      'Understand how context affects suggestion quality',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-01-core-experience',
    optional: true,
  },
  {
    id: 'module-02-chat-deep-dive',
    number: 2,
    title: 'Copilot Chat Deep Dive',
    duration: 60,
    format: 'Demo + Hands-on',
    description: "Explore GitHub Copilot Chat's powerful conversational AI features. Learn to use chat participants, slash commands, and how to frame questions for the best results.",
    objectives: [
      'Use Copilot Chat in VS Code for code explanation',
      'Learn slash commands: /explain, /fix, /tests, /doc',
      'Work with chat participants like @workspace and @terminal',
      'Use inline chat for targeted code improvements',
      'Generate unit tests with Copilot Chat',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-02-chat-deep-dive',
    optional: true,
  },
  {
    id: 'module-03-copilot-on-github',
    number: 3,
    title: 'Copilot on GitHub.com GHEC',
    duration: 45,
    format: 'Demo + Hands-on',
    description: 'Discover GitHub Copilot features available directly on GitHub.com in the Enterprise Cloud. Learn to use Copilot in pull requests, issues, and the GitHub web interface.',
    objectives: [
      'Use Copilot to summarize pull requests',
      'Generate PR descriptions with Copilot',
      'Use Copilot in GitHub issues for analysis',
      'Explore Copilot in code search on GitHub.com',
      'Understand enterprise-specific Copilot features',
    ],
    languages: [],
    path: '../modules/module-03-copilot-on-github',
    optional: true,
  },
  {
    id: 'module-04-customization',
    number: 4,
    title: 'Customization Instructions & Prompt Files',
    duration: 60,
    format: 'Demo + Hands-on',
    description: "Learn how to customize GitHub Copilot for your organization's specific needs. Create custom instructions, prompt files, and repository-specific configurations.",
    objectives: [
      'Create repository-level Copilot instructions',
      'Write effective prompt files for common tasks',
      'Configure organization-wide Copilot policies',
      'Use custom instructions to enforce coding standards',
      'Build reusable prompt templates for your team',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-04-customization',
    optional: true,
  },
  {
    id: 'module-05-agents',
    number: 5,
    title: 'Agent Mode & Custom Agents',
    duration: 75,
    format: 'Demo + Hands-on',
    description: "Explore GitHub Copilot's powerful agent capabilities. Learn to use agent mode for complex multi-step tasks and create custom agents tailored to your workflows.",
    objectives: [
      'Understand what agent mode is and when to use it',
      'Use built-in agents for common development tasks',
      'Create custom agents with MCP (Model Context Protocol)',
      'Build multi-step automated workflows with agents',
      'Integrate agents into your CI/CD pipeline',
    ],
    languages: ['java', 'javascript'],
    path: '../modules/module-05-agents',
    optional: true,
  },
  {
    id: 'module-06-wrapup',
    number: 6,
    title: 'Wrap-up Q&A & Next Steps',
    duration: 30,
    format: 'Discussion',
    description: 'Conclude the workshop with a Q&A session and discussion about next steps for adopting GitHub Copilot in your organization. Share learnings and plan your AI-assisted development journey.',
    objectives: [
      'Review key learnings from the workshop',
      'Address open questions and challenges',
      'Discuss adoption strategies for your organization',
      'Identify next steps and resources for continued learning',
      'Connect with the GitHub Copilot community',
    ],
    languages: [],
    path: '../modules/module-06-wrapup',
    optional: false,
  },
];

/**
 * Get all workshop modules.
 * @returns {WorkshopModule[]}
 */
const getAllModules = () => MODULES;

/**
 * Get a single module by its ID.
 * @param {string} id - The module ID (e.g. 'module-01-core-experience')
 * @returns {WorkshopModule | undefined}
 */
const getModuleById = (id) => MODULES.find((m) => m.id === id);

/**
 * Filter modules that support a specific programming language.
 * Returns modules with no language restriction too.
 * @param {string} language - 'java' or 'javascript'
 * @returns {WorkshopModule[]}
 */
const filterByLanguage = (language) =>
  MODULES.filter((m) => m.languages.length === 0 || m.languages.includes(language));

module.exports = { getAllModules, getModuleById, filterByLanguage };
