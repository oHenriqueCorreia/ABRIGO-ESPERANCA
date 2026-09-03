/**
 * CAMPANHA SOLIDÁRIA - 412 CÃEZINHOS (ABRIGO DE ANIMAIS)
 * Interactive JavaScript Controller - Infinite Carousel, Docs & Pix
 */

// Global Configuration
const CONFIG = {
  pixKey: "https://link.syncpayments.com.br/AxkHLA",
  beneficiaryName: "ASSOCIAÇÃO DE RESGATE E PROTEÇÃO ANIMAL",
  campaignGoal: 150000,
  currentRaised: 48910
};

// --- Copy Pix Functionality ---
function copyPixKey(customKey) {
  const keyToCopy = customKey || CONFIG.pixKey;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(keyToCopy).then(() => {
      onPixCopiedSuccess();
    }).catch(() => {
      fallbackCopyText(keyToCopy);
    });
  } else {
    fallbackCopyText(keyToCopy);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    onPixCopiedSuccess();
  } catch (err) {
    alert("Chave Pix para copiar: " + text);
  }
  document.body.removeChild(textArea);
}

function onPixCopiedSuccess() {
  showToast("Chave Pix copiada com sucesso! Cole no app do seu banco.");
  
  // Close basic donation modal if open and show urgent confirmation modal
  closeDonationModal();
  
  setTimeout(() => {
    openPixCopiedModal();
  }, 400);
}

// --- Toast Notification ---
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const toastText = document.getElementById("toastMessageText");
  if (!toast) return;
  
  if (toastText) toastText.textContent = message;
  toast.classList.add("show");
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// --- Donation Modal Handlers ---
function openDonationModal(presetAmount) {
  const modal = document.getElementById("pixDonationModal");
  if (!modal) return;
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  
  if (presetAmount) {
    selectPresetValue(presetAmount);
  }
}

function closeDonationModal() {
  const modal = document.getElementById("pixDonationModal");
  if (!modal) return;
  
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeDonationModalOnOverlay(event) {
  if (event.target.id === "pixDonationModal") {
    closeDonationModal();
  }
}

// --- Value Preset Buttons ---
const PIX_LINKS = {
  10:  'https://link.syncpayments.com.br/VGI5mD',
  25:  'https://link.syncpayments.com.br/iFQenP',
  50:  'https://link.syncpayments.com.br/fjbcho',
  100: 'https://link.syncpayments.com.br/n7PBsw'
};

function selectPresetValue(val, btnElement) {
  // Highlight the selected button
  document.querySelectorAll(".btn-preset-val").forEach(btn => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

  // Update the pix link and label
  const link = PIX_LINKS[val] || PIX_LINKS[25];
  const inputEl = document.getElementById("modalPixKeyInput");
  const labelEl = document.getElementById("selectedValueLabel");
  if (inputEl) {
    inputEl.value = link;
  }
  if (labelEl) {
    labelEl.textContent = "R$ " + val + ",00";
  }

  showToast("Valor de R$ " + val + ",00 selecionado!");
}

function copyModalPixKey() {
  const inputEl = document.getElementById("modalPixKeyInput");
  if (!inputEl) return;
  copyPixKey(inputEl.value);
}

// --- Post-Copy Urgent Modal ---
function openPixCopiedModal() {
  const modal = document.getElementById("postCopyModal");
  if (!modal) return;
  
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePixCopiedModal() {
  const modal = document.getElementById("postCopyModal");
  if (!modal) return;
  
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closePixCopiedOnOverlay(event) {
  if (event.target.id === "postCopyModal") {
    closePixCopiedModal();
  }
}

// --- FAQ Accordion ---
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isActive = item.classList.contains("active");
  
  // Close all other items
  document.querySelectorAll(".faq-item").forEach(other => {
    if (other !== item) other.classList.remove("active");
  });
  
  if (!isActive) {
    item.classList.add("active");
  } else {
    item.classList.remove("active");
  }
}

// --- Drawer Navigation ---
function openDrawer() {
  const drawer = document.getElementById("drawerMenu");
  if (drawer) drawer.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = document.getElementById("drawerMenu");
  if (drawer) drawer.classList.remove("active");
  document.body.style.overflow = "";
}

// --- Share Button ---
function shareCampaign() {
  if (navigator.share) {
    navigator.share({
      title: "Campanha Solidária - Ajude 412 Cãezinhos",
      text: "O abrigo precisa de nossa ajuda urgente para continuar alimentando mais de 400 animais resgatados! Doe pelo Pix.",
      url: window.location.href
    }).catch(() => {});
  } else {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Link da vaquinha copiado para compartilhar!");
      });
    } else {
      showToast("Compartilhe: " + window.location.href);
    }
  }
}

// --- Video Demo Trigger ---
function playShelterVideo() {
  openDonationModal();
  showToast("Assista e apoie a campanha salvando vidas!");
}

// --- Document Viewer Tabs ---
function switchDocTab(tabId, btnElement) {
  // Update Buttons
  document.querySelectorAll(".doc-tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  if (btnElement) {
    btnElement.classList.add("active");
  }

  // Update Panes
  document.querySelectorAll(".tab-pane-doc").forEach(pane => {
    pane.classList.remove("active");
  });
  
  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add("active");
  }
}

