import os
import json
import re

# ==============================================================================
# COMPUTATIONAL LEXICAL DIVERGENCE EVALUATOR
# ==============================================================================
# This evaluation script measures the mathematical text divergence between 
# two generated outputs from the context isolation experiment. 
# It tokenizes the reports, establishes unique vocabulary sets, and calculates 
# the Jaccard Distance to quantify how much the conversational context shifted 
# the LLM's final psychoanalytic output.
# ==============================================================================

# Paths
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
INPUT_PATH = os.path.join(DATA_DIR, "context_outputs.json")

def clean_and_tokenize(text):
    """
    Normalizes text data by converting characters to lower-case, 
    removing typographic punctuation, and splitting string components into arrays.
    """
    text_normalized = text.lower()
    text_normalized = re.sub(r'[^\w\s]', '', text_normalized)
    return text_normalized.split()

def run_lexical_evaluation():
    print("=" * 70)
    print("LATENTDREAM EVALUATION: COMPUTING LEXICAL DIVERGENCE METRICS")
    print("=" * 70)

    if not os.path.exists(INPUT_PATH):
        raise FileNotFoundError(f"[ERROR] Could not find experiment data at {INPUT_PATH}. Run run_context_experiment.py first.")

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    report_a_raw = data["profiles"]["profile_a"]["generated_report"]
    report_b_raw = data["profiles"]["profile_b"]["generated_report"]

    # Tokenize the outputs into structural arrays
    tokens_a = clean_and_tokenize(report_a_raw)
    tokens_b = clean_and_tokenize(report_b_raw)

    # Establish localized vocabulary maps
    vocab_set_a = set(tokens_a)
    vocab_set_b = set(tokens_b)

    # Perform structural set intersections and unions
    lexical_intersection = vocab_set_a.intersection(vocab_set_b)
    lexical_union = vocab_set_a.union(vocab_set_b)

    # Calculate Jaccard Similarity and Jaccard Distance
    jaccard_similarity = len(lexical_intersection) / len(lexical_union)
    jaccard_distance = 1.0 - jaccard_similarity

    # Isolate highly distinctive contextual identifiers (words over 4 characters long)
    distinct_to_a = sorted([word for word in (vocab_set_a - vocab_set_b) if len(word) > 4])
    distinct_to_b = sorted([word for word in (vocab_set_b - vocab_set_a) if len(word) > 4])

    # Print out simple, clear quantitative outcomes
    print(f"Report A (Somatic Profile) Word Count:    {len(tokens_a)}")
    print(f"Report B (Relational Profile) Word Count: {len(tokens_b)}")
    print(f"Distinct Vocabulary Words in Report A:    {len(vocab_set_a)}")
    print(f"Distinct Vocabulary Words in Report B:    {len(vocab_set_b)}")
    print(f"Shared Vocabulary Words Between Reports:  {len(lexical_intersection)}")
    print("-" * 70)
    print(f"Jaccard Similarity Index (Overlapping):   {jaccard_similarity:.4f}")
    print(f"Jaccard Distance Index (Divergence Rate): {jaccard_distance:.4f}")
    print("=" * 70)
    
    print("\nDistinctive Somatic Context Keywords (Report A Only):")
    print(", ".join(distinct_to_a[:10]))

    print("\nDistinctive Relational Context Keywords (Report B Only):")
    print(", ".join(distinct_to_b[:10]))
    print("=" * 70)

if __name__ == "__main__":
    run_lexical_evaluation()