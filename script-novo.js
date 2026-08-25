/* =========================================================
   PRGILBERTOPENIDO - JAVASCRIPT REFATORADO PROFISSIONAL
   Validação, Tratamento de Erros, Performance
========================================================= */

// =========================================================
// CONFIGURAÇÃO GLOBAL
// =========================================================

const CONFIG = {
  API_BASE: 'http://localhost:3000',
  STORAGE_KEY: 'prgilbertopenido_user',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente.',
  FILE_ERROR: 'Erro ao processar arquivo.',
  UNAUTHORIZED: 'Não autorizado. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  TIMEOUT: 'Operação expirou. Tente novamente.',
};

const SUCCESS_MESSAGES = {
  SAVED: 'Salvo com sucesso!',
  DELETED: 'Deletado com sucesso!',
  CREATED: 'Criado com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  UPLOADED: 'Upload realizado com sucesso!',
};

// =========================================================
// UTILITÁRIOS & HELPERS
// =========================================================

/**
 * Debounce - Limita chamadas de função em alta frequência
 * @param {Function} func - Função a executar
 * @param {number} delay - Tempo de espera em ms
 * @returns {Function} Função debounced
 */
const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle - Limita frequência de execução
 * @param {Function} func - Função a executar
 * @param {number} limit - Tempo mínimo entre execuções em ms
 * @returns {Function} Função throttled
 */
const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean} True se válida
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar arquivo
 * @param {File} file - Arquivo a validar
 * @param {string} type - Tipo MIME esperado
 * @param {number} maxSize - Tamanho máximo em bytes
 * @returns {object} Resultado da validação
 */
const validateFile = (file, type = null, maxSize = CONFIG.MAX_FILE_SIZE) => {
  if (!file) {
    return { valid: false, error: 'Arquivo não selecionado' };
  }

  if (maxSize && file.size > maxSize) {
    return { valid: false, error: `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB` };
  }

  if (type && !file.type.match(type)) {
    return { valid: false, error: `Tipo de arquivo inválido. Esperado: ${type}` };
  }

  return { valid: true };
};

/**
 * Formatar tamanho de arquivo
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Sanitizar entrada de usuário
 * @param {string} input - Entrada a sanitizar
 * @returns {string} Entrada sanitizada
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .substring(0, 1000); // Limita tamanho
};

/**
 * Gerar ID único
 * @returns {string} ID único
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Logger estruturado
 */
const logger = {
  info: (message, data = null) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  warn: (message, data = null) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  },
  
  error: (message, error = null) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  }
};

// =========================================================
// GERENCIAMENTO DE NOTIFICAÇÕES
// =========================================================

/**
 * Sistema de notificações
 */
const notificationManager = {
  container: null,
  
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notifications-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(this.container);
    }
  },
  
  show(message, type = 'info', duration = 4000) {
    this.init();
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
      padding: 16px 20px;
      border-radius: 8px;
      border-left: 4px solid;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideInRight 0.3s ease-out;
      min-width: 300px;
    `;
    
    notification.textContent = message;
    this.container.appendChild(notification);
    
    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
    
    return notification;
  },
  
  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  },
  
  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  },
  
  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  },
  
  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }
};

// =========================================================
// GERENCIAMENTO DE AUTENTICAÇÃO
// =========================================================

const authManager = {
  /**
   * Fazer login
   */
  login(email, password) {
    // Validações básicas
    if (!email || !password) {
      return Promise.reject(new Error('Email e senha são obrigatórios'));
    }
    
    if (!isValidEmail(email)) {
      return Promise.reject(new Error('Email inválido'));
    }
    
    // Simular validação (em produção, fazer requisição ao servidor)
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        logger.info('User logged in:', { email });
        resolve({ email, name: email.split('@')[0] });
      } catch (error) {
        logger.error('Login failed:', error);
        reject(new Error(ERROR_MESSAGES.SERVER_ERROR));
      }
    });
  },
  
  /**
   * Fazer logout
   */
  logout() {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      logger.info('User logged out');
      window.location.href = 'login.html';
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  },
  
  /**
   * Verificar autenticação
   */
  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;
    return {
      email,
      name: email.split('@')[0],
      initials: email.split('@')[0].slice(0, 2).toUpperCase()
    };
  }
};

// =========================================================
// GERENCIAMENTO DE API
// =========================================================

/**
 * Wrapper para requisições fetch
 */
const api = {
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      timeout = 30000
    } = options;
    
    const url = `${CONFIG.API_BASE}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${ERROR_MESSAGES[`HTTP_${response.status}`] || ERROR_MESSAGES.SERVER_ERROR}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.error('Request timeout:', { endpoint });
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      
      logger.error('API request failed:', { endpoint, error: error.message });
      throw error;
    }
  },
  
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },
  
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },
  
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },
  
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};

