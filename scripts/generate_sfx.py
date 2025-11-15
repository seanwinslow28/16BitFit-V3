#!/usr/bin/env python3
"""
16BitFit V3 - ElevenLabs SFX Batch Generator
Extracts SFX prompts from elevenlabs-sfx-prompts.md and generates all sound effects
Excludes Voice/Grunt assets (marked with strikethrough)
"""

import os
import json
import time
import re
from pathlib import Path
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class SFXBatchGenerator:
    """ElevenLabs SFX batch generator for 16BitFit V3"""

    def __init__(self, api_key: str = None):
        self.client = ElevenLabs(api_key=api_key or os.getenv("ElevenLabs_API_KEY"))
        self.generation_log = []
        self.output_format = "mp3_44100_96"  # Balance of quality and file size

    def generate_sfx(self, sfx_data: dict, base_output_dir: str = "./assets/audio") -> bool:
        """Generate single SFX from JSON definition"""
        try:
            sfx_id = sfx_data['id']
            filename = sfx_data['filename']
            prompt = sfx_data['prompt']
            duration = sfx_data.get('duration_seconds')
            prompt_influence = sfx_data.get('prompt_influence', 0.7)

            output_path = os.path.join(base_output_dir, filename)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            print(f"\n[{sfx_id}] Generating...")
            print(f"  Prompt: {prompt[:60]}...")
            print(f"  Duration: {duration}s | Influence: {prompt_influence}")

            result = self.client.text_to_sound_effects.convert(
                text=prompt,
                duration_seconds=duration,
                prompt_influence=prompt_influence,
            )

            with open(output_path, "wb") as f:
                for chunk in result:
                    f.write(chunk)

            log_entry = {**sfx_data, "success": True, "output_path": output_path}
            self.generation_log.append(log_entry)

            print(f"  ✓ Saved to {output_path}")
            return True

        except Exception as e:
            print(f"  ✗ Error: {e}")
            log_entry = {**sfx_data, "success": False, "error": str(e)}
            self.generation_log.append(log_entry)
            return False

    def batch_generate(
        self,
        sfx_list: list,
        base_output_dir: str = "./assets/audio",
        delay: float = 1.5
    ):
        """Batch generate multiple SFX with rate limiting"""
        total = len(sfx_list)
        successful = 0

        print(f"\n{'='*60}")
        print(f"Starting batch generation: {total} SFX")
        print(f"{'='*60}")

        for i, sfx_data in enumerate(sfx_list):
            print(f"\n[{i+1}/{total}] " + "="*50)

            if self.generate_sfx(sfx_data, base_output_dir):
                successful += 1

            # Rate limiting
            if i < total - 1:
                time.sleep(delay)

        # Save log
        self.save_log(base_output_dir)

        print(f"\n{'='*60}")
        print(f"Batch complete: {successful}/{total} successful")
        print(f"{'='*60}")

    def save_log(self, output_dir: str):
        """Save generation log as JSON"""
        log_path = os.path.join(output_dir, "sfx_generation_log.json")
        with open(log_path, "w") as f:
            json.dump(self.generation_log, f, indent=2)
        print(f"\n✓ Log saved to {log_path}")


def extract_sfx_from_markdown(md_path: str) -> list:
    """
    Extract all SFX JSON blocks from elevenlabs-sfx-prompts.md
    Skips any sections marked with strikethrough (~~) which are excluded
    """
    with open(md_path, 'r') as f:
        content = f.read()

    sfx_list = []

    # Pattern to match JSON code blocks
    json_pattern = r'```json\n(\{[^`]+\})\n```'

    # Find all JSON blocks
    matches = re.finditer(json_pattern, content, re.MULTILINE)

    for match in matches:
        json_str = match.group(1)

        # Get the heading before this JSON block to check for strikethrough
        start_pos = match.start()
        lines_before = content[:start_pos].split('\n')

        # Look for the most recent heading (###)
        heading = None
        for line in reversed(lines_before):
            if line.strip().startswith('###'):
                heading = line.strip()
                break

        # Skip if heading contains strikethrough (excluded asset)
        if heading and '~~' in heading:
            excluded_id = json.loads(json_str).get('id', 'UNKNOWN')
            print(f"⊘ Skipping excluded asset: {excluded_id}")
            continue

        try:
            sfx_data = json.loads(json_str)
            sfx_list.append(sfx_data)
        except json.JSONDecodeError as e:
            print(f"Warning: Failed to parse JSON block: {e}")
            continue

    return sfx_list


