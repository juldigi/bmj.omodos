# OMODOS Worker Deployment Settings Audit

- Audited UTC: 2026-09-20T14:06:33.329259+00:00
- Recent versions: 10

## Current settings keys

- annotations, bindings, compatibility_date, compatibility_flags, logpush, observability, placement, tags, tail_consumers, usage_model

## Current bindings

- None or unavailable.

## v68 bindings

- {"name": "ASSETS", "type": "assets"}
- {"name": "GEMINI_API_KEY", "type": "secret_text"}
- {"name": "GROQ_API_KEY", "type": "secret_text"}
- {"class_name": "MaintenanceStore", "name": "MAINTENANCE", "namespace_id": "b4c352e7351a45b186b26d25fe7bdb37", "type": "durable_object_namespace"}
- {"name": "SETUP_TOKEN", "type": "secret_text"}

## Assets metadata

- current: null
- latest: {"config": {"html_handling": "auto-trailing-slash", "not_found_handling": "none", "run_worker_first": false}}
- v68: {"config": {"html_handling": "auto-trailing-slash", "not_found_handling": "none", "run_worker_first": ["/api", "/api/*", "/files/*"]}}

## Compatibility and module metadata

- current: compatibility_date=2026-09-18 main_module=None usage_model=standard migration_tag=None
- latest: compatibility_date=2026-09-18 main_module=None usage_model=standard migration_tag=v1
- v68: compatibility_date=2026-09-01 main_module=worker.js usage_model=standard migration_tag=v1

## Script settings

- {"logpush": false, "observability": {"enabled": true, "head_sampling_rate": 1, "logs": {"enabled": true, "head_sampling_rate": 1, "invocation_logs": true, "persist": true}, "redact_query_string": false, "traces": {"enabled": false, "head_sampling_rate": 1, "persist": true}}, "tags": null, "tail_consumers": null}

## Subdomain

- {"enabled": true, "previews_enabled": true}

## Deployment safety

- Durable Object binding metadata is available for reconstruction.
- Current Worker settings do not expose assets configuration directly.
