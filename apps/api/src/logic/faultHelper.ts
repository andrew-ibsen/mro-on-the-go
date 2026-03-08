import { nanoid } from 'nanoid';
import type { FaultGuidance } from '@ops/shared';

export function runFaultHelper(discrepancy: string, filenames: string[]): FaultGuidance {
  const keywords = discrepancy.toLowerCase();
  const causes = [
    keywords.includes('hydraulic') ? 'Hydraulic pressure leak or pump inefficiency' : 'Intermittent sensor degradation',
    keywords.includes('elect') || keywords.includes('avion')
      ? 'Electrical connector corrosion or loose pin'
      : 'Procedural mismatch from deferred maintenance',
    'Historical repeat defect pattern in same ATA chapter'
  ];

  const diagnostics = [
    'Review AMM task card and last 3 technical records for repeat findings',
    'Perform targeted inspection and continuity checks on affected zone',
    filenames.length
      ? `Correlate uploaded evidence (${filenames.join(', ')}) with troubleshooting matrix`
      : 'Capture photos/scan evidence and correlate with troubleshooting matrix'
  ];

  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    discrepancy,
    probableCauses: causes,
    diagnosticSteps: diagnostics,
    recommendedActions: [
      'Isolate fault to LRU or wiring segment before replacement',
      'Apply minimum equipment list constraints check',
      'Escalate to structures/avionics specialist if no-fault-found after test'
    ],
    confidence: 0.76,
    explainability: [
      'Rule set matched discrepancy keywords and prior defect archetypes.',
      'Confidence adjusted by evidence quality and attachment presence.',
      'Recommendations prioritize lowest-risk diagnostic path first.'
    ]
  };
}

export function mockSmsSend(recipient: string, body: string): string {
  return `[MOCK SMS to ${recipient}] ${body}`;
}
