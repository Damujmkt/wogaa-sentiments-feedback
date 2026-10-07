@sentiments @mobile
Feature: Sentiments feedback - mobile web
  As a mobile web user
  I want to provide feedback one question at a time
  So that I can complete the Sentiments flow on a mobile device

  Background:
    Given the user is on the WOGAA test website
    And the Sentiments widget is available

  @smoke @mobile-e2e @tc-mob-01
  Scenario: Submit low-rating feedback successfully on mobile
    When I open the Sentiments widget
    And the user selects rating 1
    Then all configured "low" feedback categories should be available
    And mobile feedback step "1 of 4" should be displayed
    When the user selects feedback category "technical_errors"
    And the user continues to the next mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    Then the configured success acknowledgement should be displayed

  @smoke @mobile-e2e @tc-mob-02
  Scenario: Submit high-rating feedback successfully on mobile
    When I open the Sentiments widget
    And the user selects rating 6
    Then all configured "high" feedback categories should be available
    And mobile feedback step "1 of 4" should be displayed
    When the user selects feedback category "content_was_clear"
    And the user continues to the next mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    Then the configured success acknowledgement should be displayed

  @regression @mobile-e2e @tc-mob-03
  Scenario: Display feedback questions sequentially on mobile
    When I open the Sentiments widget
    And the user selects rating 5
    Then mobile feedback step "1 of 4" should be displayed
    When the user selects feedback category "content_was_clear"
    And the user continues to the next mobile question
    Then mobile feedback step "2 of 4" should be displayed
    When the user skips the optional mobile question
    Then mobile feedback step "3 of 4" should be displayed
    When the user skips the optional mobile question
    Then mobile feedback step "4 of 4" should be displayed

  @regression @validation @tc-mob-04
  Scenario: Enforce the mandatory feedback category on mobile
    When I open the Sentiments widget
    And the user selects rating 1
    Then mobile feedback step "1 of 4" should be displayed
    And the mobile NEXT button should be disabled
    When the user selects feedback category "technical_errors"
    Then the mobile NEXT button should be enabled

  @regression @other @tc-mob-05
  Scenario: Submit feedback using Other category on mobile
    When I open the Sentiments widget
    And the user selects rating 5
    And the user selects feedback category "other"
    And the user enters "Other feedback from mobile user" in the Other elaboration field
    And the user continues to the next mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    And the user skips the optional mobile question
    Then the configured success acknowledgement should be displayed

  @regression @mobile-e2e @tc-mob-06
  Scenario: Submit complete feedback with optional information on mobile
    When I open the Sentiments widget
    And the user selects rating 6
    And the user selects feedback category "content_was_clear"
    And the user continues to the next mobile question
    And the user selects mobile interest "informational_services"
    And the user continues to the next mobile question
    And the user enters "The information was clear and useful." in the optional feedback field
    And the user continues to the next mobile question
    And the user enters "mobile.user@test.com" in the email field
    And the user continues to the next mobile question
    Then the configured success acknowledgement should be displayed
