# ASG Dynamic Input System

A reusable, polymorphic input component system built with **Astro** and **Preact**. One component, many variants, automatic state-driven styling.

## The Problem

Building forms with many input types (text, phone, date, file, address, select, currency) typically means duplicating styling logic, validation, and state management across dozens of components. Colour definitions multiply — error red for borders, a lighter red for label backgrounds, another shade for text — and keeping them in sync becomes a maintenance headache.

## The Solution

### One Component, Many Variants

```tsx
<Input variant="text" label="File Reference Name" name="fileRef" />
<Input variant="phone" label="Phone Number" name="phone" countryCode="+44" />
<Input variant="date" label="Date Picker" name="date" />
<Input variant="file" label="Document Upload" name="doc" />
<Input variant="address" label="Private Address" name="address" />
<Input variant="select" label="Manager" name="manager" options={managerList} />
<Input variant="currency" label="Interest Rate" name="rate" suffix="%" />
<Input variant="currency" label="Total Exit Fee" name="exitFee" prefix="£" suffix="%" />
```

Each variant handles its own rendering (calendar trigger, file upload button, country code selector, etc.) while the parent `Input` component handles shared concerns: state management, floating labels, validation, and error display.

### One Colour Per State — Everything Else Derived

The core design principle: define **one CSS variable per state**, and derive border colour, label text colour, and label background automatically using `color-mix()`.

```css
/* Each state sets ONE variable */
.input-field[data-state="error"]   { --state-color: var(--error-red); }
.input-field[data-state="active"]  { --state-color: var(--asg-light); }
.input-field[data-state="warning"] { --state-color: var(--warning-yellow); }

/* All visuals derived from that single variable */
--border-color: var(--state-color);
--label-color:  var(--state-color);
--label-bg:     color-mix(in srgb, var(--state-color), white 88%);
```

Change `--error-red` from red to orange in `tokens.css` and every error state — border, label text, label background — updates to orange shades automatically. No hunting through CSS files, no extra variables to maintain.

### Built-In Validation Per Variant

Each variant comes with sensible default validation rules that run automatically on blur:

| Variant    | Auto-Validates                          |
|------------|------------------------------------------|
| `text`     | minLength, maxLength, pattern            |
| `phone`    | valid phone format                       |
| `date`     | yyyy/mm/dd format                        |
| `file`     | file type, file size                     |
| `address`  | minimum 16 characters                    |
| `currency` | numeric with up to 4 decimal places      |
| `select`   | required selection                       |

Add custom rules via the `validationRules` prop:

```tsx
<Input
  variant="text"
  label="Reference Name"
  name="ref"
  required
  validationRules={[
    { type: 'minLength', value: 16, message: 'Minimum 16 characters' }
  ]}
/>
```

## Project Structure

```
src/
  styles/
    tokens.css                  # Base colour palette — single source of truth
    input.css                   # Input styling with auto-shading state system
  components/inputs/
    types.ts                    # TypeScript interfaces
    validation.ts               # Validation engine with built-in rules
    color-shades.ts             # JS shade generation alternative (for comparison)
    Input.tsx                   # Main polymorphic component
    index.ts                    # Barrel export
    variants/
      TextInput.tsx
      PhoneInput.tsx
      DateInput.tsx
      FileInput.tsx
      AddressInput.tsx
      SelectInput.tsx
      CurrencyInput.tsx
  pages/
    index.astro                 # Demo page — all variants and colour swatches
```

## Getting Started

```bash
npm install
npm run dev
```

Open `localhost:4321` to see the demo page with all input variants and the colour-mix auto-shading swatch comparison.

## Commands

| Command           | Action                                      |
|:------------------|:--------------------------------------------|
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`         |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview production build locally             |

## Tech Stack

- **Astro** — static site framework
- **Preact** — lightweight UI components
- **CSS `color-mix()`** — automatic shade derivation, zero JS required
- No Tailwind, no CSS-in-JS, no runtime styling dependencies
