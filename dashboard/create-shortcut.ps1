$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut('C:\Users\Isaacko0\Desktop\Cosatecon.lnk')
$Shortcut.TargetPath = 'C:\Users\Isaacko0\cosatecon\start-all.bat'
$Shortcut.WorkingDirectory = 'C:\Users\Isaacko0\cosatecon'
$Shortcut.Description = 'Inicia Cosatecon Dashboard + Instabox'
$Shortcut.Save()
Write-Host 'Shortcut created'