import os
import json

# ==============================================================================
# EMPIRICAL DATASET GENERATOR: SIMULATED PSYCHOANALYTIC CORPUS
# ==============================================================================
# This script programmatically instantiates the dream log corpus used to 
# evaluate the theoretical alignment of the LatentDream engine. It constructs
# a JSON-structured dataset of 30 unique, anonymized dream narratives reflecting 
# core thematic archetypes commonly observed in classical psychoanalysis 
# (e.g., phallic symbolism, somatic anxiety, regression, and repression).
# ==============================================================================

def generate_dream_corpus():
    # Define a collection of 30 distinct dream narratives for evaluation
    dream_dataset = [
        {"id": 1, "theme": "Anxiety (Teeth Falling Out)", "narrative": "I was standing in front of a mirror preparing for a presentation. When I opened my mouth, all of my teeth fell out into the sink. I felt a deep sense of shame and vulnerability."},
        {"id": 2, "theme": "Performance Inhibition (Exam)", "narrative": "I am back in university sitting at a desk. The professor hands out a calculus exam, but the paper is completely blank. I realize I have not attended a single class all semester."},
        {"id": 3, "theme": "Infantile Regression (Childhood Bedroom)", "narrative": "I am looking at my childhood bedroom, but everything is miniature. I am trying to fit myself into my old crib while my parents watch from the doorway without saying anything."},
        {"id": 4, "theme": "Somatic/Ego Suppression (Muted Scream)", "narrative": "A dark figure is slowly approaching me in an empty hallway. I open my mouth to scream for help, but absolutely no sound comes out. I am completely paralyzed."},
        {"id": 5, "theme": "Phallic Symbolism (Snake/Pillar)", "narrative": "I was walking through a dry, barren desert. Suddenly, a massive snake wrapped itself tightly around a marble pillar in the middle of the sand. I watched it in quiet fascination."},
        {"id": 6, "theme": "Ego Defense/Social Anxiety (Nakedness)", "narrative": "I walked into a critical business meeting with my bosses. Everyone was in formal suits, but I suddenly realized I was completely naked. I tried to cover myself with a small notebook."},
        {"id": 7, "theme": "Ego Boundary Loss (Endless Descent)", "narrative": "I am falling down a dark elevator shaft that has no bottom. I feel no wind or gravity, just a continuous, peaceful sinking into an endless black void."},
        {"id": 8, "theme": "Loss of Impulse Control (Runaway Vehicle)", "narrative": "I am driving a fast sports car down a steep winding mountain road. When I press down on the brake pedal, it is completely loose. I cannot stop the car as it speeds up."},
        {"id": 9, "theme": "Fear of Mortality (Missed Train)", "narrative": "I am running as fast as I can through an empty train station. I can see the train slowly pulling away from the platform, and I realize I will never be able to catch it."},
        {"id": 10, "theme": "Unconscious Exploration (Hidden Rooms)", "narrative": "I am exploring my house and find a dusty door behind a bookshelf. I open it and discover a massive, beautifully decorated wing of the house that I never knew existed."},
        {"id": 11, "theme": "Superego Judgment (Giant Eye)", "narrative": "I am walking through a busy city street, but the sky is replaced by a massive, unblinking human eye that watches every step I take. I feel incredibly guilty."},
        {"id": 12, "theme": "Instinctual Overwhelm (Tidal Wave)", "narrative": "I am standing on a quiet beach. In the distance, a massive tidal wave slowly rises. Instead of running, I stand still and watch as the dark water gets ready to swallow me."},
        {"id": 13, "theme": "Fixation (Spinning Clock)", "narrative": "I am sitting in an empty white room with an antique grandfather clock. The hands of the clock begin to spin backwards rapidly, and the room gets darker with every rotation."},
        {"id": 14, "theme": "Sublimation (Burning Building)", "narrative": "I am watching a beautiful old house burn down. The flames are bright orange and yellow, and I feel a strange, exciting warmth and comfort standing near it."},
        {"id": 15, "theme": "Oral-Incorporative Fixation (Endless Feast)", "narrative": "I am sitting at a massive banquet table piled high with sweet fruits and desserts. I eat constantly, but my stomach feels completely empty, and my hunger never stops."},
        {"id": 16, "theme": "Splitting/Identity (Distorted Mirror)", "narrative": "I look into a bathroom mirror, but the reflection is not mine. It is a completely different person who mimics my movements but looks at me with a cold, mocking grin."},
        {"id": 17, "theme": "Id-Ego Conflict (Trapped Elevator)", "narrative": "I am trapped in a very small, metal elevator. A large, wild tiger is sitting in the corner staring at me. I have to stand completely still so it doesn't attack."},
        {"id": 18, "theme": "Repressed Memories (Locked Chest)", "narrative": "I am swimming in deep water and find an old iron chest at the bottom of the lake. I have a tiny golden key in my hand, but I am terrified of what will happen if I open it."},
        {"id": 19, "theme": "Oedipal/Superego Conflict (Silent Father)", "narrative": "I am sitting at a table across from my father. He is staring at me in complete silence, holding an old book. I try to explain something to him, but he just shakes his head slowly."},
        {"id": 20, "theme": "Superego Pressure (Heavy Weight)", "narrative": "I am climbing up a steep, endless pyramid. I am carrying a heavy, rough stone on my shoulders, and the weight increases with every step I take toward the top."},
        {"id": 21, "theme": "Projection of Drives (Animal Birth)", "narrative": "I am helping a wild, injured wolf give birth in a dark forest. As the pup is born, it looks at me with human eyes and speaks my name in a whisper."},
        {"id": 22, "theme": "Ego Defense/Disguise (Heavy Fog)", "narrative": "I am trying to walk down a busy city street, but a thick, white fog rolls in. I can hear people laughing and talking all around me, but I cannot see anyone's face."},
        {"id": 23, "theme": "Ego Defense/Mask)", "narrative": "I am attending a masquerade ball. When I try to peel off my paper mask at the end of the night, I realize it has fused completely with the skin on my face."},
        {"id": 24, "theme": "Uterine Regression (Water Flood)", "narrative": "I am floating peacefully inside a warm, dark, flooded room. I can hear soft, muffled heartbeats echoing through the water, and I feel incredibly safe and relaxed."},
        {"id": 25, "theme": "Castration Anxiety (Shrinking Doorway)", "narrative": "I am trying to run through a doorway to escape a threat, but as I get closer, the wooden frame shrinks smaller and smaller until I cannot pass through it."},
        {"id": 26, "theme": "Split Ego (Mirror Self)", "narrative": "I am playing chess against myself, but my opponent is a physical copy of me. The other version of me is making moves that I do not expect and cannot predict."},
        {"id": 27, "theme": "Anal-Retentive Symbol (Cellar Hoard)", "narrative": "I am in a cold, dark cellar, burying small wooden boxes filled with gold coins into the dirt. I feel a strong, anxious need to make sure no one sees where they are hidden."},
        {"id": 28, "theme": "Wish-Fulfillment Ambivalence (Wedding/Funeral)", "narrative": "I am attending a wedding. As the bride walks down the aisle, her white dress turns black, the music stops, and the ceremony suddenly turns into a quiet funeral service."},
        {"id": 29, "theme": "Ego Block (Wrong Numbers)", "narrative": "I am in an emergency and desperately need to make a phone call. Every time I dial the digits, my fingers slip, or the screen changes, and I keep calling the wrong number."},
        {"id": 30, "theme": "Id Drive Conflict (Chased by Shadow)", "narrative": "I am running through an empty, narrow alleyway. A giant, dark shadow is chasing me. The faster I run, the closer the shadow gets, though it never actually touches me."}
    ]

    # Ensure the target directory exists in the backend application
    target_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(target_dir, exist_ok=True)

    # Export the dream logs to the target data directory
    output_path = os.path.join(target_dir, "dream_logs.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"test_cases": dream_dataset}, f, indent=4, ensure_ascii=False)

    print(f"[SUCCESS] Programmatic test corpus created successfully at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    generate_dream_corpus()