"""Create submission ZIP without dependencies, Git internals or screenshots."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
target=root.parent/'Hallo-Mehrweg-Abgabe.zip'
with ZipFile(target,'w',ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(root.rglob('*')):
  rel=p.relative_to(root)
  if any(part in ['node_modules','.git','test-results','__pycache__'] for part in rel.parts) or p.name=='.DS_Store':continue
  if p.is_file():z.write(p,Path(root.name)/rel)
assert target.stat().st_size<100_000_000
print(f'{target.name}: {target.stat().st_size/1_000_000:.2f} MB')
