#!/bin/bash

for i in {1..10}; do
  echo "=== Iteration $i/10 ==="

  echo "Running: codex"
  codex exec "README.md を読んで進めてください"
  if [ $? -ne 0 ]; then
    echo "Error: codex failed at iteration $i" >&2
    exit 1
  fi

  echo "Waiting 5 minutes..."
  sleep 300

  echo "Running: claude"
  claude -p "README.md を読んで進めてください"
  if [ $? -ne 0 ]; then
    echo "Error: claude failed at iteration $i" >&2
    exit 1
  fi

  echo "Waiting 5 minutes..."
  sleep 300
done

echo "All iterations completed successfully"
