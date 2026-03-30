# TSpirit Forge

[日本語](docs/README.ja.md)

TSpirit Forge is an unofficial browser extension that streamlines everyday TeamSpirit operations.

It currently provides CSV import/export for the workload dialog and sorting/batch-select features for the job assignment page.

## Features

### Workload Dialog

- CSV Export
- CSV Import
- Export is available even on the daily-confirmed view

The output file is `workload.csv` in `name,time` format.

### Job Assignment Page

- Adds a **Sort** button
- Adds a **Select All Expired** button
- Sort rules are fully customizable from the options page

Sort rules support the following:

- Base sort: None / Sort by a specific key
- Conditional rules: Target, match condition, and value
- Move to: Top / Bottom
- Sort within matched rows: None / Same as base sort / Custom
- Drag-and-drop reordering of conditional rules

Conditional rules are evaluated from top to bottom; when multiple rules match, the later rule takes priority.

## Usage

### Workload Dialog

- Click **Export** to save the current workload entries as `workload.csv`
- Click **Import** to load entries from a CSV file

CSV format: `name,time`

### Job Assignment Page

- Click **Sort** to reorder jobs based on the configured rules
- Click **Select All Expired** to check all expired jobs at once
- Open the options page to edit base sort and conditional rules

## Default Settings

- Base sort: Job Code ascending
- Conditional rule: Move jobs ending with `(End)` (or `(終了)` for Japanese locale) to the bottom

The suffix used in the default rule is determined by the browser locale when the extension initializes.

## Supported Pages

This extension works on the following TeamSpirit pages:

- `https://*.vf.force.com/apex/AtkWorkTimeView*`
- `https://*.vf.force.com/apex/AtkEmpJobView*`

## Storage & Permissions

- Permission required: `storage`
- Sort settings are saved in the browser's local storage

## Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup, build instructions, scripts, and tech stack.

## Disclaimer

- This extension is unofficial and is not affiliated with TeamSpirit Inc.
- If TeamSpirit changes its page structure, the extension may stop working.
