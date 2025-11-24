# 🌍 Geographia

Geographia es una aplicación web que permite explorar y crear publicaciones geolocalizadas. El proyecto se encuentra dividido en un frontend Angular y un backend Node.js, que pueden ser ejecutados mediante Docker usando *docker-compose*.

## 🚀 Requisitos previos

Antes de comenzar, asegurate de tener instalados:

* **Git**
* **Docker**
* **Docker Compose**

## 🔐 Archivo `.env`

Para ejecutar el proyecto correctamente, necesitás obtener el archivo `.env` ubicado en la raíz del repositorio.

📩 **Solicitalo a los desarrolladores:**

* [Antonio Felix Glorioso Ceretti](https://github.com/Ationno)
* [Agustina Sol Rojas](https://github.com/agusrnfr)

*La aplicación no funcionará sin este archivo.*

## 🛠️ Instalación y ejecución

Seguí estos pasos para levantar la aplicación en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Ationno/Geographia.git

# 2. Ingresar a la carpeta del proyecto
cd Geographia/

# 3. Asegurarte de colocar el archivo .env en la raíz del proyecto

# 4. Construir los contenedores, puede tardar unos minutos
docker compose build

# 5. Levantar los servicios
docker compose up
```

## 🌐 Acceder a la aplicación

Una vez que los contenedores estén en ejecución, ingresá a:

👉 **[http://localhost:4200](http://localhost:4200)**
