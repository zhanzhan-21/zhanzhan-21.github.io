@echo off
echo ===== GitHub连接配置助手 =====
echo.
echo 此脚本将帮助您设置Git配置和GitHub连接
echo.

REM 检查git是否安装
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Git命令
    echo 请先安装Git: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM 设置用户信息
echo === 设置Git用户信息 ===
set /p user_name=请输入您的姓名: 
set /p user_email=请输入您的邮箱: 

git config --global user.name "%user_name%"
git config --global user.email "%user_email%"

echo.
echo === 配置GitHub连接方式 ===
echo 请选择GitHub连接方式:
echo 1. HTTPS (使用个人访问令牌)
echo 2. SSH (使用SSH密钥)
set /p auth_method=请选择 (1/2): 

if "%auth_method%"=="1" (
    echo.
    echo === 配置HTTPS访问 ===
    echo 请创建个人访问令牌:
    echo 1. 访问 https://github.com/settings/tokens
    echo 2. 点击 "Generate new token"
    echo 3. 选择 "repo" 和其他需要的权限
    echo 4. 生成并复制令牌
    echo.
    set /p token=请输入您的个人访问令牌: 
    
    echo.
    echo === 配置凭据管理器 ===
    echo 1. 使用Git凭据管理器存储令牌
    git config --global credential.helper store
    
    echo.
    set /p repo_url=请输入GitHub仓库URL (例如 https://github.com/zhanzhan-21/个人博客.git): 
    
    REM 提取用户名和仓库名
    for /f "tokens=3,4 delims=/" %%a in ("%repo_url%") do (
        set github_username=%%a
        set repo_name=%%b
    )
    
    REM 替换.git后缀
    set repo_name=%repo_name:.git=%
    
    REM 配置远程URL带令牌
    echo.
    echo === 配置远程仓库 ===
    echo 正在设置远程仓库URL...
    
    REM 检查仓库是否已存在
    if exist "%repo_name%\" (
        echo 仓库目录已存在，尝试更新远程URL
        cd %repo_name%
        git remote set-url origin https://%github_username%:%token%@github.com/%github_username%/%repo_name%.git
    ) else (
        echo 正在克隆仓库...
        git clone https://%github_username%:%token%@github.com/%github_username%/%repo_name%.git
        if %ERRORLEVEL% neq 0 (
            echo 错误: 克隆仓库失败
            pause
            exit /b 1
        )
    )
) else (
    echo.
    echo === 配置SSH访问 ===
    echo 检查是否存在SSH密钥...
    
    if not exist "%USERPROFILE%\.ssh\id_ed25519.pub" (
        echo 未找到现有的SSH密钥，正在生成新密钥...
        set /p ssh_email=请输入用于SSH密钥的邮箱: 
        ssh-keygen -t ed25519 -C "%ssh_email%"
    )
    
    echo.
    echo === 将SSH公钥添加到GitHub ===
    echo 请复制以下公钥并添加到GitHub:
    echo.
    type "%USERPROFILE%\.ssh\id_ed25519.pub"
    echo.
    echo 按照以下步骤将公钥添加到GitHub:
    echo 1. 访问 https://github.com/settings/keys
    echo 2. 点击 "New SSH key"
    echo 3. 粘贴上面的公钥内容
    echo 4. 点击 "Add SSH key"
    echo.
    pause
    
    echo.
    set /p repo_url=请输入SSH格式的仓库URL (例如 git@github.com:zhanzhan-21/个人博客.git): 
    
    REM 提取用户名和仓库名
    for /f "tokens=2 delims=:" %%a in ("%repo_url%") do (
        set repo_full=%%a
    )
    
    for /f "tokens=2 delims=/" %%a in ("%repo_full%") do (
        set repo_name=%%a
    )
    
    REM 替换.git后缀
    set repo_name=%repo_name:.git=%
    
    REM 检查仓库是否已存在
    if exist "%repo_name%\" (
        echo 仓库目录已存在，尝试更新远程URL
        cd %repo_name%
        git remote set-url origin %repo_url%
    ) else (
        echo 正在克隆仓库...
        git clone %repo_url%
        if %ERRORLEVEL% neq 0 (
            echo 错误: 克隆仓库失败
            echo 请确保已将SSH密钥添加到GitHub并且有正确的权限
            pause
            exit /b 1
        )
    )
)

echo.
echo === 测试连接 ===
git pull
if %ERRORLEVEL% neq 0 (
    echo 警告: 拉取操作失败，可能需要检查连接配置
) else (
    echo 成功! GitHub连接已正确配置
)

echo.
echo === 配置完成 ===
echo 现在您可以使用git push和git pull等命令与GitHub交互
pause 