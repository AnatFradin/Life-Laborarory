# Laboratory of Life - Design System Documentation

## Overview

This document describes the design system used in Laboratory of Life, including color tokens, typography scales, spacing, and component patterns.

## Color Palette

### Background Colors
```css
--color-bg: #fdfbf7                 /* Warm off-white base */
--color-bg-secondary: #f7f5f0       /* Warm sand for panels */
--color-bg-elevated: #ffffff        /* Pure white for cards */
--color-bg-hover: #f0ede5          /* Warm hover state */
```

### Text Colors
```css
--color-text: #1a1816              /* Rich dark brown */
--color-text-secondary: #524e47     /* Warm charcoal */
--color-text-tertiary: #6b6762     /* Soft charcoal */
```

### Primary (Forest Green)
```css
--color-primary: #2d5a3d           /* Main action color */
--color-primary-hover: #234a30     /* Hover state */
--color-primary-light: #e5f3eb     /* Light backgrounds */
--color-primary-surface: #d4ebe0   /* Medium surfaces */
--color-primary-dark: #1a3d26      /* Dark variant */
```

### Semantic Colors
```css
/* Success */
--color-success: #2d5a3d
--color-success-light: #e5f3eb
--color-success-border: #9fcbb4

/* Warning */
--color-warning: #8b5e1f
--color-warning-light: #fef6e9
--color-warning-border: #e8c88e

/* Error */
--color-error: #a63232
--color-error-light: #fef1f1
--color-error-border: #e8a9a9
```

### Border Colors
```css
--color-border: #e5e1d9           /* Subtle border */
--color-border-focus: #2d5a3d     /* Focus state */
--color-border-strong: #d4cfc3    /* Stronger emphasis */
--color-focus-ring: rgba(45, 90, 61, 0.15) /* Focus ring with alpha */
```

## Typography

### Font Families
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', ...
```

### Font Sizes
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
```

### Line Heights
```css
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

## Spacing Scale

```css
--space-xs: 0.25rem     /* 4px */
--space-sm: 0.5rem      /* 8px */
--space-md: 1rem        /* 16px */
--space-lg: 1.5rem      /* 24px */
--space-xl: 2rem        /* 32px */
--space-2xl: 2.5rem     /* 40px */
--space-3xl: 3rem       /* 48px */
--space-4xl: 4rem       /* 64px */
```

## Shadows

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.03)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.04)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.03)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 10px 10px -5px rgb(0 0 0 / 0.02)
```

## Border Radius

```css
--radius-sm: 0.375rem   /* 6px - Small elements */
--radius-md: 0.5rem     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem    /* 12px - Cards, containers */
--radius-xl: 1rem       /* 16px - Large containers */
--radius-2xl: 1.5rem    /* 24px - Hero elements */
--radius-full: 9999px   /* Pill shape */
```

## Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Component Patterns

### Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
padding: var(--space-md) var(--space-2xl);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);
transition: all var(--transition-base);
```

**Hover State:**
```css
box-shadow: var(--shadow-md);
transform: translateY(-2px);
```

### Cards

**Base Card:**
```css
background: linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-secondary));
border: 1.5px solid var(--color-border);
border-radius: var(--radius-xl);
padding: var(--space-xl);
box-shadow: var(--shadow-sm);
transition: all var(--transition-base);
```

**Hover Effect:**
```css
border-color: var(--color-primary);
box-shadow: var(--shadow-md);
transform: translateY(-2px);
```

**Left Accent (on hover):**
```css
.card::before {
  content: '';
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-dark));
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover::before {
  opacity: 1;
}
```

### Inputs

**Base Input:**
```css
border: 1.5px solid var(--color-border);
border-radius: var(--radius-md);
padding: var(--space-sm) var(--space-md);
transition: all var(--transition-base);
```

**Focus State:**
```css
border-color: var(--color-border-focus);
box-shadow: 0 0 0 3px var(--color-focus-ring);
```

### Badges

**Pill Badge:**
```css
display: inline-flex;
padding: var(--space-xs) var(--space-md);
border-radius: var(--radius-full);
font-size: var(--text-sm);
font-weight: 600;
background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary-surface));
border: 1.5px solid var(--color-success-border);
box-shadow: var(--shadow-xs);
```

## Usage Guidelines

### Do's ✅

1. **Use design tokens** instead of hardcoded values
2. **Apply consistent spacing** from the scale
3. **Use gradients** for primary actions and elevated surfaces
4. **Add hover effects** with lift (translateY) and shadow changes
5. **Include focus states** with rings for accessibility
6. **Maintain warm color palette** across all components
7. **Use transitions** for smooth interactions

### Don'ts ❌

1. **Don't** use arbitrary color values
2. **Don't** create one-off spacing values
3. **Don't** add aggressive animations
4. **Don't** use pure black (#000) or pure white text
5. **Don't** forget focus states for keyboard navigation
6. **Don't** mix color systems (stay warm)
7. **Don't** exceed 300ms for transitions

## Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Text on background: 7:1 minimum
- Interactive elements: 4.5:1 minimum
- Large text: 3:1 minimum

### Focus States

All interactive elements have visible focus indicators:
```css
*:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- Tab order follows logical flow
- Focus states are clearly visible
- All interactive elements are keyboard accessible

## Browser Support

- **Chrome/Edge:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Mobile:** Modern iOS Safari, Chrome Mobile

## Examples

### Creating a New Button Variant

```css
.btn-secondary {
  background: linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-secondary));
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
```

### Creating a Status Badge

```css
.status-success {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: linear-gradient(135deg, var(--color-success-light), #d4ebe0);
  color: var(--color-success);
  border: 1.5px solid var(--color-success-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  box-shadow: var(--shadow-xs);
}
```

## Maintenance

### Adding New Colors

1. Follow the naming convention: `--color-{context}-{variant}`
2. Ensure WCAG AA compliance
3. Add both light and dark variants if applicable
4. Document in this file

### Updating Spacing

1. Maintain the 8px base grid
2. Use multipliers: 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4
3. Update all spacing tokens consistently
4. Test on mobile devices

### Modifying Shadows

1. Keep shadows subtle (opacity 0.02-0.08)
2. Use multiple layers for depth
3. Test on different backgrounds
4. Ensure visibility without overwhelming

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Maintained by:** Laboratory of Life Team
