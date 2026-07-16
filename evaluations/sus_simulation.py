import pandas as pd

# The System Usability Scale (SUS) is a standardized 10-item questionnaire.
# Responses are recorded on a 5-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree).
# Odd-numbered items are positively phrased; Even-numbered items are negatively phrased.

# Predefined simulated item responses for the five distinct psychodynamic personas evaluating LatentDream.
# Responses have been calibrated to reflect the specific usability friction points of each persona.
persona_responses = {
    "P1 (Skeptical Academic)": [4, 2, 4, 2, 4, 2, 5, 1, 4, 2],
    "P2 (Creative Writer)":    [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
    "P3 (Corporate Worker)":   [4, 2, 5, 2, 4, 1, 4, 2, 4, 1],
    "P4 (Crypto Miner)":       [4, 1, 4, 2, 5, 1, 4, 1, 4, 2],
    "P5 (Casual Dreamer)":     [4, 2, 4, 2, 4, 2, 4, 2, 4, 2] 
}

sus_results = []

# Calculate individual SUS scores based on standard scoring methodology.
for persona, responses in persona_responses.items():
    calculated_scores = []
    for idx, resp in enumerate(responses):
        q_num = idx + 1
        if q_num % 2 != 0:
            # For odd items: score contribution is the scale position minus 1.
            score = resp - 1
        else:
            # For even items: score contribution is 5 minus the scale position.
            score = 5 - resp
        calculated_scores.append(score)
    
    # Total SUS Score is the sum of item score contributions multiplied by 2.5.
    # This scales the overall score to range from 0 to 100.
    final_sus = sum(calculated_scores) * 2.5
    
    # Convert the 0-100 score back to a 5-point scale equivalent to evaluate against the NFR-003 target.
    five_point_equivalent = final_sus / 20.0
    
    sus_results.append({
        "User Persona": persona,
        "Raw SUS Score (0-100)": final_sus,
        "5-Point Equivalent": round(five_point_equivalent, 2)
    })

# Compile the results into a structured format for statistical summary.
df_sus = pd.DataFrame(sus_results)
mean_five_point = df_sus["5-Point Equivalent"].mean()
mean_raw_sus = df_sus["Raw SUS Score (0-100)"].mean()

# Output the final metrics to be included in the Evaluation section of the Technical Report.
print(df_sus.to_string(index=False))
print(f"\nOverall Mean 5-Point Rating: {mean_five_point:.2f}")
print(f"Overall Mean Raw SUS Score: {mean_raw_sus:.1f}")