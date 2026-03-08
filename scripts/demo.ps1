# Demo script (PowerShell)
Invoke-RestMethod http://localhost:4000/health

# Attempt conflicting allocation (should return error)
try {
  Invoke-RestMethod -Method Post -Uri http://localhost:4000/allocations -ContentType 'application/json' -Body (@{
    resourceType='person'; resourceId='tech-alex'; workOrderId='wo2'; start='2026-03-08T09:00:00.000Z'; end='2026-03-08T10:30:00.000Z'
  } | ConvertTo-Json)
} catch {
  Write-Host "Expected conflict detected"
}

# Work order invoice generation flow (wo2 is seeded as completed)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/work-orders/wo2/invoice -ContentType 'application/json' -Body '{}'
