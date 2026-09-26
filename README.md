# TaskNest — AUREX Week 4

**Full Name:** Laiba Nadeem
**Domain:** Web Development (Full-Stack / Frontend)
**Week:** Week 4 — JS Fundamentals, DOM, Events, Forms & localStorage

**Live Link:** _[Add GitHub Pages / Vercel link here]_

## Technologies Used

HTML5 · CSS3 (no frameworks) · Vanilla JavaScript (no libraries) · `localStorage`

## Features Implemented

- Add task
- Edit task (inline)
- Delete task
- Mark task complete / incomplete
- Filter: All / Active / Done
- Input validation (blocks empty submissions, shows inline error)
- Tasks persist in `localStorage` and reload correctly after refresh
- Responsive layout (mobile + desktop)

## Challenges & Learnings

- Kept the `tasks` array as the single source of truth — every action updates it, saves it, then re-renders, instead of editing the DOM directly.
- Used event delegation on the `<ul>` instead of a listener per task row.
- Paired `JSON.stringify()` / `JSON.parse()` for saving and reading tasks, and learned the difference between in-memory state and what's actually persisted.

## Completed JavaScript Exercises

| Concept | Where |
|---|---|
| Variables (`let`, `const`) | `tasks`, `currentFilter`, `STORAGE_KEY` |
| Conditionals | form validation, `getFilteredTasks()` |
| Loops (`for`, `while`) | `generateId()` (for), `findTaskById()` (while) |
| Functions | `addTask`, `deleteTask`, `toggleComplete`, `editTaskText` |
| Arrays | `push`, `filter`, `forEach` |
| Objects | task shape `{ id, text, completed }` |
| ES6+ | arrow functions, template literals, `const`/`let` |
