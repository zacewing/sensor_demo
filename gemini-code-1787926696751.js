// Component Technical Specifications & Sequence Data
const partDetails = {
  head: { title: "Integrated Cylinder Head", desc: "Bolted down directly above the engine block. Cools exhaust gas in-head prior to entering the turbine." },
  avs: { title: "Audi Valvelift System (AVS)", desc: "Mounts directly above the cylinder head. Controls exhaust valve lift timing profiles." },
  injection: { title: "Dual Injection System", desc: "Installed into the intake ports. Combines high-pressure direct injection with lower-pressure port injection." },
  turbo: { title: "IHI Turbocharger Unit", desc: "Mounts directly to the integrated exhaust manifold outlet on the right flank of the engine." },
  thermal: { title: "Rotary Thermal Management Module", desc: "Mounts to the side of the engine block. Replaces standard mechanical thermostats." },
  chain: { title: "Timing Chain Assembly", desc: "Mounts vertically down the engine timing side, securing timing synchronization across cams and crankshaft." }
};

let installedCount = 0;
const totalParts = Object.keys(partDetails).length;

// Drag and Drop Event Listeners
document.querySelectorAll('.part-item').forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.part);
  });
});

document.querySelectorAll('.snap-target').forEach(target => {
  target.addEventListener('dragover', (e) => {
    e.preventDefault();
    target.classList.add('drag-over');
  });

  target.addEventListener('dragleave', () => {
    target.classList.remove('drag-over');
  });

  target.addEventListener('drop', (e) => {
    e.preventDefault();
    target.classList.remove('drag-over');
    
    const partKey = e.dataTransfer.getData('text/plain');
    const targetKey = target.id.replace('target-', '');

    // Validate if dragged item matches the target slot
    if (partKey === targetKey) {
      installPart(partKey);
    } else {
      updateInspector("<b>Assembly Error:</b> Component does not fit this mounting location.", "#ff4d4d");
    }
  });
});

function installPart(partKey) {
  const partElement = document.querySelector(`.part-item[data-part="${partKey}"]`);
  const installedGraphic = document.getElementById(`installed-${partKey}`);
  const targetZone = document.getElementById(`target-${partKey}`);

  if (partElement && !partElement.classList.contains('installed')) {
    // Mark as installed in UI
    partElement.classList.add('installed');
    installedGraphic.classList.add('visible');
    targetZone.style.display = 'none';

    // Update stats
    installedCount++;
    updateProgress();
    
    // Update Inspector panel
    const info = partDetails[partKey];
    updateInspector(`<b>Successfully Installed: ${info.title}</b><br><br>${info.desc}`, "#00d2ff");

    if (installedCount === totalParts) {
      setTimeout(() => {
        updateInspector("<b>Engine Fully Assembled!</b><br>All major EA888 Gen 3 structural components have been correctly placed.", "#4bb543");
      }, 500);
    }
  }
}

function updateProgress() {
  const percentage = (installedCount / totalParts) * 100;
  document.getElementById('progress-bar').style.width = `${percentage}%`;
  document.getElementById('assembly-status').innerText = `Assembly Progress: ${installedCount} / ${totalParts} Parts Installed`;
}

function updateInspector(message, color = "#ffffff") {
  const inspector = document.getElementById('inspector-content');
  inspector.innerHTML = `<p style="color: ${color}">${message}</p>`;
}