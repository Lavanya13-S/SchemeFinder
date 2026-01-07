import json

with open('Final Dataset 0601.json', encoding='utf-8') as f:
    data = json.load(f)

# Check different criteria for "central" schemes
all_india = 0
has_ministry = 0
ministry_starts_with = 0

for scheme in data:
    states = scheme.get('states', [])
    ministry = scheme.get('ministry', [])
    
    # Check if "All India" in states
    if 'All India' in states:
        all_india += 1
    
    # Check if has any ministry
    if ministry and len(ministry) > 0:
        has_ministry += 1
        
        # Check if ministry starts with "Ministry"
        if any(m and str(m).startswith('Ministry') for m in ministry):
            ministry_starts_with += 1

print(f"Schemes with 'All India' in states: {all_india}")
print(f"Schemes with any ministry: {has_ministry}")
print(f"Schemes with ministry starting with 'Ministry': {ministry_starts_with}")

# Show sample
sample = [s for s in data if s.get('ministry') and len(s.get('ministry', [])) > 0][:3]
print("\nSample schemes with ministries:")
for s in sample:
    print(f"  - {s.get('scheme_name', 'Unknown')[:50]}")
    print(f"    Ministry: {s.get('ministry')}")
    print(f"    States: {s.get('states')}")
