---
name: hscsg-github-bookmark-extractor
description: Extracts GitHub URLs from exported browser bookmarks HTML.
category: devops
version: 1.0.0
author: HSCSG
---

# HSCSG GitHub Bookmark Extractor Skill

## Purpose
Extract GitHub repository URLs from exported browser bookmarks (Netscape HTML format) for assimilation pipelines.

## When to Use
- Have exported browser bookmarks (Netscape HTML)
- Need to isolate GitHub repository links
- Feeding assimilation pipelines with curated repos

## Input
- Exported bookmarks HTML file (Netscape format from Chrome/Edge/Firefox)
- Default: `sections/bookmarks_16_7_26.html`

## Process
1. Read input HTML file
2. Regex pattern: `<A\s+HREF="([^"]*github\.com[^"]*)"[^>]*>(.*?)</A>`
3. Extract all GitHub URLs with titles
4. Output filtered Netscape HTML with only GitHub bookmarks

## Output
- `github_bookmarks.html` - Filtered Netscape bookmark file
- Console log with count found

## Usage
```python
from hscsg_github_bookmark_extractor import extract_github_bookmarks
extract_github_bookmarks('path/to/bookmarks.html', 'github_bookmarks.html')
```

## Integration with HSCSG
- Feeds hscsg-repo-assimilation with curated repo list
- Extracted repos can be batched for assimilation
- Output feeds hscsg-repo-assimilation skill
- Can schedule as cron job for continuous curation

## Requirements
- Python 3.x
- Input file in Netscape bookmark format
- Export from browser: Chrome/Edge → Bookmarks → Export