"""
LatentDream Performance Evaluation Script: NFR-001 Latency Verification
Author: Rosalind Barrett (Student ID: 25115642)
Institution: National College of Ireland

Description:
This script performs an automated quantitative evaluation of the LatentDream 
backend response latency. Specifically, it validates Non-Functional Requirement 
NFR-001: ensuring that when a user logs a dream, the first LangChain-driven 
Gemini API prompt response is returned in under 3.5 seconds. 

The script conducts multiple trial runs to account for network variance and warm-up 
cycles, calculating the mean, minimum, maximum, and standard deviation of latency.
"""

import time
import requests
import statistics

# Configuration Constants
# Adjust the URL to match your local development environment or your live Render deployment URL
BACKEND_URL = "http://127.0.0.1:8000/api/chat"  # Or your live Render backend endpoint
NUM_TRIALS = 5  # Recommended: 5-10 runs for local validation; 30 runs for final System Testing

# Sample test cases representing typical user-submitted manifest dream text
SAMPLE_DREAM_LOGS = [
    "I was flying over a dense, dark forest but my wings suddenly stopped working and I began to fall.",
    "I found myself back in my childhood classroom, but I realized I had forgotten to study for the final exam.",
    "I was walking down an endless hallway of doors, and every time I opened one, it led back to the same hallway.",
    "A massive shadow was chasing me through an empty city, and my legs felt too heavy to run.",
    "I discovered a hidden room inside my house that I had never seen before, filled with ancient books."
]

def measure_response_latency(dream_text: str) -> float:
    """
    Sends a mock POST request containing manifest dream text to the FastAPI backend,
    measuring the precise wall-clock time elapsed until the first question is returned.
    """
    # Updated payload to match the ChatRequest Pydantic model in main.py
    payload = {
        "dream_text": dream_text,
        "transcript": []  # Empty list because this is the first question
    }
    
    start_time = time.perf_counter()
    
    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=30)
        end_time = time.perf_counter()
        
        if response.status_code == 200:
            elapsed_time = end_time - start_time
            return elapsed_time
        else:
            print(f"[ERROR] Received server error code: {response.status_code}")
            print(f"[ERROR DETAILS]: {response.text}") # Added this to show exact error details
            return -1.0
            
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Network communication failed: {e}")
        return -1.0

def run_performance_test():
    """
    Orchestrates the latency evaluation cycle, aggregate statistical metrics,
    and formats the final output to verify alignment with NFR-001 thresholds.
    """
    print("======================================================================")
    print("  LATENTDREAM: NFR-001 LATENCY AND SYSTEM RESPONSE TEST")
    print("======================================================================")
    print(f"Target Threshold: First question must deliver in < 3.5 seconds")
    print(f"Testing Endpoint: {BACKEND_URL}")
    print(f"Executing {NUM_TRIALS} testing trials...\n")
    
    latencies = []
    
    for i in range(NUM_TRIALS):
        # Rotate through sample dream logs
        dream_input = SAMPLE_DREAM_LOGS[i % len(SAMPLE_DREAM_LOGS)]
        
        print(f"Trial {i+1}/{NUM_TRIALS}: Sending dream input...")
        latency = measure_response_latency(dream_input)
        
        if latency > 0:
            print(f" -> Response received in: {latency:.3f} seconds.")
            latencies.append(latency)
        else:
            print(" -> Trial Failed.")
            
        # Optional brief delay between calls to simulate sequential, non-burst user traffic
        time.sleep(15)
        
    if not latencies:
        print("\n[CRITICAL] All performance testing trials failed. Check backend status.")
        return
        
    # Statistical Aggregations
    avg_latency = statistics.mean(latencies)
    min_latency = min(latencies)
    max_latency = max(latencies)
    std_dev = statistics.stdev(latencies) if len(latencies) > 1 else 0.0
    
    # NFR-001 Compliance Evaluation
    nfr_compliant = "PASSED" if avg_latency <= 3.5 else "FAILED"
    
    # Generate the final clean performance evaluation report
    print("\n======================================================================")
    print("                      SYSTEM PERFORMANCE REPORT                       ")
    print("======================================================================")
    print(f"Total Completed Trials : {len(latencies)} / {NUM_TRIALS}")
    print(f"Average Response Time  : {avg_latency:.3f} seconds")
    print(f"Minimum Response Time  : {min_latency:.3f} seconds")
    print(f"Maximum Response Time  : {max_latency:.3f} seconds")
    print(f"Standard Deviation     : {std_dev:.3f} seconds")
    print(f"NFR-001 Target Status  : {nfr_compliant} (Target: < 3.5s)")
    print("======================================================================")

if __name__ == "__main__":
    run_performance_test()