#!/bin/bash

echo "Starting cleanup of nested Git repositories..."

# Find all .git directories that are nested within the main repository
NESTED_GIT_DIRS=$(find . -name ".git" -type d -not -path "./.git/*" -not -path ".")

if [ -z "$NESTED_GIT_DIRS" ]; then
    echo "No nested .git directories found."
else
    echo "Found nested .git directories:"
    echo "$NESTED_GIT_DIRS"
    
    echo ""
    echo "WARNING: The following nested Git repositories will be converted to regular directories:"
    for gitdir in $NESTED_GIT_DIRS; do
        parent_dir=$(dirname "$gitdir")
        echo "  - $parent_dir"
    done
    
    echo ""
    read -p "Do you want to proceed with removing these .git directories? (yes/no): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for gitdir in $NESTED_GIT_DIRS; do
            parent_dir=$(dirname "$gitdir")
            echo "Removing .git directory: $gitdir"
            rm -rf "$gitdir"
        done
        echo "Cleanup completed."
    else
        echo "Operation cancelled."
    fi
fi

echo ""
echo "Important: After this cleanup, you may need to:"
echo "1. Run 'git add .' to stage the removed directories"
echo "2. Run 'git commit' to commit the changes"
echo "3. If any of these were intended to be submodules, add them back with 'git submodule add'"