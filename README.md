Quick NewsGPT - Deployable Full System (frontend + backend)

Folders:
- frontend/  -> Vite + React (deploy to Vercel)
- backend/   -> Express backend (deploy to Render)

Quick deploy steps:
1) Create two GitHub repos: quick-newsgpt-frontend, quick-newsgpt-backend-v2
2) Push frontend and backend folders to their respective repos
3) Deploy backend on Render (connect repo)
4) Set backend URL in frontend/src/config.js then deploy frontend on Vercel.

If you want, run these commands locally to push:
cd frontend
git init && git add . && git commit -m "frontend" && git branch -M main
# create repo on GitHub and add remote, then git push -u origin main
