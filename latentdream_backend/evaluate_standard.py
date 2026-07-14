"""
Title: Academic Evaluation Experiment - Standard (Consistent) Trial Pipeline
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland

Description:
This script automates the execution of Path A (Standard/Consistent Trial) for the
LatentDream conversational loop evaluation. It simulates a multi-turn psychoanalytic 
intake process by sequentially injecting predefined user responses that consistently 
reflect professional performance anxiety and fear of failure. 

The system leverages the highly responsive 'gemini-2.5-flash' model configuration, 
promoting low latency conversational state transitions while maintaining strict adherence 
to classical Freudian theoretical constructs.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

# Load environment variables from the local .env file securely.
load_dotenv()

# Dual-key fallback mechanism: Resolve credential identity across different naming schemas
api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

if not api_key:
    raise ValueError(
        "CRITICAL ERROR: No valid API credentials found. Please ensure either "
        "'GEMINI_API_KEY' or 'GOOGLE_API_KEY' is defined in your '.env' file."
    )

# Initialize the Gemini LLM using the optimized gemini-2.5-flash model.
# We set temperature to 0.2 to ensure high deterministic adherence to the system instructions.
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.2)

# Define the rigorous Freudian System Instructions to govern the model's behavior.
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

# Define the experimental payload containing the baseline dream and the Path A (Standard) responses.
experimental_payload = {
    "dream": "I was flying high over a crowded city. Suddenly, my wings turned to thin sheets of paper, and I began to plummet rapidly toward the streets. I woke up gasping for air.",
    "answers": [
        "I felt absolute terror. It felt exactly like my daily fear of failing at my new corporate job.",
        "Paper reminds me of my fragile employment contract and endless, overwhelming office work.",
        "I felt judged by the crowd below. I was terrified my colleagues would see me fail."
    ]
}

def run_consistent_experiment():
    print("Starting Standard (Consistent) Trial (Path A)...")
    
    # Initialize the chat history state with the system instructions.
    chat_history = [SystemMessage(content=SYSTEM_INSTRUCTION)]
    
    # Send the initial manifest dream description.
    print("\n[User]: Sending initial dream log...")
    chat_history.append(HumanMessage(content=f"Analyze my dream: {experimental_payload['dream']}"))
    
    # Loop through the three sequential question-and-answer turns.
    for i in range(3):
        # Generate the analyst's question based on current history.
        response = llm.invoke(chat_history)
        print(f"\n[Analyst Q{i+1}]: {response.content}")
        chat_history.append(AIMessage(content=response.content))
        
        # Inject the pre-defined, consistent user association.
        user_answer = experimental_payload["answers"][i]
        print(f"[User A{i+1}]: {user_answer}")
        chat_history.append(HumanMessage(content=user_answer))
        
    # Generate the final Freudian Interpretation Report.
    print("\nGenerating Final Freudian Interpretation Report...")
    final_report_response = llm.invoke(chat_history)
    report_content = final_report_response.content
    print(f"\n=== FINAL REPORT (PATH A) ===\n{report_content}\n=============================")
    
    # Save the output to a text file for subsequent academic evaluation.
    with open("standard_report.txt", "w", encoding="utf-8") as f:
        f.write(report_content)
    print("\nReport successfully saved to 'standard_report.txt'.")

if __name__ == "__main__":
    run_consistent_experiment()