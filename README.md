# Cuestionario Integral

Una aplicación de formulario integral para la evaluación nutricional de pacientes con condiciones complejas como el Síndrome de Ehlers-Danlos, resistencia a la insulina y artritis, en el contexto del postparto y la lactancia.

## Características

- ✅ Formulario completo en español
- ✅ Envío automático por correo electrónico
- ✅ Diseño responsive y moderno
- ✅ Optimizado para Vercel

## Despliegue en Vercel

### Prerrequisitos

1. **Cuenta en Resend**: Regístrate en [Resend](https://resend.com) para obtener una API key para envío de correos
2. **Cuenta en Vercel**: Regístrate en [Vercel](https://vercel.com)

### Pasos para desplegar

1. **Clona el repositorio**:
   ```bash
   git clone <tu-repositorio>
   cd Cuestionario-clinico-erlnd-dannoso
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   - Ve a tu proyecto en Vercel
   - Ve a Settings > Environment Variables
   - Agrega las siguientes variables:
     - `RESEND_API_KEY`: Tu API key de Resend
     - `EMAIL_RECIPIENT`: El email donde quieres recibir los formularios

4. **Despliega en Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

### Configuración de Resend

1. Ve a [Resend](https://resend.com) y crea una cuenta
2. Ve a API Keys y crea una nueva key
3. Copia la key y agrégala como variable de entorno en Vercel
4. Configura tu dominio en Resend (opcional, puedes usar el dominio por defecto)

### Variables de entorno requeridas

- `RESEND_API_KEY`: API key de Resend para envío de correos
- `EMAIL_RECIPIENT`: Email donde se enviarán los formularios completados

## Desarrollo local

1. **Instala las dependencias**:
   ```bash
   npm install
   ```

2. **Configura las variables de entorno**:
   Crea un archivo `.env.local` con:
   ```
   RESEND_API_KEY=tu_api_key_aqui
   EMAIL_RECIPIENT=tu-email@ejemplo.com
   ```

3. **Ejecuta en modo desarrollo**:
   ```bash
   npm run dev
   ```

## Estructura del proyecto

```
├── pages/
│   └── api/
│       └── submit-form.ts    # Endpoint para envío de formularios
├── components/
│   ├── FormElements.tsx     # Componentes de formulario
│   └── Section.tsx          # Componente de sección
├── App.tsx                  # Componente principal
├── types.ts                 # Tipos TypeScript
├── vercel.json             # Configuración de Vercel
└── package.json            # Dependencias del proyecto
```

## Funcionalidades

- **Formulario completo**: 13 secciones cubriendo todos los aspectos de evaluación nutricional
- **Envío por correo**: Los formularios se envían automáticamente por email
- **Diseño responsive**: Funciona en desktop, tablet y móvil
- **Validación**: Campos requeridos y validación de datos
- **Interfaz en español**: Todo el contenido está en español

## Soporte

Si tienes problemas con el despliegue o configuración, revisa:
1. Las variables de entorno están configuradas correctamente
2. La API key de Resend es válida
3. El email de destino es correcto
