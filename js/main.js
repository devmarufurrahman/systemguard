"use strict";

// ! Element ============================================================

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const header = document.querySelector(".header");
const toggleBtn = document.querySelector(".nav__toggle");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const allSections = document.querySelectorAll(".section");
const section1 = document.querySelector("#section--1");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
const cookieBody = document.querySelector(".cookie");
const cookieCloseBtn = document.querySelector(".cookie__close");
const imgTargets = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

// ! Cookie

cookieCloseBtn.addEventListener("click", function () {
	cookieBody.classList.add("hidden");
	cookieBody.style.bottom = "-12rem";
});

// Sticky nav bar
//! nav's height
const navHeight = nav.getBoundingClientRect().height;

function sticky(entries) {
	const entry = entries[0];

	if (!entry.isIntersecting) {
		nav.classList.add("sticky");
	} else {
		nav.classList.remove("sticky");
	}
}

const headerObserve = new IntersectionObserver(sticky, {
	root: null, //viewport
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserve.observe(header);

// ! reveal section
function revealSection(entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.classList.remove("section--hidden");

	observer.unobserve(entry.target);
}

const sectionObserve = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.2,
});

allSections.forEach((section) => {
	sectionObserve.observe(section);
	section.classList.add("section--hidden");
});

// ! Modal window

function openModal(e) {
	e.preventDefault();
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
}

function closeModal() {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
}

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

// scroll behavior

navLinks.addEventListener("click", function (e) {
	e.preventDefault();

	if (e.target.classList.contains("nav__link")) {
		const attr = e.target.getAttribute("href");
		document.querySelector(attr).scrollIntoView({ behavior: "smooth" });
	}
});

// ! Toggle navbar

toggleBtn.addEventListener("click", function () {
	if (navLinks.classList.contains("nav__open")) {
		navLinks.classList.remove("nav__open");
		document.querySelector("html").style.overflow = "visible";
	} else {
		navLinks.classList.add("nav__open");
		document.querySelector("html").style.overflow = "hidden";
	}
});

navLinks.addEventListener("click", function () {
	navLinks.classList.contains("nav__open") &&
		navLinks.classList.remove("nav__open");
	document.querySelector("html").style.overflow = "visible";
});

// Learn more scroll

btnScrollTo.addEventListener("click", function () {
	section1.scrollIntoView({ behavior: "smooth" });
});

// ! Lazy loading

function loadImg(entries, observe) {
	const entry = entries[0];
	if (!entry.isIntersecting) return;
	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener("load", function () {
		entry.target.classList.remove("lazy-img");
	});
	observe.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0.2,
});

imgTargets.forEach((img) => imgObserver.observe(img));

//! SLider ==============================================================
let currentSlide = 0;
const maxSlide = slides.length - 1;

// Dots-----------------------------------------------------
function creatingDots() {
	slides.forEach((_, i) => {
		const dot = `<button class="dots__dot" data-slide="${i}"></button>`;
		dotContainer.insertAdjacentHTML("beforeend", dot);
	});
}

creatingDots();

function activeDots(slide) {
	document
		.querySelectorAll(".dots__dot")
		.forEach((dot) => dot.classList.remove("dots__dot--active"));
	document
		.querySelector(`.dots__dot[data-slide="${slide}"]`)
		.classList.add("dots__dot--active");
}

activeDots(0);

// Changing slide ----------------------------------------
function updateSlide(cs) {
	slides.forEach(
		(sl, i) => (sl.style.transform = `translateX(${100 * (i - cs)}%)`),
	);
}

updateSlide(0);

function previousSlide() {
	if (currentSlide === 0) currentSlide = maxSlide;
	else currentSlide--;
	updateSlide(currentSlide);
	activeDots(currentSlide);
}

function nextSlide() {
	if (currentSlide === maxSlide) currentSlide = 0;
	else currentSlide++;
	updateSlide(currentSlide);
	activeDots(currentSlide);
}

// dots container

dotContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("dots__dot")) {
		activeDots(e.target.dataset.slide);
		updateSlide(e.target.dataset.slide);
	}
});

// button handle
btnLeft.addEventListener("click", previousSlide);
btnRight.addEventListener("click", nextSlide);

// arrow key
document.addEventListener("keydown", function (e) {
	e.key === "ArrowLeft" && previousSlide();
	e.key === "ArrowRight" && nextSlide();
});

//! tab component

tabsContainer.addEventListener("click", function (e) {
	const btn = e.target.closest(".operations__tab");

	if (!btn) return;
	tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
	tabsContent.forEach((content) =>
		content.classList.remove("operations__content--active"),
	);

	btn.classList.add("operations__tab--active");
	document
		.querySelector(`.operations__content--${btn.dataset.tab}`)
		.classList.add("operations__content--active");
});
