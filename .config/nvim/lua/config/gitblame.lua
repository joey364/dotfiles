--local status_ok, _ = pcall(require, "git-blame")
--if not status_ok then
--  return
--end

vim.g.gitblame_enabled = 1
vim.g.gitblame_date_format = "%r"
