# Drug Input Feature - UI Guide

## User Interface Overview

The Drug Input feature adds a professional drug selection interface to the VCF upload form.

## UI Components

### 1. Drug Selection Dropdown

**Location**: Between Patient ID and Clinical Notes fields

**Appearance**:
```
┌─────────────────────────────────────────────────┐
│ 🔵 Select drug(s) to analyze...          ⌄     │
└─────────────────────────────────────────────────┘
```

**When drugs selected**:
```
┌─────────────────────────────────────────────────┐
│ 🔵 2 drugs selected                       ⌄     │
└─────────────────────────────────────────────────┘
```

### 2. Dropdown Menu (Opened)

**Appearance**:
```
┌─────────────────────────────────────────────────┐
│ 🔍 Search drugs...                              │
├─────────────────────────────────────────────────┤
│ ✓ CODEINE                                       │
│   Pain relief opioid • Gene: CYP2D6             │
├─────────────────────────────────────────────────┤
│   WARFARIN                                      │
│   Blood thinner anticoagulant • Gene: CYP2C9    │
├─────────────────────────────────────────────────┤
│ ✓ CLOPIDOGREL                                   │
│   Antiplatelet therapy • Gene: CYP2C19          │
├─────────────────────────────────────────────────┤
│   SIMVASTATIN                                   │
│   Cholesterol statin • Gene: SLCO1B1            │
├─────────────────────────────────────────────────┤
│   AZATHIOPRINE                                  │
│   Immunosuppressant • Gene: TPMT                │
├─────────────────────────────────────────────────┤
│   FLUOROURACIL                                  │
│   Chemotherapy • Gene: DPYD                     │
└─────────────────────────────────────────────────┘
```

**Features**:
- ✓ Checkmark shows selected drugs
- Search bar filters drugs in real-time
- Each drug shows description and gene
- Scrollable list (max height)
- Click to toggle selection

### 3. Drug → Gene Mapping Preview

**Appears below dropdown when drugs are selected**:

```
┌─────────────────────────────────────────────────┐
│ SELECTED DRUG → GENE MAPPING                    │
│                                                 │
│ ┌──────────────────┐  ┌──────────────────────┐ │
│ │ CODEINE → CYP2D6 │  │ CLOPIDOGREL → CYP2C19│ │
│ └──────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Features**:
- Shows all selected drugs
- Drug name in bold
- Arrow (→) separator
- Gene name in primary color
- Badge style with rounded corners
- Wraps to multiple lines if needed

### 4. Error States

**No drugs selected (validation error)**:
```
┌─────────────────────────────────────────────────┐
│ 🔵 Select drug(s) to analyze...          ⌄     │ ← Red border
└─────────────────────────────────────────────────┘
❌ At least one drug must be selected
```

**API fetch failed**:
```
┌─────────────────────────────────────────────────┐
│ ⚠️ Failed to load drug list. Please try again.  │
│ [ Retry ]                                       │
└─────────────────────────────────────────────────┘
```

**Loading state**:
```
┌─────────────────────────────────────────────────┐
│ Loading drugs...                                │
└─────────────────────────────────────────────────┘
```

## Complete Form Layout

```
┌───────────────────────────────────────────────────────┐
│ Upload VCF File                    [ Run Demo ]       │
│ Upload a VCF v4.2 genomic file for analysis          │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ℹ️ ACCEPTED FILE FORMAT                               │
│ • Format: VCF (Variant Call Format) v4.2             │
│ • Extension: .vcf only                                │
│ • Max Size: 5 MB                                      │
│ • Max Variants: 100,000                               │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│           📄 Drag & drop a VCF file                   │
│           Or click to browse                          │
│           VCF v4.2 format only, max 5 MB              │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Patient ID *                                          │
│ ┌─────────────────────────────────────────────────┐  │
│ │ e.g., PT-2024-00123                             │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Drug Selection * ⭐ NEW                               │
│ ┌─────────────────────────────────────────────────┐  │
│ │ 🔵 Select drug(s) to analyze...          ⌄     │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ SELECTED DRUG → GENE MAPPING                    │  │
│ │ ┌──────────────────┐  ┌──────────────────────┐ │  │
│ │ │ WARFARIN → CYP2C9│  │ CODEINE → CYP2D6     │ │  │
│ │ └──────────────────┘  └──────────────────────┘ │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Clinical Notes (optional)                             │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Additional context for the analysis...          │  │
│ │                                                 │  │
│ │                                                 │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │     🧪 Analyze Pharmacogenomics                 │  │
│ └─────────────────────────────────────────────────┘  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## User Interaction Flow

### Scenario 1: Single Drug Selection

1. **User clicks dropdown**
   ```
   Click: [Select drug(s) to analyze... ⌄]
   ```

2. **Dropdown opens with search**
   ```
   Shows: All 6 drugs with descriptions
   ```

3. **User types "war" in search**
   ```
   Filters to: WARFARIN only
   ```

4. **User clicks WARFARIN**
   ```
   Checkmark appears: ✓ WARFARIN
   Dropdown closes
   ```

5. **Preview appears**
   ```
   Shows: [WARFARIN → CYP2C9]
   ```

6. **User submits form**
   ```
   Analysis runs for WARFARIN only
   ```

### Scenario 2: Multi-Drug Selection

