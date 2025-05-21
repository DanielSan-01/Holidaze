import '../styles/Footer.css';

class Footer {
    render() {
        return `
            <div class="footer-container">
                Holidaze all rights reserved 2025 &copy;
            </div>
        `;
    }
}

function renderFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        const footerComponent = new Footer();
        footer.innerHTML = footerComponent.render();
    }
}

renderFooter();

export default Footer; 