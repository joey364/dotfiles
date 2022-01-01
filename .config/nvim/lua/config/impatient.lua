local status_ok, impoatient = pcall(require, "impatient")
if not status_ok then
  return
end

impoatient.enable_profile()
