export const REPORT_PROBLEM = {
  fixtureDirectory: 'test-data/report-problem',
  labels: {
    trigger: 'Report a problem',
  },
  placeholders: {
    details: 'Type your reply here',
  },
  counters: {
    empty: '0/1000 characters',
  },
  messages: {
    unsupported_file_type: 'Unsupported file type. Please upload a JPG, JPEG, or PNG file.',
    file_too_large: 'File size exceeds 5MB. Please upload a smaller file',
    success: 'Thank you for reporting the issue',
  },
  validDescription: 'Page is not displaying correctly',
  validScreenshot: 'valid-screenshot.png',
} as const;

export type ReportProblemMessageKey = keyof typeof REPORT_PROBLEM.messages;

export function getReportProblemMessage(key: string): string {
  const value = REPORT_PROBLEM.messages[key as ReportProblemMessageKey];
  if (!value) {
    throw new Error(`Unknown Report a problem message key: "${key}".`);
  }
  return value;
}

export const BUTTON_STATES: Record<string, boolean> = {
  enabled: true,
  disabled: false,
};
