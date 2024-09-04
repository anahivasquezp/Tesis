# Juego Serio para el Entrenamiento de Habilidades de Lenguaje

## Descripción
Este proyecto consiste en el desarrollo de un **juego serio** para el **entrenamiento de habilidades de lenguaje**, enfocado en mejorar el vocabulario, la construcción de frases y la comprensión del lenguaje en niños con discapacidades cognitivas o del lenguaje.

El juego incluye dos módulos principales: uno para terapeutas que permite el seguimiento y evaluación del progreso del niño, y otro para invitados, enfocado en la práctica libre. Incluye ejercicios de **discriminación auditiva**, **conciencia fonémica**, y **práctica de fonemas** categorizados por edades.

## Requisitos Previos

Para ejecutar este proyecto, necesitas tener instaladas las siguientes herramientas y versiones:

- **Node.js** v20.11.1
- **React** v18.2.0
- **Express.js** v4.18.3
- **Firebase Authentication** v10.12.2
- **Firebase Firestore** v10.12.2
- **Firebase Storage** v10.12.2
- **DALL-E 3** v3.0.0
- **SpeechSynthesis API** (No requiere instalación, integrada en el navegador)
- **Git** v2.45.2
- **Visual Studio Code** v1.91.1

## Instalación

1. **Clona este repositorio** en tu máquina local:

    ```bash
    git clone https://github.com/anahivasquezp/Tesis.git
    ```

2. **Cambia a la rama de desarrollo**: La rama `tests` contiene el flujo principal de desarrollo. Asegúrate de cambiarte a esta rama.

    ```bash
    git checkout tests
    ```

3. **Instala las dependencias necesarias** usando npm:

    ```bash
    npm install
    ```

4. **Configura Firebase** para la autenticación y base de datos en tiempo real. Asegúrate de que las credenciales de Firebase estén correctamente configuradas en los archivos de entorno.

5. **Ejecuta la aplicación localmente**:

    ```bash
    npm start
    ```

## Funcionalidades Principales

1. **Módulo de Autenticación**: 
   - Registro e inicio de sesión de terapeutas.
   - Modo invitado sin necesidad de registro.
   
2. **Módulo de Gestión de Niños**:
   - Registro y seguimiento del progreso de los niños.
   - Transferencia de niños entre terapeutas.
   
3. **Módulo de Ejercicios de Conciencia Fonológica**:
   - Ejercicios interactivos de fonemas y discriminación auditiva.
   
4. **Sistema de Retroalimentación**:
   - Retroalimentación inmediata y sistema de puntuación para motivar a los niños.

## Arquitectura del Sistema

El proyecto sigue el patrón **Modelo-Vista-Controlador (MVC)** para separar la lógica del negocio, la interfaz de usuario y el control de eventos. El backend está implementado en **Node.js** con **Express**, mientras que el frontend usa **React**. Firebase se utiliza para la autenticación de usuarios y el almacenamiento de datos en tiempo real.

## Flujo de Desarrollo

El flujo de desarrollo principal se encuentra en la rama `tests`. La rama `main` contiene la versión estable del proyecto, mientras que todos los desarrollos y nuevas funcionalidades se implementan y prueban en la rama `tests` antes de ser fusionados en `main`.


