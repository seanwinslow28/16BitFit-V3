# Credential Rotation Status – 2025-11-16

**Owner:** Codex  
**Scope:** All secrets that previously lived in `.env` at the repo root.

## What changed
- Removed live Supabase, GitHub, Firecrawl, FAL, HuggingFace, Gemini, Context7, and ElevenLabs keys from `.env`.
- `.env` now acts as a template only; developers must create `.env.local` (already git‑ignored) for actual credentials.
- Added this checklist so we can track the external rotations that still need to happen in each provider dashboard.

## Rotation checklist

| Service | Action Item | Owner | Status |
| --- | --- | --- | --- |
| Supabase (URL, anon key, service token) | Rotate keys in Supabase dashboard → Project Settings → API, copy into 1Password/EAS secrets. | Backend | ☐ |
| GitHub PAT | Issue a new fine-grained PAT with `repo` + `workflow`, store in Secrets Manager. | DevOps | ☐ |
| Firecrawl API | Regenerate key in https://firecrawl.dev dashboard. | Research | ☐ |
| FAL.ai | Create new key (`fal_...`) and update automations. | Design | ☐ |
| HuggingFace | Revoke old `hf_` key, add new personal access token. | ML | ☐ |
| Google Gemini | Rotate API key in Google Cloud console, restrict by IP/project. | Platform | ☐ |
| Context7 | Re-issue `ctx7sk_...` secret and update MCP config. | Docs | ☐ |
| ElevenLabs | Rotate API key and update any voice pipelines. | Audio | ☐ |

Update this table as each owner completes their rotation and stores the new value securely (1Password, Doppler, or EAS secrets).

## Local setup reminder
1. Duplicate `.env` → `.env.local`.
2. Fill in the rotated secrets locally.
3. Never commit `.env.local`.
