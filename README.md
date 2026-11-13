# 🚵‍♂️ RIDE LAB | Taller de MTB - Sistema de Agenda & Mantenciones

Sistema web ligero, moderno y responsivo diseñado a medida para **RIDE LAB Taller** (@ridelab.taller). Pensado para reemplazar las notas de iPhone por un sistema rápido, limpio e intuitivo con base de datos, búsqueda instantánea, agenda de carga de trabajo y comprobantes oficiales para compartir por WhatsApp.

---

## 🌟 Características Principales

1. **📱 Experiencia tipo App Nativa (iOS / PWA)**:
   - Diseñado prioritariamente para el uso diario en celular (iPhone).
   - Estética clara (Light Mode) en tonos crema/arena y grafito con el logo oficial de RIDELAB.
   - Guardado automático en el dispositivo (sin necesidad de servidores complejos ni costos mensuales).

2. **🔍 Búsqueda Rápida & Historial de Clientes ("¿Qué le hicimos a mi bici?")**:
   - En 2 segundos puedes buscar por nombre del cliente, marca de bicicleta o repuesto.
   - Pestaña **"Clientes"**: Despliega la ficha de vida completa de cada rider con todas sus mantenciones en el tiempo, repuestos instalados, especificaciones (talla de marco, presiones de suspensión en psi, calibraciones) y total invertido.

3. **📅 Agenda de Taller (Control de Carga de Trabajo)**:
   - Organiza los compromisos por días (Hoy, Mañana, Esta Semana, Próximas).
   - Alerta visual de sobrecarga si hay más de 3 o 4 entregas el mismo día para evitar colapsar los tiempos del mecánico.

4. **⚡ Carga Rápida de Trabajos & Catálogo de 1 Toque**:
   - Botones rápidos para agregar servicios frecuentes (+ Mantención Full $55.000, + Purgado $20.000, + Tubeless, + Rodamientos, etc.).
   - Posibilidad de agregar cualquier servicio o repuesto libremente con su precio.
   - Cálculo automático del total en Pesos Chilenos (CLP).
   - Autocompletado de clientes recurrentes.

5. **🧾 Comprobante Digital con Logo & Enlace Directo a WhatsApp**:
   - Genera una orden de trabajo estética con el logo de RIDELAB.
   - Botón directo **"Enviar por WhatsApp"**: redacta automáticamente el mensaje cordial con el desglose de lo realizado, valor total y estado del trabajo para enviarlo al cliente con 1 tap.
   - Botón de **Imprimir / Guardar en PDF**.

6. **💾 Copias de Seguridad (Backup)**:
   - Botón en la barra superior para descargar un archivo `.json` de respaldo en el teléfono o Google Drive.
   - Restauración instantánea desde cualquier archivo de respaldo.
   - Precargado con los **13 registros reales** de las notas de RIDELAB (Miguel Ángel, Matías Vásquez, Patricio, Cristian Pinto, Ignacio, etc.).

---

## 🚀 Cómo Ejecutar en Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor local:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador:
   - En tu computador: `http://localhost:5173`
   - **En el celular de tu amigo (conectado a la misma red Wi-Fi)**:
     Abre la dirección de red que muestra la terminal (por ejemplo: `http://192.168.1.4:5173`).

---

## 📲 Cómo Instalar como App en iPhone (PWA)

1. Abre el enlace del sistema en **Safari** en el iPhone.
2. Toca el botón **Compartir** (icono del cuadrado con una flecha hacia arriba en la barra inferior de Safari).
3. Desliza hacia abajo y selecciona **"Agregar a pantalla de inicio"** (Add to Home Screen).
4. Toca **"Agregar"**.
5. ¡Listo! Quedará en la pantalla del iPhone con el icono y logo oficial de **RIDE LAB**, abriéndose a pantalla completa sin barra de navegación, como cualquier app descargada de la App Store.

---

## ☁️ Cómo Desplegar Gratis en Internet (Para acceder desde cualquier lugar)

### Opción 1: Vercel (Recomendada - 100% Gratuita y en 2 minutos)
1. Sube este proyecto a tu cuenta de GitHub (o crea un repositorio privado/público):
   ```bash
   git init
   git add .
   git commit -m "RIDE LAB taller app"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/ridelab-taller.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New Project"** y selecciona el repositorio `ridelab-taller`.
4. Deja todo por defecto y haz clic en **"Deploy"**.
5. En 30 segundos te dará un enlace permanente HTTPS gratuito (ej: `https://ridelab-taller.vercel.app`) que tu amigo puede abrir desde cualquier lugar con datos móviles.

### Opción 2: GitHub Pages (Gratis)
1. En `package.json`, asegúrate de que esté configurado `homepage` si tu repositorio tiene nombre:
   ```json
   "homepage": "https://TU_USUARIO.github.io/ridelab-taller"
   ```
2. Ejecuta en la terminal:
   ```bash
   npm run deploy
   ```
3. En la configuración de tu repositorio en GitHub, ve a **Settings -> Pages** y selecciona la rama `gh-pages`.

---

## 🛠️ Tecnologías Utilizadas

- **React 19**
- **Vite 8**
- **Tailwind CSS 3**
- **Lucide Icons**
- **Canvas Confetti**
- **LocalStorage API & JSON Backup** (Persistencia local sin costos ni configuración de bases de datos de pago)
