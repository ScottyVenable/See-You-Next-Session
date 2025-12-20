# Automated Testing & CI Pipeline Guide

> **Document Type:** Technical Reference  
> **Created:** December 20, 2025  
> **Authors:** Development Team  
> **Status:** Planning/Implementation Guide

---

## 1. Testing Strategy Overview

### Test Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests  │  Few, slow, comprehensive
                    │  (Cypress)   │
                    └──────┬──────┘
                   ┌───────┴───────┐
                   │ Integration   │  More coverage, moderate speed
                   │   Tests       │
                   │ (React Testing│
                   │   Library)    │
                   └───────┬───────┘
              ┌────────────┴────────────┐
              │      Unit Tests         │  Many, fast, focused
              │      (Vitest)           │
              └─────────────────────────┘
```

### Testing Priorities for This Project

| Priority | System | Test Type | Criticality |
|----------|--------|-----------|-------------|
| 1 | SDNS Parser | Unit | Critical - game breaks without it |
| 2 | Keyword System | Unit | Critical - core mechanic |
| 3 | GameContext State | Integration | High - manages all game state |
| 4 | Dialogue Flow | Integration | High - main gameplay loop |
| 5 | Token System | Unit | Medium - synthesis mechanics |
| 6 | UI Components | Integration | Medium - user experience |
| 7 | Full Session | E2E | Low priority for MVP |

---

## 2. Recommended Testing Stack

### Dependencies to Install

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0",
    "cypress": "^13.0.0"
  }
}
```

### Installation Command

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## 3. Vitest Configuration

### vite.config.js Update

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.jsx'
      ]
    }
  }
});
```

### Test Setup File

```javascript
// src/test/setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Audio for SoundManager tests
window.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  addEventListener: vi.fn(),
}));
```

---

## 4. Unit Test Examples

### SDNS Parser Tests

```javascript
// src/sdns/parser.test.js
import { describe, it, expect } from 'vitest';
import { parseSDNS } from './parser.js';

describe('SDNS Parser', () => {
  describe('Block Parsing', () => {
    it('should parse a simple block', () => {
      const input = `=== START ===
PATIENT
"Hello, doctor."
-> next_block`;
      
      const result = parseSDNS(input);
      
      expect(result.blocks).toHaveProperty('START');
      expect(result.blocks.START.lines).toHaveLength(2);
    });

    it('should parse multiple blocks', () => {
      const input = `=== START ===
PATIENT
"First block."
-> second

=== second ===
PATIENT
"Second block."`;
      
      const result = parseSDNS(input);
      
      expect(Object.keys(result.blocks)).toHaveLength(2);
      expect(result.blocks).toHaveProperty('START');
      expect(result.blocks).toHaveProperty('second');
    });

    it('should handle empty blocks gracefully', () => {
      const input = `=== EMPTY ===
=== NEXT ===
PATIENT
"Content."`;
      
      const result = parseSDNS(input);
      
      expect(result.blocks.EMPTY.lines).toHaveLength(0);
    });
  });

  describe('Keyword Extraction', () => {
    it('should extract keywords from dialogue', () => {
      const input = `=== START ===
PATIENT
"I've been having [trouble sleeping]<keyword:gregory.sleep.trouble>."`;
      
      const result = parseSDNS(input);
      const line = result.blocks.START.lines[0];
      
      expect(line.keywords).toHaveLength(1);
      expect(line.keywords[0]).toMatchObject({
        text: 'trouble sleeping',
        id: 'gregory.sleep.trouble'
      });
    });

    it('should extract multiple keywords from one line', () => {
      const input = `=== START ===
PATIENT
"I feel [anxious]<keyword:emotion.anxious> and [tired]<keyword:physical.tired>."`;
      
      const result = parseSDNS(input);
      const line = result.blocks.START.lines[0];
      
      expect(line.keywords).toHaveLength(2);
    });

    it('should handle keywords with contradiction markers', () => {
      const input = `=== START ===
PATIENT
"I sleep [fine]<keyword:sleep.fine><contradicts:bags_under_eyes>."`;
      
      const result = parseSDNS(input);
      const keyword = result.blocks.START.lines[0].keywords[0];
      
      expect(keyword.contradicts).toBe('bags_under_eyes');
    });
  });

  describe('Conditional Parsing', () => {
    it('should parse @if conditions', () => {
      const input = `=== START ===
@if rapport >= 50
    PATIENT
    "High rapport dialogue."
@else
    PATIENT
    "Low rapport dialogue."
@endif`;
      
      const result = parseSDNS(input);
      
      expect(result.blocks.START.conditionals).toHaveLength(1);
    });
  });

  describe('Speaker and Mood', () => {
    it('should parse speaker with mood', () => {
      const input = `=== START ===
PATIENT (nervous)
"I'm a bit nervous."`;
      
      const result = parseSDNS(input);
      const line = result.blocks.START.lines[0];
      
      expect(line.speaker).toBe('PATIENT');
      expect(line.mood).toBe('nervous');
    });
  });
});
```

### Keyword System Tests

```javascript
// src/data/keywords/keyword-parser.test.js
import { describe, it, expect } from 'vitest';
import { parseKeyword, validateKeywordId } from './keyword-parser.js';

