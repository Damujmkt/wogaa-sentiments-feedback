@sentiments @web
Feature: Sentiments feedback
  As a user of a WOGAA-enabled website
  I want to provide feedback about my website experience
  So that the agency can understand and improve the digital service

  Background:
    Given the user is on the WOGAA test website
    And the Sentiments widget is available

  @smoke @ui @sentiments-tc-01
  Scenario: Display the Sentiments feedback widget
    When I open the Sentiments widget
    Then the feedback widget should be displayed
    And the configured "widget" heading should be displayed
    And the configured "rating" question should be displayed
    And all configured rating options should be available
    And rating 1 should represent configured "not_satisfied" label
    And rating 6 should represent configured "very_satisfied" label
    And the configured Report a problem option should be displayed

  @regression @rating
  Scenario Outline: Allow the user to select every supported rating
    When I open the Sentiments widget
    And the user selects rating <rating>
    Then rating <rating> should be selected
    And the configured "feedback" form should be displayed

    Examples:
      | rating |
      | 1      |
      | 2      |
      | 3      |
      | 4      |
      | 5      |
      | 6      |

  @regression @rating @negative_feedback
  Scenario Outline: Display negative feedback categories for low ratings
    When I open the Sentiments widget
    And the user selects rating <rating>
    Then the configured "category" question should be displayed
    And all configured "low" feedback categories should be available

    Examples:
      | rating |
      | 1      |
      | 2      |
      | 3      |
      | 4      |

  @regression @rating @positive_feedback
  Scenario Outline: Display positive feedback categories for high ratings
    When I open the Sentiments widget
    And the user selects rating <rating>
    Then the configured "category" question should be displayed
    And all configured "high" feedback categories should be available

    Examples:
      | rating |
      | 5      |
      | 6      |

  @smoke @regression @category
  Scenario: Select a single feedback category
    Given the user has selected rating 2
    When the user selects feedback category "technical_errors"
    Then the feedback category "technical_errors" should be selected

  @regression @category
  Scenario: Select multiple feedback categories
    Given the user has selected rating 2
    When the user selects the following feedback categories:
      | categoryKey           |
      | difficult_to_navigate |
      | content_not_clear     |
      | website_loaded_slowly |
    Then all selected feedback categories should remain selected

  @regression @category
  Scenario: Deselect a previously selected feedback category
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    When the user deselects feedback category "technical_errors"
    Then the feedback category "technical_errors" should be unselected

  @regression @conditional
  Scenario Outline: Display elaboration field when Other is selected
    Given the user has selected rating <rating>
    When the user selects feedback category "other"
    Then the Other elaboration field should be displayed
    And the Other elaboration field should be mandatory

    Examples:
      | rating |
      | 2      |
      | 5      |

  @negative @validation @conditional
  Scenario: Prevent submission when Other is selected without elaboration
    Given the user has selected rating 2
    And the user selects feedback category "other"
    And the Other elaboration field is empty
    Then the Submit button should be disabled

  @regression @conditional
  Scenario: Enable submission after providing Other elaboration
    Given the user has selected rating 2
    And the user selects feedback category "other"
    When the user enters "Unable to complete my activity" in the Other elaboration field
    Then the Other elaboration should contain "Unable to complete my activity"
    And the Submit button should be enabled

  @regression @conditional
  Scenario: Remove Other dependency when Other category is deselected
    Given the user has selected rating 2
    And the user selects feedback category "other"
    And the user enters "Navigation issue" in the Other elaboration field
    When the user deselects feedback category "other"
    Then the Other elaboration field should not be required

  @negative @validation
  Scenario Outline: Prevent feedback submission without a mandatory category
    Given the user has selected rating <rating>
    And no feedback category is selected
    Then the Submit button should be disabled

    Examples:
      | rating |
      | 1      |
      | 4      |
      | 5      |
      | 6      |

  @regression @optional
  Scenario: Display optional areas of interest
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    Then the configured "interests" question should be displayed as optional
    And all configured interest options should be available

  @regression @optional
  Scenario: Select multiple areas of interest
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    When the user selects the following interests:
      | interestKey            |
      | informational_services |
      | transactional_services |
      | mobile_applications    |
    Then all selected interests should remain selected

  @regression @optional
  Scenario: Allow feedback submission without selecting an area of interest
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    And no area of interest is selected
    Then the Submit button should be enabled

  @regression @optional @input
  Scenario: Display optional free-text feedback field
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    Then the configured "free_text_low" question should be displayed as optional
    And the feedback text field should display the configured "feedback" placeholder
    And the feedback character counter should show the configured default value

  @regression @input
  Scenario: Enter optional free-text feedback
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    When the user enters "Testing this feedback form" in the optional feedback field
    Then the optional feedback field should contain "Testing this feedback form"
    And the character counter should reflect the entered text length

  @regression @boundary @input
  Scenario Outline: Validate optional feedback character limit
    Given the user has selected rating 6
    And the user has selected feedback category "website_is_great"
    When the user enters feedback text at the "<boundary>" boundary
    Then the feedback character count should match the "<boundary>" boundary
    And the feedback Submit button should become <buttonState>

    Examples:
      | boundary  | buttonState |
      | min       | enabled     |
      | below_max | enabled     |
      | max       | enabled     |
      | above_max | disabled    |

  @regression @optional @email
  Scenario: Allow feedback submission without an email address
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    And the email field is empty
    Then the Submit button should be enabled

  @regression @email
  Scenario Outline: Accept valid email addresses
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    When the user enters "<email>" in the email field
    Then no email validation error should be displayed
    And the Submit button should be enabled

    Examples:
      | email                        |
      | user@example.com             |
      | qa.test@wogaa.gov.sg         |
      | test.user+feedback@gmail.com |

  @negative @validation @email
  Scenario Outline: Reject invalid email addresses
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    When the user enters "<email>" in the email field
    Then the configured email validation message should be displayed
    And the Submit button should be disabled

    Examples:
      | email         |
      | @gmail.com    |
      | user@         |
      | usergmail.com |
      | user@.com     |

  @smoke @e2e @negative_feedback
  Scenario: Submit complete feedback for an unsatisfactory experience
    When I open the Sentiments widget
    And the user selects rating 2
    And the user selects the following feedback categories:
      | categoryKey           |
      | difficult_to_navigate |
      | website_loaded_slowly |
      | other                 |
    And the user enters "The page was difficult to use" in the Other elaboration field
    And the user selects interest "informational_services"
    And the user enters "Navigation and page loading need improvement" in the optional feedback field
    And the user enters "qa.user@example.com" in the email field
    And the user submits the feedback
    Then the configured success acknowledgement should be displayed

  @smoke @e2e @positive_feedback
  Scenario: Submit complete feedback for a satisfactory experience
    When I open the Sentiments widget
    And the user selects rating 6
    And the user selects the following feedback categories:
      | categoryKey          |
      | content_was_clear    |
      | website_loaded_fast  |
      | easy_to_navigate     |
      | easy_to_find_content |
    And the user selects interest "transactional_services"
    And the user submits the feedback
    Then the configured success acknowledgement should be displayed

  @regression @submission
  Scenario Outline: Submit feedback using only mandatory information
    When I open the Sentiments widget
    And the user selects rating <rating>
    And the user selects feedback category "<categoryKey>"
    And the user submits the feedback
    Then the configured success acknowledgement should be displayed

    Examples:
      | rating | categoryKey           |
      | 1      | technical_errors      |
      | 4      | difficult_to_navigate |
      | 5      | content_was_clear     |
      | 6      | easy_to_navigate      |

  @regression @form_state
  Scenario: Close the feedback form without submitting
    Given the user has selected rating 2
    And the user has selected feedback category "technical_errors"
    And the user enters "Temporary feedback" in the optional feedback field
    When the user closes the feedback form
    Then the feedback form should not be displayed

  @regression @form_state
  Scenario: Start a fresh feedback session after successful submission
    Given the user has selected rating 5
    And the user has selected feedback category "content_was_clear"
    When the user submits the feedback
    Then the configured success acknowledgement should be displayed
    When the user starts a fresh Sentiments session
    Then the rating selection screen should be displayed
    And no rating should be selected
