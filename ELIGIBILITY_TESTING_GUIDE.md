# Testing the Advanced Eligibility Checker

## Test URL
http://localhost:5173/eligibility

## Test Scenarios

### Test 1: Female SC Student from Gujarat
**Expected**: Should show education/scholarship schemes for SC students

**Input**:
- Step 1: 
  - Gender: Female
  - Age: 18
  - Marital Status: Never Married
- Step 2:
  - State: Gujarat
  - Residence: Urban
- Step 3:
  - Caste: Scheduled Caste (SC)
  - Minority: No
- Step 4:
  - Disability: No
  - BPL: No
  - Income: 250000
- Step 5:
  - Student: Yes

**Expected Results**:
- Should filter schemes with `requires_student: true`
- Should show schemes available in Gujarat or All India
- Should prioritize SC-specific schemes
- Should show female-focused schemes
- High match scores (60-100) for exact matches

---

### Test 2: Farmer with Disability
**Expected**: Should show agriculture schemes for disabled persons

**Input**:
- Step 1:
  - Gender: Male
  - Age: 45
  - Marital Status: Married
- Step 2:
  - State: Maharashtra
  - Residence: Rural
- Step 3:
  - Caste: General
  - Minority: No
- Step 4:
  - Disability: Yes
  - Disability %: 50
  - BPL: No
  - Income: (leave blank)
- Step 5:
  - Student: No
  - Employment: Self-Employed
  - Occupation: Farmer

**Expected Results**:
- Should show agriculture schemes
- Should show disability schemes requiring 40%+ or Any Disability
- Rural-focused schemes should score higher
- Maharashtra-specific + All India schemes only

---

### Test 3: BPL Family Member
**Expected**: Should show poverty alleviation schemes

**Input**:
- Step 1:
  - Gender: Female
  - Age: 35
  - Marital Status: Widowed
- Step 2:
  - State: Bihar
  - Residence: Rural
- Step 3:
  - Caste: Scheduled Tribe (ST)
  - Minority: No
- Step 4:
  - Disability: No
  - BPL: Yes
  - Income: 50000
- Step 5:
  - Student: No
  - Employment: Unemployed
  - Occupation: (leave blank)

**Expected Results**:
- Should show only schemes with `bpl_applicable: true`
- High match scores for widows/women schemes
- ST-specific schemes should appear
- Income-based schemes should match

---

### Test 4: Young Professional in IT
**Expected**: Should show skill development, employment schemes

**Input**:
- Step 1:
  - Gender: Male
  - Age: 25
  - Marital Status: Never Married
- Step 2:
  - State: Karnataka
  - Residence: Urban
- Step 3:
  - Caste: General
  - Minority: No
- Step 4:
  - Disability: No
  - BPL: No
  - Income: 500000
- Step 5:
  - Student: No
  - Employment: Employed
  - Occupation: (leave blank)

**Expected Results**:
- General schemes for all categories
- Urban-focused schemes
- Karnataka + All India schemes
- Youth-focused schemes (age 18-30)

---

### Test 5: Senior Citizen with Disability
**Expected**: Should show pension, disability, senior citizen schemes

**Input**:
- Step 1:
  - Gender: Male
  - Age: 65
  - Marital Status: Married
- Step 2:
  - State: Tamil Nadu
  - Residence: Urban
- Step 3:
  - Caste: Other Backward Class (OBC)
  - Minority: No
- Step 4:
  - Disability: Yes
  - Disability %: 75
  - BPL: No
  - Income: 100000
- Step 5:
  - Student: No
  - Employment: Unemployed
  - Occupation: (leave blank)

**Expected Results**:
- Schemes for seniors (age 60+)
- Severe disability schemes (60-79%)
- OBC-specific schemes
- Social welfare schemes

---

## What to Verify

### ✅ Form Validation
- [ ] Age field accepts only numbers
- [ ] Age validation shows error for invalid values (negative, >120)
- [ ] Income field accepts only numbers
- [ ] Disability % accepts 1-100 only
- [ ] Required fields prevent next step until filled
- [ ] Progress bar updates correctly (20%, 40%, 60%, 80%, 100%)

### ✅ Smart Matching
- [ ] Student = Yes → Only shows schemes with `requires_student: true`
- [ ] BPL = Yes → Only shows schemes with `bpl_applicable: true`
- [ ] Disability → Matches percentage requirements correctly
- [ ] Age → Filters by age_criteria.min and age_criteria.max
- [ ] State → Shows state-specific + All India schemes only
- [ ] Income → Filters by income_criteria.max

### ✅ Result Display
- [ ] Shows total count of eligible schemes
- [ ] Schemes sorted by match score (highest first)
- [ ] High match (60%+) shown with green border and badge
- [ ] Medium match (30-59%) shown with blue border and badge
- [ ] Low match (10-29%) shown with gray border
- [ ] Match reasons displayed for high/medium matches
- [ ] Each scheme card shows:
  - [ ] Match percentage badge
  - [ ] Scheme name
  - [ ] Matching reasons (checkmarks)
  - [ ] Brief description
  - [ ] State/location
  - [ ] "View Details" link

### ✅ Navigation
- [ ] Previous button disabled on step 1
- [ ] Next button enabled only when required fields filled
- [ ] "Find My Schemes" button on final step
- [ ] "Check Again" button resets form and returns to step 1
- [ ] Clicking scheme card navigates to scheme detail page

### ✅ Data Persistence
- [ ] Form data saved in localStorage
- [ ] Returning to page restores previous form data
- [ ] Results persist when navigating away and back

### ✅ Edge Cases
- [ ] Test with no matching schemes → Shows "No schemes found" message
- [ ] Test with age < 18 → Marital status not required
- [ ] Test Student = Yes → Employment/Occupation not shown
- [ ] Test with all fields blank except required → Shows general schemes

---

## Expected Behavior by Field

| User Input | Matching Logic | Notes |
|-----------|---------------|-------|
| Gender = Female | Filters schemes with `gender: ['Female']` or `['All']` | Hard requirement if specified |
| Age = 20 | Filters schemes where `age_criteria.min ≤ 20 ≤ age_criteria.max` | Hard requirement if specified |
| State = Gujarat | Filters schemes with `states: ['Gujarat']` or `['All India']` | Hard requirement unless All India |
| Caste = SC | Filters schemes with `caste_categories: ['SC']` or `['All']` | Hard requirement if specified |
| Student = Yes | Filters schemes with `requires_student: true` | Hard requirement |
| BPL = Yes | Filters schemes with `bpl_applicable: true` | Hard requirement |
| Disability = 50% | Matches schemes where `disability_percent.min ≤ 50` | Hard requirement if specified |
| Income = 300000 | Filters schemes where `income_criteria.max ≥ 300000` | Hard requirement if specified |
| Occupation = Farmer | Boosts schemes with `occupations: ['Farmer']` | Soft preference (+15 points) |
| Residence = Rural | Boosts schemes with `residence: ['Rural']` | Soft preference (+10 points) |

---

## Performance Benchmarks

- [ ] Form loads in < 1 second
- [ ] Each step transition is instant
- [ ] Result calculation completes in < 500ms
- [ ] Displaying 100+ schemes renders smoothly
- [ ] No console errors or warnings
- [ ] Mobile responsive on all screen sizes

---

## Screenshot Checklist

1. [ ] Empty form (Step 1)
2. [ ] Progress bar at 60%
3. [ ] Form validation error
4. [ ] High match results page
5. [ ] Single scheme card with match reasons
6. [ ] No results page
7. [ ] Mobile view of form
8. [ ] Mobile view of results
