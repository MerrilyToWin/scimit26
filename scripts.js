       const API_URL = "https://scimit26.onrender.com/chat";
        async function sendMessage() {
            const input = document.getElementById("userInput");
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, "user");
            input.value = "";

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                addMessage(data.reply, "bot");

            } catch (error) {
                addMessage("⚠️ Server error. Please try again.", "bot");
            }
        }

        function addMessage(text, sender) {
            const chatBox = document.getElementById("chatBox");
            const msg = document.createElement("div");
            msg.className = sender;
            msg.innerText = text;
            chatBox.appendChild(msg);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Create particles
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll reveal animation
        const revealElements = document.querySelectorAll('.reveal');
        
        function reveal() {
            revealElements.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', reveal);
        reveal(); // Initial check

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        // Countdown Timer - SCIMIT'26
        const eventDate = new Date("February 28, 2026 09:00:00").getTime();

        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.querySelector(".countdown").innerHTML =
                    "<h3 style='color: var(--accent-gold);'>🎉 Event Started!</h3>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
            document.getElementById("seconds").innerText = seconds;
        }, 1000);

        const registerLeftBtn = document.getElementById("floatingRegisterLeft");
        const aboutSection = document.getElementById("about");
        const chatbotToggle = document.getElementById("chatbotToggle");
        const chatbotOverlay = document.getElementById("chatbotOverlay");
        const closeChatbot = document.getElementById("closeChatbot");
        const chatMessages = document.getElementById("chatMessages");
        const typingIndicator = document.getElementById("typingIndicator");


        // Show Register button when About section enters viewport
        window.addEventListener("scroll", () => {
            const aboutTop = aboutSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (aboutTop < windowHeight - 150) {
                registerLeftBtn.classList.add("show");
            } else {
                registerLeftBtn.classList.remove("show");
            }
        });

        // Register button action
        registerLeftBtn.addEventListener("click", () => {
            window.open("https://forms.gle/aegb4XqcuCfT4LPs9", "_blank");
        });

        chatbotToggle.addEventListener("click", () => {
            chatbotOverlay.style.display = "flex";
        });

        closeChatbot.addEventListener("click", () => {
            chatbotOverlay.style.display = "none";
        });

        chatbotToggle.onclick = () => {
            chatbotOverlay.classList.add("active");
            autoGreeting();
        };

        closeChatbot.onclick = () => {
            chatbotOverlay.classList.remove("active");
        };

        function autoGreeting() {
            if (chatMessages.children.length === 0) {
                addBotMessage("Hi there 👋<br>How can I help you today?");
            }
        }

        function addBotMessage(text) {
            const div = document.createElement("div");
            div.className = "bot-msg";
            div.innerText = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addUserMessage(text) {
            const div = document.createElement("div");
            div.className = "user-msg";
            div.innerText = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById("userInput");
            const msg = input.value.trim();
            if (!msg) return;

            addUserMessage(msg);
            input.value = "";

            typingIndicator.style.display = "block";

            const res = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg })
            });

            const data = await res.json();

            typingIndicator.style.display = "none";
            addBotMessage(data.reply);
        }

        function quickSend(text) {
            document.getElementById("userInput").value = text;
            sendMessage();
        }





