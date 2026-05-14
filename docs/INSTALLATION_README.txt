# ----- FastAPI [BACKEND] -----

# create venv
python3 -m venv venv

# activate it
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# reinstall dependencies
pip install -r requirements.txt

# create .env file (path: SandBank.API/)
    * at this point run Stripe service is needed and replace webhook secret key
    * .env content:

SECRET_KEY=<secret_key_here>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./sandbank.db
STRIPE_SECRET_KEY=sk_test_secret_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# create admin
python3 create_admin.py

# run
uvicorn main:app --reload

# (optional) fresh database
rm sandbank.db

# ----- Stripe service -----

# check Stripe keys
stripe config --list

# run Stripe service
stripe listen --forward-to http://127.0.0.1:8000/api/payments/webhook

# manually test Stripe service
stripe trigger checkout.session.completed

# ----- React [FRONTEND] -----

# install 
npm install

# run
npm run dev