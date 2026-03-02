# Module 3: Copilot on GitHub.com (GHEC)

> **Duration:** 45 minutes (15 min demo + 30 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Copilot Chat on GitHub.com to query repositories, explain code, and explore codebases
- Generate pull request summaries with Copilot
- Use Copilot code review to get AI-powered review feedback on pull requests
- Leverage Copilot from the search bar and dashboard for repository-scoped questions

---

## 1. Copilot Chat on GitHub.com (5 min demo)

### Accessing Copilot Chat

Copilot Chat is available across GitHub.com:

| Access Point | How to Open | Best For |
|-------------|-------------|----------|
| **Copilot icon** (title bar) | Click the Copilot icon next to the search bar | General questions, cross-repo queries |
| **Search bar** | Type a question in a repo's search bar → "Ask Copilot" | Repository-scoped questions |
| **Dashboard** | Prompt box on your github.com dashboard | Quick questions on login |
| **PR / Issue context** | Open Copilot while viewing a PR or issue | Context-aware code questions |

### Copilot Skills on GitHub.com

Copilot dynamically selects **skills** based on your question. Key skills include:

| Skill | What It Does | Example Prompt |
|-------|-------------|----------------|
| **Code search** | Searches across your repository code | `Where is the authentication middleware defined?` |
| **Bing web search** | Answers with current web information | `@github #web What is the latest LTS version of Node.js?` |
| **Path search** | Finds files by path pattern | `Find all configuration files in this repo` |
| **Issue/PR search** | Searches issues and pull requests | `What are the open P1 bugs assigned to my team?` |

> **Enterprise tip:** Use `What skills are available?` to see the full list of skills Copilot can use.

### Conversation Features on GitHub.com

- **Subthreads**: Branch a conversation by editing or retrying any question
- **Model switching**: Regenerate a response with a different AI model using the retry icon
- **File generation**: Copilot can generate complete files that you can view, edit, and download
- **Sharing**: Share conversations with teammates via a link (preview feature)

---

## 2. Pull Request Summaries (5 min demo)

Copilot can automatically generate a summary of the changes in a pull request.

### How to Use

1. Create or open a pull request
2. In the PR description field, click the **Copilot** icon (or the "Generate summary" button)
3. Copilot analyzes the diff and generates:
   - **Overview** of what changed and why
   - **File-by-file breakdown** with descriptions of each change
   - **Review guidance** highlighting what a reviewer should focus on

### Enterprise Value

| Benefit | Impact |
|---------|--------|
| **Faster reviews** | Reviewers get context before reading code |
| **Consistent quality** | Every PR has a meaningful description |
| **Knowledge transfer** | New team members understand changes without asking |
| **Compliance** | Auditable descriptions of all code changes |

---

## 3. Copilot Code Review (5 min demo)

Copilot can review pull request code and provide AI-generated feedback.

### Features

- **Automated review comments**: Copilot identifies potential issues, bugs, and improvements
- **Custom instructions**: Use `.github/copilot-instructions.md` to customize review behavior
- **One-click request**: Request a Copilot review just like requesting a human reviewer
- **Inline suggestions**: Copilot provides code suggestions directly in the review

### Enterprise Use Cases

| Scenario | How Copilot Helps |
|----------|-------------------|
| **Security review** | Flags potential vulnerabilities, injection risks, credential exposure |
| **Code quality** | Identifies duplicated code, complex methods, missing error handling |
| **Standards compliance** | Checks against team-defined coding standards via custom instructions |
| **Performance** | Highlights N+1 queries, unnecessary allocations, missing caching |

---

## 4. Copilot Coding Agent (Demo Only)

The Copilot coding agent is an autonomous AI agent that works directly on GitHub.com:

1. **Assign an issue to Copilot** → Copilot creates a branch and starts working
2. **Copilot creates a pull request** → You review the proposed changes
3. **Iterate with comments** → Leave feedback, Copilot revises

> **Enterprise relevance:** The coding agent respects your repository's custom instructions (`.github/copilot-instructions.md`) and runs CI/CD pipelines to validate its changes.

---

## 5. Hands-on Exercise (30 min)

### Exercise 3A: Explore a Repository with Copilot Chat (10 min)

1. Navigate to a repository on GitHub.com (use your organization's repo or a public repo)
2. Click the **search bar** at the top of the repository page
3. Ask the following questions and observe how Copilot uses different skills:

```
What does this repository do?
```

```
Where is the main entry point of the application?
```

```
What testing frameworks are used in this project?
```

```
Show me all API endpoint definitions in this codebase
```

4. Try asking with a web search:
```
@github #web What are the current best practices for the framework used in this repo?
```

### Exercise 3B: Generate a Pull Request Summary (10 min)

1. Create a new branch and make a small code change (e.g., add a utility function, fix a comment, or update a configuration)
2. Create a pull request from the branch
3. In the PR description, click the **Copilot summary** button
4. Review the generated summary:
   - Is the "what changed" section accurate?
   - Does the file-by-file breakdown match your changes?
   - Would a reviewer find this summary useful?
5. Edit the summary to add any context Copilot missed

### Exercise 3C: Request a Copilot Code Review (10 min)

1. On the same pull request, go to the **Reviewers** section
2. Request a review from **Copilot**
3. Wait for Copilot to analyze the PR and provide comments
4. Review Copilot's feedback:
   - Are the suggestions relevant?
   - Did it catch any issues you missed?
   - How does it compare to a human review?
5. If Copilot provided inline suggestions, examine whether they're appropriate

### Bonus: Dashboard Quick Access

1. Navigate to your GitHub dashboard (github.com)
2. Use the Copilot prompt box to ask:
```
What are my most recent pull requests that need attention?
```
```
Summarize the open issues in [repo-name]
```

---

## Key Takeaways

1. **Copilot on GitHub.com is context-aware:** It understands the repository, PR, or issue you're viewing
2. **PR summaries save review time:** Auto-generated summaries help reviewers focus on what matters
3. **AI code review complements human review:** Copilot catches patterns humans might miss, but always verify
4. **Skills are dynamically selected:** Copilot chooses the right tool (code search, web search, etc.) based on your question
5. **Copilot coding agent enables autonomous work:** Assign issues directly to Copilot for background implementation

---

**Next:** [Module 4 - Customization: Instructions & Prompt Files](../module-04-customization/)
