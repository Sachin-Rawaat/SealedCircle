# SealedCircle — Node.js (Express) Version

## Naya flow (latest update)
1. **Home** → "Get Your Pass" button ab seedha **Signup** page kholta hai.
2. User apni details bharta hai → submit karne pe wo **MongoDB me save** ho
   jaati hai (`api/signup.js` / local pe `server.js`).
3. Save hote hi user seedha **Choose Your Pass (tickets)** page pe pahunch
   jaata hai.
4. Tickets page ke "Access" buttons abhi **kuch nahi karte** (koi
   login/signup nahi kholte) — jaisa tumne bola, wo function hata diya hai.
   Baad me jab batao, inhe real booking/payment se jod denge.
5. Footer (Privacy Policy / Terms / etc.) aur date-time subtitle hata diye
   gaye hain.
6. Saare 4 pass cards (Solo / 2pax / Standing / VIP) ab **same size** hain,
   chahe unme features kam ho ya zyada.
7. Logo ab PNG image hai (`public/assets/logo.png`) — chahe kitna bhi bada
   file ho, CSS usko header ki height ke hisaab se apne aap chhota kar dega.
8. Hero photo ab **poori dikhegi** (kuch bhi crop nahi hoga) — box ki height
   same rahegi, agar photo ka ratio match nahi karta to bas thodi si black
   space side me aa sakti hai.

## MongoDB setup (zaroori — signup save karne ke liye)
1. Free MongoDB database banao: https://www.mongodb.com/cloud/atlas (free
   tier "M0" kaafi hai).
2. Connection string copy karo (kuch aisa dikhega):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sealedcircle?retryWrites=true&w=majority
   ```
3. **Local testing ke liye:** `.env.example` file ko copy karke `.env` bana
   do (same folder me), aur usme apna connection string daal do:
   ```
   MONGODB_URI=mongodb+srv://...
   ```
4. **Vercel pe deploy karte waqt:** Vercel dashboard → apna project →
   Settings → Environment Variables → yahan `MONGODB_URI` naam se wahi
   connection string add karo. (`.env` file Vercel pe upload nahi hoti,
   isliye ye step zaroori hai.)

Signup data `signups` collection me save hoga — fields: fullName, email,
phone, password, age, gender, creativeField, org, instagram, portfolio.

⚠️ **Note:** Abhi password plain text me save ho raha hai (sirf testing ke
liye). Production me jaane se pehle isko hash karna zaroori hai (bcrypt jaisi
library se) — jab batao, wo bhi kar denge.

## Kya file delete karni hai?
**Koi bhi file delete nahi karni.** Sab kuch same files me edit hua hai. Naye
files jo add hue hain (delete nahi, ye zaroori hain):
- `lib/db.js` — MongoDB connection
- `models/Signup.js` — signup ka data structure
- `.env.example` — MongoDB URI ka sample

## Structure
```
sealedcircle-node/
├── server.js          → Express server, LOCAL TESTING ONLY (npm start)
├── package.json
├── vercel.json         → tells Vercel: serve public/ as static, auto-detect api/
├── .env.example        → copy to .env and add your MongoDB URI (local only)
├── lib/
│   └── db.js            → MongoDB connection helper
├── models/
│   └── Signup.js         → Mongoose schema for signup data
├── api/
│   ├── login.js         → real Vercel serverless function for /api/login
│   └── signup.js        → real Vercel serverless function for /api/signup (saves to MongoDB)
└── public/
    ├── index.html       → ALL pages live here as hidden <section> blocks
    ├── style.css        → black + soft red theme, all colors as CSS variables
    ├── script.js         → client-side router (instant page switching) + menu + forms
    └── assets/
        ├── event-banner.svg   → placeholder, replace with your photo
        └── logo.png            → your logo goes here (any size, auto-scales)
```

## Run locally
```bash
npm install
npm start
```
Then open http://localhost:3000

## Apna logo/photo lagana (VS Code me)
1. Apni photo `public/assets/` me daalo, e.g. `public/assets/event-banner.jpg`
2. `public/index.html` me ye line dhundo:
   ```html
   <img src="assets/event-banner.svg" alt="Depth Pool Party banner" />
   ```
   File name apni image se replace kar do.
3. Logo ke liye `public/index.html` ke header me ye comment mila hai (sirf ek
   jagah, kyunki header ab sirf ek baar likha hua hai poori site ke liye):
   ```html
   <!-- Replace with your own logo image if you want:
        <img class="brand-logo-img" src="assets/logo.png" alt="SealedCircle" /> -->
   ```
   Apna logo `public/assets/logo.png` me daal ke uncomment kar do, aur upar
   wali `<span class="logo-mark">...</span>` line hata do.

## Colors
`public/style.css` ke top `:root { ... }` block me `--red`, `--bg`, `--card`
jaise variables se poora theme control hota hai.

## API (stubbed — connect to your real DB/auth later)
- `POST /api/login`  → body: `{ email, password }`
- `POST /api/signup` → body: `{ fullName, email, phone, password, ... }`

Abhi ye sirf JSON echo karte hain (`{ ok: true, ... }`). Real auth/DB
(MongoDB, Postgres, Firebase, etc.) yahi routes ke andar `server.js` me jodni hai.

## Vercel pe deploy (static + serverless split — sabse fast, kabhi hang nahi)
`vercel.json` aur `api/` folder already sahi tarike se set hain. Bas:

```bash
npm i -g vercel
cd sealedcircle-node
vercel
```

Ya GitHub se import karo — Vercel khud detect kar lega:
- `public/` → static hosting (CDN se instant serve, no server, no cold start)
- `api/login.js`, `api/signup.js` → auto serverless functions

Framework preset me kuch select karne ki zarurat nahi, "Other" bhi chalega
kyunki `vercel.json` already output directory bata raha hai. Koi build
command chahiye hi nahi.

**Local testing** (`npm start`) me `server.js` (Express) use hota hai jo
same `/api/login` & `/api/signup` routes deta hai — taaki tum bina Vercel pe
deploy kiye local pe test kar sako. Production (Vercel) me ye file use nahi
hoti, sirf `api/*.js` files chalti hain.
