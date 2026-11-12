# CLAUDE.md

## Project Goal

Develop a website mockup for a residential real estate developer.

- The company's core business is building multi-apartment residential buildings and selling housing during the construction phase.
- The website must present the company and give visitors information about active construction projects and the apartments currently available for sale.
- A contact form is mandatory and must be reachable through a quick-access link from any point on the site.

## Design Requirements

- The site is aimed at a mobile audience, so a **mobile-first** approach is recommended.
- Primary color palette: white and `#0a223e`.

## Technical Requirements

- The mockup must be static. Complex elements are not required to be functional.
- Allowed technologies: HTML5, CSS3, and vanilla JavaScript only.

## Project Structure

- The site must run from `index.html` in the project root.
- `js/` for all `.js` files.
- `css/` for all `.css` files.
- `html/` for all other `.html` files.
- `assets/` for all other files (images, fonts, icons, etc.).

## Site Pages

The site must include the following pages:

- **Home**: a landing page (`index.html`).
- **All properties**: lists residential properties for sale, archived residential properties, and commercial real estate.
- **Residential property (for sale)**: a page for a single residential property.
- **Contacts**: the contacts page.

### Apartment selection

- The site must let visitors choose an apartment. This can be a separate page or an alternative mechanism.

### Property page templates

- All property pages are templates, so a single property page is enough. Use it as a placeholder everywhere an alternative property page is needed.

## Workflow

- The mockup is developed in stages, each consisting of tasks and subtasks.

## Git Rules

Git must be used throughout the work.

### Critical rule

**Deleting or overwriting commits is strictly forbidden.** Never use history-rewriting operations (e.g. `git reset --hard` to drop commits, `git rebase` on pushed commits, `git commit --amend`, `git push --force`). Any fix must be made exclusively through an additional commit.

### Branching

- Each task is a separate branch, created from the up-to-date `main` at the time of creation (pull the latest `main` first).
- All subtasks of a task are committed to that task's branch.

### Commits

- Include the subtask name in the commit title.
- Use the commit description for a short summary of the changes.
- Before each commit, review `git status` and `git diff`; resolve conflicts if there are any.
- After each commit, push it to the remote repository.

### Completing a task

- When the task is finished, merge its entire branch into `main`.

## Requirements Clarification Protocol

Before implementing any non-trivial task:

1. Read and understand the entire user request.
2. Inspect relevant parts of the existing codebase.
3. Identify:
   - Ambiguous requirements.
   - Missing business logic.
   - Unspecified edge cases.
   - Technical constraints.
   - Potential conflicts with existing architecture.
4. Ask the user clarifying questions before implementation.

Questioning rules:
- Ask specific questions, not generic ones.
- Explain why each question matters.
- Offer possible answers when appropriate.
- Do not ask about things already specified.
- Do not invent requirements.
- Group related questions together.

If critical information is missing:
- Do not implement the task.
- Wait for the user's answers.

After clarification:
1. Summarize the final requirements.
2. Present the implementation plan.
3. Identify affected files and components.
4. Wait for explicit user approval before implementation.