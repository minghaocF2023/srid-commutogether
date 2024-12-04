import os
import json
import random
import uuid
from shutil import copyfile

# Paths
WORKING_DIR = os.getcwd()
PHOTOS_DIR = os.path.join(WORKING_DIR, "public/photos")
MEMORIES_DIR = os.path.join(WORKING_DIR, "public/memories")
OUTPUT_FILE = os.path.join(WORKING_DIR, "src/data/photos.json")

# Load existing albums
with open(OUTPUT_FILE, "r") as json_file:
    data = json.load(json_file)

# Get all photos from the photos and memories directories
all_photos = [os.path.join(PHOTOS_DIR, f) for f in os.listdir(PHOTOS_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
all_photos += [os.path.join(MEMORIES_DIR, f) for f in os.listdir(MEMORIES_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]

# Function to create a photo metadata entry
def create_photo_metadata(photo_path):
    file_name = os.path.basename(photo_path)
    new_file_name = f"{uuid.uuid4()}.jpg"
    new_file_path = os.path.join(PHOTOS_DIR, new_file_name)
    copyfile(photo_path, new_file_path)
    return {
        "photoId": str(uuid.uuid4()),
        "photoUrl": f"/photos/{new_file_name}",
        "latitude": random.uniform(-90, 90),  # Random latitude for demo purposes
        "longitude": random.uniform(-180, 180),  # Random longitude for demo purposes
        "location": "Demo Location",
        "isUserUpload": False
    }

# Ensure each album has at least 5 photos
for album in data["albums"]:
    while len(album["photos"]) < 5:
        random_photo = random.choice(all_photos)
        album["photos"].append(create_photo_metadata(random_photo))

# Save the updated albums back to the JSON file
with open(OUTPUT_FILE, "w") as json_file:
    json.dump(data, json_file, indent=2)
    print(f"Updated metadata saved to {OUTPUT_FILE}")