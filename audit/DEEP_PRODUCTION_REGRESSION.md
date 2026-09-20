# OMODOS Deep Production Regression Audit

- Audited UTC: 2026-09-20T13:36:21.852225+00:00
- Mode: read-only navigation/render audit using synthetic Superadmin session in browser memory
- Navigation views tested: 36
- Views with structural/runtime findings: 0
- Page errors observed: 0
- Same-origin failed requests observed: 0

## View routing findings

- No structural/runtime view-routing failure detected.

## Static view target audit

- Unique HTML IDs: 935
- Duplicate ID definitions: 23
- data-view targets: 38
- view containers: 44
- data-view values without view-* container: ["${enteringView}", "${view}"]

## Duplicate IDs

- None in rendered DOM.

## Bantuan / Copilot

- Help-related interactive/card nodes found: 0
- Help-related nodes outside Copilot: 0

## Machine selectors

- Logbook selects: [{"id": "filter-status", "name": "", "options": 5, "aria": ""}, {"id": "filter-jenis", "name": "", "options": 1, "aria": ""}, {"id": "filter-group", "name": "", "options": 8, "aria": ""}]
- Patrol selects: [{"id": "patrol-machine-select", "name": "", "options": 1, "aria": ""}, {"id": "patrol-shift", "name": "", "options": 4, "aria": ""}, {"id": "patrol-grouping-team", "name": "", "options": 5, "aria": ""}, {"id": "patrol-nama-pelapor", "name": "", "options": 1, "aria": ""}, {"id": "patrol-temuan-kategori", "name": "", "options": 6, "aria": ""}, {"id": "patrol-temuan-prioritas", "name": "", "options": 3, "aria": ""}]

## User Management / Role Access

- No matching navigation/control text found.

## Required core functions

- latestLogbookForMachine_: function
- latestPatrolForMachine_: function
- currentMachineStatusSnapshot_: undefined
- attachSparepartPaginationHandlers: function
- switchToView: function
- renderOmodos4: function

## Static feature fingerprints

- switchToView: 1 hit(s)
- sparepartPagination: 1 hit(s)
- machineLatestLogbook: 1 hit(s)
- machineLatestPatrol: 1 hit(s)
- machineCurrentSnapshot: 0 hit(s)
- mediaModal: 0 hit(s)
- copilot: 346 hit(s)
- help: 3 hit(s)
- userManagement: 5 hit(s)
- roleAccess: 46 hit(s)
- omodos4Permission: 3 hit(s)

## Network failures during view traversal

- None.
