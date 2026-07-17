# ==============================================================================
# TAXONOMICAL DEFINITIONS FOR THEORETICAL FIDELITY EVALUATION
# ==============================================================================
# This configuration file defines the categorical boundaries used to validate 
# the AI's adherence to classical Freudian psychoanalysis. It establishes 
# a dual-taxonomy framework consisting of:
#   1. Target Freudian Lexicon (positive indicators required for validation)
#   2. Forbidden Paradigms (negative indicators representing theoretical drift)
# ==============================================================================

# Core theoretical terms derived from Sigmund Freud's 'The Interpretation of Dreams' (1899)
FREUDIAN_LEXICON = [
    "manifest content",    # The conscious, literal imagery and narrative of the dream.
    "latent content",     # The hidden, unconscious psychological meaning and repressed wishes.
    "wish fulfillment",   # The symbolic satisfaction of an unconscious, repressed desire.
    "displacement",       # The psychic mechanism of transferring emotional energy from a threatening object to a neutral one.
    "condensation",       # The process of compressing multiple unconscious chains of association into a single dream element.
    "id",                 # The primitive, instinctive component of the tripartite personality structure.
    "ego",                # The realistic component of the psyche that mediates between instinctive drives and reality.
    "superego",           # The moralistic component representing internalized societal and parental standards.
    "repression",         # The primary defense mechanism of excluding painful or unacceptable impulses from consciousness.
    "defense mechanism",  # Unconscious ego strategies deployed to mitigate intrapsychic conflict and anxiety.
    "psychosexual"        # Relating to the developmental stages of the libido.
]

# Competing psychological theories and cognitive paradigms that must be strictly excluded
# to prevent theoretical contamination.
FORBIDDEN_THEORIES = {
    "Jungian_Analytical": [
        "collective unconscious", # Carl Jung's theory of a shared, inherited ancestral psyche.
        "archetype",              # Universal, mythic symbols residing in the collective unconscious.
        "shadow",                 # The repressed, unacknowledged dark side of the personality.
        "individuation",          # The process of integrating conscious and unconscious aspects of the self.
        "anima", "animus"         # Inner feminine and masculine psychological archetypes.
    ],
    "Adlerian_Individual": [
        "inferiority complex",    # Alfred Adler's core concept of striving for superiority to overcome organic deficit.
        "birth order",            # The influence of sibling hierarchy on personality development.
        "social interest"         # Community feeling and cooperative attitude toward society.
    ],
    "Cognitive_Behavioral": [
        "cognitive distortion",   # Systematic errors in reasoning leading to dysfunctional beliefs.
        "automatic thought",      # Rapid, evaluative cognitive responses triggered by situations.
        "schema",                 # Cognitive frameworks for organizing and interpreting information.
        "reframing"               # Identifying and changing habitual, unhelpful cognitive patterns.
    ]
}