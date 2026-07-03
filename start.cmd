@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0backend"

echo Запускаем «Плюши»...
echo.

if not exist "node_modules" (
  echo Устанавливаем зависимости...
  call npm install
  if errorlevel 1 (
    echo Не удалось установить зависимости.
    pause
    exit /b 1
  )
)

if not exist ".env" (
  echo Создаем .env из примера...
  copy ".env.example" ".env" >nul
)

echo Сайт откроется по адресу http://localhost:4000
echo.

start "" "http://localhost:4000"
call npm start