describe('Keyword Parser', () => {
  describe('parseKeyword', () => {
    it('should parse a full keyword syntax', () => {
      const input = '[anxious]<keyword:gregory.emotion.anxious><anim:pulse>';
      const result = parseKeyword(input);
      
      expect(result).toMatchObject({
        displayText: 'anxious',
        type: 'keyword',
        id: 'gregory.emotion.anxious',
        animation: 'pulse'
      });
    });

    it('should handle keywords without animation', () => {
      const input = '[tired]<keyword:gregory.physical.tired>';
      const result = parseKeyword(input);
      
      expect(result.animation).toBeUndefined();
    });

    it('should handle style markers', () => {
      const input = '[critical]<keyword:symptom.critical><style:symptom.critical>';
      const result = parseKeyword(input);
      
      expect(result.style).toBe('symptom.critical');
    });
  });

  describe('validateKeywordId', () => {
    it('should accept valid 3-part IDs', () => {
      expect(validateKeywordId('gregory.emotion.anxious')).toBe(true);
      expect(validateKeywordId('patient.category.keyword')).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(validateKeywordId('invalid')).toBe(false);
      expect(validateKeywordId('only.two')).toBe(false);
      expect(validateKeywordId('')).toBe(false);
    });
  });
});
```

### GameContext Tests

```javascript
// src/context/GameContext.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext.jsx';

describe('GameContext', () => {
  const wrapper = ({ children }) => <GameProvider>{children}</GameProvider>;

  describe('Focus System', () => {
    it('should start with max focus', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      expect(result.current.gameState.focus).toBe(100);
    });

    it('should spend focus correctly', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.actions.spendFocus(15);
      });
      
      expect(result.current.gameState.focus).toBe(85);
    });

    it('should not allow focus below 0', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.actions.spendFocus(150);
      });
      
      expect(result.current.gameState.focus).toBe(0);
    });

    it('should restore focus on breakthrough', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.actions.spendFocus(50);
        result.current.actions.triggerBreakthrough({ focusRestore: 40 });
      });
      
      expect(result.current.gameState.focus).toBe(90);
    });
  });

  describe('Rapport System', () => {
    it('should start with base rapport', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      expect(result.current.gameState.rapport).toBeGreaterThan(0);
    });

    it('should increase rapport on good choices', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      const initialRapport = result.current.gameState.rapport;
      
      act(() => {
        result.current.actions.adjustRapport(10);
      });
      
      expect(result.current.gameState.rapport).toBe(initialRapport + 10);
    });

    it('should cap rapport at 100', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.actions.adjustRapport(200);
      });
      
      expect(result.current.gameState.rapport).toBe(100);
    });
  });

  describe('Token Collection', () => {
    it('should add text tokens', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.actions.addToken({
          id: 'token-1',
          type: 'text',
          content: 'trouble sleeping'
        });
      });
      
      expect(result.current.gameState.textTokens).toHaveLength(1);
    });

    it('should not add duplicate tokens', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      const token = { id: 'token-1', type: 'text', content: 'trouble sleeping' };
      
      act(() => {
        result.current.actions.addToken(token);
        result.current.actions.addToken(token);
      });
      
      expect(result.current.gameState.textTokens).toHaveLength(1);
    });
  });
});
```

---

## 5. Integration Test Examples

### DialogueBox Integration Test

```javascript
// src/components/game/DialogueBox.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameProvider } from '../../context/GameContext.jsx';
import DialogueBox from './DialogueBox.jsx';