def test_connection(api_key: str = None) -> bool:
    """Test ElevenLabs API connection with a simple request"""
    try:
        print("\n" + "="*60)
        print("Testing ElevenLabs API Connection...")
        print("="*60)

        client = ElevenLabs(api_key=api_key or os.getenv("ElevenLabs_API_KEY"))

        # Test with a simple sound effect
        test_prompt = "Quick button click sound, 8-bit retro game, simple beep"
        test_duration = 0.5
        test_influence = 0.7

        print(f"\nTest Parameters:")
        print(f"  Prompt: {test_prompt}")
        print(f"  Duration: {test_duration}s")
        print(f"  Influence: {test_influence}")
        print("\nGenerating test sound effect...")

        result = client.text_to_sound_effects.convert(
            text=test_prompt,
            duration_seconds=test_duration,
            prompt_influence=test_influence,
        )

        # Save test file
        test_dir = "./test_output"
        os.makedirs(test_dir, exist_ok=True)
        test_path = os.path.join(test_dir, "test_connection.mp3")

        with open(test_path, "wb") as f:
            for chunk in result:
                f.write(chunk)

        print(f"\n✓ Connection successful!")
        print(f"✓ Test file saved to: {test_path}")
        print(f"✓ API is ready for batch generation")
        print("="*60)
        return True

    except Exception as e:
        print(f"\n✗ Connection failed: {e}")
        print("="*60)
        return False


def main():
    """Main execution"""
    import argparse

    parser = argparse.ArgumentParser(description='Generate SFX for 16BitFit V3')
    parser.add_argument('--test', action='store_true', help='Test API connection only')
    parser.add_argument('--output', default='./assets/audio', help='Output directory')
    parser.add_argument('--delay', type=float, default=1.5, help='Delay between requests (seconds)')

    args = parser.parse_args()

    # Test mode
    if args.test:
        success = test_connection()
        return 0 if success else 1

    # Full batch generation
    print("\n" + "="*60)
    print("16BitFit V3 - ElevenLabs SFX Batch Generator")
    print("="*60)

    # Find the markdown file
    project_root = Path(__file__).parent.parent
    md_path = project_root / "docs" / "design-system" / "elevenlabs-sfx-prompts.md"

    if not md_path.exists():
        print(f"✗ Error: Could not find {md_path}")
        return 1

    print(f"\n✓ Found prompts file: {md_path}")

    # Extract SFX definitions
    print("\nExtracting SFX definitions from markdown...")
    sfx_list = extract_sfx_from_markdown(str(md_path))

    print(f"\n✓ Extracted {len(sfx_list)} SFX definitions")
    print(f"  (Excluded voice/grunt assets automatically skipped)")

    # Initialize generator
    generator = SFXBatchGenerator()

    # Confirm before generating
    print(f"\nReady to generate {len(sfx_list)} sound effects")
    print(f"Output directory: {args.output}")
    print(f"Rate limit delay: {args.delay}s between requests")
    print("\n▶ Starting batch generation...")

    # Auto-proceed (no confirmation needed)
    # response = input("\nProceed with batch generation? (y/n): ")
    # if response.lower() != 'y':
    #     print("Cancelled.")
    #     return 0

    # Generate all SFX
    generator.batch_generate(
        sfx_list=sfx_list,
        base_output_dir=args.output,
        delay=args.delay
    )

    return 0


if __name__ == "__main__":
    exit(main())
