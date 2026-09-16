/**
 * CAMPANHA SOLIDÁRIA - 412 CÃEZINHOS (ABRIGO DE ANIMAIS)
 * Interactive JavaScript Controller - Infinite Carousel, Docs & Pix
 */

// Global Configuration
const CONFIG = {
  beneficiaryName: "ASSOCIAÇÃO DE RESGATE E PROTEÇÃO ANIMAL",
  campaignGoal: 150000,
  currentRaised: 48910
};

// --- Copy Pix Functionality ---
function copyPixKey(customKey) {
  if (!customKey) {
    openDonationModal();
    return;
  }
  const keyToCopy = customKey;
  
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
  stopPixStatusPolling();
  document.getElementById("pixCheckoutForm").style.display = "block";
  document.getElementById("pixPaymentPanel").style.display = "none";
  const qr = document.getElementById("pixQrCode");
  qr.style.display = "none";
  qr.removeAttribute("src");
  const paymentStatus = document.getElementById("pixPaymentStatus");
  paymentStatus.textContent = "Aguardando a confirmação do pagamento…";
  paymentStatus.style.color = "#166534";
  document.getElementById("pixDonationDetails").style.display = "none";
  document.getElementById("customPixValueForm").style.display = "none";
  setPixError("");
  
  if (presetAmount) {
    selectPresetValue(presetAmount);
  }
}

function closeDonationModal() {
  const modal = document.getElementById("pixDonationModal");
  if (!modal) return;
  
  modal.classList.remove("active");
  document.body.style.overflow = "";
  stopPixStatusPolling();
}

function closeDonationModalOnOverlay(event) {
  if (event.target.id === "pixDonationModal") {
    closeDonationModal();
  }
}

// --- Value Preset Buttons ---
let selectedPixAmount = 25;
let pixStatusTimer;

function selectPresetValue(val, btnElement) {
  // Highlight the selected button
  document.querySelectorAll(".btn-preset-val").forEach(btn => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }
  document.getElementById("pixDonationDetails").style.display = "block";
  document.getElementById("customPixValueForm").style.display = "none";

  selectedPixAmount = Number(val) || 25;
  const labelEl = document.getElementById("selectedValueLabel");
  if (labelEl) {
    labelEl.textContent = "R$ " + selectedPixAmount.toFixed(2).replace(".", ",");
  }

  showToast("Valor de R$ " + selectedPixAmount.toFixed(2).replace(".", ",") + " selecionado!");
}

function showCustomPixValue() {
  document.querySelectorAll(".btn-preset-val").forEach(btn => btn.classList.remove("active"));
  document.getElementById("pixDonationDetails").style.display = "block";
  document.getElementById("customPixValueForm").style.display = "block";
  document.getElementById("customPixAmount").focus();
}

function copyModalPixKey() {
  const inputEl = document.getElementById("modalPixKeyInput");
  if (!inputEl) return;
  copyPixKey(inputEl.value);
}

function setPixError(message) {
  const error = document.getElementById("pixFormError");
  if (!error) return;
  error.textContent = message || "";
  error.style.display = message ? "block" : "none";
}

async function generatePixDonation() {
  const customValueForm = document.getElementById("customPixValueForm");
  if (customValueForm.style.display !== "none") {
    const amount = Number(String(document.getElementById("customPixAmount").value).replace(",", "."));
    if (!Number.isFinite(amount) || amount < 1) return setPixError("Informe um valor de doação a partir de R$ 1,00.");
    selectedPixAmount = amount;
    document.getElementById("selectedValueLabel").textContent = "R$ " + amount.toFixed(2).replace(".", ",");
  }
  const name = document.getElementById("donorName")?.value.trim();
  const phone = document.getElementById("donorPhone")?.value.replace(/\D/g, "");
  const button = document.getElementById("generatePixBtn");
  if (name.length < 2 || phone.length < 10 || phone.length > 13) {
    return setPixError("Informe seu nome completo e telefone com DDD para gerar o PIX.");
  }

  setPixError("");
  button.disabled = true;
  button.textContent = "GERANDO PIX…";
  try {
    const response = await fetch("/api/create-pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(selectedPixAmount * 100), name, phone }),
    });
    const data = await response.json();
    if (!response.ok || !data.pix?.code) throw new Error(data.message || "Não foi possível gerar o PIX.");

    document.getElementById("modalPixKeyInput").value = data.pix.code;
    const qr = document.getElementById("pixQrCode");
    if (data.pix.imageBase64) {
      qr.src = data.pix.imageBase64.startsWith("data:") ? data.pix.imageBase64 : `data:image/png;base64,${data.pix.imageBase64}`;
      qr.style.display = "block";
    }
    document.getElementById("pixCheckoutForm").style.display = "none";
    document.getElementById("pixPaymentPanel").style.display = "block";
    startPixStatusPolling(data.id);
  } catch (error) {
    setPixError(error.message || "Não foi possível gerar o PIX. Tente novamente.");
  } finally {
    button.disabled = false;
    button.textContent = "GERAR PIX SEGURO";
  }
}

