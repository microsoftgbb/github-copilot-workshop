# GitHub Copilot Enterprise Workshop

> **Audience:** Enterprise developers and technical resources  
> **Duration:** Full day (9:00 AM - 4:15 PM)  
> **Prerequisites:** VS Code installed, GitHub Copilot license (Business/Enterprise), GitHub.com account  

---

## Schedule

| Time | Module | Duration | Format |
|------|--------|----------:|--------|
| 9:00 - 9:15 | [Welcome & Foundations](modules/module-00-welcome/) | 15 min | Presentation |
| 9:15 - 10:15 | [Module 1: Copilot in VS Code - Core Experience](modules/module-01-core-experience/) | 60 min | Demo + Hands-on |
| 10:15 - 10:30 | Break | 15 min | |
| 10:30 - 11:30 | [Module 2: Copilot Chat - Deep Dive](modules/module-02-chat-deep-dive/) | 60 min | Demo + Hands-on |
| 11:30 - 12:15 | [Module 3: Copilot on GitHub.com (GHEC)](modules/module-03-copilot-on-github/) | 45 min | Demo + Hands-on |
| 12:15 - 1:15 | Lunch | 60 min | |
| 1:15 - 2:15 | [Module 4: Customization - Instructions & Prompt Files](modules/module-04-customization/) | 60 min | Demo + Hands-on |
| 2:15 - 2:30 | Break | 15 min | |
| 2:30 - 3:45 | [Module 5: Agent Mode & Custom Agents](modules/module-05-agents/) | 75 min | Demo + Hands-on |
| 3:45 - 4:15 | [Wrap-up, Q&A & Next Steps](modules/module-06-wrapup/) | 30 min | Discussion |

---

## Learning Objectives by Module

### Welcome & Foundations (15 min)
- Understand what GitHub Copilot is and how it fits into the enterprise software development lifecycle
- Identify the different Copilot plans (Business vs Enterprise) and their capabilities
- Understand Copilot's privacy, security, and IP indemnity guarantees for enterprise use

### Module 1: Copilot in VS Code - Core Experience (60 min)
- Receive and accept inline code suggestions using Tab, partial accept, and next edit suggestions
- Write effective comment-driven prompts that produce accurate code completions
- Navigate alternative suggestions and understand when to accept, modify, or reject them
- Apply Copilot code suggestions to real enterprise tasks: CRUD operations, data transformations, and boilerplate reduction
- Use GitHub Copilot on GitHub.com to generate pull request summaries and request AI-powered code reviews
- Assign issues to the Copilot Coding Agent and review its autonomously generated pull requests

### Module 2: Copilot Chat - Deep Dive (60 min)
- Use Chat participants (`@workspace`, `@terminal`, `@github`), slash commands, and chat variables to craft precise prompts
- Distinguish between Ask, Edit, Agent, and Plan modes and select the right one for a given task
- Generate, explain, and fix code using Copilot Chat with enterprise-grade examples
- Write unit tests for existing code using Copilot Chat in both Java and JavaScript

### Module 3: Copilot on GitHub.com - GHEC (45 min)
- Use Copilot Chat on GitHub.com to query repositories, explain code, and explore codebases
- Generate pull request summaries with Copilot
- Use Copilot code review to get AI-powered review feedback on pull requests
- Leverage Copilot from the search bar and dashboard for repository-scoped questions

### Module 4: Customization - Instructions & Prompt Files (60 min)
- Create repository-wide custom instructions (`.github/copilot-instructions.md`) to enforce coding standards
- Build path-specific instruction files (`.instructions.md`) with `applyTo` frontmatter for language/framework-specific rules
- Author reusable prompt files (`.prompt.md`) as slash commands for common enterprise workflows
- Understand the instruction priority hierarchy: personal > repository > organization

### Module 5: Agent Mode & Custom Agents (75 min)
- Use Agent mode in VS Code for autonomous multi-step tasks with terminal command execution
- Create custom agents (`.agent.md`) with specialized tools, instructions, and model selection
- Implement handoffs between agents for sequential multi-step workflows (e.g., Plan → Implement → Review)
- Understand and configure subagents for parallel task delegation and context isolation
- Build an orchestration pattern using coordinator and worker agents with the `agents` property

### Wrap-up, Q&A & Next Steps (30 min)
- Review key takeaways and identify areas for immediate adoption
- Understand enterprise governance: policy management, audit logs, content exclusions, and usage metrics
- Create an action plan for rolling out Copilot customizations to your team

---

## Repository Structure

```
├── agenda.md                              # This file
├── modules/
│   ├── module-00-welcome/
│   │   └── README.md                     # Welcome & Foundations
│   ├── module-01-core-experience/
│   │   ├── README.md                     # Module instructions
│   │   └── exercises/                    # Hands-on exercise stubs
│   │       ├── orderService.js
│   │       └── OrderService.java
│   ├── module-02-chat-deep-dive/
│   │   ├── README.md                     # Module instructions
│   │   └── samples/                      # Sample code for unit test generation
│   │       ├── java/
│   │       │   ├── OrderService.java
│   │       │   └── OrderServiceTest.java
│   │       └── javascript/
│   │           ├── package.json
│   │           ├── src/userService.js
│   │           └── test/userService.test.js
│   ├── module-03-copilot-on-github/
│   │   └── README.md                     # Module instructions
│   ├── module-04-customization/
│   │   ├── README.md                     # Module instructions
│   │   └── exercises/README.md           # Exercise guide
│   ├── module-05-agents/
│   │   ├── README.md                     # Module instructions
│   │   └── exercises/README.md           # Exercise guide
│   └── module-06-wrapup/
│       └── README.md                     # Wrap-up & next steps
└── .github/                              # Live Copilot customization config
    ├── copilot-instructions.md           # Repository-wide instructions
    ├── instructions/                     # Path-specific instructions
    ├── prompts/                          # Reusable prompt files
    └── agents/                           # Custom agent definitions
```

## Resources
- https://code.visualstudio.com/docs/copilot/overview
- https://github.com/github/awesome-copilot/
- https://github.blog/engineering/architecture-optimization/the-technology-behind-githubs-new-code-search/
- https://speckit.org/
