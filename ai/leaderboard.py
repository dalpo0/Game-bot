# Simple ranking algorithm
import json
import numpy as np

def calculate_rank(scores):
    """AI-powered ranking with numpy"""
    arr = np.array(scores)
    return np.argsort(-arr).tolist()  # Descending order

if __name__ == "__main__":
    with open('public/assets/leaderboard.json', 'r') as f:
        data = json.load(f)
    
    ranks = calculate_rank([p["score"] for p in data["players"]])
    
    # Update ranks
    for i, rank in enumerate(ranks):
        data["players"][rank]["rank"] = i + 1
    
    with open('public/assets/leaderboard.json', 'w') as f:
        json.dump(data, f)
