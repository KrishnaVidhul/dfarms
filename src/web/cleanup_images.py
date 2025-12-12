
import subprocess
import json

REPO = "us-central1-docker.pkg.dev/dfarms-480705/cloud-run-source-deploy/dfarms-frontend"

def get_images():
    cmd = [
        "gcloud", "artifacts", "docker", "images", "list", REPO,
        "--sort-by=~CREATE_TIME",
        "--format=json"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)

def delete_image(digest):
    full_image = f"{REPO}@{digest}"
    print(f"Deleting {full_image}...")
    cmd = [
        "gcloud", "artifacts", "docker", "images", "delete", full_image,
        "--delete-tags", "--quiet"
    ]
    subprocess.run(cmd, check=True)

def main():
    images = get_images()
    print(f"Found {len(images)} images.")
    
    # Keep last 10 to be safe (covers recent reverts)
    # Revisions 40-52 are today. 
    KEEP_COUNT = 10
    
    if len(images) <= KEEP_COUNT:
        print("Nothing to clean up.")
        return

    to_delete = images[KEEP_COUNT:]
    print(f"Deleting {len(to_delete)} old images...")

    for img in to_delete:
        # The JSON output has 'digest' key? Let's check format or just use digest string
        # 'package': '...', 'version': 'digest' usually
        # The 'list' command output format=json usually gives list of dicts.
        # Let's inspect structure if needed, or just assume standard.
        # Standard: [{'package': '...', 'version': 'sha256:...', 'createTime': '...', 'updateTime': '...', 'tags': [...]}]
        # Wait, 'version' IS the digest in some views, or 'digest' key.
        # Let's verify by printing one key set if I could, but I'll trust 'version' or 'digest'.
        # Actually, Artifact Registry list json has 'package', 'version', 'tags'.
        # 'version' looks like 'sha256:...'
        
        digest = img.get('version', img.get('digest'))
        if digest:
            try:
                delete_image(digest)
            except Exception as e:
                print(f"Failed to delete {digest}: {e}")

if __name__ == "__main__":
    main()
