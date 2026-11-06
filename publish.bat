@echo off
setlocal enabledelayedexpansion

pushd "%~dp0."

echo ============================================================================
echo   truncgil-uxigl - NPM Publish ve Canli Sunucu Deploy Araci
echo ============================================================================

for /f "delims=" %%v in ('node -p "require('./package.json').version"') do set "CURRENT_VER=%%v"
echo Mevcut surum: v%CURRENT_VER%
echo.

if /i "%~1"=="--check" (
    echo [OK] publish.bat sozdizimi ve surum okuma testi basarili: v%CURRENT_VER%
    popd
    exit /b 0
)

REM 1. NPM oturum kontrolu
echo [1/6] NPM oturumu kontrol ediliyor...
call npm whoami >nul 2>&1
if not errorlevel 1 goto npm_logged_in

echo [!] NPM oturumu acik degil. Lutfen giris yapin:
call npm login
if errorlevel 1 (
    echo [HATA] NPM girisi basarisiz oldu.
    popd
    pause
    exit /b 1
)

:npm_logged_in
for /f "delims=" %%u in ('call npm whoami') do set "NPM_USER=%%u"
echo [OK] NPM kullanicisi: %NPM_USER%
echo.

REM 2. Otomatik Surum Belirleme (10 patch = 1 minor, 10 minor = 1 major)
if /i "%~1"=="deploy" (
    set "NEW_VER=%CURRENT_VER%"
    echo [BILGI] Sadece sunucu deploy modu secildi. Surum: v%NEW_VER%
    goto deploy_remote
)

if not "%~1"=="" (
    set "TARGET_VER=%~1"
    echo [BILGI] Komut satirindan girilen surum/tip kullaniliyor: !TARGET_VER!
    call npm version !TARGET_VER! --no-git-tag-version
) else (
    for /f "delims=" %%v in ('node -e "let [M,m,p]=require(\"./package.json\").version.split(\".\").map(Number);if(++p>=10){p=0;if(++m>=10){m=0;++M;}}console.log(M+\".\"+m+\".\"+p);"') do set "NEXT_VER=%%v"
    echo [2/6] Otomatik surum artisi uygulaniyor (10 patch = 1 minor, 10 minor = 1 major):
    echo       v%CURRENT_VER% -^> v!NEXT_VER!
    call npm version !NEXT_VER! --no-git-tag-version
)

if errorlevel 1 (
    echo [HATA] Surum numarasi guncellenemedi.
    popd
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node -p "require('./package.json').version"') do set "NEW_VER=%%v"
echo [OK] Yayinlanacak surum: v%NEW_VER%
echo.

REM 3. Uretim derlemesi (Demo + Lib)
echo [3/6] Demo ve kutuphane paketleri derleniyor: npm run build ...
call npm run build
if errorlevel 1 (
    echo [HATA] Derleme sirasinda hata olustu! Yayinlama iptal edildi.
    popd
    pause
    exit /b 1
)
echo [OK] Derleme basariyla tamamlandi.
echo.

REM 4. NPM Publish
echo [4/6] Paket NPM uzerinde yayinlaniyor: truncgil-uxigl@%NEW_VER% ...
call npm publish --access public
if errorlevel 1 (
    echo [HATA] npm publish basarisiz oldu!
    popd
    pause
    exit /b 1
)
echo [OK] truncgil-uxigl@%NEW_VER% basariyla NPM'de yayinlandi!
echo.

REM 5. Git Commit, Tag ve Push
echo [5/6] Git commit, etiket [v%NEW_VER%] ve origin push islemi yapiliyor...
git add package.json README.md
if exist package-lock.json git add package-lock.json
git diff --cached --quiet
if errorlevel 1 git commit -m "chore: release v%NEW_VER%"
git tag -f "v%NEW_VER%"
git push origin main --tags
echo.

:deploy_remote
REM 6. Uzak Sunucu Deploy (truncgil_ubuntu -> uxigl.truncgil.com)
echo [6/6] uxigl.truncgil.com sunucusuna SSH ile baglanip canli deploy yapiliyor...
ssh truncgil_ubuntu "/home/truncgil/web/uxigl.truncgil.com/deploy.sh"
if errorlevel 1 (
    echo [HATA] uxigl.truncgil.com uzaktan deploy islemi basarisiz oldu!
    popd
    pause
    exit /b 1
)
echo [OK] uxigl.truncgil.com basariyla guncellendi!

echo.
echo ============================================================================
echo   TAMAMLANDI: truncgil-uxigl@%NEW_VER% yayinlandi ve canliya alindi!
echo   Canli : https://uxigl.truncgil.com
echo   NPM   : https://www.npmjs.com/package/truncgil-uxigl
echo   GitHub: https://github.com/umitunc/uxigl
echo ============================================================================
popd
pause
endlocal
