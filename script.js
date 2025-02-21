document.addEventListener('DOMContentLoaded', function() {
    // 基础功能
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // 滚动进度条
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight);
        scrollProgress.style.transform = `scaleX(${scrolled})`;
    });

    // 淡入效果
    const fadeElements = document.querySelectorAll('.timeline-item, .project-card, .research-card, .add-skill-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // 添加滚动指示器功能
    const sections = document.querySelectorAll('section');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    function updateScrollIndicator() {
        const currentScroll = window.scrollY;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                scrollDots[index].classList.add('active');
            } else {
                scrollDots[index].classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateScrollIndicator);

    // 添加标题动画效果
    const titles = document.querySelectorAll('h2, h3');
    titles.forEach(title => {
        title.innerHTML = title.textContent.split('').map(char => 
            `<span class="char">${char}</span>`
        ).join('');
    });

    // 添加鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 添加卡片悬浮效果
    document.querySelectorAll('.timeline-item, .project-card, .research-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 添加滚动动画
    const sections = document.querySelectorAll('.section-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 添加进度条动画
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.progress;
            }
        });
    });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // 轮播图功能
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        
        // 更新轮播图显示
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // 自动播放
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 3000);
        
        // 点击导航点切换
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    });

    // 轮播图触摸滑动支持
    function initCarouselTouch(carousel) {
        const track = carousel.querySelector('.carousel-track');
        let startX = 0;
        let currentTranslate = 0;
        let isDragging = false;
        let currentIndex = 0;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const slideCount = slides.length;

        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);

        function touchStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentTranslate = -currentIndex * 100;
            track.style.transition = 'none';
        }

        function touchMove(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = (currentX - startX) / carousel.offsetWidth * 100;
            const translate = currentTranslate + diff;
            track.style.transform = `translateX(${translate}%)`;
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const threshold = 20; // 滑动阈值
            const diff = (event.type.includes('mouse') ? event.pageX : event.changedTouches[0].clientX) - startX;
            const diffPercent = (diff / carousel.offsetWidth) * 100;

            if (Math.abs(diffPercent) > threshold) {
                currentIndex = diffPercent > 0 ? 
                    Math.max(currentIndex - 1, 0) : 
                    Math.min(currentIndex + 1, slideCount - 1);
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = carousel.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    // 初始化所有轮播图
    document.querySelectorAll('.carousel-container').forEach(initCarouselTouch);
});

// 添加打字机效果
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// 添加文字渐显效果
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-text');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-content h3, .project-card h3').forEach(el => {
  observer.observe(el);
});

// 返回顶部按钮
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 