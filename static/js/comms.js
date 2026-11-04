(() => {
  const TELEMETRY_EVENTS = [
    {
      phase: "G.2",
      chipClass: "phase-chip-g",
      route: "PRIME -> KIPP",
      summary: "harvest_evidence(issue=#42) -> sha256:007dd10e",
      receipt: "RECEIPT // 007dd10e"
    },
    {
      phase: "U.1",
      chipClass: "phase-chip-u",
      route: "BRAND -> PRIME",
      summary: "submit_contract(spec.md, evidence-disposition.json)",
      receipt: "SCOPE_LOCK // 8_FILES"
    },
    {
      phase: "A.2",
      chipClass: "phase-chip-a",
      route: "COOPER -> PRIME",
      summary: "ratify_bundle(spec.md, design.md, structure.md) [GATE_OPEN]",
      receipt: "GATE // RATIFIED"
    },
    {
      phase: "A.3",
      chipClass: "phase-chip-a",
      route: "PRIME -> ROMILLY",
      summary: "sequence_execution_plan(steps=6, scope_lock=enforced)",
      receipt: "PLAN // 5feaba8e"
    },
    {
      phase: "R.1",
      chipClass: "phase-chip-r",
      route: "CASE -> PRIME",
      summary: "commit_worktree(feat/landing, files=8, npm_deps=0)",
      receipt: "WORKTREE // ISOLATED"
    },
    {
      phase: "R.2",
      chipClass: "phase-chip-r",
      route: "DOYLE -> PRIME",
      summary: "adversarial_verify(case!=doyle, devenv_test=PASS)",
      receipt: "CASE!=DOYLE // PASS"
    },
    {
      phase: "D.1",
      chipClass: "phase-chip-d",
      route: "DOYLE -> PRIME",
      summary: "verify_artifacts(zola_check=0_errors, pagefind=indexed)",
      receipt: "VERIFY // 0_ERRORS"
    },
    {
      phase: "S.2",
      chipClass: "phase-chip-s",
      route: "PRIME -> DOYLE",
      summary: "seal_pr_review(status=APPROVED, airgap_bundle=READY)",
      receipt: "SHIP // READY"
    }
  ];

  const MAX_FEED_ITEMS = 12;
  let eventCursor = 0;
  let totalDispatchedFrames = 4;
  let streamActive = true;
  let streamIntervalId = null;
  let latestFrameSummary =
    "R.2 | DOYLE -> PRIME | adversarial_verify(case!=doyle, devenv_test=PASS)";

  const isReducedMotion = () =>
    Boolean(
      typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

  const readFormState = (overrides = {}) => {
    const callsignEl = document.getElementById("comms-callsign");
    const topologyEl = document.getElementById("comms-topology");
    const messageEl = document.getElementById("comms-message");

    const callsign =
      overrides.callsign !== undefined
        ? overrides.callsign
        : (callsignEl && callsignEl.value.trim()) || "OPERATOR // SOVEREIGN-NODE-01";
    const topology =
      overrides.topology !== undefined
        ? overrides.topology
        : (topologyEl && topologyEl.value.trim()) || "AIRGAP_ENCLAVE // ZERO_REGISTRY";
    const message =
      overrides.message !== undefined
        ? overrides.message
        : (messageEl && messageEl.value.trim()) ||
          "Requesting sovereign runtime provisioning brief and v3.5 airgap bundle verification keys.";
    const timestamp =
      overrides.timestamp || new Date().toISOString();
    const frame = overrides.latestFrame || latestFrameSummary;

    return {
      callsign,
      topology,
      message,
      timestamp,
      latestFrame: frame
    };
  };

  const buildTelemetryPayload = (state = {}) => {
    const resolved = readFormState(state);
    const lines = [
      "=== TARS_CLOUD // RFC_6068_TELEMETRY_DISPATCH ===",
      `TIMESTAMP_UTC: ${resolved.timestamp}`,
      `OPERATOR_CALLSIGN: ${resolved.callsign}`,
      `DEPLOYMENT_TOPOLOGY: ${resolved.topology}`,
      "PROTOCOL_STATE: GUARDS_V3.5 // CASE_NEQ_DOYLE // AIRGAP_READY",
      `LATEST_TELEMETRY_FRAME: ${resolved.latestFrame}`,
      "--- OPERATOR_MESSAGE ---",
      resolved.message,
      "=== END_TELEMETRY_DISPATCH ==="
    ];
    return lines.join("\r\n");
  };

  const buildMailtoUri = (state = {}) => {
    const resolved = readFormState(state);
    const subject = `[TARS_COMMS_LINK] ${resolved.callsign} // ${resolved.topology}`;
    const body = buildTelemetryPayload(resolved);
    return `mailto:cooper@tars-cloud.ai?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const syncCommsPreview = () => {
    const state = readFormState();
    const payload = buildTelemetryPayload(state);
    const mailtoUri = buildMailtoUri(state);

    const previewEl = document.getElementById("comms-payload-preview");
    const mailtoAnchor = document.getElementById("comms-mailto-anchor");
    const modalUriEl = document.getElementById("comms-modal-uri");
    const modalBodyEl = document.getElementById("comms-modal-body");
    const modalMailtoEl = document.getElementById("comms-modal-mailto-link");

    if (previewEl) {
      previewEl.textContent = payload;
    }
    if (mailtoAnchor) {
      mailtoAnchor.setAttribute("href", mailtoUri);
    }
    if (modalUriEl) {
      modalUriEl.textContent = mailtoUri;
    }
    if (modalBodyEl) {
      modalBodyEl.textContent = payload;
    }
    if (modalMailtoEl) {
      modalMailtoEl.setAttribute("href", mailtoUri);
    }
  };

  const setStatusMessage = (text) => {
    const statusEl = document.getElementById("comms-status-msg");
    if (!statusEl) return;
    statusEl.textContent = text;
  };

  const copyTextToClipboard = async (text) => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_err) {
        // Fall through to textarea copy fallback
      }
    }

    if (typeof document === "undefined") return false;
    try {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(helper);
      return Boolean(copied);
    } catch (_err) {
      return false;
    }
  };

  const openFallbackModal = () => {
    syncCommsPreview();
    const modal = document.getElementById("comms-fallback-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    const copyBtn = document.getElementById("comms-modal-copy-btn");
    if (copyBtn) {
      copyBtn.focus();
    }
  };

  const closeFallbackModal = () => {
    const modal = document.getElementById("comms-fallback-modal");
    if (!modal) return;
    modal.classList.add("hidden");
  };

  const pushTelemetryEvent = (customEvent) => {
    const feedEl = document.getElementById("telemetry-feed");
    const counterEl = document.getElementById("telemetry-counter");
    const item =
      customEvent || TELEMETRY_EVENTS[eventCursor % TELEMETRY_EVENTS.length];
    eventCursor = (eventCursor + 1) % TELEMETRY_EVENTS.length;
    totalDispatchedFrames += 1;

    const utcStamp = new Date().toISOString().slice(11, 19) + "Z";
    latestFrameSummary = `${item.phase} | ${item.route} | ${item.summary}`;

    if (counterEl) {
      const padded = String(totalDispatchedFrames).padStart(2, "0");
      counterEl.textContent = `FRAMES: ${padded}`;
    }

    if (feedEl) {
      const row = document.createElement("div");
      row.className =
        "p-2 border border-border bg-surface-raised/60 flex flex-wrap items-center justify-between gap-2";

      const left = document.createElement("div");

      const badge = document.createElement("span");
      badge.className = `${item.chipClass || "phase-chip-g"} mr-1.5`;
      badge.textContent = item.phase;

      const route = document.createElement("span");
      route.className = "text-accent-cyan font-semibold";
      route.textContent = item.route;

      const summary = document.createElement("span");
      summary.className = "text-text-primary ml-1";
      summary.textContent = item.summary;

      left.appendChild(badge);
      left.appendChild(route);
      left.appendChild(summary);

      const right = document.createElement("span");
      right.className = "text-[10px] text-text-muted";
      right.textContent = `${utcStamp} // ${item.receipt || "VERIFIED"}`;

      row.appendChild(left);
      row.appendChild(right);

      feedEl.appendChild(row);

      while (feedEl.children.length > MAX_FEED_ITEMS) {
        feedEl.removeChild(feedEl.firstElementChild);
      }

      feedEl.scrollTop = feedEl.scrollHeight;
    }

    syncCommsPreview();
  };

  const updateStreamStatusUI = () => {
    const badgeEl = document.getElementById("telemetry-status-badge");
    const toggleBtn = document.getElementById("telemetry-toggle-btn");

    if (badgeEl) {
      badgeEl.textContent = streamActive ? "STREAM // ACTIVE" : "STREAM // PAUSED";
      badgeEl.className = streamActive
        ? "status-chip status-chip-nominal"
        : "status-chip status-chip-amber";
    }
    if (toggleBtn) {
      toggleBtn.textContent = streamActive ? "[PAUSE_STREAM]" : "[RESUME_STREAM]";
    }
  };

  const startStreamTimer = () => {
    if (streamIntervalId) {
      clearInterval(streamIntervalId);
      streamIntervalId = null;
    }
    if (!streamActive || isReducedMotion()) return;
    streamIntervalId = setInterval(() => {
      if (streamActive) {
        pushTelemetryEvent();
      }
    }, 3200);
  };

  const toggleStream = (forceState) => {
    streamActive = typeof forceState === "boolean" ? forceState : !streamActive;
    updateStreamStatusUI();
    if (streamActive) {
      startStreamTimer();
    } else if (streamIntervalId) {
      clearInterval(streamIntervalId);
      streamIntervalId = null;
    }
    return streamActive;
  };

  const initComms = () => {
    syncCommsPreview();

    if (isReducedMotion()) {
      streamActive = false;
      updateStreamStatusUI();
    } else {
      startStreamTimer();
    }

    const toggleBtn = document.getElementById("telemetry-toggle-btn");
    const clearBtn = document.getElementById("telemetry-clear-btn");
    const feedEl = document.getElementById("telemetry-feed");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        toggleStream();
      });
    }

    if (clearBtn && feedEl) {
      clearBtn.addEventListener("click", () => {
        feedEl.textContent = "";
        totalDispatchedFrames = 0;
        const counterEl = document.getElementById("telemetry-counter");
        if (counterEl) {
          counterEl.textContent = "FRAMES: 00";
        }
      });
    }

    const callsignEl = document.getElementById("comms-callsign");
    const topologyEl = document.getElementById("comms-topology");
    const messageEl = document.getElementById("comms-message");

    [callsignEl, topologyEl, messageEl].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", syncCommsPreview);
      el.addEventListener("change", syncCommsPreview);
    });

    const formEl = document.getElementById("comms-dispatch-form");
    const copyBtn = document.getElementById("comms-copy-btn");
    const modalCopyBtn = document.getElementById("comms-modal-copy-btn");
    const modalCloseBtn = document.getElementById("comms-modal-close-btn");

    if (formEl) {
      formEl.addEventListener("submit", async (event) => {
        event.preventDefault();
        syncCommsPreview();
        const payload = buildTelemetryPayload();
        await copyTextToClipboard(payload);
        setStatusMessage("RFC_6068_PACKET_READY // CLIPBOARD_AND_MODAL_SYNCED");
        openFallbackModal();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        syncCommsPreview();
        const payload = buildTelemetryPayload();
        const ok = await copyTextToClipboard(payload);
        setStatusMessage(
          ok
            ? "PACKET_COPIED // CLIPBOARD_SYNC_OK"
            : "CLIPBOARD_FALLBACK // OPENED_MODAL"
        );
        if (!ok) {
          openFallbackModal();
        }
      });
    }

    if (modalCopyBtn) {
      modalCopyBtn.addEventListener("click", async () => {
        const payload = buildTelemetryPayload();
        await copyTextToClipboard(payload);
        setStatusMessage("PACKET_COPIED // CLIPBOARD_SYNC_OK");
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => {
        closeFallbackModal();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeFallbackModal();
      }
    });
  };

  if (typeof window !== "undefined") {
    window.TARSComms = {
      TELEMETRY_EVENTS,
      buildTelemetryPayload,
      buildMailtoUri,
      pushTelemetryEvent,
      toggleStream,
      openFallbackModal,
      closeFallbackModal
    };
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initComms);
    } else {
      initComms();
    }
  }
})();
