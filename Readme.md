# 🔐 Generador de Contraseñas

Este proyecto es una aplicación web sencilla para generar, guardar y gestionar contraseñas seguras. Está construido con **Node.js**, **Express** y **LowDB** para el backend, y HTML/CSS/JavaScript puro para el frontend.

---

## 🚀 ¿Qué hace este proyecto?

- **Genera contraseñas seguras** de longitud configurable.
- Permite **guardar** las contraseñas generadas junto con un nombre o etiqueta opcional.
- Muestra un **historial** de contraseñas generadas, con fecha y nombre.
- Permite **editar** o **eliminar** cualquier contraseña del historial.
- Todo se almacena localmente en un archivo `db.json` (no se usan bases de datos externas).

---

## 🗂️ Estructura del proyecto

```
DSS/
├── public/
│   ├── index.html      # Interfaz web principal
│   └── style.css       # Estilos de la interfaz
├── assets/             # Favicons y manifest para PWA
│   ├── favicon-96x96.png
│   ├── favicon2.svg
│   ├── favicon2.ico
│   ├── apple-touch-icon2.png
│   └── site.webmanifest
├── server.js           # Servidor Express y API
├── db.json             # Base de datos local (LowDB)
├── package.json        # Dependencias y scripts
└── .gitignore
```

---

## 📝 Detalles técnicos y comentarios del código

- **Servidor Express**: Sirve los archivos estáticos de `public/` y los recursos de `assets/`.
- **CORS**: Solo permite peticiones desde `http://localhost:3000` para mayor seguridad.
- **API REST**:
  - `GET /api/generate`: Genera una contraseña segura.
  - `POST /api/passwords`: Guarda una contraseña y su etiqueta.
  - `GET /api/passwords`: Lista todas las contraseñas guardadas.
  - `PUT /api/passwords/:id`: Edita una contraseña y/o su etiqueta.
  - `DELETE /api/passwords/:id`: Elimina una contraseña del historial.
- **Validaciones**:
  - Limita el tamaño de las peticiones JSON a 10kb.
  - Valida que la contraseña no sea demasiado larga y que la etiqueta solo contenga caracteres ASCII.
- **Frontend**:
  - Usa delegación de eventos para manejar los botones de editar y eliminar en el historial.
  - El historial se actualiza automáticamente tras cada operación.
  - El diseño es responsivo y agradable visualmente.

---

## 🛠️ Instalación y uso

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd DSS
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Inicia el servidor:
   ```sh
   npm start
   ```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## 📦 Dependencias principales

- [express](https://www.npmjs.com/package/express)
- [lowdb](https://www.npmjs.com/package/lowdb)
- [nanoid](https://www.npmjs.com/package/nanoid)
- [validator](https://www.npmjs.com/package/validator)
- [cors](https://www.npmjs.com/package/cors)

---

## 📝 Notas adicionales

- Los favicons y el manifest están en la carpeta `assets/` y se sirven correctamente gracias a la línea:
  ```js
  app.use('/assets', express.static('assets'));
  ```
- El archivo `db.json` está en `.gitignore` para no subir contraseñas generadas al repositorio.
- El código está comentado para facilitar su comprensión y mantenimiento.

---

## ✨ Autor

Hecho para fines educativos