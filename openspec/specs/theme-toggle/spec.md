# theme-toggle Specification

## Purpose

This specification defines the theme toggle feature that allows users to switch between light, dark, and system-following theme modes, with persistence across sessions.

## Requirements
### Requirement: Theme Mode Selection
The system SHALL provide three theme modes: light, dark, and system.

#### Scenario: Default to system mode
- **WHEN** no theme preference is stored
- **THEN** the theme mode is set to "system"
- **AND** the resolved theme matches the operating system preference

#### Scenario: Manual light mode
- **WHEN** user selects light mode
- **THEN** the application displays in light theme regardless of system preference

#### Scenario: Manual dark mode
- **WHEN** user selects dark mode
- **THEN** the application displays in dark theme regardless of system preference

#### Scenario: System mode follows OS
- **WHEN** theme mode is "system"
- **AND** the operating system preference changes
- **THEN** the application theme updates to match the new OS preference

### Requirement: Theme Toggle UI
The system SHALL display a theme toggle button in the application header.

#### Scenario: Toggle button visibility
- **WHEN** the application loads
- **THEN** a theme toggle button is visible in the header area

#### Scenario: Toggle cycles through modes
- **WHEN** user clicks the toggle button
- **THEN** the theme cycles: light -> dark -> system -> light

#### Scenario: Icon reflects current mode
- **WHEN** theme mode is light
- **THEN** the button displays a sun icon
- **WHEN** theme mode is dark
- **THEN** the button displays a moon icon
- **WHEN** theme mode is system
- **THEN** the button displays a monitor/computer icon

### Requirement: Theme Persistence
The system SHALL persist the user's theme preference across sessions.

#### Scenario: Preference saved on change
- **WHEN** user changes the theme mode
- **THEN** the preference is saved to localStorage

#### Scenario: Preference restored on load
- **WHEN** the application loads
- **AND** a theme preference exists in localStorage
- **THEN** the saved theme mode is applied

### Requirement: Dark Class Application
The system SHALL apply a `dark` class to the HTML element when dark theme is active.

#### Scenario: Dark class added
- **WHEN** the resolved theme is dark (manual or system-detected)
- **THEN** the `<html>` element has class `dark`

#### Scenario: Dark class removed
- **WHEN** the resolved theme is light
- **THEN** the `<html>` element does not have class `dark`

