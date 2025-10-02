export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Generar contenido del email
    const emailContent = generateEmailContent(formData);
    
    // Enviar email usando Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@tu-dominio.com',
        to: [process.env.EMAIL_RECIPIENT],
        subject: `Nuevo Cuestionario Integral - ${formData.patientInfo.patientName}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    res.status(200).json({ message: 'Formulario enviado exitosamente' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error al enviar el formulario' });
  }
}

function generateEmailContent(formData) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 30px; border-left: 4px solid #0d9488; padding-left: 15px; }
          .section-title { font-weight: bold; font-size: 18px; color: #0d9488; margin-bottom: 10px; }
          .field { margin-bottom: 8px; }
          .field-label { font-weight: bold; }
          .field-value { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Cuestionario Integral - Nuevo Envío</h1>
          <p><strong>Paciente:</strong> ${formData.patientInfo.patientName}</p>
          <p><strong>Fecha de evaluación:</strong> ${formData.patientInfo.evaluationDate}</p>
        </div>

        <div class="section">
          <div class="section-title">Información del Paciente</div>
          <div class="field"><span class="field-label">Nombre:</span><span class="field-value">${formData.patientInfo.patientName}</span></div>
          <div class="field"><span class="field-label">Fecha de nacimiento:</span><span class="field-value">${formData.patientInfo.birthDate}</span></div>
          <div class="field"><span class="field-label">Edad:</span><span class="field-value">${formData.patientInfo.age}</span></div>
          <div class="field"><span class="field-label">Fecha de parto:</span><span class="field-value">${formData.patientInfo.deliveryDate}</span></div>
          <div class="field"><span class="field-label">Semanas postparto:</span><span class="field-value">${formData.patientInfo.postpartumWeeks}</span></div>
        </div>

        <div class="section">
          <div class="section-title">Datos Antropométricos</div>
          <div class="field"><span class="field-label">Peso actual:</span><span class="field-value">${formData.section1.anthropometric.currentWeight} kg</span></div>
          <div class="field"><span class="field-label">Talla:</span><span class="field-value">${formData.section1.anthropometric.height} cm</span></div>
          <div class="field"><span class="field-label">IMC:</span><span class="field-value">${formData.section1.anthropometric.bmi} kg/m²</span></div>
          <div class="field"><span class="field-label">Peso pre-embarazo:</span><span class="field-value">${formData.section1.anthropometric.prePregnancyWeight} kg</span></div>
        </div>

        <div class="section">
          <div class="section-title">Consentimiento</div>
          <div class="field"><span class="field-label">Firma del paciente:</span><span class="field-value">${formData.consent.patientSignature}</span></div>
          <div class="field"><span class="field-label">Fecha:</span><span class="field-value">${formData.consent.patientDate}</span></div>
        </div>

        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #666;">
          Este formulario fue enviado automáticamente desde el Cuestionario Integral.
        </p>
      </body>
    </html>
  `;
}