// =========================================================
// INICIALIZAÇÃO DA APP
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Verificar autenticação
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      const currentPage = window.location.pathname.split('/').pop();
      if (currentPage !== 'login.html' && currentPage !== '') {
        window.location.href = 'login.html';
        return;
      }
    }
    
    // Inicializar UI
    initializeUI();
    
    // Inicializar listeners
    initializeListeners();
    
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Application initialization failed:', error);
    notificationManager.error('Erro ao inicializar aplicação');
  }
});

/**
 * Inicializar elementos da UI
 */
function initializeUI() {
  // Atualizar dados do usuário
  const user = authManager.getCurrentUser();
  if (user) {
    const userNameElement = document.querySelector('.user-box strong');
    const avatarElement = document.querySelector('.avatar');
    
    if (userNameElement) {
      userNameElement.textContent = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    }
    
    if (avatarElement) {
      avatarElement.textContent = user.initials;
    }
  }
  
  // Definir menu ativo
  setActiveMenuItem();
  
  // Inicializar progress bars
  initializeProgressBars();
}

/**
 * Definir menu ativo baseado na página atual
 */
function setActiveMenuItem() {
  const menuItems = document.querySelectorAll('.menu-item');
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  
  menuItems.forEach((item) => {
    const href = item.getAttribute('href') || '';
    const isActive = href.includes(currentPage) || (currentPage === '' && href === 'dashboard.html');
    
    if (isActive) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });
}

/**
 * Inicializar progress bars
 */
function initializeProgressBars() {
  const progressBars = document.querySelectorAll('.progress span[data-width]');
  progressBars.forEach((bar) => {
    const width = bar.getAttribute('data-width');
    if (width && !isNaN(width)) {
      bar.style.width = Math.min(100, Math.max(0, parseFloat(width))) + '%';
    }
  });
}

/**
 * Inicializar event listeners
 */
function initializeListeners() {
  // Logout button
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authManager.logout();
    });
  }
  
  // Mobile menu toggle (se aplicável)
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }
}

/**
 * Toggle do menu mobile
 */
function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// =========================================================
// GERENCIAMENTO DE FORMULÁRIOS
// =========================================================

/**
 * Validar formulário
 * @param {HTMLFormElement} form - Formulário a validar
 * @returns {object} Dados validados ou erro
 */
function validateForm(form) {
  if (!form || !(form instanceof HTMLFormElement)) {
    return { valid: false, error: 'Formulário inválido' };
  }
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const errors = {};
  
  // Validações básicas
  for (const [key, value] of Object.entries(data)) {
    if (!value || value.toString().trim() === '') {
      errors[key] = `${key} é obrigatório`;
    }
  }
  
  if (Object.keys(errors).length > 0) {
    return { valid: false, error: 'Preencha todos os campos obrigatórios', errors };
  }
  
  return { valid: true, data };
}

/**
 * Mostrar erros de validação no formulário
 * @param {HTMLFormElement} form - Formulário
 * @param {object} errors - Objeto com erros por campo
 */
function showFormErrors(form, errors) {
  // Limpar erros anteriores
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  
  // Mostrar novos erros
  for (const [fieldName, errorMessage] of Object.entries(errors)) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      const errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      `;
      errorEl.textContent = errorMessage;
      field.parentElement.appendChild(errorEl);
      field.classList.add('error');
    }
  }
}

/**
 * Limpar erros de validação
 * @param {HTMLFormElement} form - Formulário
 */
function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// =========================================================
// GERENCIAMENTO DE LOADING
// =========================================================

/**
 * Mostrar loading
 * @param {HTMLElement} element - Elemento a mostrar loading
 * @param {string} message - Mensagem de loading
 */
function showLoading(element, message = 'Carregando...') {
  if (!element) return;
  
  const loadingEl = document.createElement('div');
  loadingEl.className = 'loading-overlay';
  loadingEl.innerHTML = `
    <div class="loading-spinner"></div>
    <p>${sanitizeInput(message)}</p>
  `;
  loadingEl.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
  `;
  
  element.appendChild(loadingEl);
  element.dataset.loading = 'true';
}

/**
 * Esconder loading
 * @param {HTMLElement} element - Elemento com loading
 */
function hideLoading(element) {
  if (!element) return;
  
  const loadingEl = element.querySelector('.loading-overlay');
  if (loadingEl) {
    loadingEl.remove();
  }
  
  delete element.dataset.loading;
}

// =========================================================
// EXPORTAR PARA WINDOW (Para compatibilidade com scripts inline)
// =========================================================

window.authManager = authManager;
window.api = api;
window.notificationManager = notificationManager;
window.logger = logger;
window.validateForm = validateForm;
window.showFormErrors = showFormErrors;
window.clearFormErrors = clearFormErrors;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.sanitizeInput = sanitizeInput;
window.isValidEmail = isValidEmail;
window.isValidUrl = isValidUrl;
window.validateFile = validateFile;
window.formatFileSize = formatFileSize;
window.debounce = debounce;
window.throttle = throttle;

console.log('PrGilbertoPenido App initialized - Script loaded successfully');
