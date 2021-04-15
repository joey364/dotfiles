" Simplify the startify list to just recent files and sessions
let g:startify_lists = [
          \ { 'type': 'files',     'header': ['   Files']            },
          \ { 'type': 'dir',       'header': ['   Current Directory '. getcwd()] },
          \ { 'type': 'sessions',  'header': ['   Sessions']       },
          \ { 'type': 'bookmarks', 'header': ['   Bookmarks']      },
          \ ]

"Bookmarks"
let g:startify_bookmarks = [
            \ { 'i': '~/.config/nvim/init.vim' },
            \ { 'z': '~/.zshrc' },
            \ ]

let g:startify_session_autoload = 1

let g:startify_session_delete_buffers = 1

let g:startify_fortune_use_unicode = 1

let g:startify_session_persistence = 1

let g:startify_enable_special = 0

" Fancy custom header"

let s:header = [
        \ '        _                    _            ____  ____       ',
        \ '       (_)___  ___  __  __  (_)___  _____/ __ \/ __ \_  __ ',
        \ '      / / __ \/ _ \/ / / / / / __ \/ ___/ /_/ / /_/ / |/_/ ',
        \ '     / / /_/ /  __/ /_/ / / / / / / /   \__, /\__, />  <   ',
        \ '  __/ /\____/\___/\__, /_/ /_/ /_/_/   /____//____/_/|_|   ',
        \ ' /___/           /____/___/                                ',
        \]"

"let s:footer = [
"        \ '        _                    _            ____  ____       ',
"        \ '       (_)___  ___  __  __  (_)___  _____/ __ \/ __ \_  __ ',
"        \ '      / / __ \/ _ \/ / / / / / __ \/ ___/ /_/ / /_/ / |/_/ ',
"        \ '     / / /_/ /  __/ /_/ / / / / / / /   \__, /\__, />  <   ',
"        \ '  __/ /\____/\___/\__, /_/ /_/ /_/_/   /____//____/_/|_|   ',
"        \ ' /___/           /____/___/                                ',
"        \]"

function! s:center(lines) abort
  let longest_line   = max(map(copy(a:lines), 'strwidth(v:val)'))
  let centered_lines = map(copy(a:lines),
        \ 'repeat(" ", (&columns / 2) - (longest_line / 2)) . v:val')
  return centered_lines
endfunction

let g:startify_custom_header = s:center(s:header)
"let g:startify_custom_footer = s:center(s:footer)
"
