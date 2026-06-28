#!/usr/bin/env python3
"""
Keyword matching utility based on srbhr/Resume-Matcher logic.
https://github.com/srbhr/Resume-Matcher/blob/main/apps/frontend/lib/utils/keyword-matcher.ts

Extracts significant keywords from a job description, compares against resume text,
and reports match percentage plus missing keywords.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

MIN_WORD_LENGTH = 3

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "from", "as", "is", "was", "are", "were", "been", "be", "have",
    "has", "had", "do", "does", "did", "will", "would", "could", "should", "may",
    "might", "must", "shall", "can", "need", "dare", "ought", "used", "this",
    "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "what",
    "which", "who", "whom", "whose", "where", "when", "why", "how", "all", "each",
    "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just", "also",
    "now", "here", "there", "then", "once", "if", "about", "into", "through",
    "during", "before", "after", "above", "below", "between", "under", "again",
    "further", "any", "our", "your", "their", "my", "his", "her", "its", "us",
    "them", "me", "him", "being", "having", "doing", "get", "got", "make", "made",
    "work", "working", "experience", "years", "year", "ability", "able", "well",
    "strong", "excellent", "good", "great", "including", "include", "includes",
    "required", "preferred", "plus", "etc", "via", "using", "use", "used",
}


def extract_keywords(text: str) -> set[str]:
    """Extract significant keywords (lowercase, min length, no stop words/numbers)."""
    words = re.split(r"[^a-z0-9-]+", text.lower())
    keywords: set[str] = set()
    for word in words:
        if (
            len(word) >= MIN_WORD_LENGTH
            and word not in STOP_WORDS
            and not re.fullmatch(r"\d+", word)
        ):
            keywords.add(word)
    return keywords


def calculate_match_stats(resume_text: str, jd_keywords: set[str]) -> dict:
    resume_keywords = extract_keywords(resume_text)
    matched = {kw for kw in jd_keywords if kw in resume_keywords}
    total = len(jd_keywords)
    count = len(matched)
    pct = round((count / total) * 100) if total > 0 else 0
    missing = sorted(jd_keywords - matched)
    return {
        "matched_keywords": matched,
        "match_count": count,
        "total_keywords": total,
        "match_percentage": pct,
        "missing_keywords": missing,
    }


def color_band(pct: int) -> str:
    if pct >= 50:
        return "green"
    if pct >= 30:
        return "yellow"
    return "red"


def main() -> int:
    parser = argparse.ArgumentParser(description="Resume vs JD keyword matcher")
    parser.add_argument("--jd", required=True, help="Path to job description text file")
    parser.add_argument("--resume", required=True, help="Path to resume text/markdown")
    args = parser.parse_args()

    jd_path = Path(args.jd)
    resume_path = Path(args.resume)
    if not jd_path.exists():
        print(f"Error: JD file not found: {jd_path}", file=sys.stderr)
        return 1
    if not resume_path.exists():
        print(f"Error: Resume file not found: {resume_path}", file=sys.stderr)
        return 1

    jd_text = jd_path.read_text(encoding="utf-8")
    resume_text = resume_path.read_text(encoding="utf-8")
    jd_keywords = extract_keywords(jd_text)
    stats = calculate_match_stats(resume_text, jd_keywords)

    print("=" * 60)
    print("RESUME KEYWORD MATCH REPORT")
    print("=" * 60)
    print(f"Match: {stats['match_count']} / {stats['total_keywords']} keywords ({stats['match_percentage']}%)")
    print(f"Status: {color_band(stats['match_percentage']).upper()}")
    print()
    print("Matched keywords:")
    for kw in sorted(stats["matched_keywords"]):
        print(f"  ✓ {kw}")
    print()
    print("Missing keywords (add to resume where truthful):")
    for kw in stats["missing_keywords"]:
        print(f"  ✗ {kw}")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
