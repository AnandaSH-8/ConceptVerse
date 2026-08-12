---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# ConceptVerse — Copilot Instructions

You are working on **ConceptVerse**, an interactive 3D educational platform that teaches software engineering concepts through visual, animated mental models.

The goal is to build a polished product, not simply generate code that works.

## 1. Product Philosophy

ConceptVerse makes invisible software concepts visible.

Examples include HTTP, TCP, DNS, browser rendering, React internals, backend architecture, databases, AWS, Docker, Kubernetes, and system design.

The 3D visualization is the primary teaching mechanism.

Animations should communicate the core idea before the learner reads the explanation.

Visualizations may use conceptual representations such as:

* HTTP as a package/message
* TCP as a transport mechanism
* Client/server as computers
* DNS as a lookup system

These are visual metaphors, not literal implementations.

Keep the underlying technical explanation accurate.

Prioritize:

1. Educational clarity
2. UX
3. Visual quality
4. Performance
5. Maintainability

## 2. General Development Rules

Before changing code:

* Inspect the existing implementation.
* Understand related components and state.
* Reuse existing code whenever possible.
* Make the smallest change that solves the request.
* Do not rewrite working code unnecessarily.
* Do not make unrelated changes.
* Do not introduce dependencies without a clear reason.
* Do not create duplicate components or utilities.

When a requirement is ambiguous, make a reasonable assumption for small UI details. Ask before making a major architectural or product decision.

Prefer simple solutions over premature abstraction.

## 3. Architecture

Keep the application modular and reusable.

Educational content should be separated from presentation logic where practical.

Chapter-specific content should be data-driven so new chapters can be added without rebuilding the application.

Prefer:

```text
Chapter data
→ Scene configuration
→ Reusable 3D components
→ Animation sequence
→ Educational content
```

Build reusable primitives for concepts that will appear repeatedly, such as:

* Client
* Computer
* Server
* Packet
* Vehicle
* Network path
* Router
* Database
* Cloud
* Browser
* CDN

Do not create a new implementation of an existing visual concept unless its behavior genuinely differs.

## 4. 3D Development

Use React Three Fiber patterns and existing helpers before directly manipulating Three.js.

Prefer lightweight procedural geometry and reusable primitives before importing large 3D assets.

3D scenes should:

* Have clear spatial hierarchy.
* Have meaningful animation.
* Remain visually understandable.
* Work in both dark and light themes.
* Support camera interaction where appropriate.
* Avoid unnecessary visual effects.

Avoid excessive:

* Bloom
* Particles
* Glows
* Camera movement
* Post-processing
* Heavy models

Visual effects must support the learning experience rather than distract from it.

Reuse geometries, materials, and assets where practical.

Avoid unnecessary object creation during render cycles.

Clean up animation loops, event listeners, timers, and resources appropriately.

## 5. Animation

Animations should explain a process, not merely decorate the page.

Prefer:

```text
Object appears
→ Action begins
→ Important state changes
→ Result becomes visible
```

Animations should be:

* Smooth
* Predictable
* Replayable
* Understandable at normal speed

Avoid animations that are too fast to follow.

When an animation represents a technical process, preserve the correct conceptual order.

## 6. 3D Interaction

Interactive objects should provide clear visual feedback.

On hover:

* Highlight the selected object.
* Dim unrelated scene elements.
* Add a subtle primary-color glow.
* Slightly emphasize the selected object.
* Show a concise tooltip or information card.

Restore the scene when the pointer leaves.

On click, provide deeper information or focus the relevant concept when appropriate.

Support:

* Orbit
* Zoom
* Pan
* Reset camera

Do not make essential educational information available only through hover.

Provide sensible touch interactions for mobile devices.

## 7. UI / UX

ConceptVerse should feel like a premium modern educational application.

Maintain the established visual language:

* Orange as the primary brand color
* Blue/Navy as a complementary color
* Dark and Light themes
* Clear typography
* Strong visual hierarchy
* Consistent spacing
* Subtle borders
* Controlled shadows
* Smooth transitions
* Minimal clutter

Every UI element should have a purpose.

Do not add controls merely because they are visually interesting.

Maintain consistency between chapters rather than redesigning the entire interface for every concept.

## 8. Responsive Design

Support:

* Desktop
* Tablet
* Mobile

Do not simply scale the desktop scene down.

For smaller screens:

* Reframe the camera.
* Simplify non-essential UI.
* Make controls touch-friendly.
* Keep labels readable.
* Preserve the core animation and explanation.

## 9. Next.js

Respect the existing Next.js App Router architecture.

Use client components only where browser-side behavior is required.

Be careful with:

* Three.js
* Browser APIs
* Event listeners
* Animation loops
* Hydration
* SSR/client boundaries

Avoid unnecessary `"use client"` declarations.

## 10. TypeScript

Use strong typing throughout.

* Avoid `any`.
* Define clear interfaces/types for chapter data and scene configuration.
* Keep component props explicit.
* Avoid unnecessary type complexity.
* Prefer type-safe reusable configuration over scattered constants.

## 11. State Management

Use local React state when state is local to a component.

Use Zustand only when state genuinely needs to be shared across distant components or scenes.

Do not put everything into global state.

## 12. Accessibility

All important non-3D UI should remain accessible.

Consider:

* Semantic HTML
* Keyboard navigation
* Focus states
* Accessible buttons
* ARIA labels where appropriate
* Sufficient contrast
* Reduced-motion preferences where practical

Important educational information must not depend exclusively on 3D interaction.

## 13. Educational Accuracy

Technical explanations must be accurate.

Do not invent protocol behavior or simplify concepts to the point of becoming misleading.

When using an analogy:

* Clearly distinguish analogy from implementation.
* Preserve the important technical relationship.
* Avoid analogies that create incorrect mental models.

If uncertain about a technical fact, verify it rather than guessing.

## 14. Performance

Treat 3D performance as a first-class requirement.

Watch for:

* Unnecessary React re-renders
* Excessive geometry
* Excessive materials
* Large textures
* Heavy models
* Too many particles
* Unnecessary animation calculations
* Excessive post-processing

Use lazy loading and code splitting where beneficial.

Do not optimize prematurely, but do not introduce obvious performance problems.

## 15. Dependencies

Before installing a package:

1. Check whether the existing stack can solve the problem.
2. Check whether an existing dependency already provides the functionality.
3. Add a dependency only when it provides meaningful value.

Do not introduce multiple libraries for the same purpose.

## 16. Validation

After making changes, when applicable:

* Run TypeScript checks.
* Run linting.
* Run the production build.
* Check the affected UI.
* Check both themes.
* Check responsive behavior.
* Check 3D interactions.
* Check animation cleanup.
* Check for console errors.

Never claim that something was tested unless it was actually tested.

## 17. Agent Behavior

When implementing a request:

1. Inspect first.
2. Plan the smallest appropriate change.
3. Reuse existing components.
4. Implement incrementally.
5. Validate the result.
6. Report what changed and any limitations.

Do not generate a large rewrite when a focused modification is sufficient.

Do not change architecture, dependencies, or established UX patterns without a clear reason.

For major architectural decisions, explain the trade-off before implementing them.

## 18. ConceptVerse Golden Rule

Always ask:

> "Does this change help the learner understand the concept?"

If a visual effect, abstraction, dependency, animation, or UI element does not improve the learning experience, prefer not to add it.

The final product should feel like an interactive visual explanation of software—not a collection of technical diagrams.