const mockDialogue = {
  speaker: 'PATIENT',
  mood: 'nervous',
  text: 'I have been having [trouble sleeping]<keyword:gregory.sleep.trouble>.',
  keywords: [
    { text: 'trouble sleeping', id: 'gregory.sleep.trouble' }
  ]
};

describe('DialogueBox Integration', () => {
  const renderWithContext = (props) => {
    return render(
      <GameProvider>
        <DialogueBox {...props} />
      </GameProvider>
    );
  };

  it('should display dialogue text', async () => {
    renderWithContext({ dialogue: mockDialogue });
    
    await waitFor(() => {
      expect(screen.getByText(/trouble sleeping/i)).toBeInTheDocument();
    });
  });

  it('should make keywords clickable', async () => {
    const user = userEvent.setup();
    renderWithContext({ dialogue: mockDialogue });
    
    await waitFor(() => {
      const keyword = screen.getByText(/trouble sleeping/i);
      expect(keyword).toHaveClass('keyword');
    });
  });

  it('should show speaker and mood', () => {
    renderWithContext({ dialogue: mockDialogue });
    
    expect(screen.getByText(/patient/i)).toBeInTheDocument();
    expect(screen.getByText(/nervous/i)).toBeInTheDocument();
  });

  it('should trigger keyword collection on click', async () => {
    const user = userEvent.setup();
    const onKeywordCollect = vi.fn();
    
    renderWithContext({ 
      dialogue: mockDialogue,
      onKeywordCollect 
    });
    
    await waitFor(async () => {
      const keyword = screen.getByText(/trouble sleeping/i);
      await user.click(keyword);
    });
    
    expect(onKeywordCollect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'gregory.sleep.trouble' })
    );
  });
});
```

---

## 6. CI Pipeline Configuration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, stable, develop]
  pull_request:
    branches: [main, stable]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Unit Tests
        run: npm run test:unit
      
      - name: Run Integration Tests
        run: npm run test:integration
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Web Version
        run: npm run build
      
      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: dist/
          retention-days: 7

  build-tauri:
    runs-on: ${{ matrix.os }}
    needs: test
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
      
      - name: Install dependencies (Ubuntu)
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
      
      - name: Install npm dependencies
        run: npm ci
      
      - name: Build Tauri App
        run: npm run tauri build
      
      - name: Upload Tauri Build
        uses: actions/upload-artifact@v4
        with:
          name: tauri-${{ matrix.os }}
          path: src-tauri/target/release/bundle/
          retention-days: 7
```

### Package.json Scripts Update

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri dev": "tauri dev",
    "tauri build": "tauri build",
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose",
    "test:integration": "vitest run --config vitest.integration.config.js",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/ --ext .js,.jsx",
    "lint:fix": "eslint src/ --ext .js,.jsx --fix"
  }
}
```

---

## 7. Test Coverage Goals

### MVP Coverage Targets

| System | Target Coverage | Notes |
|--------|-----------------|-------|
| SDNS Parser | 90% | Critical system |
| Keyword Parser | 85% | Core mechanic |
| GameContext | 80% | State management |
| Utility Functions | 75% | Error handling, etc. |
| UI Components | 60% | Focus on critical paths |

### Coverage Commands

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

## 8. Testing Best Practices

### Do

- Write tests before fixing bugs (regression prevention)
- Test edge cases and error states
- Use meaningful test descriptions
- Keep tests independent and isolated
- Mock external dependencies

### Don't

- Test implementation details (test behavior instead)
- Write overly specific snapshot tests
- Skip flaky tests without fixing them
- Test third-party library functionality
- Create tests that depend on other tests

### Test File Location

```
src/
├── sdns/
│   ├── parser.js
│   ├── parser.test.js        # Co-located with source
│   ├── engine.js
│   └── engine.test.js
├── components/
│   └── game/
│       ├── DialogueBox.jsx
│       └── DialogueBox.test.jsx
└── test/
    ├── setup.js              # Global test setup
    ├── mocks/                # Shared mocks
    └── fixtures/             # Test data
```

---

## 9. Running Tests

### Commands

```bash
# Run all tests once
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/sdns/parser.test.js

# Run tests matching pattern
npx vitest run --grep "keyword"
```

---

## Related Documents

- [Codebase Best Practices](./CODEBASE_BEST_PRACTICES.md)
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
