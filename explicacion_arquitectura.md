# Arquitectura Desacoplada: Solución Híbrida para Proxmox y Nginx

Este documento detalla la arquitectura implementada para solucionar los conflictos de despliegue en el entorno virtualizado de la UTN (Proxmox), abordando los bloqueos del proxy inverso de la facultad mediante la creación de un sistema de microservicios apoyado en una CDN global.

---

## 1. El Problema Original
La infraestructura de la facultad utiliza un servidor de entrada (Nginx) que actúa como *Proxy Inverso*. La tarea de este servidor es recibir el tráfico de internet (`nap.frt.utn.edu.ar`) y redirigirlo a tu máquina virtual (`172.16.90.143:3000`).

El conflicto radicaba en que este Nginx estaba interceptando, por error o configuración estricta, las peticiones hacia archivos estáticos (archivos con extensiones `.js`, `.css`, `.woff2`, `.svg`). En lugar de dejarlos pasar hacia tu contenedor, el Nginx los bloqueaba devolviendo un error **501 Not Implemented**. Sin estos archivos, la aplicación Next.js no podía cargar ni sus estilos ni su lógica visual interactiva.

---

## 2. Conceptos Clave Intervinientes

Para entender la solución, es imperativo dominar cuatro conceptos de infraestructura:

### A. Reverse Proxy (Proxy Inverso)
Un proxy inverso es un servidor que se sitúa delante de los servidores web y encamina las peticiones de los clientes (naveমাদের) hacia esos servidores. 
*   **Analogía:** Es como el recepcionista de un edificio de oficinas. Vos le pedís ir al consultorio 45275660, y el recepcionista te lleva ahí sin que sepas qué ruta interna tomó.
*   **En nuestro proyecto:** Tenemos dos. El de la facultad (Nginx) y el que construimos nosotros (`server-proxy.js`). Nuestro proxy recibe a los visitantes que manda el de la facultad y decide a qué "habitaciones" enviarlos.

### B. CDN (Content Delivery Network)
Una CDN es una red de servidores distribuidos geográficamente por todo el mundo. Su único propósito es entregar archivos estáticos (imágenes, CSS, JS) a los usuarios desde el servidor más cercano a ellos, a velocidades ultra rápidas.
*   **Por qué la usamos:** En lugar de forzar a que tu pequeña máquina virtual en Proxmox entregue las imágenes pesadas y los estilos (y de paso pelear contra el Nginx), delegamos este trabajo a **Vercel** (que actúa como nuestra CDN).

### C. Hashes de Compilación (Bundlers)
Cuando programas en React/Next.js y corres `npm run build`, herramientas como Webpack empaquetan el código y le cambian el nombre a los archivos agregándoles un código aleatorio, llamado *hash* (ej: `estilos-0dlxeaqz.css`). Esto se hace para evitar que el navegador guarde en caché versiones viejas de la página.
*   **El Conflicto:** Si compilas en tu computadora, el archivo se llama `A.css`. Si compilas en la nube de Vercel, se llama `B.css`. Al intentar mezclar el HTML de tu computadora con la CDN de Vercel, el HTML pedía el archivo `A.css`, pero Vercel solo tenía `B.css`, resultando en un error **404 Not Found**.

### D. Microservicios / Headless Backend
En lugar de tener una aplicación gigante (Monolito) que hace todo, separamos las responsabilidades en sistemas más pequeños (Microservicios). 
*   **Headless Backend:** Es un servidor que *no tiene cabeza* (no tiene interfaz gráfica). Solo sirve datos puros (en formato JSON) cuando se lo piden mediante una API.

---

## 3. La Solución Arquitectónica (Cómo funciona ahora)

Para resolver todo, eliminamos la responsabilidad visual de Proxmox y lo convertimos en el **Director de Orquesta** mediante un Proxy Híbrido (`server-proxy.js`).

### El Flujo de Datos Paso a Paso:

> **Paso 1: La Llegada del Usuario**
> El profesor escribe `nap.frt.utn.edu.ar/45275660` en su navegador. El Nginx de la facultad lo deja pasar y lo manda a tu máquina virtual en el puerto 3000. Ahí lo atiende nuestro `server-proxy.js`.

> **Paso 2: Bifurcación Visual (El salto a la CDN)**
> Nuestro proxy ve que el profesor quiere cargar la página web. En lugar de procesarla localmente, **va corriendo a Vercel**, busca el código HTML y se lo entrega al profesor. Como este HTML viene de Vercel, contiene los hashes exactos y perfectos. A partir de acá, el navegador del profesor carga todo el diseño (CSS y JS) directamente desde la CDN de Vercel, saltándose por completo las restricciones del Nginx de la facultad.

> **Paso 3: Bifurcación de Datos (Seguridad Privada)**
> La interfaz visual ya cargó. Ahora, el código de React quiere traer los artículos para mostrarlos en pantalla. Hace una petición a `/45275660/api/posts`.
> La petición llega de nuevo a nuestro `server-proxy.js` en el puerto 3000. Nuestro proxy detecta la palabra `/api/` y dice: *"¡Alerta! Esto es confidencial y requiere la base de datos"*. 
> En lugar de mandarlo a Vercel, **lo desvía internamente hacia el puerto 3001**, donde está nuestro servidor de Next.js (Headless Backend). 

> **Paso 4: Conexión a Base de Datos**
> El Next.js en el puerto 3001, al estar dentro de la red privada de Proxmox, tiene permiso para hablar con el contenedor de la Base de Datos (`172.16.90.144:5432`). Hace la consulta, obtiene los posts, se los pasa al proxy y el proxy se los entrega al navegador del profesor.

## Conclusión
Gracias a este diseño, lograste lo mejor de ambos mundos:
1. **Velocidad y Resiliencia Front-End:** El diseño visual se sirve a nivel global y evita los errores 501/404 del servidor universitario.
2. **Seguridad y Control Back-End:** Tus datos están resguardados en tu red privada de Proxmox, sin exponer tu Base de Datos PostgreSQL a la internet pública.
