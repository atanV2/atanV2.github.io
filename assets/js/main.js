// メインJavaScriptファイル
document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの処理
    initMobileMenu();
    
    // スムーススクロールの設定
    initSmoothScroll();
    
    // ライトボックスの初期化
    initLightbox();
    
    // お問い合わせフォームの処理
    initContactForm();
    
    // 遅延読み込みの設定
    initLazyLoading();
});

// モバイルメニューの初期化
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });
        
        // メニューリンクをクリックしたときにメニューを閉じる
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            });
        });
    }
}

// スムーススクロールの初期化
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// シンプルなライトボックス実装
function initLightbox() {
    const lightboxLinks = document.querySelectorAll('.lightbox');
    
    lightboxLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const imageUrl = this.getAttribute('href');
            const alt = this.querySelector('img').getAttribute('alt');
            
            openLightbox(imageUrl, alt);
        });
    });
}

function openLightbox(imageUrl, alt) {
    // ライトボックスHTML作成
    const lightboxHTML = `
        <div class="lightbox-overlay" onclick="closeLightbox()">
            <div class="lightbox-container">
                <img src="${imageUrl}" alt="${alt}" class="lightbox-image">
                <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    document.body.style.overflow = 'hidden';
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    if (lightboxOverlay) {
        lightboxOverlay.remove();
        document.body.style.overflow = '';
    }
}

// ライトボックスのCSS（動的に追加）
function addLightboxStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        }
        
        .lightbox-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            cursor: default;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
            line-height: 1;
        }
        
        .lightbox-close:hover {
            opacity: 0.7;
        }
        
        @media (max-width: 768px) {
            .lightbox-container {
                max-width: 95%;
                max-height: 95%;
            }
            
            .lightbox-close {
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
                width: 40px;
                height: 40px;
            }
        }
    `;
    document.head.appendChild(style);
}

// お問い合わせフォームの処理
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // 簡単なバリデーション
            if (validateForm(formObject)) {
                // 送信ボタンの状態変更
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = '送信中... / Sending...';
                submitButton.disabled = true;
                
                // 実際の送信処理（Netlify Forms や Formspree を使用）
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        showMessage('メッセージが送信されました。/ Message sent successfully!', 'success');
                        this.reset();
                    } else {
                        throw new Error('送信に失敗しました。');
                    }
                })
                .catch(error => {
                    showMessage('送信に失敗しました。もう一度お試しください。/ Failed to send message. Please try again.', 'error');
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
            }
        });
    }
}

// フォームバリデーション
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('お名前を入力してください。/ Please enter your name.');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('有効なメールアドレスを入力してください。/ Please enter a valid email address.');
    }
    
    if (!formData.message || formData.message.trim() === '') {
        errors.push('メッセージを入力してください。/ Please enter a message.');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// メールアドレスの妥当性チェック
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// メッセージ表示
function showMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 5px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    messageDiv.textContent = message;
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // 5秒後に自動削除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// 遅延読み込みの初期化
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ページ読み込み時にライトボックススタイルを追加
addLightboxStyles();

// スクロール時のナビゲーション効果
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// アニメーション用のCSSクラス追加
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header.scrolled {
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                padding: 1rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                border-top: 1px solid var(--border-color);
            }
            
            .mobile-menu-button.active .hamburger-line:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .mobile-menu-button.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-button.active .hamburger-line:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// アニメーションスタイルも追加
addAnimationStyles();