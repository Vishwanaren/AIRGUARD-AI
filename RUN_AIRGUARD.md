# AIRGUARD AI - run instructions

## Backend
From the project root:
`python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload`

## Frontend
In a second terminal:
`cd frontend`
`npm run dev`
Then open http://127.0.0.1:5173

## Optional CPCB live source
Create `.env` in the project root and add:
`DATA_GOV_API_KEY=YOUR_KEY`
Without a key, AIRGUARD uses an explicitly labelled Open-Meteo model estimate for current/live inference.

## Data separation
- Historical training/analytics data keeps its original 2015-2020 dates.
- Live readings never overwrite historical rows.
- Recent live/model history is used only in the forecast inference copy.
