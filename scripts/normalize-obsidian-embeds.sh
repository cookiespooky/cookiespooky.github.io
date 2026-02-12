#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

ROOT_DIR="${1:-./content}"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "normalize-obsidian-embeds: directory not found: $ROOT_DIR"
  exit 1
fi

echo "normalize-obsidian-embeds: scanning $ROOT_DIR"

find "$ROOT_DIR" -type f -name '*.md' -print0 | while IFS= read -r -d '' file; do
  perl -0777 -i - "$file" <<'PERL'
sub trim {
  my ($s) = @_;
  $s =~ s/^\s+|\s+$//g;
  return $s;
}

sub normalize_wikilink_value {
  my ($raw) = @_;
  my $v = trim($raw);
  $v =~ s/^"(.*)"$/$1/s;
  $v =~ s/^'(.*)'$/$1/s;
  # [[slug]], [[slug|alias]], [[slug#anchor]], [[slug#anchor|alias]]
  if ($v =~ /^\[\[([^\]#|]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]$/) {
    return trim($1);
  }
  return $v;
}

sub normalize_hub_frontmatter {
  my ($fm) = @_;
  my @lines = split /\n/, $fm, -1;
  my @out = ();
  my $i = 0;

  while ($i <= $#lines) {
    my $line = $lines[$i];

    # hub scalar: hub: [[slug]]
    if ($line =~ /^hub:\s*(\S.*)$/) {
      my $norm = normalize_wikilink_value($1);
      push @out, "hub:";
      push @out, "  - \"$norm\"";
      $i++;
      next;
    }

    # hub list:
    # hub:
    #   - [[slug]]
    if ($line =~ /^hub:\s*$/) {
      push @out, "hub:";
      $i++;
      while ($i <= $#lines && $lines[$i] =~ /^[ \t]+-\s*(.*?)\s*$/) {
        my $norm = normalize_wikilink_value($1);
        push @out, "  - \"$norm\"";
        $i++;
      }
      next;
    }

    push @out, $line;
    $i++;
  }

  return join("\n", @out);
}

while (<>) {
  # Normalize Obsidian wikilinks in frontmatter hub field only.
  # Body wikilinks stay untouched.
  s{\A---\r?\n([\s\S]*?)\r?\n---\r?\n}{
    my $fm = $1;
    my $norm = normalize_hub_frontmatter($fm);
    "---\n$norm\n---\n";
  }eg;

  # Normalize Obsidian image embeds in markdown body.
  s{!\[\[([^\]|]+?\.(?:png|jpe?g|gif|webp|svg|avif|bmp|ico))(?:\#[^\]|]+)?(?:\|([^\]]+))?\]\]}{
    my $path = $1;
    my $alt = defined($2) ? $2 : "";
    $alt =~ s/^\s+|\s+$//g;
    $alt = "" if $alt =~ /^\d+(?:x\d+)?$/;
    "![$alt]($path)"
  }egi;

  print;
}
PERL
done

echo "normalize-obsidian-embeds: done"
