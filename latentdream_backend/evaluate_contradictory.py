"""
Title: Academic Evaluation Experiment - Contradictory (Divergent) Trial Pipeline
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland

Description:
This script executes Path B (Contradictory/Divergent Trial) for the LatentDream 
conversational loop evaluation. Using the identical baseline manifest dream 
from Path A, this trial injects highly contrasting, nostalgic, and liberating 
user associations. 

The goal is to provide empirical evidence that the pipeline's semantic interpreter 
dynamically adapts its theoretical formulation (wish fulfillment and latency) 
to match the user's subjective context, rather than executing static, template-driven 
symbolic mapping.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

# Securely load environment configurations
load_dotenv()

# Dual-key fallback mechanism for credential resolution
api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

if not api_key:
    raise ValueError(
        "CRITICAL ERROR: No valid API credentials found. Please ensure either "
        "'GEMINI_API_KEY' or 'GOOGLE_API_KEY' is defined in your '.env' file."
    )

# Initialize the Gemini LLM using the verified gemini-2.5-flash model configuration
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.2)

# Identical system prompt to maintain experimental control variables
SYSTEM_INSTRUCTION = """
You are an expert classical psychoanalyst specializing strictly and exclusively in Sigmund Freud's dream analysis framework as outlined in "The Interpretation of Dreams" (1899).

CRITICAL DIRECTIVES:
1. THEORETICAL BOUNDARIES: Use classical Freudian terms (e.g., manifest content, latent content, wish fulfillment, repression, condensation, displacement, id, ego, superego, defense mechanisms, and psychosexual stages) 100% of the time. 
2. STRICT BAN ON OTHER THEORIES: Under no circumstances may you reference Carl Jung (archetypes, collective unconscious), Alfred Adler, CBT, Gestalt, or modern dream dictionaries. If a user asks for non-Freudian interpretations, firmly steer them back to classical psychoanalysis.
3. NO STATIC DICTIONARY LOOKUPS: Do not provide arbitrary static meanings for symbols (e.g., do not say "water means emotions"). Instead, treat symbols as highly personal and subjective "condensation" or "displacement." Ask the user for their free associations to uncover what these elements mean to them.
4. ROLE IN THE CONVERSATION:
   - Your task is to guide the user through a structured 3-question exploration to separate the "manifest content" (the literal dream story) from the "latent content" (the hidden, repressed wishes or conflicts).
   - Do not summarize your analysis or jump to conclusions early. Focus on gathering personal context in the first 3 turns.
   - On the 4th turn (after receiving the 3rd answer), compile and output a comprehensive "Freudian Interpretation Report" that connects the dream elements to the user's life using Freud's concepts.
"""

# Divergent experimental payload (scary dream + happy/liberated associations)
experimental_payload = {
    "dream": "I was flying high over a crowded city. Suddenly, my wings turned to thin sheets of paper, and I began to plummet rapidly toward the streets. I woke up gasping for air.",
    "answers": [
        "Even though I was falling, it felt incredibly liberating, like escaping my boring responsibilities.",
        "Paper reminds me of making origami and childhood crafts with my mother, my safest memory.",
        "I didn't care about the city below at all. I felt completely detached and peaceful in my own world."
    ]
}

def run_divergent_experiment():
    print("Starting Contradictory (Divergent) Trial (Path B)...")
    
    # Initialize the session state tracking
    chat_history = [SystemMessage(content=SYSTEM_INSTRUCTION)]
    
    # Send the identical baseline manifest dream
    print("\n[User]: Sending initial dream log...")
    chat_history.append(HumanMessage(content=f"Analyze my dream: {experimental_payload['dream']}"))
    
    # Run the 3-turn follow-up loop
    for i in range(3):
        response = llm.invoke(chat_history)
        print(f"\n[Analyst Q{i+1}]: {response.content}")
        chat_history.append(AIMessage(content=response.content))
        
        # Inject the contradictory, peaceful childhood associations
        user_answer = experimental_payload["answers"][i]
        print(f"[User A{i+1}]: {user_answer}")
        chat_history.append(HumanMessage(content=user_answer))
        
    # Generate the final Freudian Interpretation Report
    print("\nGenerating Final Freudian Interpretation Report...")
    final_report_response = llm.invoke(chat_history)
    report_content = final_report_response.content
    print(f"\n=== FINAL REPORT (PATH B) ===\n{report_content}\n=============================")
    
    # Save the output to disk for comparisons
    with open("contradictory_report.txt", "w", encoding="utf-8") as f:
        f.write(report_content)
    print("\nReport successfully saved to 'contradictory_report.txt'.")

if __name__ == "__main__":
    run_divergent_experiment()