function stopPixStatusPolling() {
  clearInterval(pixStatusTimer);
  pixStatusTimer = undefined;
}

function startPixStatusPolling(id) {
  stopPixStatusPolling();
  const status = document.getElementById("pixPaymentStatus");
  const check = async () => {
    try {
      const response = await fetch(`/api/pix-status?id=${encodeURIComponent(id)}`);
      const data = await response.json();
      if (data.status === "paid") {
        stopPixStatusPolling();
        status.textContent = "Pagamento confirmado! Muito obrigado por ajudar. 💚";
        status.style.color = "#15803d";
      } else if (["expired", "cancelled", "refunded"].includes(data.status)) {
        stopPixStatusPolling();
        status.textContent = "Esta cobrança não está mais disponível. Gere um novo PIX.";
        status.style.color = "#b91c1c";
      }
    } catch (_) {
      // A confirmação continua sendo checada na próxima tentativa.
    }
  };
  check();
  pixStatusTimer = setInterval(check, 5000);
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

// --- Depoimentos em vídeo: reproduz um por vez e troca ao terminar ---
let testimonialVideoPlayers = [];
let activeTestimonialVideo = 0;
let testimonialVideosReady = false;

function activateTestimonialVideo(index, autoplay = true) {
  if (!testimonialVideoPlayers.length) return;
  activeTestimonialVideo = index % testimonialVideoPlayers.length;
  document.querySelectorAll(".testimonial-video-slide").forEach((slide, position) => {
    slide.classList.toggle("active", position === activeTestimonialVideo);
  });
  const counter = document.getElementById("testimonialVideoCounter");
  if (counter) counter.textContent = `Depoimento ${activeTestimonialVideo + 1} de ${testimonialVideoPlayers.length}`;
  testimonialVideoPlayers.forEach((player, position) => {
    if (position === activeTestimonialVideo) {
      if (autoplay) player.playVideo();
    } else {
      player.pauseVideo();
    }
  });
}

function initializeTestimonialVideos() {
  if (testimonialVideosReady || !window.YT?.Player) return;
  const frames = [...document.querySelectorAll(".testimonial-video-slide iframe")];
  if (!frames.length) return;
  testimonialVideosReady = true;
  testimonialVideoPlayers = frames.map((frame, index) => new window.YT.Player(frame.id, {
    host: "https://www.youtube-nocookie.com",
    videoId: frame.dataset.videoId,
    playerVars: { autoplay: index === 0 ? 1 : 0, controls: 1, modestbranding: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: (event) => {
        if (index === 0) event.target.playVideo();
      },
      onStateChange: (event) => {
        if (event.data === window.YT.PlayerState.ENDED && index === activeTestimonialVideo) {
          activateTestimonialVideo(index + 1);
        }
      },
    },
  }));
}

function loadTestimonialVideoAPI() {
  if (document.getElementById("youtube-iframe-api")) return;
  const api = document.createElement("script");
  api.id = "youtube-iframe-api";
  api.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(api);
}

window.onYouTubeIframeAPIReady = initializeTestimonialVideos;

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
  loadTestimonialVideoAPI();

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
