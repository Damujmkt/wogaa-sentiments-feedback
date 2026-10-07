export type RatingGroup = 'low' | 'high';

export const SENTIMENTS = {
  rating: {
    min: 1,
    max: 6,
  },
  headings: {
    widget: 'Give us feedback',
    feedback: 'Tell us more',
  },
  questions: {
    rating: 'Rate your experience with this website',
    category: 'Which areas contributed to your rating today?',
    interests: 'Which are you interested in?',
    free_text_low: 'What did you like least?',
    free_text_high: 'What did you like most?',
  },
  labels: {
    trigger: 'Help us improve',
    not_satisfied: 'NOT SATISFIED',
    very_satisfied: 'VERY SATISFIED',
    report_problem: 'Report a problem',
    submit: 'SUBMIT',
    email: 'Email',
  },
  placeholders: {
    feedback: 'Type your reply here',
    otherElaboration: 'Elaborate here',
  },
  messages: {
    email_validation: 'Please enter a valid email address.',
    success: 'Thank you for your feedback!',
  },
  feedbackMaxLength: 255,
};

export const feedbackCategories: Record<string, string> = {
  difficult_to_navigate: 'Difficult to navigate',
  couldnt_find_content: "Couldn't find content",
  content_not_clear: 'Content not clear',
  website_loaded_slowly: 'Website loaded slowly',
  technical_errors: 'Technical errors',
  content_was_clear: 'Content was clear',
  website_loaded_fast: 'Website loaded fast',
  website_is_great: 'Website is great',
  easy_to_navigate: 'Easy to navigate',
  easy_to_find_content: 'Easy to find content',
  other: 'Other',
};

export const feedbackOptions: Record<RatingGroup, readonly string[]> = {
  low: [
    feedbackCategories.website_loaded_slowly,
    feedbackCategories.content_not_clear,
    feedbackCategories.couldnt_find_content,
    feedbackCategories.difficult_to_navigate,
    feedbackCategories.technical_errors,
    feedbackCategories.other,
  ],
  high: [
    feedbackCategories.website_loaded_fast,
    feedbackCategories.easy_to_find_content,
    feedbackCategories.website_is_great,
    feedbackCategories.easy_to_navigate,
    feedbackCategories.content_was_clear,
    feedbackCategories.other,
  ],
};

export const interestOptions: Record<string, string> = {
  informational_services: 'Informational Services',
  transactional_services: 'Transactional Services',
  mobile_applications: 'Mobile Applications',
};

// Mobile UI currently renders this label differently from desktop.
const mobileInterestOverrides: Record<string, string> = {
  informational_services: 'Informational Servicess',
};

export const FEEDBACK_BUTTON_STATES: Record<string, boolean> = {
  enabled: true,
  disabled: false,
};

export const FEEDBACK_BOUNDARIES: Record<string, number> = {
  min: 1,
  below_max: SENTIMENTS.feedbackMaxLength - 1,
  max: SENTIMENTS.feedbackMaxLength,
  above_max: SENTIMENTS.feedbackMaxLength + 1,
};

function configuredValue(
  values: Record<string, string>,
  key: string,
  valueType: string,
): string {
  const value = values[key];
  if (value !== undefined) {
    return value;
  }

  throw new Error(
    `Unsupported ${valueType}: "${key}". Supported values: ${Object.keys(values).join(', ')}`,
  );
}

export function getFeedbackCategoryLabel(key: string): string {
  return configuredValue(feedbackCategories, key, 'feedback category');
}

export function getInterestLabel(key: string, mobile = false): string {
  const desktopLabel = configuredValue(interestOptions, key, 'interest');
  return mobile ? mobileInterestOverrides[key] ?? desktopLabel : desktopLabel;
}

export function getQuestionText(key: string): string {
  return configuredValue(SENTIMENTS.questions, key, 'question');
}

export function getHeadingText(key: string): string {
  return configuredValue(SENTIMENTS.headings, key, 'heading');
}

export function getLabelText(key: string): string {
  return configuredValue(SENTIMENTS.labels, key, 'label');
}

export function getPlaceholderText(key: string): string {
  return configuredValue(SENTIMENTS.placeholders, key, 'placeholder');
}

export function getMessageText(key: string): string {
  return configuredValue(SENTIMENTS.messages, key, 'message');
}

export function getFeedbackBoundaryLength(key: string): number {
  const value = FEEDBACK_BOUNDARIES[key];
  if (value === undefined) {
    throw new Error(
      `Unsupported feedback boundary: "${key}". Supported values: ${Object.keys(FEEDBACK_BOUNDARIES).join(', ')}`,
    );
  }
  return value;
}
