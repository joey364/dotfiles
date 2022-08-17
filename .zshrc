
#          _              
#  _______| |__  _ __ ___ 
# |_  / __| '_ \| '__/ __|
#  / /\__ \ | | | | | (__ 
# /___|___/_| |_|_|  \___|
#
                        
# zsh completion init
autoload -U compinit
compinit -i

plugins=(
  autojump
  git
  vi-mode
  zsh-autosuggestions
  zsh-syntax-highlighting
)

# Path to your oh-my-zsh installation.
export ZSH="/home/joel/.oh-my-zsh"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
HIST_STAMPS="mm/dd/yyyy"

# ignore all duplicate commands
setopt HIST_IGNORE_ALL_DUPS
# handling duplicate commands
setopt HIST_FIND_NO_DUPS
# following should be turned off, if sharing history via setopt SHARE_HISTORY
setopt INC_APPEND_HISTORY
# do not save duplicate commands
setopt HIST_SAVE_NO_DUPS  
# remove unnecessary blanks
setopt HIST_REDUCE_BLANKS 

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
export LANG=en_US.UTF-8

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# enable color support of ls and also add handy aliases
# if [ -x /usr/bin/dircolors ]; then
#   test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
#   # alias ls='ls --color=auto'
#   # alias ll= 'exa -l'
#   #alias dir='dir --color=auto'
#   #alias vdir='vdir --color=auto'
# fi

alias ls='exa --icons'
alias la='exa -lah --icons'
alias ~='~ && clear'

# Grepa aliases
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Package management aliases 
if [ -f "/etc/fedora-release" ] || [ -f "/etc/redhat-release" ]; then
  alias rpminstall='sudo rpm -i $@'
  alias install='sudo dnf install $@ -y'
  alias reinstall='sudo dnf reinstall $@ -y'
  alias check-update='sudo dnf check-update'
  alias remove='sudo dnf remove $@ -y'
  alias update='sudo dnf upgrade'
  alias upgrade='sudo dnf upgrade -y'
  alias search='dnf search $@'
  alias info='dnf info $@'
  alias provides='dnf provides $@'
else
  alias debinstall='sudo dpkg -i $@'
  alias install='sudo apt-fast install $@ -y'
  alias remove='sudo apt remove $@ -y'
  alias apdate='sudo apt-fast update'
  alias apgrade='sudo apt-fast update; sudo apt-fast upgrade -y'
fi

# Nordvpn aliases
alias us='sudo nordvpn c United_States'
alias uk='sudo nordvpn c United_Kingdom'
alias jp='sudo nordvpn c Japan'
alias d='nordvpn d'

# dotfiles setup
alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

# Useful helpers
alias uptime='uptime -p'
alias snap='sudo snap'
alias watch='sass $@ --watch -s compressed '
alias cat='~/.local/share/cargo/bin/bat'
alias logout='gnome-session-quit'
alias yarn='yarn --emoji true'
alias lg='lazygit'
alias run-as-cron='crontab -l | grep -v '^#' | cut -f 6- -d ' ' | while read CMD; do eval $CMD; done'
# alias nvim='lvim'

# convert other document formats to pdf using libreoffice
alias x2pdf='libreoffice --convert-to pdf $@' 

# adb no permissions fix
alias adbfix='~/scripts/adb_no_permission_fix.sh'

# remove lunarvim
alias rm-lvim='~/scripts/rm-lvim.sh'

# bun 
# alias bun='sde -chip-check-disable -- bun'

# Change cursor shape for different vi modes.
function zle-keymap-select {
if [[ ${KEYMAP} == vicmd ]] ||
  [[ $1 = 'block' ]]; then
  echo -ne '\e[1 q'
elif [[ ${KEYMAP} == main ]] ||
  [[ ${KEYMAP} == viins ]] ||
  [[ ${KEYMAP} = '' ]] ||
  [[ $1 = 'beam' ]]; then
  echo -ne '\e[5 q'
fi
}
zle -N zle-keymap-select

zle-line-init() {
  zle -K viins # initiate `vi insert` as keymap (can be removed if `bindkey -V` has been set elsewhere)
  echo -ne "\e[5 q"
}

zle -N zle-line-init
echo -ne '\e[5 q' # Use beam shape cursor on startup.
preexec() { echo -ne '\e[5 q' ;} # Use beam shape cursor for each new prompt.

# remap escape key to jk 
bindkey -M viins 'jk' vi-cmd-mode

# # support for pywal themes 
# (\cat ~/.cache/wal/sequences &)
# 
# # To add support for TTYs this line can be optionally added.
# source ~/.cache/wal/colors-tty.sh


#Codi Shell wrapper for neovim
codi() {
  local syntax="${1:-python}"
  shift
  nvim -c \
    "let g:startify_disable_at_vimenter = 1 |\
    set bt=nofile ls=0 noru nonu nornu |\
    hi CodiVirtualText guifg=red
      hi ColorColumn ctermbg=NONE |\
        hi VertSplit ctermbg=NONE |\
        hi NonText ctermfg=0 |\
        Codi $syntax" "$@"
      }


# Please leave me here 
# Starship prompt
eval "$(starship init zsh)"

export STARSHIP_CONFIG=~/.config/starship.toml 

# Bun
export BUN_INSTALL="/home/joel/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# bun completions
[ -s "/home/joel/.bun/_bun" ] && source "/home/joel/.bun/_bun"
