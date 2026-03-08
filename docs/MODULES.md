# Module-Level Notes

## Stores Keeper
- Track parts with min levels
- Issue/return validations prevent negative stock

## Tool Control
- Tool issue/return state machine (available/issued/calibration_due)

## Work Orders + Billing
- Status transitions enforced by rule set
- Invoice generated from labor + parts + surcharge

## Experience Logs
- Tracks technician practical time entries for skills and aircraft type exposure

## Technical Records
- File-backed records linked to work orders (photos/scans/docs)

## Planner
- Overlap conflict logic across shared resource IDs
- Gantt-like visual timeline in web app

## Fault-Finding Helper
- Mock NLP/heuristic analysis from discrepancy text
- Explainability and recommendations persisted to work order `faultTrail`
- Mock SMS summary generated for shift supervision
