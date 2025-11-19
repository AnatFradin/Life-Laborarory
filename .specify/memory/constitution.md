<!--
Sync Impact Report:
Version: 2.0.0 → 2.1.0 (Minor: Added AI Assistant Guidelines)
Ratification Date: 2025-11-08
Last Amended: 2025-11-19

Changes in v2.1.0:
- ADDED: Section III "AI Assistant Guidelines" with critical workflow rules
- Enforces test-first development with mandatory test execution
- Prevents premature commits without explicit approval
- Result: Codifies AI assistant behavior and user approval requirements

Changes in v2.0.0:
- BREAKING: Removed all product-specific principles (moved to product spec)
- Kept only: Development process principles (Small Steps, Test-First)
- Kept: Definition of Done, Quality Bar, Work Rhythm, Governance
- Removed: Product features like "AI as Mirror", "Multiple Forms", "Calm Experience" etc.
- Result: Constitution is now reusable for ANY project

Templates Status:
✅ plan-template.md - Constitution Check needs updating for new v2.0.0
⚠️  Product principles moved to /specs/000-product-vision/spec.md (to be created)
✅ spec-template.md - Alignment unchanged
✅ tasks-template.md - Task organization unchanged

Follow-up Actions:
- Create /specs/000-product-vision/spec.md with product principles
- Update plan-template.md Constitution Check to reference product spec
- Update README to reference both constitution (HOW) and product spec (WHAT)
-->

# Project Constitution

**Purpose**: This document defines HOW the project is built, not WHAT is built. It establishes development practices, quality standards, and governance that apply to all features and specs.

This constitution is project-agnostic and focuses purely on the development process.

## Development Principles

### I. Small Steps, Always

Work in tiny, testable slices that can be finished in one focused session (max 45 minutes).

**MUST**: Every task represents a completable unit of work within a single session.

**MUST**: Features are broken down into independently testable stories (per spec template).

**MUST**: Commit after each completed task or logical group.

**Rationale**: Protects developer energy, enables frequent validation, and prevents scope creep.

### II. Test-First Development

Write tests before implementation to ensure correctness and prevent regressions.

**MUST**: Write Acceptance Tests for each task BEFORE implementation.

**MUST**: Tests fail first, then implement to make them pass (Red-Green-Refactor).

**MUST**: All tests pass before marking a task or feature complete.

**Rationale**: Tests document expected behavior and catch issues early.

### III. AI Assistant Guidelines

When working with AI assistants (GitHub Copilot, etc.), the following rules are mandatory:

**CRITICAL RULES**:

1. ❌ **NEVER commit without explicit user approval**
   - **MUST**: Present all changes for review before committing
   - **MUST**: Wait for explicit user approval before any git operations
   - **MUST NOT**: Auto-commit or suggest commits without permission

2. ✅ **ALWAYS create unit tests for each task**
   - **MUST**: Write unit tests before or alongside implementation
   - **MUST**: Ensure tests cover core functionality and edge cases
   - **SHOULD**: Follow test-first development (Red-Green-Refactor)

3. ✅ **ALWAYS run tests before requesting approval**
   - **MUST**: Execute all relevant tests after implementation
   - **MUST**: Verify all tests pass before presenting work for review
   - **MUST**: Include test results in implementation review

4. ✅ **ALWAYS create acceptance tests for each user story**
   - **MUST**: Write acceptance tests that verify user story requirements
   - **MUST**: Ensure acceptance tests pass before marking story complete
   - **SHOULD**: Use acceptance tests as definition of done criteria

5. ✅ **Present test results with implementation for review**
   - **MUST**: Show test execution output alongside code changes
   - **MUST**: Highlight any test failures or warnings
   - **SHOULD**: Include coverage reports when available

**Rationale**: These rules ensure quality, prevent premature commits, and maintain user control over the codebase. AI assistants accelerate development but must not bypass quality gates or user approval.

## Definition of Done

