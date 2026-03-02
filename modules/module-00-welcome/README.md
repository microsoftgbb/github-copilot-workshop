# Welcome & Foundations

> **Duration:** 15 minutes | **Format:** Presentation

---

## Learning Objectives

By the end of this section, you will be able to:

- Understand what GitHub Copilot is and how it fits into the enterprise software development lifecycle
- Identify the different Copilot plans (Business vs Enterprise) and their capabilities
- Understand Copilot's privacy, security, and IP indemnity guarantees for enterprise use

---

## What Is GitHub Copilot?

GitHub Copilot is an AI coding assistant that helps you write code faster and with less effort, allowing you to focus more energy on problem solving and collaboration.

Research shows that Copilot **increases developer productivity** and accelerates software development. Developers using Copilot complete tasks up to **55% faster** than those without it.

### Where Can You Use Copilot?

| Surface | Features Available |
|---------|-------------------|
| **VS Code / JetBrains / Visual Studio** | Inline suggestions, Chat (Ask/Edit/Agent/Plan modes), Next Edit Suggestions |
| **GitHub.com** | Chat, PR summaries, Code review, Copilot coding agent, Copilot Spaces |
| **GitHub Mobile** | Chat interface |
| **CLI / Terminal** | Copilot CLI for command-line assistance |

---

## Enterprise Plans at a Glance

| Capability | Copilot Business | Copilot Enterprise |
|---|---|---|
| Code suggestions in IDE | Yes | Yes |
| Copilot Chat in IDE & GitHub.com | Yes | Yes |
| Agent mode in VS Code | Yes | Yes |
| Custom instructions | Yes | Yes |
| Pull request summaries | Yes | Yes |
| Copilot code review | Yes | Yes |
| Copilot coding agent | Yes | Yes |
| Policy management | Yes | Yes |
| Audit logs | Yes | Yes |
| Content exclusions | Yes | Yes |
| IP indemnity | Yes | Yes |
| Knowledge bases (Copilot Spaces) | No | Yes |
| Fine-tuned models for your org | No | Yes |

---

## Enterprise Trust & Security

### Data Privacy
- **No training on your code**: Copilot Business and Enterprise do **not** retain prompts or suggestions, and your code is **never used to train models**
- **Encrypted in transit**: All data between your IDE and GitHub is encrypted
- **SOC 2 compliant**: GitHub Copilot meets enterprise compliance requirements

### IP Indemnity
- GitHub provides **IP indemnity** for Copilot Business and Enterprise customers
- Optional **duplicate detection filter** blocks suggestions matching public code

### Admin Controls
- **Policy management**: Enterprise and org owners control which features are enabled
- **Content exclusions**: Specify files and repositories Copilot should never access
- **Audit logs**: Track Copilot usage across your organization
- **Seat management**: Assign and revoke licenses at the org level

---

## Today's Workshop Flow

```
9:00  ┌─ Welcome & Foundations (You are here!)
9:15  ├─ Module 1: Core Copilot Experience in VS Code
10:00 ├─ Break
10:15 ├─ Module 2: Copilot Chat Deep Dive
11:15 ├─ Module 3: Copilot on GitHub.com
12:00 ├─ Lunch
1:00  ├─ Module 4: Customization (Instructions & Prompt Files)
2:00  ├─ Break
2:15  ├─ Module 5: Agent Mode & Custom Agents
3:30  └─ Wrap-up, Q&A & Next Steps
```

### What You'll Build Today

Throughout this workshop, you will work with **enterprise-grade code samples** in both **Java** and **JavaScript**, covering:

- REST API services and data transformation utilities
- Unit testing with JUnit 5 and Jest
- Custom instructions that enforce your team's coding standards
- Reusable prompt files for common workflows
- Custom agents for specialized tasks like planning, implementation, and code review
- Agent handoffs and subagent orchestration patterns

---

## Prerequisites Checklist

- [ ] VS Code installed (latest stable version)
- [ ] Signed in to GitHub in VS Code
- [ ] GitHub Copilot license active (Business or Enterprise)
- [ ] GitHub Copilot extension installed in VS Code (auto-installed on first sign-in)
- [ ] Access to a GitHub Enterprise Cloud organization
- [ ] Node.js 18+ installed (for JavaScript exercises)
- [ ] Java 17+ and Maven installed (for Java exercises)

---

**Next:** [Module 1 - Copilot in VS Code: Core Experience](../module-01-core-experience/)
