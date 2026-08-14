@echo off
rem 总控台（Windows 版）— 终端启动入口，等价于 macOS 的 start.command
setlocal
chcp 65001 >nul
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
  echo 错误：未找到 Python，请先安装 Python 3.12 或更高版本。
  echo 下载地址: https://www.python.org/downloads/
  pause
  exit /b 127
)

python -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 12) else 1)" >nul 2>&1
if errorlevel 1 (
  echo 错误：总控台需要 Python 3.12 或更高版本。
  pause
  exit /b 126
)

python server.py --launcher
if errorlevel 1 pause
endlocal
