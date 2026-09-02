/**
 * auth-permissions.js
 * Acesso total liberado para todos os cadastrados
 * Regra única: quem se cadastra / faz login tem acesso a TODO o conteúdo.
 * Apenas páginas administrativas continuam restritas a admin.
 */
(function() {
    const adminEmails = ['gilbertobertho@gmail.com','gilbertbertho@gmail.com'];

    function isUserAdmin() {
        const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
        const isAdminFlag = localStorage.getItem('isAdmin') === 'true';
        return isAdminFlag || adminEmails.includes(userEmail);
    }

    // Agora todo usuário logado é considerado assinante com acesso total
    function isSubscriber() {
        if (isUserAdmin()) return true;
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    function getTrialStatus() {
        if (isUserAdmin()) return { isTrial: false, isExpired: false, daysRemaining: 999, isSubscriber: true, isAdmin: true };
        if (localStorage.getItem('isLoggedIn') === 'true') {
            return { isTrial: false, isExpired: false, daysRemaining: 999, isSubscriber: true, isAdmin: false };
        }
        return { isTrial: false, isExpired: false, daysRemaining: 999, isSubscriber: false, isAdmin: false };
    }

    function getUserStatus() {
        if (isUserAdmin()) return 'approved';
        if (localStorage.getItem('isLoggedIn') === 'true') return 'approved';
        return localStorage.getItem('userStatus') || 'approved';
    }

    // Acesso liberado para todos os logados - sem bloqueio por conteúdo
    function checkItemAccess(moduleType, itemIdentifier, itemIndex = -1) {
        return true;
    }

    function showAccessModal(title, message) { /* descontinuado - acesso total liberado */ }

    function applyUserPermissions() {
        const isAdmin = isUserAdmin();
        const currentPath = window.location.pathname.toLowerCase();
        const adminOnlyPages = ['usuarios.html','relatorios.html','criar.html','adicionar-video.html','adicionar-artigo.html','adicionar-projeto.html','estudio-audio.html','painel-root.html'];
        const isCurrentPageAdminOnly = adminOnlyPages.some(page => currentPath.endsWith(page));
        if (isCurrentPageAdminOnly && !isAdmin) {
            alert('Acesso Restrito: Esta área é exclusiva para administradores.');
            window.location.href = 'dashboard.html';
            return;
        }
        if (!isAdmin) {
            const menuLinks = document.querySelectorAll('.menu-item, .sidebar-nav a, nav a');
            menuLinks.forEach(link => {
                const href = (link.getAttribute('href') || '').toLowerCase();
                if (href.includes('usuarios.html') || href.includes('relatorios.html') || href.includes('criar.html')) {
                    link.style.display = 'none';
                }
            });
            const selectorsToHide = ['.delete-btn','.delete-audiobook-btn','.delete-playbook-btn','.delete-article-btn','.delete-video-btn','button[onclick*="deleteVideo"]','button[onclick*="deleteArticle"]','button[onclick*="deletePlaybook"]','button[onclick*="deleteAudiobook"]','button[onclick*="openNewUserModal"]','a[href="criar.html"]','a[href="adicionar-video.html"]','a[href="adicionar-artigo.html"]','a[href="adicionar-projeto.html"]'];
            selectorsToHide.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => { el.style.display = 'none'; });
            });
        }
    }

    window.AppPermissions = { isUserAdmin, isSubscriber, getUserStatus, getTrialStatus, checkItemAccess, showAccessModal, applyUserPermissions };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyUserPermissions);
    } else {
        applyUserPermissions();
    }
})();
