
        // Simple analytics and interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Add click tracking for available games
            const availableGames = document.querySelectorAll('.game-card.available');
            availableGames.forEach(card => {
                card.addEventListener('click', function() {
                    // Add click effect
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                });
            });

            // Add hover effect for coming soon games
            const comingSoonGames = document.querySelectorAll('.game-card.coming-soon');
            comingSoonGames.forEach(card => {
                card.addEventListener('click', function() {
                    // Show tooltip or message
                    const badge = this.querySelector('.coming-soon-badge');
                    const originalText = badge.textContent;
                    badge.textContent = 'Đang phát triển...';
                    badge.style.background = '#ff4d4f';
                    badge.style.color = 'white';
                    
                    setTimeout(() => {
                        badge.textContent = originalText;
                        badge.style.background = '#ffc107';
                        badge.style.color = '#333';
                    }, 2000);
                });
            });

            // Smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });

        // Simple page view tracking
        console.log('Game list page loaded');
    