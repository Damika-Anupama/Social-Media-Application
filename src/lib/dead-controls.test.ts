import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * No button may be wired to nothing.
 *
 * I claimed, in a commit message, that no control in this app pretended to
 * work. Then I actually counted: twenty buttons had no handler at all. Clicking
 * them did nothing, silently — voice call, attach a file, change your avatar,
 * follow someone. A control that does nothing when pressed reads as broken, not
 * as out of scope.
 *
 * Everything now either does its job or says why it does not (DemoButton). This
 * guard exists because my eye demonstrably could not be trusted with it: a
 * <button> with no onClick, no submit, and no spread props is a bug.
 */

function tsxFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...tsxFiles(path));
    else if (path.endsWith('.tsx')) out.push(path);
  }
  return out;
}

/** Comments contain example markup; they are prose, not controls. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/**
 * Read a JSX opening tag, tracking brace depth — an attribute like
 * `onClick={() => x}` contains a `>`, so naive matching stops in the wrong
 * place and reports handlers that are plainly there.
 */
function openingTag(source: string, start: number): string {
  let depth = 0;
  let tag = '';
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '>' && depth === 0) break;
    tag += ch;
  }
  return tag;
}

function deadButtons(): string[] {
  const dead: string[] = [];

  for (const file of tsxFiles('src')) {
    const source = stripComments(readFileSync(file, 'utf8'));
    const pattern = /<button\b/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(source))) {
      const tag = openingTag(source, match.index + '<button'.length);

      // A real control does something: handles a click, submits a form, or has
      // its props spread in from a hook (the tabs, for instance).
      if (/onClick|type="submit"|\{\.\.\./.test(tag)) continue;

      const line = source.slice(0, match.index).split('\n').length;
      const label = /aria-label=["{]([^"}]+)/.exec(tag)?.[1] ?? '(unnamed)';
      dead.push(`${file}:${line} — ${label.trim()}`);
    }
  }
  return dead;
}

/**
 * A link to "#" is the anchor equivalent of a dead button: it looks clickable
 * and goes nowhere. Real destinations (a route, an external URL) or a
 * DemoButton if the action is out of scope.
 */
function deadLinks(): string[] {
  const dead: string[] = [];
  for (const file of tsxFiles('src')) {
    const source = stripComments(readFileSync(file, 'utf8'));
    const pattern = /href="#"/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source))) {
      const line = source.slice(0, match.index).split('\n').length;
      dead.push(`${file}:${line}`);
    }
  }
  return dead;
}

describe('interactive controls', () => {
  it('has no button wired to nothing', () => {
    // Use DemoButton if a control is deliberately out of scope: it says so
    // instead of failing silently.
    expect(deadButtons()).toEqual([]);
  });

  it('has no link pointing at "#"', () => {
    expect(deadLinks()).toEqual([]);
  });
});
