# Module 4 Exercises: Customization

## Exercise Instructions

### Exercise 4A: Repository-Wide Instructions (10 min)

1. Open `.github/copilot-instructions.md`
2. Review the existing instructions
3. Customize for your team:
   - Update the language/framework sections to match your stack
   - Add your team's specific coding conventions
   - Include your testing requirements
4. Test: Open Copilot Chat and ask `Create a utility function that validates an email address`
   - Verify the output follows your custom instructions

### Exercise 4B: Path-Specific Instructions (10 min)

1. Review the existing instruction files in `.github/instructions/`:
   - `java-standards.instructions.md` - Java-specific rules
   - `javascript-standards.instructions.md` - JS/TS-specific rules
   - `testing-standards.instructions.md` - Test file rules
2. Create a new instruction file for your use case
3. Test by opening a matching file and asking Copilot a question

### Exercise 4C: Reusable Prompt Files (20 min)

1. Review the existing prompt files in `.github/prompts/`:
   - `create-unit-test.prompt.md` - Generate unit tests
   - `security-review.prompt.md` - Security-focused review
   - `create-service.prompt.md` - Scaffold a service class
2. Test each prompt:
   - Type `/create-unit-test` in Chat (select a code file first)
   - Type `/security-review` in Chat
   - Type `/create-service` in Chat
3. Create your own prompt file for a workflow specific to your team

### Tips

- Instructions are applied automatically (no action needed beyond saving)
- Prompt files are invoked manually with `/name` in chat
- Check the References dropdown in Chat responses to verify instructions were applied
- Use the diagnostics view (right-click Chat → Diagnostics) to troubleshoot
