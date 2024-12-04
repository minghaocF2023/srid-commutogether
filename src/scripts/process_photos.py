import os
import json
from PIL import Image, ExifTags
import requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path=".env.local")

# Get the Mapbox access token from an environment variable
MAPBOX_ACCESS_TOKEN = os.getenv("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN")

if not MAPBOX_ACCESS_TOKEN:
    raise ValueError("Mapbox access token is not set. Please set the MAPBOX_ACCESS_TOKEN environment variable.")

# Get the current working directory (Next.js root directory)
WORKING_DIR = os.getcwd()

# Set paths relative to the working directory
PHOTOS_DIR = os.path.join(WORKING_DIR, "public/photos")
OUTPUT_FILE = os.path.join(WORKING_DIR, "src/data/photos.json")

# Function to extract EXIF metadata
def extract_exif(photo_path):
    try:
        image = Image.open(photo_path)
        exif_data = image._getexif()
        if not exif_data:
            return None

        exif = {ExifTags.TAGS[k]: v for k, v in exif_data.items() if k in ExifTags.TAGS}
        gps_info = exif.get("GPSInfo")
        if not gps_info:
            return None

        def to_decimal(coord, ref):
            degrees, minutes, seconds = coord
            decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
            if ref in ["S", "W"]:
                decimal = -decimal
            return decimal

        latitude = to_decimal(gps_info[2], gps_info[1])
        longitude = to_decimal(gps_info[4], gps_info[3])
        return {"latitude": latitude, "longitude": longitude}
    except Exception as e:
        print(f"Error reading EXIF data from {photo_path}: {e}")
        return None

# Function to perform reverse geocoding using Mapbox
def reverse_geocode(lat, lon):
    try:
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{lon},{lat}.json"
        params = {"access_token": MAPBOX_ACCESS_TOKEN}
        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()
        if data["features"]:
            return data["features"][0]["place_name"]
        return "Unknown location"
    except Exception as e:
        print(f"Error during reverse geocoding: {e}")
        return "Unknown location"

# Main function to process all photos
def process_photos():
    photo_metadata = []

    for file_name in os.listdir(PHOTOS_DIR):
        photo_path = os.path.join(PHOTOS_DIR, file_name)

        # Skip non-image files
        if not file_name.lower().endswith((".jpg", ".jpeg", ".png")):
            print(f"Skipping non-image file: {file_name}")
            continue

        print(f"Processing {file_name}...")

        exif_data = extract_exif(photo_path)
        if exif_data:
            location = reverse_geocode(exif_data["latitude"], exif_data["longitude"])
            photo_metadata.append({
                "photoUrl": f"/photos/{file_name}",
                "latitude": exif_data["latitude"],
                "longitude": exif_data["longitude"],
                "location": location,
            })
        else:
            print(f"No GPS data found for {file_name}")

    with open(OUTPUT_FILE, "w") as json_file:
        json.dump(photo_metadata, json_file, indent=2)
        print(f"Metadata saved to {OUTPUT_FILE}")

# Run the script
if __name__ == "__main__":
    process_photos()