// --- Document Zoom Modal ---
function openDocZoom() {
  const activePane = document.querySelector(".tab-pane-doc.active");
  const zoomModal = document.getElementById("docZoomModal");
  const zoomContent = document.getElementById("docZoomContent");
  
  if (!zoomModal || !zoomContent || !activePane) return;
  
  zoomContent.innerHTML = activePane.innerHTML;
  zoomModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDocZoom() {
  const zoomModal = document.getElementById("docZoomModal");
  if (!zoomModal) return;
  
  zoomModal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeDocZoomOnOverlay(event) {
  if (event.target.id === "docZoomModal") {
    closeDocZoom();
  }
}

function downloadDocMock(docType) {
  showToast(`Baixando comprovante oficial (${docType}) em PDF...`);
  setTimeout(() => {
    showToast(`Comprovante autenticado baixado com sucesso!`);
  }, 1200);
}

// --- TESTIMONIALS INFINITE LOOP CAROUSEL ---
let currentSlideIndex = 0;
let carouselTimer = null;

function getVisibleSlidesCount() {
  return window.innerWidth >= 768 ? 2 : 1;
}

function getTotalSlides() {
  return document.querySelectorAll(".testimonial-slide").length;
}

function getMaxIndex() {
  const total = getTotalSlides();
  const visible = getVisibleSlidesCount();
  return Math.max(0, total - visible);
}

function updateCarouselUI() {
  const track = document.getElementById("testimonialsTrack");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!track) return;

  const visible = getVisibleSlidesCount();
  const stepPercentage = 100 / visible;
  const offset = -(currentSlideIndex * stepPercentage);
  
  track.style.transform = `translateX(${offset}%)`;

  // Update dots
  dots.forEach((dot, idx) => {
    if (idx === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function nextTestimonialSlide() {
  const max = getMaxIndex();
  if (currentSlideIndex >= max) {
    currentSlideIndex = 0; // Infinite loop circular wrap
  } else {
    currentSlideIndex++;
  }
  updateCarouselUI();
}

function prevTestimonialSlide() {
  const max = getMaxIndex();
  if (currentSlideIndex <= 0) {
    currentSlideIndex = max; // Circular wrap backwards
  } else {
    currentSlideIndex--;
  }
  updateCarouselUI();
}

function goToTestimonialSlide(index) {
  currentSlideIndex = index;
  updateCarouselUI();
  resetCarouselTimer();
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselTimer = setInterval(nextTestimonialSlide, 4500); // 4.5 seconds per slide
}

function stopCarouselAutoPlay() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function resetCarouselTimer() {
  stopCarouselAutoPlay();
  startCarouselAutoPlay();
}

// --- Social Proof Random Donors Simulation ---
const DONOR_PROOFS = [
  { name: "Mariana Silva", city: "São Paulo", value: "R$ 50", time: "há 2 min" },
  { name: "Carlos Eduardo", city: "Curitiba", value: "R$ 100", time: "há 4 min" },
  { name: "Fernanda Costa", city: "Belo Horizonte", value: "R$ 25", time: "há 7 min" },
  { name: "Rodrigo Almeida", city: "Porto Alegre", value: "R$ 150", time: "há 10 min" },
  { name: "Juliana Santos", city: "Rio de Janeiro", value: "R$ 30", time: "há 12 min" },
  { name: "Patrícia Lima", city: "Campinas", value: "R$ 80", time: "há 15 min" },
  { name: "Gabriel Souza", city: "Florianópolis", value: "R$ 50", time: "há 18 min" }
];

let donorIndex = 0;
function showNextSocialProof() {
  const toast = document.getElementById("socialProofToast");
  const nameEl = document.getElementById("spDonorName");
  const valueEl = document.getElementById("spDonorValue");
  const timeEl = document.getElementById("spDonorTime");
  const avatarEl = document.getElementById("spDonorAvatar");
  
  if (!toast || !nameEl) return;
  
  const donor = DONOR_PROOFS[donorIndex];
  nameEl.textContent = donor.name + ` (${donor.city})`;
  valueEl.textContent = `doou ${donor.value} via Pix`;
  timeEl.textContent = donor.time;
  if (avatarEl) {
    avatarEl.textContent = donor.name.charAt(0);
  }
  
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
  
  donorIndex = (donorIndex + 1) % DONOR_PROOFS.length;
  
  // Schedule next popup in 16 to 28 seconds
  const nextInterval = Math.floor(Math.random() * 12000) + 16000;
  setTimeout(showNextSocialProof, nextInterval);
}

// --- Initialize when DOM is ready ---
document.addEventListener("DOMContentLoaded", () => {
  // Start social proof after 4 seconds
  setTimeout(showNextSocialProof, 4000);
  
  // Close drawer on link click
  document.querySelectorAll(".drawer-links a").forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

  // Init Carousel
  updateCarouselUI();
  startCarouselAutoPlay();

  // Pause on hover
  const carouselContainer = document.getElementById("testimonialsContainer");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopCarouselAutoPlay);
    carouselContainer.addEventListener("mouseleave", startCarouselAutoPlay);
  }

  // Handle window resize for carousel recalculation
  window.addEventListener("resize", () => {
    const max = getMaxIndex();
    if (currentSlideIndex > max) currentSlideIndex = max;
    updateCarouselUI();
  });
});

// --- Intersection Observer for Lazy Autoplay Videos ---
document.addEventListener('DOMContentLoaded', () => {
  const lazyVideos = document.querySelectorAll('.lazy-video');
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
          }
          // observer.unobserve(iframe); // Keep observing if we want to pause when out of view, but for simple iframe just load once.
          observer.unobserve(iframe);
        }
      });
    }, { rootMargin: "0px 0px 100px 0px" });

    lazyVideos.forEach(video => {
      videoObserver.observe(video);
    });
  } else {
    // Fallback
    lazyVideos.forEach(video => {
      video.src = video.dataset.src;
    });
  }
});
