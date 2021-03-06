# XDG_BASE_DIRS
export XDG_DATA_HOME="${XDG_DATA_HOME:-"$HOME/.local/share"}"
export XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-"$HOME/.config"}"
export XDG_STATE_HOME="${XDG_STATE_HOME:-"$HOME/.local/state"}"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-"$HOME/.cache"}"

# rust and tools
export CARGO_HOME="$XDG_DATA_HOME/cargo"
export RUSTUP_HOME="$XDG_DATA_HOME/rustup"
source "$CARGO_HOME/env" # source cargo env

# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$HOME/.local/bin:$PATH

# Preferred editor 
export EDITOR='nvim'

# nvm (node version manager) 
export NVM_DIR="${NVM_DIR:-"$XDG_DATA_HOME/nvm"}"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm setup  

# WebP 
# export PATH=$PATH:/opt/libwebp-1.2.0-linux-x86-64/bin

# Clangd
# export PATH=$PATH:/usr/bin/clangd-9

# Yarn 
export PATH="$PATH:$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin"

# Firefox
# export PATH=$PATH:/opt/firefox/firefox

# Go  
export GOPATH="${GOPATH:-"$XDG_DATA_HOME/go"}"
export GOBIN="$GOPATH/bin"
export GOROOT="${GOROOT:-"$HOME/goroot"}"
export PATH="$PATH:$GOBIN:$GOROOT/bin"

# Flutter  
# export PATH=$PATH:/opt/flutter/bin

# java
export JAVA_HOME=$(dirname $(dirname $(readlink $(readlink $(which javac)))))
