# 📘 Sentence Construction Tool

This is a React + Vite-based sentence construction tool for the CA MONK Frontend Internship assignment.

## ✨ Features

- Fill in the blanks with 4 options per question
- Timer of 30 seconds per question
- Auto-navigation on timeout
- Final score with correct/incorrect feedback
- Responsive design using Tailwind CSS
- Restart/Replay option
- Questions stored in JSON Server (mock API)

## 🛠 Tech Stack

- React + Vite
- Tailwind CSS
- JSON Server

## 📦 Installation

```bash
git clone https://github.com/your-username/sentence-construction-tool.git
cd sentence-construction-tool
npm install

> ⚠️ Note: The deployed version on Vercel shows an error unless `json-server` is running locally.
To test this app, please:
- Clone the repo
- Run: `npx json-server --watch db.json --port 3000`
- Run the app: `npm run dev`
