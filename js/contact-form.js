export function initContactForm() {
    const contactForm = document.querySelector('#contactForm');
    const formStatus = document.querySelector('#formStatus');
    const WHATSAPP_NUMBER = '919848519310';

    const showFormStatus = (message, type) => {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = type;
    };

    const validatePhoneField = (field) => {
        if (!field || field.name !== 'phone') return true;
        const trimmedValue = field.value.trim();
        if (!trimmedValue) {
            field.setCustomValidity('');
            return false;
        }
        const digits = trimmedValue.replace(/\D/g, '');
        const isPhoneValid = digits.length >= 10 && digits.length <= 15;
        field.setCustomValidity(isPhoneValid ? '' : 'Please enter a valid contact number with at least 10 digits.');
        return isPhoneValid;
    };

    const markValidity = (field) => {
        if (!field) return true;
        validatePhoneField(field);
        const isFieldValid = field.checkValidity();
        field.classList.toggle('invalid', !isFieldValid);
        return isFieldValid;
    };

    if (contactForm) {
        const fields = [...contactForm.querySelectorAll('input, select, textarea')];
        
        fields.forEach((field) => {
            const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
            field.addEventListener(eventName, () => markValidity(field));
            field.addEventListener('blur', () => markValidity(field));
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const valid = fields.every((field) => markValidity(field));

            if (!valid) {
                showFormStatus('Please complete the highlighted fields so we can prepare your WhatsApp message.', 'error');
                const firstInvalid = contactForm.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const service = String(formData.get('service') || '').trim();
            const timeline = String(formData.get('timeline') || '').trim();
            const message = String(formData.get('message') || '').trim();
            
            const whatsappMessage = [
                'Hello, I am contacting you from your website.',
                '',
                `Name: ${name}`,
                `Contact Number: ${phone}`,
                `Service Needed: ${service}`,
                `When Needed: ${timeline}`,
                '',
                'Project Details:',
                message
            ].join('\n');
            
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            showFormStatus('Redirecting to WhatsApp with your message details filled in.', 'success');

            contactForm.reset();
            fields.forEach((field) => {
                field.classList.remove('invalid');
                if (field.name === 'phone') field.setCustomValidity('');
            });
        });
    }

    const currentYear = document.querySelector('#currentYear');
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
}
