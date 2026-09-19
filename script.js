// ==========================================================================
// LÓGICA INTERACTIVA Y ACCESIBILIDAD NATIVA
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. LECTURA EN VOZ ALTA (Text-to-Speech)
    window.speakText = function(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Detener lecturas anteriores
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CO'; // Español Colombia
            utterance.rate = 0.9; // Velocidad pausada para mejor comprensión
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Su navegador no soporta lectura por voz.");
        }
    };

    // Botón para leer toda la pantalla
    document.getElementById('btn-read-page').addEventListener('click', () => {
        const textToRead = "Bienvenido a Salud Fácil Senior. Portal de agendamiento de citas médicas accesibles. En la pantalla encontrará opciones para hablar por voz, agendar citas en tres pasos o llamar a urgencias.";
        speakText(textToRead);
    });

    // 2. MODO ALTO CONTRASTE
    const btnContrast = document.getElementById('btn-toggle-contrast');
    btnContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isHigh = document.body.classList.contains('high-contrast');
        speakText(isHigh ? "Modo alto contraste activado" : "Modo alto contraste desactivado");
    });

    // 3. AUMENTAR TAMAÑO DE LETRA DInÁMICAMENTE
    const btnFont = document.getElementById('btn-increase-font');
    let currentFontSize = 20;
    btnFont.addEventListener('click', () => {
        currentFontSize = currentFontSize >= 28 ? 20 : currentFontSize + 3;
        document.body.style.fontSize = `${currentFontSize}px`;
        speakText(`Tamaño de letra cambiado a ${currentFontSize} píxeles`);
    });

    // 4. RECONOCIMIENTO DE VOZ (Speech Recognition)
    const btnVoice = document.getElementById('btn-voice-command');
    const voiceStatus = document.getElementById('voice-status');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-CO';

        btnVoice.addEventListener('click', () => {
            recognition.start();
            voiceStatus.textContent = "🎙️ Escuchando... Hable ahora.";
            speakText("Escuchando, diga el servicio que necesita");
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceStatus.textContent = `Usted dijo: "${transcript}"`;
            
            // Auto-seleccionar según la palabra dicha
            const select = document.getElementById('service-select');
            if (transcript.toLowerCase().includes('general')) {
                select.value = "Medicina General";
            } else if (transcript.toLowerCase().includes('odonto') || transcript.toLowerCase().includes('diente')) {
                select.value = "Odontología";
            } else if (transcript.toLowerCase().includes('ojo') || transcript.toLowerCase().includes('vista') || transcript.toLowerCase().includes('opto')) {
                select.value = "Optometría";
            } else if (transcript.toLowerCase().includes('examen') || transcript.toLowerCase().includes('sangre')) {
                select.value = "Exámenes de Laboratorio";
            }

            speakText(`Entendido. Seleccionó ${select.value || transcript}. Ahora elija la fecha.`);
        };

        recognition.onerror = () => {
            voiceStatus.textContent = "No se logró entender. Intente de nuevo.";
            speakText("No logré escucharle con claridad. Por favor presione el botón e intente de nuevo.");
        };
    } else {
        btnVoice.disabled = true;
        voiceStatus.textContent = "Su navegador no soporta reconocimiento de voz.";
    }

    // 5. FORMULARIO DE AGENDAMIENTO
    const form = document.getElementById('appointment-form');
    const confirmation = document.getElementById('confirmation-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const service = document.getElementById('service-select').value;
        const date = document.getElementById('appointment-date').value;
        const id = document.getElementById('user-id').value;

        const message = `¡Cita médica agendada con éxito! Servicio: ${service}. Fecha: ${date}. Documento: ${id}.`;
        
        confirmation.innerHTML = `🎉 <strong>¡Su cita ha sido confirmada!</strong><br>${message}`;
        confirmation.style.display = 'block';

        speakText(message);
        form.reset();
    });
});