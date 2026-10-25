import os
import random
import urllib.parse
from datetime import date

import requests
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from dotenv import load_dotenv

load_dotenv()

# 1. Firestore connect
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Oru random product edu
docs = list(db.collection("products").get())
if not docs:
    raise SystemExit("No products found in Firestore")
product = random.choice(docs).to_dict()
name = product["name"]
price = product["price"]
print("Product:", name, price)

# 3. Caption + hashtags (Gemini)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
prompt = f"""
Write a short, catchy WhatsApp Status caption for this product.
Product: {name}, price: Rs.{price} (Indian rupees, use the ₹ symbol)
Rules:
- Max 3 lines, friendly tone, 1-2 emojis
- End with 5 relevant hashtags
- Return only the caption text
"""
caption = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=prompt,
).text.strip()
print("\nCaption:\n", caption)

# 4. AI image (Pollinations)
img_prompt = (
    f"professional product photo of fresh {name}, "
    "studio lighting, clean white background, high detail, appetizing"
)
url = (
    "https://image.pollinations.ai/prompt/"
    + urllib.parse.quote(img_prompt)
    + "?width=1024&height=1024&nologo=true"
)
resp = requests.get(url, timeout=120)
resp.raise_for_status()

# 5. Save
os.makedirs("output", exist_ok=True)
stamp = date.today().isoformat()
with open(f"output/{stamp}.jpg", "wb") as f:
    f.write(resp.content)
with open(f"output/{stamp}.txt", "w", encoding="utf-8") as f:
    f.write(caption)

print(f"\nSaved output/{stamp}.jpg and output/{stamp}.txt")