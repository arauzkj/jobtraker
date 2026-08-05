export const EULA_METADATA = {
  title: "Acuerdo de Licencia de Usuario Final (EULA)",
  lastUpdated: "5 de agosto de 2026",
  jurisdiction: "República de Costa Rica",
};

export const EULA_SECTIONS = [
  {
    title: "1. Partes y objeto",
    body: `El presente Acuerdo de Licencia de Usuario Final ("EULA") es un contrato entre usted ("Usuario" o "Licenciatario") y el titular del software **Trayecto** ("Licenciante"), con domicilio en la República de Costa Rica.

Este EULA regula el acceso y uso del software web Trayecto (el "Software"), incluyendo sus actualizaciones y documentación asociada, en los términos aquí establecidos y conforme a la legislación costarricense aplicable.`,
  },
  {
    title: "2. Concesión de licencia",
    body: `Sujeto al cumplimiento de este EULA y de los Términos y Condiciones del Servicio, el Licenciante concede al Usuario una licencia **limitada, no exclusiva, intransferible, revocable y no sublicenciable** para acceder y utilizar el Software únicamente para fines personales de organización de postulaciones laborales.

Esta licencia **no implica venta** del Software ni transferencia de derechos de propiedad.`,
  },
  {
    title: "3. Restricciones de uso",
    body: `Salvo autorización expresa por escrito del Licenciante, el Usuario **no podrá**:

- Copiar, modificar, adaptar, traducir o crear obras derivadas del Software.
- Descompilar, desensamblar o intentar obtener el código fuente, salvo en los casos expresamente permitidos por la ley costarricense.
- Alquilar, arrendar, prestar, vender, distribuir o poner el Software a disposición de terceros con fines comerciales.
- Eliminar avisos de derechos de autor, marcas o restricciones de licencia.
- Utilizar el Software para desarrollar un producto competidor sustancialmente similar.
- Automatizar el acceso de forma abusiva o eludir medidas técnicas de protección.`,
  },
  {
    title: "4. Propiedad intelectual",
    body: `El Software, su código, interfaz, diseño, logotipos y documentación son propiedad del Licenciante o de sus proveedores, protegidos por la **Ley de Derechos de Autor y Derechos Conexos** de Costa Rica (Ley N.° 6683) y tratados internacionales aplicables.

Todos los derechos no otorgados expresamente en este EULA quedan reservados al Licenciante.`,
  },
  {
    title: "5. Cuenta y credenciales",
    body: `El acceso al Software puede requerir registro. Las credenciales son personales e intransferibles. El Usuario es responsable de su custodia y de notificar accesos no autorizados.

El Licenciante podrá suspender el acceso ante uso indebido, vulneración de seguridad o incumplimiento de este EULA.`,
  },
  {
    title: "6. Actualizaciones y cambios",
    body: `El Licenciante podrá proporcionar actualizaciones, parches o modificaciones al Software. Dichas versiones quedarán sujetas a este EULA, salvo que se indique lo contrario.

El Licenciante no está obligado a mantener compatibilidad con versiones anteriores ni a continuar el desarrollo del Software indefinidamente.`,
  },
  {
    title: "7. Servicios de terceros",
    body: `El Software puede integrarse con servicios de terceros (por ejemplo: base de datos, autenticación o APIs de inteligencia artificial). El uso de dichos servicios puede estar sujeto a términos adicionales de esos proveedores.

El Licenciante no controla ni garantiza la disponibilidad, seguridad o contenido de servicios de terceros.`,
  },
  {
    title: "8. Datos personales",
    body: `El tratamiento de datos personales en relación con el Software se realiza conforme a la **Ley N.° 8968** y demás normativa costarricense de protección de datos.

El Usuario reconoce que es responsable de la licitud de los datos que ingrese en el Software, especialmente cuando incluya información de terceros relacionada con procesos de selección.`,
  },
  {
    title: "9. Exclusión de garantías",
    body: `En la medida máxima permitida por la ley costarricense, el Software se proporciona **"TAL CUAL"** y **"SEGÚN DISPONIBILIDAD"**, sin garantías de ningún tipo, ya sean expresas, implícitas o legales, incluyendo —sin limitación— garantías de comerciabilidad, idoneidad para un propósito particular, exactitud o ausencia de errores.

El Licenciante no garantiza que el Software esté libre de interrupciones, vulnerabilidades o pérdida de datos.`,
  },
  {
    title: "10. Limitación de responsabilidad",
    body: `En ningún caso el Licenciante será responsable por daños indirectos, incidentales, especiales, consecuenciales o punitivos, incluyendo pérdida de datos, ingresos o oportunidades laborales, aun cuando hubiere sido advertido de la posibilidad de tales daños.

La responsabilidad total del Licenciante, si correspondiera, se limitará al monto que la ley costarricense no permita excluir en el contexto de un servicio digital de carácter personal y gratuito.`,
  },
  {
    title: "11. Terminación",
    body: `Este EULA permanece vigente mientras el Usuario utilice el Software. El Licenciante puede rescindir la licencia de forma inmediata si el Usuario incumple cualquier disposición de este acuerdo o de los Términos y Condiciones.

Tras la terminación, el Usuario debe cesar todo uso del Software. Las cláusulas sobre propiedad intelectual, exclusiones de garantía y limitación de responsabilidad subsistirán.`,
  },
  {
    title: "12. Ley aplicable y jurisdicción",
    body: `Este EULA se interpreta y ejecuta de acuerdo con las leyes de la **República de Costa Rica**.

Cualquier disputa relacionada con este EULA será sometida a la jurisdicción de los **tribunales ordinarios competentes de Costa Rica**, salvo norma imperativa en contrario.`,
  },
  {
    title: "13. Aceptación",
    body: `Al marcar la casilla de aceptación durante el registro, al acceder al Software o al utilizarlo, usted manifiesta haber leído y aceptado este EULA en su totalidad.

Si no acepta estos términos, no debe instalar, acceder ni utilizar el Software.`,
  },
] as const;
