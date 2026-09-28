# The Aurelius — Hotel Digital Menu

## Deploy to Vercel (QR works on ANY phone, ANY network)

### Step 1 — Open CMD in this folder and run:
npm install
npx vercel --prod

### Step 2 — Answer prompts:
- Link to existing project? → N
- Project name? → hotel-menu
- Directory? → ./ (just press Enter)
- Modify settings? → N

### Step 3 — Copy your URL shown after deploy:
Example: https://hotel-menu-xyz.vercel.app

### Step 4 — Add Environment Variable on Vercel:
1. Go to vercel.com → your project → Settings → Environment Variables
2. Add: NEXT_PUBLIC_APP_URL = https://hotel-menu-xyz.vercel.app
3. (Optional — OTP) Add: TWO_FACTOR_API_KEY = your_2factor_api_key
4. (Optional — OTP) Add: TWO_FACTOR_SMS_TEMPLATE = anyhelp
5. (Recommended — Live Tables Sync) Add Vercel KV to your project (Storage tab). It will create KV env vars automatically (KV_REST_API_URL / KV_REST_API_TOKEN).
6. Run: npx vercel --prod

### Step 5 — Scan QR from any phone on any network!

---

Pages:
/ = Home with QR code
/menu = Guest menu (mobile optimized)  
/admin = Admin panel + QR download
