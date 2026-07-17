# ==============================================================================
# CONTEXTUAL ISOLATION EXPERIMENT SPECIFICATION
# ==============================================================================
# This configuration establishes a controlled experimental design to validate 
# the pipeline's utilization of multi-turn conversational context. 
# It holds the base manifest dream static while introducing two diametrically 
# opposed vectors of user context (somatic/repressive vs. relational/oedipal).
# ==============================================================================

# Target Dream: ID 0364 from the Hall/VdC Normative Series
EXPERIMENTAL_MANIFEST_DREAM = (
    "I dreamt I was lying in bed and there was a snake underneath it. "
    "I was afraid to move in the bed or scream. I could hear him moving back "
    "and forth under the bed, making a funny noise as if he was ready to attack someone. "
    "All I could do was sit in one spot hoping he would crawl out and go away."
)

# Context Profile A: Focuses on physical safety, immediate environment, and rigid emotional control
CONTEXT_PROFILE_A = {
    "profile_id": "somatic_anxiety",
    "answers": [
        "I felt a cold shiver down my spine and my body was completely frozen with fear.",
        "The bedroom is my current apartment; it felt small, restrictive, and unsafe.",
        "In my daily life, I try to suppress my fears and stay in control of everything around me."
    ]
}

# Context Profile B: Focuses on interpersonal dynamics, family authority, and boundary struggles
CONTEXT_PROFILE_B = {
    "profile_id": "relational_authority",
    "answers": [
        "The fear felt exactly like how I used to feel when my strict father would yell at me as a child.",
        "The room felt massive and dark, resembling my childhood home's basement.",
        "Lately, I have been having major power struggles and arguments with my manager at work."
    ]
}