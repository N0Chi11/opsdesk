' 总控台（Windows 版）— 无窗口双击启动器，等价于 macOS 的 总控台.app
' 后台运行 server.py --launcher：实例去重/打开/重启对话框由服务端处理，
' 输出写入 %LOCALAPPDATA%\总控台\console.log。
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = projectDir
shell.Run "pythonw.exe server.py --launcher", 0, False
