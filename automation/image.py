import requests
import urllib.parse

product_name = "Mango"  # later Firestore product-la irundhu varum

prompt = (
    f"professional product photo of fresh {product_name}, "
    "studio lighting, clean white background, high detail, appetizing"
)

url = (
    "https://image.pollinations.ai/prompt/"
    + urllib.parse.quote(prompt)
    + "?width=1024&height=1024&nologo=true"
)

print("Generating image...")
response = requests.get(url, timeout=120)
print("Status:", response.status_code)

if response.status_code == 200 and response.headers.get("content-type", "").startswith("image"):
    with open("output.jpg", "wb") as f:
        f.write(response.content)
    print("Saved output.jpg")
else:
    print("Failed:", response.text[:300])