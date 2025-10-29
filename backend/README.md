Quick NewsGPT Backend v2 (Render-ready)

1) Create a GitHub repo (quick-newsgpt-backend-v2) and push this folder.
2) On Render: New Web Service -> Connect Repo -> Select this repo.
   Build Command: npm install
   Start Command: npm start
3) Set Environment Variables on Render:
   EMAIL_USER, EMAIL_PASS, EMAIL_TO
4) (Optional) Add a Cron Job on Render to hit /send-summary daily.
