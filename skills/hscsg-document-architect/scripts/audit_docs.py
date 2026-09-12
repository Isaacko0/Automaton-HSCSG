#!/usr/bin/env python3
"""
Audit HSCSG_v15_OS docs/*.md for common silent corruption:
  - Markdown tables missing the `|---|---|` separator (renders as paragraph)
  - English/German/Portuguese interference typos in Spanish content
  - Encoding rot (â€™ / Ã¡ / â€)
  - Excessive TODO/FIXME markers
  - Empty `## N.` sections

Usage:
  python3 audit_docs.py                # audit all docs in docs/
  python3 audit_docs.py file1.md ...   # audit specific files
  python3 audit_docs.py --fix          # attempt auto-fixes (typos only; tables need manual)

Exit code 0 = clean, 1 = issues found, 2 = errors.

Recipes distilled from `hscsg-document-architect` skill, learned 2026-09-04.
"""

import re
import sys
import os
from pathlib import Path

# ----- Config ----------------------------------------------------------------

# Resolve repo root from script location: skills/<name>/scripts/ → ../../..
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent.parent
DOCS_DIR = REPO_ROOT / "docs"

# Common typos: pattern -> correction
TYPO_FIXES = [
    (r"\bHSCSGllama\b", "HSCSG llama"),
    (r"\bHSCSG addtion\b", "HSCSG añade"),
    (r"\bHSCSG addtion\b", "HSCSG añade"),
    (r"\bclassifyadas\b", "clasificadas"),
    (r"\binformaless\b", "informales"),
    (r"\bLex I MJ\b", "Ley I MJ"),
    (r"\bLex II MJ\b", "Ley II MJ"),
    (r"\bLex III MJ\b", "Ley III MJ"),
    (r"\bmögliche\b", "posible"),
    (r"\b troba \b", " encuentra "),
    (r"\b trobes \b", " encuentres "),
    (r"\bHSCSG compartida\b", "HSCSG comparte"),
    (r"\binteroperability\b", "interoperabilidad"),
    (r"\bformats\b", "formatos"),
    (r"\bPilar 4\b", "Pilar 4"),  # placeholder
    (r"\bPilar 5\b", "Pilar 5"),
    (r"\bHSCSGllama\b", "HSCSG llama"),
    (r"\bMateriales M\d?H\b", "Materialismo Jerárquico"),
]

ENCODING_ROT = ["â€™", "â€œ", "â€", "Ã¡", "Ã©", "Ã­", "Ã³", "Ãº", "Ã±"]

# ----- Audit helpers ---------------------------------------------------------

def find_broken_tables(content: str) -> list[tuple[int, str]]:
    """Find markdown table headers without a `|---|---|` separator on the next line."""
    lines = content.split("\n")
    broken = []
    for i, line in enumerate(lines):
        s = line.strip()
        if s.startswith("|") and s.endswith("|") and s.count("|") >= 3:
            # Skip separator-like lines (e.g. `|---|---`)
            if "---" in s and re.match(r"^\|[\s\-:|]+\|$", s):
                continue
            if i + 1 < len(lines):
                nxt = lines[i + 1].strip()
                if not (nxt.startswith("|") and "---" in nxt and nxt.endswith("|")):
                    broken.append((i + 1, line[:80]))
    return broken


def find_typos(content: str) -> dict[str, int]:
    """Count occurrences of each known typo pattern."""
    found = {}
    for pat, fix in TYPO_FIXES:
        # Compile fresh each time to avoid cross-pattern backslash issues
        try:
            count = len(re.findall(pat, content))
            if count > 0:
                found[pat] = count
        except re.error:
            pass
    return found


def find_encoding_rot(content: str) -> dict[str, int]:
    found = {}
    for marker in ENCODING_ROT:
        c = content.count(marker)
        if c > 0:
            found[marker] = c
    return found


def find_excessive_todos(content: str) -> int:
    return len(re.findall(r"\b(TODO|FIXME|XXX|HACK)\b", content, re.IGNORECASE))


