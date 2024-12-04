import os
import json
import uuid
from PIL import Image, ExifTags
import requests
from dotenv import load_dotenv
from sklearn.cluster import DBSCAN
import numpy as np

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
            # Extract relevant components for a shorter name
            for feature in data["features"]:
                if "place" in feature["place_type"]:
                    return feature["text"]
                if "locality" in feature["place_type"]:
                    return feature["text"]
                if "neighborhood" in feature["place_type"]:
                    return feature["text"]
            # Fallback to the full place name if no specific component is found
            return data["features"][0]["place_name"]
        return "Unknown location"
    except Exception as e:
        print(f"Error during reverse geocoding: {e}")
        return "Unknown location"

# Function to cluster photos by location
def cluster_photos(photo_metadata):
    coords = np.array([(photo["latitude"], photo["longitude"]) for photo in photo_metadata])
    clustering = DBSCAN(eps=0.01, min_samples=1).fit(coords)
    clusters = {}
    for idx, label in enumerate(clustering.labels_):
        if label not in clusters:
            clusters[label] = []
        clusters[label].append(photo_metadata[idx])
    return clusters

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
            is_user_upload = "my" in file_name.lower()  # For demo purposes, assume photos with "my" in the filename are user uploads
            photo_metadata.append({
                "photoId": str(uuid.uuid4()),
                "photoUrl": f"/photos/{file_name}",
                "latitude": exif_data["latitude"],
                "longitude": exif_data["longitude"],
                "location": location,
                "isUserUpload": is_user_upload
            })
        else:
            print(f"No GPS data found for {file_name}")

    clusters = cluster_photos(photo_metadata)
    albums = []
    for label, photos in clusters.items():
        album_name = reverse_geocode(photos[0]["latitude"], photos[0]["longitude"])
        contains_user_uploads = any(photo["isUserUpload"] for photo in photos)
        albums.append({
            "albumId": str(uuid.uuid4()),
            "name": album_name,
            "photos": photos,
            "containsUserUploads": contains_user_uploads
        })

    with open(OUTPUT_FILE, "w") as json_file:
        json.dump({"albums": albums}, json_file, indent=2)
        print(f"Metadata saved to {OUTPUT_FILE}")

# Run the script
if __name__ == "__main__":
    process_photos()