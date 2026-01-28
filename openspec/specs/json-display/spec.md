# json-display Specification

## Purpose

This specification defines the JSON display components used throughout the application, including syntax highlighting, collapsible nodes for nested structures, and the lightweight implementation approach without external dependencies.

## Requirements
### Requirement: JSON Syntax Highlighting
The system SHALL render JSON values with color-coded syntax highlighting to distinguish between different value types.

#### Scenario: Key highlighting
- **WHEN** a JSON object is displayed
- **THEN** property keys SHALL be rendered in a distinct color (e.g., blue/purple)

#### Scenario: String value highlighting
- **WHEN** a JSON string value is displayed
- **THEN** string values SHALL be rendered in a distinct color (e.g., green) with surrounding quotes

#### Scenario: Number value highlighting
- **WHEN** a JSON number value is displayed
- **THEN** number values SHALL be rendered in a distinct color (e.g., orange/amber)

#### Scenario: Boolean value highlighting
- **WHEN** a JSON boolean value (true/false) is displayed
- **THEN** boolean values SHALL be rendered in a distinct color (e.g., purple/magenta)

#### Scenario: Null value highlighting
- **WHEN** a JSON null value is displayed
- **THEN** null values SHALL be rendered in a distinct color (e.g., red/gray)

### Requirement: Collapsible JSON Nodes
The system SHALL allow users to collapse and expand nested objects and arrays to navigate large JSON structures.

#### Scenario: Collapse nested object
- **WHEN** a user clicks on a collapsible indicator next to a nested object
- **THEN** the object's contents SHALL be hidden and replaced with a summary (e.g., `{...}` or item count)

#### Scenario: Expand collapsed object
- **WHEN** a user clicks on a collapsed object indicator
- **THEN** the object's full contents SHALL be displayed

#### Scenario: Collapse nested array
- **WHEN** a user clicks on a collapsible indicator next to a nested array
- **THEN** the array's contents SHALL be hidden and replaced with a summary (e.g., `[...]` or item count)

#### Scenario: Default expansion state
- **WHEN** JSON is initially rendered
- **THEN** top-level properties SHALL be expanded by default
- **AND** deeply nested structures (depth > 2) MAY be collapsed by default

### Requirement: Lightweight Implementation
The system SHALL use a lightweight approach for JSON display without external JSON viewer libraries.

#### Scenario: No external dependencies
- **WHEN** the pretty JSON feature is implemented
- **THEN** it SHALL NOT add new npm dependencies for JSON viewing
- **AND** it SHALL use only React, TypeScript, and Tailwind CSS

#### Scenario: Bundle size impact
- **WHEN** the pretty JSON feature is built
- **THEN** the additional bundle size SHALL be minimal (< 5KB gzipped)

### Requirement: Edit Mode Unchanged
The system SHALL maintain raw JSON editing experience without syntax highlighting or rich formatting.

#### Scenario: JSON editor remains raw
- **WHEN** a user edits JSON in the credential request builder
- **THEN** the editor SHALL remain a plain textarea with raw JSON
- **AND** no syntax highlighting SHALL be applied to the edit view

