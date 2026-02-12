#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

ROOT_DIR="${1:-./content}"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "normalize-obsidian-embeds: directory not found: $ROOT_DIR"
  exit 1
fi

echo "normalize-obsidian-embeds: scanning $ROOT_DIR"

FILES_RAW="$(find "$ROOT_DIR" -type f -name '*.md' -print)"
if [[ -z "$FILES_RAW" ]]; then
  echo "normalize-obsidian-embeds: no markdown files found"
  exit 0
fi

perl -0777 -i - $FILES_RAW <<'PERL'
use strict;
use warnings;

sub trim {
  my ($s) = @_;
  $s //= "";
  $s =~ s/^\s+|\s+$//g;
  return $s;
}

sub unquote {
  my ($v) = @_;
  $v = trim($v);
  $v =~ s/^"(.*)"$/$1/s;
  $v =~ s/^'(.*)'$/$1/s;
  return $v;
}

sub wiki_target {
  my ($raw) = @_;
  my $v = unquote($raw);
  # [[target]], [[target|alias]], [[target#anchor]], [[target#anchor|alias]]
  if ($v =~ /^\[\[([^\]#|]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]$/) {
    return trim($1);
  }
  return $v;
}

sub basename_no_ext {
  my ($path) = @_;
  my $name = $path;
  $name =~ s!.*[/\\]!!;
  $name =~ s/\.md$//i;
  return $name;
}

my @files = @ARGV;
my %slug_by_name = ();
my %content_by_file = ();

# Pass 1: build filename -> slug map from frontmatter.
for my $file (@files) {
  local $/;
  open my $fh, '<', $file or die "open $file: $!";
  my $text = <$fh>;
  close $fh;

  $content_by_file{$file} = $text;

  my $base = basename_no_ext($file);
  my $slug = $base;
  if ($text =~ /\A---\r?\n([\s\S]*?)\r?\n---\r?\n/) {
    my $fm = $1;
    if ($fm =~ /^slug:\s*(.+?)\s*$/m) {
      my $candidate = unquote($1);
      $slug = $candidate if $candidate ne "";
    }
  }

  $slug_by_name{$base} = $slug;
  $slug_by_name{"$base.md"} = $slug;
}

sub resolve_to_slug {
  my ($raw) = @_;
  my $target = wiki_target($raw);
  return $target if $target eq "";
  return $slug_by_name{$target} // $target;
}

sub normalize_hub_frontmatter {
  my ($fm) = @_;
  my @lines = split /\n/, $fm, -1;
  my @out = ();
  my $i = 0;

  while ($i <= $#lines) {
    my $line = $lines[$i];

    # hub scalar: hub: [[filename]] / hub: slug
    if ($line =~ /^hub:\s*(\S.*)$/) {
      my $norm = resolve_to_slug($1);
      push @out, "hub:";
      push @out, "  - \"$norm\"";
      $i++;
      next;
    }

    # hub list:
    # hub:
    #   - [[filename]]
    #   - slug
    if ($line =~ /^hub:\s*$/) {
      push @out, "hub:";
      $i++;
      while ($i <= $#lines && $lines[$i] =~ /^[ \t]+-\s*(.*?)\s*$/) {
        my $norm = resolve_to_slug($1);
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

# Pass 2: rewrite each file with normalized frontmatter + image embeds.
for my $file (@files) {
  my $text = $content_by_file{$file};

  # Normalize Obsidian wikilinks in frontmatter hub field only.
  # Body wikilinks stay untouched.
  $text =~ s{\A---\r?\n([\s\S]*?)\r?\n---\r?\n}{
    my $fm = $1;
    my $norm = normalize_hub_frontmatter($fm);
    "---\n$norm\n---\n";
  }eg;

  # Normalize Obsidian image embeds in markdown body.
  $text =~ s{!\[\[([^\]|]+?\.(?:png|jpe?g|gif|webp|svg|avif|bmp|ico))(?:\#[^\]|]+)?(?:\|([^\]]+))?\]\]}{
    my $path = $1;
    my $alt = defined($2) ? $2 : "";
    $alt =~ s/^\s+|\s+$//g;
    $alt = "" if $alt =~ /^\d+(?:x\d+)?$/;
    "![$alt]($path)"
  }egi;

  open my $out, '>', $file or die "write $file: $!";
  print {$out} $text;
  close $out;
}
PERL

echo "normalize-obsidian-embeds: done"
