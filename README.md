# 🔔 Notification FX Studio para Final Cut Pro

**Notification FX Studio** es una herramienta interactiva diseñada específicamente para creadores de contenido, filmmakers y editores de video que utilizan **Final Cut Pro**.

Permite diseñar, previsualizar y animar notificaciones realistas de teléfonos y computadoras (iOS 18, Dynamic Island, macOS Sequoia, WhatsApp, Instagram, TikTok, YouTube, Discord, Android, etc.) y exportarlas directamente para superponer en la línea de tiempo de FCP.

---

## 🚀 Inicio Rápido

Para abrir la herramienta en tu navegador en cualquier momento:

```bash
cd /Users/luistovar/.gemini/antigravity/scratch/notification-simulator-fcp
# Iniciar servidor local:
python3 -m http.server 3000
```
Luego abre tu navegador en: **`http://localhost:3000`** (o simplemente abre `index.html` en Chrome / Safari).

---

## ✨ Características Principales

1. **Plantillas Realistas Preinstaladas**:
   - **Apple iOS 17 / 18**: Banner flotante con desenfoque de cristal (Glassmorphism), iconos oficiales y rebote elástico.
   - **Dynamic Island (Isla Dinámica)**: Notificación expansiva de iPhone 14 Pro / 15 / 16 (AirDrop, alertas, mensajes).
   - **macOS Sequoia / Sonoma**: Notificación de escritorio elegante en la esquina de Mac.
   - **WhatsApp**: Notificación con avatar de contacto y badge verde característico.
   - **Instagram**: Mensajes Directos (DM) y alertas de likes/comentarios con miniatura de post.
   - **YouTube**: Alerta de nuevo video o nuevo suscriptor con badge verificado.
   - **TikTok**: Alerta de video viral o interacción.
   - **X (Twitter)**: Notificación de mención o respuesta.
   - **Discord & Android Material You**: Alertas con estilo tonal y gaming.

2. **Personalización Total**:
   - Nombre de la app, remitente, mensaje, tiempo relativo ("ahora", "hace 2m").
   - Insignia de cuenta verificada (Check azul).
   - Selector de iconos vectoriales SVG de alta fidelidad o subida de foto/avatar desde tu Mac.
   - Modo Oscuro / Claro / Intensidad de Blur (desenfoque) y redondeo de esquinas.

3. **Formatos de Video y Enfoque de Previsualización**:
   - **16:9 Widescreen (1080p / 4K)**: Ideal para YouTube, documentales y películas.
   - **9:16 Vertical**: Ideal para TikTok, Instagram Reels y YouTube Shorts.
   - **1:1 Cuadrado**: Formato para feeds.
   - **Fondos de prueba**: Transparente (patrón de ajedrez), Fondo Verde (#00FF00), Fondo Azul (#0000FF) y Video Real simulado.

4. **Motor de Sonido Sincronizado**:
   - Sonidos de notificación clásicos sintetizados en 48kHz Studio Quality (Apple Tri-tone, Apple Ding, macOS Submarine, WhatsApp Whistle, Discord Ping, Pop suave, Android).
   - Exportación de la pista de sonido sincronizada en archivo `.WAV` para FCP.

---

## 🎬 Flujo de Trabajo en Final Cut Pro

### Método 1: Video con Fondo Verde (Chroma Key - Recomendado)
1. En la pestaña **Exportar**, haz clic en **"Video Chroma Key (Fondo Verde 60 FPS)"**.
2. Haz clic también en **"Pista de Audio Sincronizada (.WAV)"** si deseas el efecto de sonido.
3. En **Final Cut Pro**, arrastra el video exportado a una pista superior sobre tu metraje.
4. En el navegador de efectos de FCP, ve a **Effects > Keying** y arrastra el efecto **Keyer** sobre el clip de notificación.
5. El fondo verde se volverá transparente al instante.
6. Alinea la pista de audio `.WAV` en el punto exacto donde la notificación aterriza en pantalla.

### Método 2: Imagen PNG 4K Transparente (Canal Alfa)
1. En la pestaña **Exportar**, haz clic en **"Imagen PNG 4K Transparente (Alpha)"**.
2. Arrastra la imagen PNG directamente a tu línea de tiempo en Final Cut Pro.
3. Como ya tiene transparencia nativa, no necesitas aplicar ningún efecto; puedes escalarla, posicionarla o animarla con fotogramas clave (Keyframes) y transiciones de FCP a tu gusto.
