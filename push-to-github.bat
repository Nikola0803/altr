@echo off
cd /d "%~dp0"
echo Adding all changes...
git add .
echo Committing...
git commit -m "Update ALTR site"
echo Pushing to GitHub...
git push -u origin master
echo.
echo Done! Press any key to close.
pause
