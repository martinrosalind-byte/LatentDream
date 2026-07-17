import os
import sys
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

# ==============================================================================
# CLASSICAL PSYCHOANALYTIC QUANTITATIVE FIDELITY ASSURANCE PIPELINE (V2)
# ==============================================================================
# This module implements an automated, state-aware verification framework 
# designed to assess the theoretical fidelity of the LatentDream engine. 
# 
# Using the unified google-genai SDK, the script runs diagnostic evaluations
# over dream narratives while maintaining run-to-run persistence to survive
# API rate-limits and network interruptions gracefully.
# ==============================================================================

# Ensure parent directory is in system path for config imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.lexicon import FREUDIAN_LEXICON, FORBIDDEN_THEORIES
from config.prompt_templates import FREUDIAN_SYSTEM_PROMPT

# Load environment configurations
load_dotenv()

# Verify the presence of Google credentials
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("[ERROR] No API key found. Please add GOOGLE_API_KEY to your .env file.")

# Initialize the modern unified Google GenAI Client
client = genai.Client(api_key=api_key)

# Define file paths
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
DATASET_PATH = os.path.join(DATA_DIR, "dreams_dataset.json")
OUTPUT_PATH = os.path.join(DATA_DIR, "generated_reports.json")

def load_dreams():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Could not find dataset at {DATASET_PATH}")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def evaluate_text(text):
    text_lower = text.lower()
    matched_freudian = []
    matched_forbidden = {}

    # 1. Search for positive indicators (required Freudian terms)
    for term in FREUDIAN_LEXICON:
        pattern = rf"\b{re.escape(term.lower())}s?\b"
        if re.search(pattern, text_lower):
            matched_freudian.append(term)

    # 2. Search for negative indicators (prohibited terms)
    for school, terms in FORBIDDEN_THEORIES.items():
        school_violations = []
        for term in terms:
            pattern = rf"\b{re.escape(term.lower())}s?\b"
            if re.search(pattern, text_lower):
                school_violations.append(term)
        if school_violations:
            matched_forbidden[school] = school_violations

    is_compliant = len(matched_freudian) > 0 and len(matched_forbidden) == 0
    return is_compliant, matched_freudian, matched_forbidden

def generate_report_with_gemini(manifest_content):
    """Queries the Gemini API utilizing the modern google-genai library."""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Analyze this dream: {manifest_content}",
            config=types.GenerateContentConfig(
                system_instruction=FREUDIAN_SYSTEM_PROMPT,
                temperature=0.3
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"[ERROR] Gemini API failed to respond: {e}")
        return None

def run_compliance_test():
    print("=" * 70)
    print("LATENTDREAM COMPLIANCE TEST: STATE-AWARE RESUME PIPELINE")
    print("=" * 70)

    try:
        test_cases = load_dreams()
    except Exception as e:
        print(f"[ERROR] Failed to load dataset: {e}")
        return

    # RESUME STATE LOGIC: Check for already generated compliant reports
    results = []
    completed_ids = set()
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                results = json.load(f)
                completed_ids = {case["id"] for case in results if case.get("compliance", {}).get("status") == "PASS"}
                print(f"[STATE-RESUME] Found {len(completed_ids)} already completed compliant reports.")
                print("[STATE-RESUME] Skipping completed cases to preserve your daily quota limit.\n")
        except Exception as e:
            print(f"[WARNING] Could not read existing output file, starting fresh: {e}")
            results = []

    total_passed = len(completed_ids)

    for index, case in enumerate(test_cases, start=1):
        dream_id = case.get("id")
        manifest_content = case.get("payload", {}).get("manifest_content")
        
        # Skip this dream if it was successfully evaluated in a prior execution
        if dream_id in completed_ids:
            print(f"[{index}/30] Skipping Dream ID: {dream_id} (Already verified PASS)")
            continue
            
        print(f"\n[{index}/30] Processing Dream ID: {dream_id}...")
        
        report_text = generate_report_with_gemini(manifest_content)
        if not report_text:
            print(f"  -> [FAILED] No report returned for Dream ID {dream_id}")
            continue
        
        is_compliant, freudian_terms, forbidden_terms = evaluate_text(report_text)
        
        if is_compliant:
            total_passed += 1
            status = "PASS"
            print(f"  -> [SUCCESS] Clean Freudian report! Found: {freudian_terms}")
        else:
            status = "FAIL"
            print(f"  -> [WARNING] Theoretical error detected!")
            if not freudian_terms:
                print("     * Reason: No Freudian terms found.")
            if forbidden_terms:
                print(f"     * Reason: Forbidden terms used: {forbidden_terms}")

        results.append({
            "id": dream_id,
            "manifest_content": manifest_content,
            "analysis_report": report_text,
            "compliance": {
                "status": status,
                "freudian_terms_matched": freudian_terms,
                "forbidden_violations": forbidden_terms
            }
        })

        # Save progress incrementally to survive API exceptions or mid-run cancellations
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=4, ensure_ascii=False)

    compliance_percentage = (total_passed / len(test_cases)) * 100

    print("\n" + "=" * 70)
    print("TESTING SUMMARY")
    print("=" * 70)
    print(f"Total dreams tested: {len(test_cases)}")
    print(f"Successful reports:  {total_passed}")
    print(f"Compliance rate:     {compliance_percentage:.2f}%")
    print(f"All reports saved to: {OUTPUT_PATH}")
    print("=" * 70)

if __name__ == "__main__":
    run_compliance_test()