# Staff Hours Calendar - Quick Reference Guide

## Color Legend

### 🔵 Dark Blue (bg-blue-500)
**Billed/Completed**
- Hours that have been pre-billed to the client AND completed by staff
- Revenue is secured and work is delivered
- This is ideal state for past work

### 🔷 Light Blue (bg-blue-300)
**Billed/Assigned**
- Hours that have been pre-billed to the client but NOT yet completed
- Revenue is secured but work is still pending
- Staff needs to complete these hours to fulfill billing commitment

### 🟢 Green (bg-green-500)
**Unbilled/Completed**
- Hours completed by staff but NOT yet billed to client
- Work is finished and ready to be invoiced
- This is revenue waiting to be recognized
- **KEY METRIC**: This directly contributes to next billing cycle

### 🟡 Yellow (bg-yellow-400)
**Unbilled/Assigned**
- Hours assigned to staff but NOT yet completed or billed
- Work is scheduled for the future
- Will become billable once completed

### ⚪ Gray (bg-gray-200)
**Unassigned**
- No work scheduled for this hour slot
- Available capacity for new assignments

---

## Abbreviation Reference

### In Calendar Day Cells:
- **BA** = Billed Assigned (hours)
- **BC** = Billed Completed (hours)
- **UA** = Unbilled Assigned (hours)
- **UC** = Unbilled Completed (hours)
- **V** = Variance (Unbilled Completed - Unbilled Assigned)

### In Summary Sections:

#### Billed Hours Section (Blue):
- **Assigned**: Total hours pre-billed and assigned
- **Completed**: Total hours pre-billed and completed

#### Unbilled Hours Section (Green):
- **Assigned**: Total hours assigned but not billed
- **Completed**: Total hours completed but not billed (ready for next invoice)

#### Variance Analysis Section (Purple):
- **Overall**: Total variance across all hours (Completed - Assigned)
- **Unbilled**: Variance in unbilled hours (critical for next billing cycle)

---

## Understanding Variance

### Overall Variance
`Total Completed - Total Assigned`

- **Positive (+)**: Staff worked MORE hours than assigned (over-delivery)
  - Green color
  - Potential for additional revenue
  - May indicate scope creep or efficiency issues
  
- **Negative (-)**: Staff worked FEWER hours than assigned (under-delivery)
  - Red color
  - Potential revenue loss
  - May indicate capacity issues or blocking problems

### Unbilled Variance
`Unbilled Completed - Unbilled Assigned`

- **Positive (+)**: Extra completed work ready to bill
  - Additional revenue opportunity in next cycle
  
- **Negative (-)**: Assigned work not yet completed
  - Expected future work completion

---

## Reading the Calendar

### Example Day Cell:
```
┌─────────────────────┐
│ 15          +2      │ ← Day 15, Overall variance +2 hours
│ ████████████        │ ← 8 hourly slots (color-coded)
│ BA: 6h    BC: 5h    │ ← 6h billed/assigned, 5h billed/completed
│ UA: 2h    UC: 3h    │ ← 2h unbilled/assigned, 3h unbilled/completed
│      V: +1h         │ ← Unbilled variance: +1h (ready to bill next cycle)
└─────────────────────┘
```

**Interpretation**:
1. **6 hours** were pre-billed to client for this day
2. Staff completed **5 hours** of that pre-billed work (1 hour short)
3. Staff also had **2 hours** assigned but not pre-billed
4. Staff completed **3 hours** of unbilled work (1 hour over)
5. **Total work**: 8 hours completed out of 8 assigned
6. **Next billing**: 3 hours of completed work ready to invoice

---

## Business Use Cases

### For HR Managers:
- **Blue hours**: Check if pre-billed work is being delivered
- **Green hours**: Identify revenue ready for next invoice
- **Yellow hours**: Plan future work completion
- **Variance**: Monitor over/under delivery patterns

### For Finance:
- **Billed Completed**: Revenue recognized and delivered
- **Unbilled Completed**: Revenue to recognize in next cycle
- **Billed Assigned**: Future work liability (already paid)
- **Variance**: Adjustments needed for next billing

### For Operations:
- **Total Assigned**: Capacity committed
- **Total Completed**: Actual productivity
- **Unbilled Assigned**: Future work pipeline
- **Color distribution**: Work flow efficiency

---

## Smart Filtering Tips

### Find Revenue Opportunities:
Look for cells with high **UC (Unbilled Completed)** values - these are billable hours ready to invoice.

### Identify Risk:
Look for cells with high **BA (Billed Assigned)** but low **BC (Billed Completed)** - pre-billed work not being delivered.

### Track Next Cycle:
Focus on **Unbilled Variance (V)** - positive values indicate extra billable work completed.

### Manage Capacity:
Gray slots = available capacity for new assignments.


