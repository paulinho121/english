# Security Policy - LinguaFlow AI

## 1. Reporting a Vulnerability

We take the security of LinguaFlow AI seriously. If you discover a security vulnerability, please report it privately to:

**Email:** paulofernandoautomacao@gmail.com

Please do NOT create public issues for security vulnerabilities.

### Our Commitment:
- We will acknowledge receipt of your report within 48 hours.
- We will provide an estimated timeframe for a fix.
- We will notify you once the vulnerability has been patched.

## 2. Best Practices for Administrators

To maintain the integrity of your intellectual property and user data:
- **Environment Variables:** Never commit `.env` or `.env.local` files to version control.
- **Supabase RLS:** Always ensure Row Level Security (RLS) is enabled for all tables in Supabase.
- **API Keys:** Use restricted API keys for Gemini and Supabase that only have the necessary permissions.
- **Dependency Updates:** Regularly run `npm audit` and keep dependencies updated to avoid known vulnerabilities.

Copyright (c) 2026 Paulinho Fernando. All rights reserved.
