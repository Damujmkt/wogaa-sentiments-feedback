@report-problem @web
Feature: Report a problem

  Background:
    Given the user is on the WOGAA test website
    And the Sentiments widget is available
    When I open the Sentiments widget
    And the user opens the Report a problem form

  @smoke @ui @report-tc-01
  Scenario: Display Report a problem form with the expected default state
    Then the Report a problem form should be displayed
    And the problem details field should be empty
    And the configured problem details placeholder should be displayed
    And the character counter should show the configured default value
    And no screenshot should be attached
    And the confirmation checkbox should be unchecked
    And the Submit button should be displayed

  @regression @form_state
  Scenario: Discard unsent form data after closing and reopening the form
    When the user enters "Page is not displaying correctly" as problem details
    And the user uploads "valid-screenshot.png"
    And the user selects the confirmation checkbox
    And the user closes the Report a problem form
    When I open the Sentiments widget
    And the user opens the Report a problem form
    Then the problem details field should be empty
    And no screenshot should be attached
    And the confirmation checkbox should be unchecked

  @regression @input
  Scenario Outline: Accept valid problem description content
    When the user enters "<description>" as problem details
    Then the problem details should contain "<description>"
    And the user selects the confirmation checkbox
    Then the Submit button should become enabled

    Examples:
      | description                                        |
      | Unable to navigate to the Contact Us page          |
      | Error displayed after clicking Submit @ 10:30 AM   |
      | Page returned #404 - page_not_found ! @ $ % & ( ) |
      | Issue 12345 - Mixed CASE text                      |
      | 页面无法正常显示 - Telugu తెలుగు                      |

  @regression @boundary
  Scenario Outline: Enforce the 1000 character problem description limit
    When the user types <inputLength> characters into the problem details field
    Then the problem details should contain <acceptedLength> characters
    And the user selects the confirmation checkbox
    Then the Submit button should become <buttonState>

    Examples:
      | inputLength | acceptedLength | buttonState |
      | 1           | 1              | enabled     |
      | 999         | 999            | enabled     |
      | 1000        | 1000           | enabled     |
      | 1001        | 1001           | disabled    |

  @regression @upload
  Scenario Outline: Upload a supported screenshot format
    When the user uploads "<file>"
    Then one screenshot should be attached
    And the uploaded filename "<file>" should be displayed
    And a remove screenshot control should be available

    Examples:
      | file                  |
      | valid-screenshot.png  |
      | valid-screenshot.jpg  |
      | valid-screenshot.jpeg |

  @regression @negative @upload
  Scenario Outline: Reject invalid screenshot uploads
    When the user uploads invalid document "<file>"
    Then the configured upload error "<errorKey>" should be displayed
    And no screenshot should be attached
    And the Report a problem form should remain displayed

    Examples:
      | file                     | errorKey              |
      | invalid-file.pdf         | unsupported_file_type |
      | invalid-file.txt         | unsupported_file_type |
      | invalid-file.exe         | unsupported_file_type |
      | oversized-screenshot.png | file_too_large        |

  @regression @upload
  Scenario: Remove an uploaded screenshot
    Given the user has uploaded "valid-screenshot.png"
    When the user removes the uploaded screenshot
    Then no screenshot should be attached
    And the screenshot upload control should be available

  @regression @upload
  Scenario: Replace an uploaded screenshot
    Given the user has uploaded "valid-screenshot.png"
    When the user removes the uploaded screenshot
    And the user uploads "replacement-screenshot.jpg"
    Then one screenshot should be attached
    And the uploaded filename "replacement-screenshot.jpg" should be displayed
    And the filename "valid-screenshot.png" should not be displayed as an attached screenshot

  @regression @negative @validation
  Scenario Outline: Prevent submission when mandatory conditions are not satisfied
    Given the problem details state is "<descriptionState>"
    And the screenshot state is "<screenshotState>"
    And the confirmation checkbox state is "<confirmationState>"
    Then the Submit button should become disabled
    And the problem report should not be submitted
    And the Report a problem form should remain displayed

    Examples:
      | descriptionState | screenshotState | confirmationState |
      | empty            | none            | unchecked         |
      | empty            | valid           | checked           |
      | valid            | none            | unchecked         |

  @manual @known-defect @validation
  Scenario: Whitespace-only mandatory problem details should not allow submission
    Given the problem details state is "whitespace"
    And the screenshot state is "none"
    And the confirmation checkbox state is "checked"
    Then the Submit button should become disabled

  @smoke @submission
  Scenario Outline: Successfully submit a valid problem report
    Given the user enters "<description>" as problem details
    And the screenshot state is "<screenshotState>"
    And the user selects the confirmation checkbox
    When the user submits the problem report
    Then the configured Report a problem success acknowledgement should be displayed

    Examples:
      | description                          | screenshotState |
      | Reporting problem in giving feedback | valid           |
      | Reporting without document upload    | none            |

  @regression @submission @form_state
  Scenario: Reset the Report a problem form after successful submission
    Given the user enters "Unable to open the requested page" as problem details
    And the screenshot state is "valid"
    And the user selects the confirmation checkbox
    When the user submits the problem report
    Then the configured Report a problem success acknowledgement should be displayed
    When I open the Sentiments widget
    And the user opens the Report a problem form
    Then the problem details field should be empty
    And no screenshot should be attached
    And the confirmation checkbox should be unchecked
