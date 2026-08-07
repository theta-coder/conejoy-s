import os
from PIL import Image

ASSETS_DIR = r"c:\Users\Diyanat Ali\Downloads\New folder\public\assets"
CONES_DIR = os.path.join(ASSETS_DIR, "cones")
CUPS_DIR = os.path.join(ASSETS_DIR, "cups")

def optimize_image(filepath, max_width=600, quality=82):
    if not os.path.exists(filepath):
        return
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    if ext.lower() != ".png":
        return

    try:
        with Image.open(filepath) as img:
            img = img.convert("RGBA")
            # Get bounding box of non-zero alpha content
            bbox = img.getbbox()
            if bbox:
                # Add a 10px margin around bbox
                w, h = img.size
                left = max(0, bbox[0] - 10)
                top = max(0, bbox[1] - 10)
                right = min(w, bbox[2] + 10)
                bottom = min(h, bbox[3] + 10)
                img = img.crop((left, top, right, bottom))

            # Resize if width exceeds max_width
            if img.width > max_width:
                aspect = img.height / img.width
                new_width = max_width
                new_height = int(max_width * aspect)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Save webp
            webp_path = os.path.join(os.path.dirname(filepath), f"{name}.webp")
            img.save(webp_path, "WEBP", quality=quality, optimize=True)

            # Save optimized png
            img.save(filepath, "PNG", optimize=True)

            orig_size = os.path.getsize(filepath) / 1024
            webp_size = os.path.getsize(webp_path) / 1024
            print(f"Optimized {filename}: PNG {orig_size:.1f}KB -> WebP {webp_size:.1f}KB ({img.width}x{img.height})")
    except Exception as e:
        print(f"Error optimizing {filepath}: {e}")

def main():
    print("--- Optimizing Logo Assets ---")
    logo_path = os.path.join(ASSETS_DIR, "conejoys-logo.png")
    optimize_image(logo_path, max_width=240, quality=90)

    print("\n--- Optimizing Cone Assets ---")
    if os.path.exists(CONES_DIR):
        for fname in os.listdir(CONES_DIR):
            if fname.endswith(".png") and not fname.endswith("-source.png"):
                fpath = os.path.join(CONES_DIR, fname)
                optimize_image(fpath, max_width=540, quality=82)

    print("\n--- Optimizing Cup Assets ---")
    if os.path.exists(CUPS_DIR):
        for fname in os.listdir(CUPS_DIR):
            if fname.endswith(".png"):
                fpath = os.path.join(CUPS_DIR, fname)
                optimize_image(fpath, max_width=500, quality=78)

if __name__ == "__main__":
    main()
