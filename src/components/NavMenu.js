import '../styles/NavMenu.css';

class NavMenu {
    render() {
        return `
            <nav class="nav-container">
                <div class="nav-logo">Holidaze</div>
                <div class="nav-links">
                    <a href="#" class="nav-link">Home</a>
                    <a href="#" class="nav-link">Venues</a>
                    <a href="#" class="nav-link">New booking</a>
                </div>
                <div class="nav-profile">
                    <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
                </div>
            </nav>
        `;
    }
}

// Render NavMenu into the existing <header> element
function renderNavMenu() {
    const header = document.querySelector('header');
    if (header) {
        const navMenu = new NavMenu();
        header.innerHTML = navMenu.render();
    }
}

renderNavMenu();

export default NavMenu; 