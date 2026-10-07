# WOGAA Sentiments Widget and Report a Problem
# Defects & Observations

Exploratory testing identified one functional validation defect and three minor mobile-web consistency/UX observations. The functional defect allows whitespace-only mandatory problem details to be submitted. The mobile observations do not block submission, but they may affect consistency and user clarity.

# 1. Mandatory problem details accept whitespace-only input

Area: Report a Problem – Web
Classification: Functional / Input Validation Defect
Severity: Medium
Actual behaviour: When the mandatory Problem Details field contains only whitespace characters, the Submit button becomes enabled and the user can submit the report.
Expected behaviour: Whitespace-only input should be treated as empty. Submit should remain disabled until meaningful problem details are entered.
Impact: The mandatory-field validation can be bypassed, allowing effectively empty or unusable problem reports to be submitted. This is primarily a data-quality defect.

# 2. “Tell us more” heading is missing on Mobile Web

Area: Sentiments – Mobile Web
Classification: UI / Consistency Observation
Severity: Low
Observation: The desktop Sentiments flow displays the heading "Tell us more", while the equivalent heading is not shown in the mobile question-by-question flow.
Impact: Minor visual and content consistency difference between desktop and mobile-web experiences.

# 3. “Informational Services” label inconsistency on Mobile Web

Area: Sentiments – Mobile Web
Classification: Content / UI Consistency Observation
Severity: Low
Observation: The "Informational Servicess" label is displayed with inconsistent or incorrect wording in the mobile version compared with the expected configured label.
Expected behaviour: The same configured label should be displayed consistently across desktop and mobile web.
Impact: Minor content-quality and consistency issue. 

# 4. Final mobile action shows NEXT instead of SUBMIT
Area: Sentiments – Mobile Web
Classification: UX / Consistency Observation
Severity: Low
Observation: On the final mobile feedback step (4 of 4), the action button is still labelled NEXT. There is no explicit SUBMIT action shown to the user.
Behaviour verified: Clicking the final NEXT action successfully submits the feedback and displays the acknowledgement.
Impact: The wording may be slightly misleading because users are not explicitly informed that the final NEXT action will submit their feedback.

## Submission verification (after base64 decoding)

```json
{
  "category": "Sentiments",
  "action": "completeFeedback",
  "property": "expectedFeedbackCount",
  "value": 4,
  "questionConfigId": 367
}
```

# SUMMARY

One functional validation defect and three low-severity mobile-web consistency/UX observations were identified. The mobile feedback flow remains functional, including successful submission through the final NEXT action.
