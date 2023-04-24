// popup wrapper
import { gsap } from "gsap";

function move(id: string, position: string, color: string) {
    const tl = gsap.timeline();
    tl.to("#bgBubble", { duration: 0.15, bottom: "-30px", ease: "ease-out" }, 0)
        .to("#bubble1", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble2", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble3", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to("#bubble4", { duration: 0.1, y: "120%", boxShadow: 'none', ease: "ease-out", }, 0)
        .to(".icon", { duration: 0.05, opacity: 0, ease: "ease-out", }, 0)
        .to("#bgBubble", { duration: 0.2, left: position, ease: "ease-in-out" }, 0.1)
        .to("#bgBubble", { duration: 0.15, bottom: "-50px", ease: "ease-out" }, '-=0.2')
        .to(`#bubble${id}`, { duration: 0.15, y: "0%", opacity: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', ease: "ease-out" }, '-=0.1')
        .to(`#bubble${id}> span`, { duration: 0.15, y: "0%", opacity: 0.7, ease: "ease-out" }, '-=0.1')
        .to("#navbarContainer", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
        .to("#bg", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
        .to("#bgBubble", { duration: 0.3, backgroundColor: color, ease: "ease-in-out" }, 0)
}

const menuElement1 = document.querySelector('.menuElement1')
console.log("🚀 ~ file: popupVisual.ts:21 ~ menuElement1:", menuElement1)

const menuElement2 = document.querySelector('.menuElement2')
console.log("🚀 ~ file: popupVisual.ts:24 ~ menuElement2:", menuElement2)

const menuElement3 = document.querySelector('.menuElement3')
console.log("🚀 ~ file: popupVisual.ts:27 ~ menuElement3:", menuElement3)

const menuElemen4 = document.querySelector('.menuElemen4')
console.log("🚀 ~ file: popupVisual.ts:30 ~ menuElemen4:", menuElemen4)

menuElement1.addEventListener('click', () => move('1', '50px', '#ffcc80'))
menuElement2.addEventListener('click', () => move('2', '150px', '#81d4fa'))
menuElement3.addEventListener('click', () =>move('3', '250px', '#c5e1a5'))
menuElemen4.addEventListener('click', () => move('4', '350px', '#ce93d8'))
// popup wrapper

// button actions
document.querySelectorAll('.buttonActions').forEach(button => button.innerHTML = '<div><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></div>');
// button actions