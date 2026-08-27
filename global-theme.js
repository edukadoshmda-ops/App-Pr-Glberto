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
        
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#f5b52e',
            color: '#050914',
            border: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'transform 0.2s'
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
