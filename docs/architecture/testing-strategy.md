# **Testing Strategy**

## **Testing Pyramid**

Manual QA \> E2E (Detox/Maestro) \> Integration (RNTL / SuperDeno) \> Unit (Jest / Deno / pgTAP).

## **Test Organization**

Tests co-located or in dedicated folders within apps and packages. E2E tests likely in apps/mobile-shell/e2e/. PG Function tests (\*.test.sql) alongside migrations.

### **Frontend Tests (React Native Shell)**

Jest \+ RNTL for unit/integration tests (\*.test.tsx).

### **Backend Tests (Supabase Edge Functions)**

Deno Testing \+ SuperDeno for unit/integration tests (\*.test.ts).

### **Backend Tests (PostgreSQL Functions)**

pgTAP for unit testing PL/pgSQL functions within migrations (\*.test.sql).

### **E2E Tests**

Detox or Maestro for critical user flows (\*.test.ts).

## **Test Examples**

(Conceptual templates provided previously for RN Component, Edge Function, E2E flow). PG function tests would use pgTAP syntax.
