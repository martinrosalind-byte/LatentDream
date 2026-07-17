import os
import sys
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# ==============================================================================
# MULTI-TURN CONVERSATIONAL CONTEXTUAL ISOLATION ENGINE
# ==============================================================================
# This script executes a controlled NLP experiment designed to isolate and 
# measure the semantic impact of conversational context on LLM outputs. 
# 
# It holds the baseline manifest dream content completely static while passing 
# two distinct vectors of user follow-up context. The resulting text outputs 
# are saved for subsequent lexical distance and thematic shift analyses.
# ==============================================================================

# Ensure parent directory is in system path for configuration imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.prompt_templates import FREUDIAN_SYSTEM_PROMPT
from config.context_experiment import (
    EXPERIMENTAL_MANIFEST_DREAM,
    CONTEXT_PROFILE_A,
    CONTEXT_PROFILE_B
)

# Load variables from the .env file
load_dotenv()

# Verify the presence of Google credentials
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("[ERROR] No API key found. Please add GOOGLE_API_KEY to your .env file.")

# Initialize the modern unified Google GenAI Client
client = genai.Client(api_key=api_key)

# Define file paths
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
OUTPUT_PATH = os.path.join(DATA_DIR, "context_outputs.json")

def request_final_analysis(manifest_dream, profile_answers):
    """
    Simulates the collection of multi-turn context by presenting the model
    with the raw dream alongside a structured block of client answers.
    """
    # Compile the structured prompt to inject user conversational context
    formatted_user_prompt = (
        f"Manifest Dream Text:\n\"{manifest_dream}\"\n\n"
        f"Client Contextual Answers to Follow-up Inquiries:\n"
        f"1. {profile_answers[0]}\n"
        f"2. {profile_answers[1]}\n"
        f"3. {profile_answers[2]}\n\n"
        f"Please provide the final three-part interpretation report based on these parameters."
    )

    try:
        # Execute content generation using the stable 2026 gemini-2.5-flash model
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=formatted_user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=FREUDIAN_SYSTEM_PROMPT,
                temperature=0.3 # Low temperature used to keep tests consistent
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"[ERROR] API generation failed: {e}")
        return None

def main():
    print("=" * 70)
    print("LATENTDREAM TECHNICAL EVALUATION: RUNNING CONTEXT EXPERIMENT")
    print("=" * 70)

    # 1. Run Generation for Profile A (Somatic/Repression Context)
    print("\n[RUNNING PROFILE A] Processing Somatic Anxiety Profile...")
    report_a = request_final_analysis(EXPERIMENTAL_MANIFEST_DREAM, CONTEXT_PROFILE_A["answers"])
    if report_a:
        print("  -> [SUCCESS] Profile A report generated successfully.")
    else:
        print("  -> [FAILED] Profile A execution error.")
        return

    # 2. Run Generation for Profile B (Relational/Oedipal Context)
    print("\n[RUNNING PROFILE B] Processing Relational Authority Profile...")
    report_b = request_final_analysis(EXPERIMENTAL_MANIFEST_DREAM, CONTEXT_PROFILE_B["answers"])
    if report_b:
        print("  -> [SUCCESS] Profile B report generated successfully.")
    else:
        print("  -> [FAILED] Profile B execution error.")
        return

    # 3. Structure and Export Experimental Data
    experimental_payload = {
        "manifest_dream": EXPERIMENTAL_MANIFEST_DREAM,
        "profiles": {
            "profile_a": {
                "metadata": CONTEXT_PROFILE_A["profile_id"],
                "answers": CONTEXT_PROFILE_A["answers"],
                "generated_report": report_a
            },
            "profile_b": {
                "metadata": CONTEXT_PROFILE_B["profile_id"],
                "answers": CONTEXT_PROFILE_B["answers"],
                "generated_report": report_b
            }
        }
    }

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(experimental_payload, f, indent=4, ensure_ascii=False)

    print("\n" + "=" * 70)
    print("CONTEXT EXPERIMENT GENERATION COMPLETE")
    print("=" * 70)
    print(f"Data payload successfully compiled and written to:\n{OUTPUT_PATH}")
    print("=" * 70)

if __name__ == "__main__":
    main()