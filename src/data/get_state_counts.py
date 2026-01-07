import json
from collections import Counter

with open('Final Dataset 0601.json', encoding='utf-8') as f:
    data = json.load(f)

# Get state counts
states = Counter(s.get('classified_state', 'Unknown') for s in data)

print(f"Total schemes: {len(data)}")
print(f"\nState counts (top 40):")
for state, count in sorted(states.items(), key=lambda x: -x[1])[:40]:
    print(f"  {state}: {count}")