A feature or story is considered done when ALL of the following are true:

1. **Documentation**: Written Spec, Plan, and Tasks exist in `/specs/[###-feature-name]/`
2. **Pre-Implementation Tests**: Each Task includes clear Acceptance Tests describing expected behavior BEFORE implementation
3. **Build & Tests Pass**: Code builds locally and all relevant tests pass
4. **Product Requirements Met**: Feature meets all requirements defined in the product spec (`/specs/000-product-vision/spec.md`)
5. **Documentation Updated**: CHANGELOG and README reflect the changes
6. **Manual Validation**: The feature has been manually tested in the actual environment

**Rationale**: DoD ensures quality is built in, not added later. Product-specific requirements (accessibility, privacy, etc.) are verified against the product spec.

## Quality Bar

### Testing Requirements

**MUST**: Every task passes its Acceptance Tests before being marked complete.

**MUST**: Unit tests cover core logic and data operations.

**MUST**: Smoke tests verify main user flows work end-to-end.

**MAY**: Contract and integration tests for complex interactions (when specified in spec).

### Code Quality

**MUST**: Code follows project's style guide and linting rules.

**MUST**: Complex logic includes inline comments explaining intent.

**SHOULD**: Functions/methods are small and focused on single responsibility.

**Rationale**: Quality is not negotiable; these standards ensure maintainability and reliability.

## Work Rhythm

### Session Structure

**MUST**: One work session = one user story OR max 45 minutes (whichever comes first).

**MUST**: After each session: short reflection, then decide — ship or stop.

**SHOULD**: Pause when fatigue or confusion rises, rather than pushing through.

### Release Cadence

**PREFER**: Small releases (micro-versions) over long development streaks.

**PREFER**: Shipping one working story over accumulating multiple incomplete stories.

**Rationale**: Sustainable pace protects energy and maintains clarity of purpose.

## Decision-Making Guidance

When facing implementation choices:

1. **Simplicity First** — Choose the simplest solution that meets requirements.
2. **YAGNI (You Aren't Gonna Need It)** — Don't build for hypothetical future needs.
3. **Ship Small** — Prefer delivering working features over perfect features.
4. **Product Spec Alignment** — Verify decisions against product requirements in spec.

**Rationale**: Guides toward pragmatic, maintainable solutions without over-engineering.

## Collaboration & Workflow

**MUST**: Work in micro-iterations (one story at a time).

**SHOULD**: Review open tasks before adding new ones.

**MUST**: Merge only passing, tested code.

**SHOULD**: Discuss scope changes before implementation.

**MUST**: Keep pull requests small and focused on single feature/fix.

**Rationale**: Incremental progress maintains code quality and project momentum.

## Governance

This Constitution supersedes all other development practices, coding preferences, and implementation decisions.

**Amendments**: Changes to Core Principles, Non-Goals, or Definition of Done require:
1. Explicit Constitution update with version bump
2. Sync Impact Report documenting affected templates and specs
3. Migration plan for existing features (if applicable)
4. Clear commit message (e.g., `docs: amend constitution to v1.1.0 (add principle IX)`)

**Version Semantics**:
- **MAJOR**: Backward incompatible changes (remove/redefine principles, change DoD)
- **MINOR**: New principles/sections added or material expansions
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

**Compliance Verification**:
- All specs MUST verify against DoD before task creation
- All tasks MUST include Acceptance Tests before implementation (Principle I)
- All PRs MUST pass Quality Bar checks (testing, accessibility, privacy, performance)
- Constitution Check in plan template gates work appropriately

**Living Document**: This constitution may evolve as development practices mature, but changes must be intentional, documented, and propagated to all dependent templates.

**Product Requirements**: Product-specific requirements (features, UX, privacy, accessibility, etc.) belong in `/specs/000-product-vision/spec.md`, not in this constitution.

**Version**: 2.1.0 | **Ratified**: 2025-11-08 | **Last Amended**: 2025-11-19
