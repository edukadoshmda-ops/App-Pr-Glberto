// Aplica tema instantaneamente para eliminar qualquer atraso visual ou FOUC
(function() {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('theme-light');
        if (document.body) document.body.classList.add('theme-light');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('theme-light');
    }

    if (!document.querySelector('#floating-theme-toggle')) {
        const btn = document.createElement('button');
        btn.id = 'floating-theme-toggle';
        btn.innerHTML = savedTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        const isMobileScreen = window.innerWidth <= 768;
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: isMobileScreen ? '85px' : '24px',
            right: isMobileScreen ? '16px' : '24px',
            width: isMobileScreen ? '42px' : '48px',
            height: isMobileScreen ? '42px' : '48px',
            borderRadius: '50%',
            backgroundColor: '#f5b52e',
            color: '#050914',
            border: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: '99',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobileScreen ? '17px' : '20px',
            transition: 'transform 0.2s, opacity 0.2s'
        });

        // Oculta automaticamente quando leitor de PDF ou modais de leitura estiverem ativos
        const checkModalVisibility = () => {
            const isReaderOpen = document.body.classList.contains('book-open') || 
                                 document.body.classList.contains('modal-open') ||
                                 document.querySelector('.book-viewer-modal.active') ||
                                 document.querySelector('#articleModal.open') ||
                                 document.querySelector('#driveIframeModal');
            btn.style.setProperty('display', isReaderOpen ? 'none' : 'flex', 'important');
        };

        const observer = new MutationObserver(checkModalVisibility);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
        window.addEventListener('resize', () => {
            const mobile = window.innerWidth <= 768;
            btn.style.bottom = mobile ? '85px' : '24px';
            btn.style.right = mobile ? '16px' : '24px';
            btn.style.width = mobile ? '42px' : '48px';
            btn.style.height = mobile ? '42px' : '48px';
            btn.style.fontSize = mobile ? '17px' : '20px';
        });
        
        btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.1)');
        btn.addEventListener('mouseout', () => btn.style.transform = 'scale(1)');
        
        btn.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const isLight = document.body.classList.contains('theme-light');
            localStorage.setItem('app-theme', isLight ? 'light' : 'dark');
            btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            document.querySelectorAll('.theme-toggle-btn i').forEach(i => {
                if(isLight) { i.classList.remove('fa-moon'); i.classList.add('fa-sun'); }
                else { i.classList.remove('fa-sun'); i.classList.add('fa-moon'); }
            });
        });
        
        document.body.appendChild(btn);
    }

    // Carregar auth-permissions.js dinamicamente se ainda não estiver presente
    if (!window.AppPermissions && !document.querySelector('script[src*="auth-permissions.js"]')) {
        const authScript = document.createElement('script');
        authScript.src = 'auth-permissions.js';
        document.head.appendChild(authScript);
    }
});
