import argparse
import json
import shutil
from pathlib import Path


def looks_mojibake(s: str) -> bool:
    # Heuristic: common mojibake markers when UTF-8 was decoded as latin-1/cp1252
    return any(ch in s for ch in ("Ã", "à", "¢", "¤", "¦")) and not any(
        "\u0E00" <= ch <= "\u0E7F" for ch in s
    )


def fix_line(s: str) -> str:
    if not s:
        return s
    if looks_mojibake(s):
        try:
            t = s.encode("latin-1", errors="ignore").decode("utf-8", errors="ignore")
            # Accept if Thai characters appear after fix
            if any("\u0E00" <= ch <= "\u0E7F" for ch in t):
                return t
        except Exception:
            pass
    return s


def process_ipynb(path: Path, out: Path | None = None, backup: bool = True) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    for cell in data.get("cells", []):
        src = cell.get("source")
        if isinstance(src, list):
            new_src = []
            for line in src:
                new_line = fix_line(line)
                if new_line != line:
                    changed = True
                new_src.append(new_line)
            cell["source"] = new_src
        elif isinstance(src, str):
            new_src = fix_line(src)
            if new_src != src:
                changed = True
            cell["source"] = new_src

    target = out if out is not None else path
    if changed:
        if backup and out is None:
            shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))
        target.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    else:
        # Still write out if an explicit output was requested
        if out is not None and out != path:
            target.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description="Fix Thai mojibake in a Jupyter .ipynb file")
    ap.add_argument("notebook", help="Path to .ipynb file")
    ap.add_argument("--out", help="Output path (in-place if omitted)")
    ap.add_argument("--no-backup", action="store_true", help="Do not create .bak when writing in-place")
    args = ap.parse_args()

    p = Path(args.notebook)
    out = Path(args.out) if args.out else None
    process_ipynb(p, out=out, backup=not args.no_backup)


if __name__ == "__main__":
    main()

