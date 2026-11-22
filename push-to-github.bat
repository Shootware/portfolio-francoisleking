@echo off
cd /d "C:\Users\abade\OneDrive\Desktop\code2026\Projets\portfolio-francoisleking"

echo === Nettoyage .git existant ===
if exist .git rmdir /s /q .git

echo === Reinit git ===
git init
git remote add origin https://github.com/Shootware/portfolio-francoisleking.git

echo === Add + Commit ===
git add -A
git commit -m "feat: Major update - Admin system, Skills horizontal scroll, 3D backgrounds, Supabase auth

- Admin system with Supabase SSR auth
- AdminFieldArray visual editor (7 TS fixes)
- Skills horizontal scroll 9 categories
- 5 GLSL shaders + Global3DBackground fixed
- 66 skills FR, 9 categories
- Formation section added
- 14 JSON fields migrated
- Middleware SSR /admin protection
- Build OK 10/10 pages"

echo === Push vers GitHub ===
git branch -M main
git push -u origin main

pause
