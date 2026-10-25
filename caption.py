import os
import random
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Firestore connect
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Oru random product edu
docs = list(db.collection("products").get())
product = random.choice(docs).to_dict()
print("PRODUCT:", product)

# Gemini-kitta caption kelu
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = f"""
Write a short, catchy WhatsApp Status caption for this product.
Product details: {product}
Rules:
- Max 3 lines, friendly tone, 1-2 emojis
- End with 5 relevant hashtags
- Return only the caption text
"""

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=prompt,
)

print("\nCAPTION:\n", response.text)