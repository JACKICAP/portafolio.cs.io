import './style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- 0. Interactive Particle Canvas (Antigravity Style) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.baseX = x; // original position
    this.baseY = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.density = (Math.random() * 30) + 1;
  }

  // Method to draw individual particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Method to check particle position, check mouse position, move the particle, draw the particle
  update() {
    // Determine if particle is in mouse radius
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;

    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;

    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }

    // floating effect
    this.baseX += this.directionX * 0.2;
    this.baseY += this.directionY * 0.2;
    
    // Boundary check
    if (this.baseX < 0 || this.baseX > canvas.width) this.directionX = -this.directionX;
    if (this.baseY < 0 || this.baseY > canvas.height) this.directionY = -this.directionY;

    this.draw();
  }
}

// Create particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 2) - 1;
    let directionY = (Math.random() * 2) - 1;
    
    // Choose colors to match black/white gradient theme or specific colors
    let color = 'rgba(255, 255, 255, 0.4)';
    // adding some colored dots for that antigravity technological feel
    let r = Math.random();
    if(r > 0.8) color = 'rgba(100, 200, 255, 0.5)'; // blueish
    if(r > 0.9) color = 'rgba(255, 100, 100, 0.5)'; // reddish

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// Draw lines between particles close to each other
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                     ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if (distance < (canvas.width/7) * (canvas.height/7)) {
        opacityValue = 1 - (distance/20000);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

init();
animate();

// --- 1. Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // Dot instantly follows
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Outline follows with a slight delay using GSAP
  gsap.to(cursorOutline, {
    x: posX,
    y: posY,
    duration: 0.15,
    ease: "power2.out"
  });
});

// Cursor Hover Effects
hoverTargets.forEach(target => {
  target.addEventListener('mouseenter', () => {
    gsap.to(cursorOutline, { scale: 1.5, borderColor: "rgba(255,255,255,0.8)", duration: 0.3 });
    gsap.to(cursorDot, { scale: 0, duration: 0.3 });
  });
  target.addEventListener('mouseleave', () => {
    gsap.to(cursorOutline, { scale: 1, borderColor: "rgba(255,255,255,0.5)", duration: 0.3 });
    gsap.to(cursorDot, { scale: 1, duration: 0.3 });
  });
});


// --- 2. Hero Initial Animation ---
const heroTimeline = gsap.timeline();

heroTimeline.to('.mask-text span', {
  y: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power4.out",
  delay: 0.2
});


// --- 3. Scroll Animations ---
const sections = document.querySelectorAll('.line-up');

sections.forEach((section) => {
  gsap.from(section, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%", // trigger when top of section hits 80% of viewport
      toggleActions: "play none none none"
    }
  });
});


// --- 4. Project Preview Hover ---
const projectItems = document.querySelectorAll('.project-item');
const projectPreview = document.getElementById('project-preview');
const previewImg = document.getElementById('preview-img');

// We use the same mousemove event for the preview but only activate it when over a project
let isHoveringProject = false;

projectItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const imgUrl = item.getAttribute('data-image');
    if (imgUrl) {
      previewImg.src = imgUrl;
      isHoveringProject = true;
      gsap.to(projectPreview, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    }
  });

  item.addEventListener('mouseleave', () => {
    isHoveringProject = false;
    gsap.to(projectPreview, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power3.out" });
  });
});

window.addEventListener('mousemove', (e) => {
  if (isHoveringProject) {
    // Move the preview image near the cursor
    gsap.to(projectPreview, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power3.out"
});
  }
});

// --- 5. Terminal Code Typing Effect ---
const codeSnippets = {
  "Java": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Java engine initialized.\");\n  }\n}",
  "Python": "def initialize():\n    print('Python environment ready.')\n\nif __name__ == '__main__':\n    initialize()",
  "HTML & CSS": "<!-- Document Structure -->\n<div class=\"tech-stack\">\n  <span>System loaded</span>\n</div>\n\n/* Styles */\n.tech-stack {\n  color: #fff;\n  background: #000;\n}",
  "JSON & JavaScript": "const systemObj = {\n  status: 'active',\n  latency: '12ms'\n};\n\nconsole.log(`System running: ${systemObj.status}`);",
  "C++": "#include <iostream>\n\nint main() {\n    std::cout << \"C++ Core executed\" << std::endl;\n    return 0;\n}",
  "SQL": "SELECT system_name, status \nFROM processes \nWHERE status = 'active' \nORDER BY start_time DESC;",
  "Machine Learning": "import tensorflow as tf\n\nmodel = tf.keras.Sequential([\n  tf.keras.layers.Dense(64, activation='relu')\n])\nmodel.compile(optimizer='adam', loss='mse')\nprint(\"ML Model compiled successfully.\")",
  "Visión Computacional": "import cv2\n\nimg = cv2.imread('frame.jpg')\nres = cv2.dnn.readNetFromDarknet(cfg, weights)\nprint(\"YOLO initialized for tracking.\")",
  "Git & GitHub": "git commit -m \"feat: initialized central repository\"\ngit push origin main\n# Pushing to remote server...",
  "Data Analysis": "import pandas as pd\n\ndf = pd.read_csv('dataset.csv')\nsummary = df.describe()\nprint(summary.head())",
  "API REST": "fetch('https://api.system.local/v1/health')\n  .then(res => res.json())\n  .then(data => console.log(data));\n// Status: 200 OK"
};

const techPills = document.querySelectorAll('.tech-pill');
const codeModal = document.getElementById('code-modal');
const closeCodeModalBtn = document.getElementById('close-code-modal');
const codeTypingArea = document.getElementById('code-typing-area');
const codeTitle = document.getElementById('code-title');

let typingInterval;

function typeCode(codeStr) {
  codeTypingArea.textContent = "";
  if (typingInterval) clearInterval(typingInterval);
  
  let i = 0;
  typingInterval = setInterval(() => {
    if (i < codeStr.length) {
      codeTypingArea.textContent += codeStr.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
    }
  }, 25); // Typing speed
}

techPills.forEach(pill => {
  // Let custom cursor interact with them
  pill.classList.add('hover-target');
  
  pill.addEventListener('click', () => {
    const techName = pill.textContent.trim();
    const snippet = codeSnippets[techName] || `// No snippet mapped for ${techName}\nconsole.log("Ready.");`;
    
    codeTitle.textContent = `${techName} Environment`;
    codeModal.classList.add('active');
    
    // Slight delay before typing starts for effect
    setTimeout(() => {
      typeCode(snippet);
    }, 300);
  });
});

closeCodeModalBtn.addEventListener('click', () => {
  codeModal.classList.remove('active');
  if (typingInterval) clearInterval(typingInterval);
});

// Close modal if clicked outside
codeModal.addEventListener('click', (e) => {
  if (e.target === codeModal) {
    codeModal.classList.remove('active');
    if (typingInterval) clearInterval(typingInterval);
  }
});