def find_truncation_markers(content: str) -> int:
    """Real truncations: word... word (not intentional ellipsis)."""
    return len(re.findall(r"\w\.\.\.\s+\w", content))


def find_empty_sections(content: str) -> int:
    """## N. Title\n\n## N+1. (no body between them)."""
    return len(re.findall(r"^##\s+[^\n]+\n\n##\s", content, re.MULTILINE))


# ----- Auto-fix --------------------------------------------------------------

def auto_fix(content: str) -> tuple[str, dict[str, int]]:
    """Apply typo fixes. Tables and encoding need manual handling."""
    changes = {}
    for pat, fix in TYPO_FIXES:
        new, n = re.subn(pat, fix, content)
        if n > 0:
            changes[pat] = n
            content = new
    return content, changes


# ----- Main ------------------------------------------------------------------

def audit_file(path: Path, auto_fix_mode: bool = False) -> int:
    if not path.exists():
        print(f"ERROR: {path} not found")
        return 2

    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            content = path.read_text(encoding="latin-1")
            print(f"  [WARN] {path.name}: read as latin-1 (encoding rot suspected)")
        except Exception as e:
            print(f"ERROR reading {path}: {e}")
            return 2

    print(f"\n=== {path.name} ===")
    issues = 0

    broken_tables = find_broken_tables(content)
    if broken_tables:
        print(f"  [FAIL] {len(broken_tables)} tables missing `|---|---|` separator:")
        for ln, txt in broken_tables[:10]:
            print(f"          line {ln}: {txt}")
        if len(broken_tables) > 10:
            print(f"          ... and {len(broken_tables) - 10} more")
        issues += len(broken_tables)
    else:
        print(f"  [OK]   all markdown tables have separator")

    typos = find_typos(content)
    if typos:
        print(f"  [FAIL] {sum(typos.values())} typo occurrences:")
        for pat, n in typos.items():
            print(f"          {pat}  x{n}")
        issues += sum(typos.values())
    else:
        print(f"  [OK]   no known typos detected")

    encoding = find_encoding_rot(content)
    if encoding:
        print(f"  [FAIL] encoding rot markers:")
        for m, n in encoding.items():
            print(f"          {m}  x{n}")
        issues += sum(encoding.values())
    else:
        print(f"  [OK]   no encoding rot")

    truncations = find_truncation_markers(content)
    if truncations > 5:
        print(f"  [WARN] {truncations} potential truncation markers (word... word)")
        issues += truncations

    todos = find_excessive_todos(content)
    if todos > 5:
        print(f"  [INFO] {todos} TODO/FIXME markers (intentional in plan docs?)")

    empty = find_empty_sections(content)
    if empty:
        print(f"  [WARN] {empty} empty `## N.` sections (heading followed immediately by next heading)")

    # Auto-fix
    if auto_fix_mode and (typos or encoding):
        new_content, changes = auto_fix(content)
        if changes:
            # Don't overwrite, just report
            print(f"  [FIX]  would apply {sum(changes.values())} typo fixes (run with --write to apply)")

    return 1 if issues > 0 else 0


def main() -> int:
    args = sys.argv[1:]
    auto_fix_mode = "--fix" in args
    write_mode = "--write" in args
    args = [a for a in args if a not in ("--fix", "--write")]

    if args:
        files = [Path(a) for a in args]
    else:
        files = sorted(DOCS_DIR.glob("*.md"))

    if not files:
        print(f"No .md files in {DOCS_DIR}")
        return 2

    total_issues = 0
    for f in files:
        total_issues += audit_file(f, auto_fix_mode)

    print(f"\n{'='*60}")
    if total_issues == 0:
        print(f"✅ All {len(files)} files clean")
        return 0
    else:
        print(f"❌ {total_issues} issues found across {len(files)} files")
        print(f"   Run with --fix to see what auto-corrections would apply")
        return 1


if __name__ == "__main__":
    sys.exit(main())