1. **User clicks dropdown**
2. **User selects CODEINE** (✓ appears)
3. **User selects WARFARIN** (✓ appears)
4. **User selects CLOPIDOGREL** (✓ appears)
5. **Dropdown shows "3 drugs selected"**
6. **Preview shows all 3 badges**:
   ```
   [CODEINE → CYP2D6] [WARFARIN → CYP2C9] [CLOPIDOGREL → CYP2C19]
   ```
7. **User submits form**
8. **Analysis runs for all 3 drugs**

### Scenario 3: Changing Selection

1. **User has WARFARIN selected**
2. **User clicks dropdown again**
3. **User clicks WARFARIN** (removes ✓)
4. **User clicks CODEINE** (adds ✓)
5. **Preview updates**: [CODEINE → CYP2D6]

### Scenario 4: Search and Select

1. **User clicks dropdown**
2. **User types "stat" in search**
3. **Only SIMVASTATIN appears**
4. **User clicks SIMVASTATIN**
5. **Preview shows**: [SIMVASTATIN → SLCO1B1]

## Visual States

### Normal State
- Border: Gray
- Background: White
- Text: Black
- Icon: Gray pill icon

### Hover State
- Border: Slightly darker gray
- Background: Light gray
- Cursor: Pointer

### Focus State
- Border: Blue (primary color)
- Background: White
- Outline: Blue glow

### Error State
- Border: Red
- Background: White
- Error text: Red below field

### Disabled State
- Border: Light gray
- Background: Gray
- Text: Light gray
- Cursor: Not allowed

### Loading State
- Shows: "Loading drugs..."
- Background: Light gray
- No interaction

## Responsive Design

### Desktop (>768px)
- Full width dropdown
- Badges in single row (wraps if needed)
- Large touch targets

### Tablet (768px)
- Full width dropdown
- Badges wrap to multiple rows
- Medium touch targets

### Mobile (<768px)
- Full width dropdown
- Badges stack vertically
- Large touch targets for mobile

## Accessibility

### Keyboard Navigation
- **Tab**: Focus dropdown
- **Enter/Space**: Open dropdown
- **Arrow Up/Down**: Navigate drugs
- **Enter/Space**: Select drug
- **Escape**: Close dropdown
- **Tab**: Move to next field

### Screen Reader
- Label: "Drug Selection, required"
- Dropdown: "Select drug(s) to analyze, combobox"
- Selected: "2 drugs selected"
- Options: "WARFARIN, Blood thinner anticoagulant, Gene CYP2C9"

### ARIA Attributes
- `role="combobox"`
- `aria-expanded="true/false"`
- `aria-required="true"`
- `aria-invalid="true"` (when error)
- `aria-describedby` (for error message)

## Color Scheme

### Light Mode
- Background: White (#FFFFFF)
- Border: Gray (#E5E7EB)
- Text: Black (#1F2937)
- Primary: Blue (#3B82F6)
- Error: Red (#EF4444)
- Success: Green (#10B981)

### Dark Mode
- Background: Dark Gray (#1F2937)
- Border: Gray (#374151)
- Text: White (#F9FAFB)
- Primary: Blue (#60A5FA)
- Error: Red (#F87171)
- Success: Green (#34D399)

## Animation

### Dropdown Open/Close
- Duration: 200ms
- Easing: ease-in-out
- Transform: scale(0.95) → scale(1)
- Opacity: 0 → 1

### Badge Appearance
- Duration: 150ms
- Easing: ease-out
- Transform: scale(0.9) → scale(1)
- Opacity: 0 → 1

### Hover Effects
- Duration: 100ms
- Easing: ease-in-out
- Background color transition

## Best Practices

### For Users
1. **Search first**: Type to quickly find drugs
2. **Check preview**: Verify drug→gene mapping
3. **Multi-select**: Select all relevant drugs at once
4. **Clear selection**: Click selected drug to deselect

### For Developers
1. **Fetch once**: Drug list cached in state
2. **Validate early**: Check drugs before submission
3. **Show feedback**: Loading, error, success states
4. **Accessible**: Keyboard and screen reader support

## Tips & Tricks

💡 **Quick Search**: Type first few letters (e.g., "clo" for CLOPIDOGREL)

💡 **Multi-Select**: Click multiple drugs without closing dropdown

💡 **Clear All**: Deselect each drug individually

💡 **Gene Info**: Hover over badge to see full gene name

💡 **Keyboard**: Use arrow keys to navigate, Enter to select

## Common Questions

**Q: Can I select all drugs?**
A: Yes, up to 10 drugs can be selected at once.

**Q: What if I don't see my drug?**
A: Only 6 drugs are currently supported. More coming soon!

**Q: Can I type drug names?**
A: Yes, use the search box in the dropdown to filter.

**Q: How do I deselect a drug?**
A: Click the selected drug again in the dropdown.

**Q: What does the arrow (→) mean?**
A: It shows which gene is analyzed for each drug.

## Summary

The Drug Input UI provides:
- ✅ Professional searchable interface
- ✅ Clear visual feedback
- ✅ Drug→gene mapping preview
- ✅ Multi-select capability
- ✅ Responsive design
- ✅ Accessibility support
- ✅ Error handling
- ✅ Loading states

Ready for production use! 🎉
