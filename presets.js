// Presets y configuración de plataformas para Notification FX Studio

const PLATFORMS = {
  ios_banner: {
    id: 'ios_banner',
    name: 'iOS 17/18 Banner',
    category: 'Apple iOS',
    description: 'Notificación flotante translúcida clásica de iPhone/iPad',
    defaultData: {
      appName: 'Mensajes',
      sender: 'Mamá ❤️',
      message: '¡Hola cariño! ¿Vas a venir a almorzar hoy? Te preparé tu comida favorita.',
      time: 'ahora',
      avatarType: 'icon',
      presetIcon: 'imessage',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'dark', // 'dark' | 'light' | 'glass'
      blurIntensity: 24,
      borderRadius: 22,
      showActionButtons: false,
      actionButton1: 'Responder',
      actionButton2: 'Marcar leído',
      sound: 'apple_tritone',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  ios_dynamic_island: {
    id: 'ios_dynamic_island',
    name: 'iOS Dynamic Island (Isla Dinámica)',
    category: 'Apple iOS',
    description: 'Notificación expansiva tipo Dynamic Island de iPhone 14 Pro / 15 / 16',
    defaultData: {
      appName: 'AirDrop',
      sender: 'MacBook Pro de Luis',
      message: 'Foto_Final_Cut_4K.mov',
      time: 'Completado',
      avatarType: 'icon',
      presetIcon: 'airdrop',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'island_black',
      blurIntensity: 0,
      borderRadius: 36,
      islandType: 'expanded',
      sound: 'apple_ding',
      animation: 'island_expand',
      duration: 4.0,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.5
    }
  },
  macos_banner: {
    id: 'macos_banner',
    name: 'macOS Sequoia / Sonoma',
    category: 'Apple macOS',
    description: 'Notificación de escritorio elegante en la esquina superior de Mac',
    defaultData: {
      appName: 'Calendario',
      sender: 'Reunión de Edición de Video',
      message: 'En 15 minutos en Google Meet con el equipo de producción.',
      time: 'ahora',
      avatarType: 'icon',
      presetIcon: 'calendar',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'dark',
      blurIntensity: 30,
      borderRadius: 16,
      showActionButtons: true,
      actionButton1: 'Opciones',
      actionButton2: 'Unirse',
      sound: 'macos_submarine',
      animation: 'macos_slide_right',
      duration: 5.0,
      enterDelay: 0.4,
      exitDelay: 0.5,
      soundTiming: 0.5
    }
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Mensajería',
    description: 'Notificación estilo WhatsApp con avatar de remitente y badge verde',
    defaultData: {
      appName: 'WhatsApp',
      sender: 'Carlos (Director Creativo)',
      message: 'Acabo de revisar el corte final. ¡Quedó brutal la edición! 🔥',
      time: '18:42',
      avatarType: 'url',
      presetIcon: 'whatsapp',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      attachmentUrl: '',
      verified: false,
      theme: 'dark',
      blurIntensity: 20,
      borderRadius: 20,
      sound: 'whatsapp_whistle',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  instagram_dm: {
    id: 'instagram_dm',
    name: 'Instagram (Mensaje Directo)',
    category: 'Redes Sociales',
    description: 'Notificación de mensaje directo en Instagram con degradado característico',
    defaultData: {
      appName: 'Instagram',
      sender: 'sofia_creative',
      message: '¿Con qué cámara grabaste esa toma aérea? Se ve increíble.',
      time: 'hace 2m',
      avatarType: 'url',
      presetIcon: 'instagram',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      attachmentUrl: '',
      verified: true,
      theme: 'dark',
      blurIntensity: 22,
      borderRadius: 22,
      sound: 'pop_soft',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  instagram_like: {
    id: 'instagram_like',
    name: 'Instagram (Like / Interacción)',
    category: 'Redes Sociales',
    description: 'Notificación de nuevo "Me gusta" o comentario con miniatura de post',
    defaultData: {
      appName: 'Instagram',
      sender: 'alex.filmmaker y 128 personas más',
      message: 'les ha gustado tu reel.',
      time: 'hace 1m',
      avatarType: 'url',
      presetIcon: 'instagram',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      attachmentUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=150&auto=format&fit=crop&q=80',
      verified: false,
      theme: 'dark',
      blurIntensity: 22,
      borderRadius: 22,
      sound: 'pop_soft',
      animation: 'ios_bounce_down',
      duration: 4.0,
      enterDelay: 0.4,
      exitDelay: 0.5,
      soundTiming: 0.5
    }
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube (Nuevo Video / Alerta)',
    category: 'Creadores',
    description: 'Notificación de canal de YouTube con miniatura de video',
    defaultData: {
      appName: 'YouTube',
      sender: 'MKBHD',
      message: 'Publicó: "Apple Vision Pro 2: El veredicto final"',
      time: 'hace 5m',
      avatarType: 'url',
      presetIcon: 'youtube',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      attachmentUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
      verified: true,
      theme: 'dark',
      blurIntensity: 20,
      borderRadius: 20,
      sound: 'apple_ding',
      animation: 'ios_bounce_down',
      duration: 5.0,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok (Alerta Viral)',
    category: 'Redes Sociales',
    description: 'Notificación de nuevo seguidor o video viral en TikTok',
    defaultData: {
      appName: 'TikTok',
      sender: 'TikTok Creator Portal',
      message: '🔥 Tu video "Tutorial Final Cut Pro" superó 100K visualizaciones',
      time: 'hace 3m',
      avatarType: 'icon',
      presetIcon: 'tiktok',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'dark',
      blurIntensity: 25,
      borderRadius: 22,
      sound: 'pop_chime',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  twitter_x: {
    id: 'twitter_x',
    name: 'X (Twitter) Mención',
    category: 'Redes Sociales',
    description: 'Notificación de mención o retuit en X con logo monocromático',
    defaultData: {
      appName: 'X',
      sender: 'Elon Musk (@elonmusk)',
      message: 'This video edit is actually insane. Well done! 🚀',
      time: 'hace 10m',
      avatarType: 'url',
      presetIcon: 'twitter_x',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      attachmentUrl: '',
      verified: true,
      theme: 'dark',
      blurIntensity: 22,
      borderRadius: 20,
      sound: 'apple_tritone',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  },
  discord: {
    id: 'discord',
    name: 'Discord (Ping / DM)',
    category: 'Gaming & Comunidad',
    description: 'Notificación con sonido característico de ping y estilo gamer',
    defaultData: {
      appName: 'Discord',
      sender: '#general-edición @EditorPro',
      message: '¿Alguien tiene el plugin de color grading para Final Cut?',
      time: 'hoy a las 20:15',
      avatarType: 'icon',
      presetIcon: 'discord',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'discord_dark',
      blurIntensity: 0,
      borderRadius: 12,
      sound: 'discord_ping',
      animation: 'slide_from_right',
      duration: 4.0,
      enterDelay: 0.4,
      exitDelay: 0.5,
      soundTiming: 0.45
    }
  },
  android_material: {
    id: 'android_material',
    name: 'Android 14/15 Material You',
    category: 'Android',
    description: 'Notificación limpia de Android con paleta tonal y chip expansivo',
    defaultData: {
      appName: 'Gmail',
      sender: 'Suscripción YouTube',
      message: 'Tienes un nuevo pago recibido por tu contenido patrocinado ($450.00 USD).',
      time: '19:40',
      avatarType: 'icon',
      presetIcon: 'gmail',
      avatarUrl: '',
      attachmentUrl: '',
      verified: false,
      theme: 'android_tonal',
      blurIntensity: 10,
      borderRadius: 26,
      sound: 'android_pop',
      animation: 'ios_bounce_down',
      duration: 4.5,
      enterDelay: 0.5,
      exitDelay: 0.5,
      soundTiming: 0.6
    }
  }
};

const SVG_ICONS = {
  imessage: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#34C759"/>
    <path d="M50 20C32.327 20 18 32.536 18 48C18 56.402 22.25 63.844 29 68.799V82L41.344 75.334C44.113 75.772 47.01 76 50 76C67.673 76 82 63.464 82 48C82 32.536 67.673 20 50 20Z" fill="white"/>
  </svg>`,
  
  airdrop: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#007AFF"/>
    <path d="M50 30L65 48H55V66H45V48H35L50 30Z" fill="white"/>
    <path d="M26 62C22.686 65.314 22.686 70.686 26 74C29.314 77.314 34.686 77.314 38 74" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <path d="M74 62C77.314 65.314 77.314 70.686 74 74C70.686 77.314 65.314 77.314 62 74" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  calendar: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#FF3B30"/>
    <rect y="32" width="100" height="68" fill="white"/>
    <text x="50" y="24" fill="white" font-size="14" font-weight="bold" font-family="-apple-system, sans-serif" text-anchor="middle">LUNES</text>
    <text x="50" y="80" fill="#1C1C1E" font-size="44" font-weight="300" font-family="-apple-system, sans-serif" text-anchor="middle">24</text>
  </svg>`,

  whatsapp: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#25D366"/>
    <path d="M50 18C32.327 18 18 32.327 18 50C18 56.12 19.742 61.85 22.77 66.72L19 82L34.67 78.33C39.31 80.99 44.52 82 50 82C67.673 82 82 67.673 82 50C82 32.327 67.673 18 50 18ZM68.14 63.36C67.38 65.48 64.38 67.24 62.06 67.74C60.48 68.08 58.42 68.34 51.52 65.48C42.7 61.82 37.04 52.88 36.6 52.3C36.18 51.72 33.04 47.54 33.04 43.22C33.04 38.9 35.22 36.8 36.1 35.9C36.82 35.16 38.02 34.82 39.16 34.82C39.52 34.82 39.86 34.84 40.16 34.86C41.04 34.9 41.48 34.96 42.06 36.34C42.78 38.08 44.54 42.38 44.76 42.82C44.98 43.26 45.14 43.86 44.84 44.44C44.56 45.04 44.38 45.28 43.94 45.8C43.5 46.32 43.1 46.68 42.66 47.22C42.26 47.68 41.8 48.18 42.32 49.06C42.84 49.94 44.62 52.86 47.24 55.2C50.62 58.22 53.38 59.18 54.38 59.6C55.14 59.92 56.06 59.84 56.62 59.24C57.34 58.46 58.22 57.22 59.12 55.96C59.76 55.06 60.58 54.94 61.42 55.26C62.28 55.56 66.86 57.82 67.8 58.3C68.74 58.78 69.36 59.02 69.58 59.4C69.8 59.78 69.8 61.24 68.14 63.36Z" fill="white"/>
  </svg>`,

  instagram: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ig-grad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFDC80"/>
        <stop offset="25%" stop-color="#F77737"/>
        <stop offset="50%" stop-color="#F56040"/>
        <stop offset="75%" stop-color="#FD1D1D"/>
        <stop offset="100%" stop-color="#C13584"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#ig-grad)"/>
    <rect x="24" y="24" width="52" height="52" rx="14" stroke="white" stroke-width="6"/>
    <circle cx="50" cy="50" r="13" stroke="white" stroke-width="6"/>
    <circle cx="65" cy="35" r="3.5" fill="white"/>
  </svg>`,

  youtube: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#FF0000"/>
    <path d="M78 37.5C77.4 34.5 75 32.1 72 31.5C66.5 30 50 30 50 30C50 30 33.5 30 28 31.5C25 32.1 22.6 34.5 22 37.5C20.5 43 20.5 50 20.5 50C20.5 50 20.5 57 22 62.5C22.6 65.5 25 67.9 28 68.5C33.5 70 50 70 50 70C50 70 66.5 70 72 68.5C75 67.9 77.4 65.5 78 62.5C79.5 57 79.5 50 79.5 50C79.5 50 79.5 43 78 37.5ZM44 58V42L58 50L44 58Z" fill="white"/>
  </svg>`,

  tiktok: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#010101"/>
    <path d="M68 37.5C64 37 60.5 34.5 59 31V58C59 67.4 51.4 75 42 75C32.6 75 25 67.4 25 58C25 48.6 32.6 41 42 41C43.2 41 44.4 41.1 45.5 41.4V50.2C44.4 49.8 43.2 49.6 42 49.6C37.4 49.6 33.6 53.4 33.6 58C33.6 62.6 37.4 66.4 42 66.4C46.6 66.4 50.4 62.6 50.4 58V25H59C60.2 30.5 64.5 34.8 70 35.8V44.4C69.3 44.4 68.6 44.3 68 44.2V37.5Z" fill="#25F4EE"/>
    <path d="M70 36C65.6 36 62 33.4 60.5 29.5V56.5C60.5 65.9 52.9 73.5 43.5 73.5C34.1 73.5 26.5 65.9 26.5 56.5C26.5 47.1 34.1 39.5 43.5 39.5C44.7 39.5 45.9 39.6 47 39.9V48.7C45.9 48.3 44.7 48.1 43.5 48.1C38.9 48.1 35.1 51.9 35.1 56.5C35.1 61.1 38.9 64.9 43.5 64.9C48.1 64.9 51.9 61.1 51.9 56.5V23.5H60.5C61.7 29 66 33.3 71.5 34.3V42.9C71 42.9 70.5 42.8 70 42.8V36Z" fill="#FE2C55" style="mix-blend-mode: screen;"/>
    <path d="M69 36.8C64.8 36.5 61.2 33.9 59.8 30.2V57.2C59.8 66.6 52.2 74.2 42.8 74.2C33.4 74.2 25.8 66.6 25.8 57.2C25.8 47.8 33.4 40.2 42.8 40.2C44 40.2 45.2 40.3 46.3 40.6V49.4C45.2 49 44 48.8 42.8 48.8C38.2 48.8 34.4 52.6 34.4 57.2C34.4 61.8 38.2 65.6 42.8 65.6C47.4 65.6 51.2 61.8 51.2 57.2V24.2H59.8C61 29.7 65.3 34 70.8 35V43.6C70.2 43.6 69.6 43.5 69 43.4V36.8Z" fill="white"/>
  </svg>`,

  twitter_x: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#000000"/>
    <path d="M57.6 45.8L77.4 23H72.7L55.5 42.8L41.8 23H26L46.8 53.1L26 77H30.7L48.8 56.1L63.3 77H79.1L57.6 45.8ZM51.3 53.3L49.2 50.3L32.4 26.5H39.6L53.1 45.7L55.2 48.7L72.7 73.5H65.5L51.3 53.3Z" fill="white"/>
  </svg>`,

  discord: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#5865F2"/>
    <path d="M72.5 30C67.4 27.6 61.9 25.8 56.1 25C55.4 26.3 54.6 28 54 29.5C48 28.6 42.1 28.6 36.2 29.5C35.6 28 34.8 26.3 34.1 25C28.3 25.8 22.8 27.6 17.7 30C7.5 45.2 4.7 59.9 6.1 74.4C12.8 79.4 19.3 82.4 25.7 84.4C27.3 82.2 28.7 79.9 29.8 77.4C27.5 76.5 25.3 75.4 23.3 74C23.9 73.6 24.4 73.1 25 72.7C37.5 78.5 51.1 78.5 63.4 72.7C64 73.2 64.5 73.6 65.1 74C63.1 75.4 60.9 76.5 58.6 77.4C59.7 79.9 61.1 82.2 62.7 84.4C69.1 82.4 75.6 79.4 82.3 74.4C83.9 57.6 79.5 43.1 72.5 30ZM32.6 65C28.7 65 25.5 61.4 25.5 57C25.5 52.6 28.6 49 32.6 49C36.6 49 39.8 52.6 39.7 57C39.7 61.4 36.6 65 32.6 65ZM57.6 65C53.7 65 50.5 61.4 50.5 57C50.5 52.6 53.6 49 57.6 49C61.6 49 64.8 52.6 64.7 57C64.7 61.4 61.6 65 57.6 65Z" fill="white"/>
  </svg>`,

  gmail: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#FFFFFF"/>
    <path d="M22 34V68C22 71.3 24.7 74 28 74H36V48L50 58.5L64 48V74H72C75.3 74 78 71.3 78 68V34C78 30.5 73.9 28.5 71.2 30.6L50 46.5L28.8 30.6C26.1 28.5 22 30.5 22 34Z" fill="#EA4335"/>
    <path d="M22 34V68C22 71.3 24.7 74 28 74H36V48L22 37.5V34Z" fill="#4285F4"/>
    <path d="M78 34V68C78 71.3 75.3 74 72 74H64V48L78 37.5V34Z" fill="#34A853"/>
    <path d="M64 48L71.2 30.6C73.9 28.5 78 30.5 78 34V37.5L64 48Z" fill="#FBBC04"/>
  </svg>`,

  mail_apple: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#007AFF"/>
    <path d="M22 33C22 30.2 24.2 28 27 28H73C75.8 28 78 30.2 78 33V67C78 69.8 75.8 72 73 72H27C24.2 72 22 69.8 22 67V33Z" stroke="white" stroke-width="4"/>
    <path d="M24 32L50 52L76 32" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  phone: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#34C759"/>
    <path d="M37.5 28C35.5 28 33.5 29 32.5 30.5L28.5 36C27 38 27 41 28.5 43.5C33.5 53 47 66.5 56.5 71.5C59 73 62 73 64 71.5L69.5 67.5C71 66.5 72 64.5 72 62.5C72 60.5 70.5 59 69 58L60 52C58.5 51 56.5 51 55 52L52 54.5C50.5 53.5 46.5 49.5 45.5 48L48 45C49 43.5 49 41.5 48 40L42 31C41 29.5 39.5 28 37.5 28Z" fill="white"/>
  </svg>`,

  spotify: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="#1DB954"/>
    <path d="M69.8 61.2C68.9 62.6 67.1 63.1 65.7 62.2C54.4 55.3 40.3 53.7 23.6 57.5C22 57.9 20.4 56.8 20 55.2C19.6 53.6 20.7 52 22.3 51.6C40.6 47.4 56.2 49.2 68.8 57C70.2 57.9 70.7 59.8 69.8 61.2ZM75.8 49.6C74.7 51.3 72.4 51.9 70.7 50.8C57.8 42.9 38.2 40.6 22.9 45.2C21 45.8 18.9 44.7 18.3 42.8C17.7 40.9 18.8 38.8 20.7 38.2C38.2 32.9 59.8 35.5 74.6 44.5C76.3 45.6 76.9 47.9 75.8 49.6ZM76.4 37.7C60.9 28.5 35.4 27.7 20.6 32.2C18.2 32.9 15.7 31.5 15 29.1C14.3 26.7 15.7 24.2 18.1 23.5C35.5 18.2 63.6 19.2 81.3 29.7C83.4 30.9 84.1 33.7 82.9 35.8C81.7 38 78.9 38.7 76.4 37.7Z" fill="white"/>
  </svg>`
};

window.FX_PLATFORMS = PLATFORMS;
window.FX_SVG_ICONS = SVG_ICONS;
