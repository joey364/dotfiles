" auto-install vim-plug
if empty(glob('~/.config/nvim/autoload/plug.vim'))
  silent !curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  "autocmd VimEnter * PlugInstall
  "autocmd VimEnter * PlugInstall | source $MYVIMRC
endif

call plug#begin('~/.config/nvim/autoload/plugged')

    " Better Syntax Support
    Plug 'sheerun/vim-polyglot'
    " File Explorer
    Plug 'scrooloose/NERDTree'
    " Auto pairs for '(' '[' '{'
    Plug 'jiangmiao/auto-pairs'
    " Stable version of coc
    Plug 'neoclide/coc.nvim', {'branch': 'release'}
    Plug 'vim-airline/vim-airline'
    Plug 'vim-airline/vim-airline-themes'
    Plug 'norcalli/nvim-colorizer.lua'
    Plug 'junegunn/rainbow_parentheses.vim'
    "Fancy start screen for Neovim"
    Plug 'mhinz/vim-startify'
    "TSX and JSX syntax highlighting"
    Plug 'leafgarland/typescript-vim'
    Plug 'peitalin/vim-jsx-typescript'
    "Coc snippets:
    Plug 'honza/vim-snippets'
    "Themes"
    Plug 'rafi/awesome-vim-colorschemes'
    "Surrounding made easy "
    Plug 'tpope/vim-surround'
    "Vim Commentary"
    Plug 'tpope/vim-commentary' 
    "Vim auto save"
    Plug '907th/vim-auto-save' 
    "Tagalong not working"
    Plug 'AndrewRadev/tagalong.vim'
    "Tabnine for vim
    " Plug 'codota/tabnine-vim'
    " Codi Interactive Scratchpad 
    Plug 'metakirby5/codi.vim'
    " Treesitter
    " Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate' }
""    "
"
call plug#end()
