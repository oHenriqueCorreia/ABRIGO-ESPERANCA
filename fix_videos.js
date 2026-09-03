const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const toReplace = `<div class="video-grid">
<!-- SECTION: HIST`;

const replacement = `<div class="video-grid">
  <div class="video-wrapper" style="overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); height: 450px; position: relative;">
    <iframe class="lazy-video" width="100%" height="570" data-src="https://www.youtube-nocookie.com/embed/NO56ewBwyOg?autoplay=1&loop=1&playlist=NO56ewBwyOg&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3" frameborder="0" allow="autoplay; encrypted-media" style="position: absolute; top: -60px; left: 0;"></iframe>
  </div>
  <div class="video-wrapper" style="overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); height: 450px; position: relative;">
    <iframe class="lazy-video" width="100%" height="570" data-src="https://www.youtube-nocookie.com/embed/Fde_AV9ocmw?autoplay=1&loop=1&playlist=Fde_AV9ocmw&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3" frameborder="0" allow="autoplay; encrypted-media" style="position: absolute; top: -60px; left: 0;"></iframe>
  </div>
</div>
</div>
</section>

<!-- SECTION: HIST`;

html = html.replace(toReplace, replacement);
fs.writeFileSync('index.html', html, 'utf8');
