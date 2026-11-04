(() => {
  const TARS_LETTERS = [
    "████████╗ █████╗ ██████╗ ███████╗   ██████╗██╗      ██████╗ ██╗   ██╗██████╗ ",
    "╚══██╔══╝██╔══██╗██╔══██╗██╔════╝  ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗",
    "   ██║   ███████║██████╔╝███████╗  ██║     ██║     ██║   ██║██║   ██║██║  ██║",
    "   ██║   ██╔══██║██╔══██╗╚════██║  ██║     ██║     ██║   ██║██║   ██║██║  ██║",
    "   ██║   ██║  ██║██║  ██║███████║  ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝",
    "   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝"
  ].join("\n");

  const CIPHER_GLYPHS = "01#<>/\\|[]{}—=+*^~";
  const COMMAND_HISTORY = [];
  let historyIndex = -1;
  let activeRunTimerIds = [];

  const isReducedMotion = () =>
    Boolean(
      typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

  const clearPendingTimers = () => {
    while (activeRunTimerIds.length > 0) {
      const id = activeRunTimerIds.pop();
      clearTimeout(id);
    }
  };

  const renderAsciiTypewriter = (element) => {
    const target = element || document.getElementById("tars-ascii-banner");
    if (!target) return;

    if (isReducedMotion()) {
      target.textContent = TARS_LETTERS;
      return;
    }

    const lines = TARS_LETTERS.split("\n");
    let lineIdx = 0;
    target.textContent = "";

    const step = () => {
      if (lineIdx >= lines.length) {
        target.textContent = TARS_LETTERS;
        return;
      }
      lineIdx += 1;
      target.textContent = lines.slice(0, lineIdx).join("\n");
      if (lineIdx < lines.length) {
        setTimeout(step, 35);
      }
    };

    step();
  };

  const scrambleText = (element) => {
    const target = element || document.getElementById("tars-matrix-subtitle");
    if (!target) return;

    const finalString =
      target.getAttribute("data-target-text") ||
      target.textContent ||
      "SOVEREIGN MULTI-AGENT ENGINEERING // GOVERNED BY GUARDS";

    if (isReducedMotion()) {
      target.textContent = finalString;
      return;
    }

    const totalFrames = 18;
    let frame = 0;

    const tick = () => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * finalString.length);
      let nextText = "";

      for (let i = 0; i < finalString.length; i += 1) {
        const ch = finalString[i];
        if (ch === " " || i < revealCount) {
          nextText += ch;
        } else {
          const randIndex = Math.floor(Math.random() * CIPHER_GLYPHS.length);
          nextText += CIPHER_GLYPHS[randIndex];
        }
      }

      target.textContent = nextText;

      if (frame < totalFrames) {
        setTimeout(tick, 28);
      } else {
        target.textContent = finalString;
      }
    };

    tick();
  };

  const scrollToBottom = (outputEl) => {
    if (!outputEl) return;
    outputEl.scrollTop = outputEl.scrollHeight;
  };

  const appendCommandEcho = (outputEl, rawInput) => {
    const row = document.createElement("div");
    row.className = "pt-1 border-t border-border/40 flex items-center gap-2";

    const promptSpan = document.createElement("span");
    promptSpan.className = "text-accent-cyan font-semibold select-none";
    promptSpan.textContent = "cooper@tars-prime:~$";

    const cmdSpan = document.createElement("span");
    cmdSpan.className = "text-text-primary font-semibold";
    cmdSpan.textContent = rawInput;

    row.appendChild(promptSpan);
    row.appendChild(cmdSpan);
    outputEl.appendChild(row);
    scrollToBottom(outputEl);
  };

  const createPhaseBadge = (phaseClass, label) => {
    const badge = document.createElement("span");
    badge.className = `${phaseClass} mr-1.5 inline-block`;
    badge.textContent = label;
    return badge;
  };

  const appendPhaseLine = (outputEl, phaseClass, badgeLabel, actorText, detailText, receiptText) => {
    const line = document.createElement("div");
    line.className = "leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-1";

    line.appendChild(createPhaseBadge(phaseClass, badgeLabel));

    const actor = document.createElement("span");
    actor.className = "text-accent-cyan font-semibold";
    actor.textContent = actorText;
    line.appendChild(actor);

    const detail = document.createElement("span");
    detail.className = "text-text-primary";
    detail.textContent = detailText;
    line.appendChild(detail);

    if (receiptText) {
      const receipt = document.createElement("span");
      receipt.className = "text-status-nominal text-[11px]";
      receipt.textContent = receiptText;
      line.appendChild(receipt);
    }

    outputEl.appendChild(line);
    scrollToBottom(outputEl);
  };

  const appendPlainLines = (outputEl, lines, colorClass = "text-text-primary") => {
    const block = document.createElement("pre");
    block.className = `font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${colorClass}`;
    block.textContent = lines.join("\n");
    outputEl.appendChild(block);
    scrollToBottom(outputEl);
  };

  const clearTerminal = () => {
    clearPendingTimers();
    const outputEl = document.getElementById("terminal-output");
    if (!outputEl) return;
    outputEl.textContent = "";

    const header = document.createElement("div");
    header.className = "text-text-muted";
    header.textContent = "TTY_01 // BUFFER_CLEARED // TARS_PRIME v3.5.0 READY";
    outputEl.appendChild(header);
    scrollToBottom(outputEl);
  };

  const runStatusCommand = (outputEl) => {
    appendPlainLines(
      outputEl,
      [
        "TARS_PRIME // RUNTIME_STATUS [NOMINAL]",
        "SESSION_ID      : ISSUE #42 (feat/governed-runtime)",
        "GATE_MODE       : SINGLE_GATE // ZERO_IDLE_COMPUTE (COOPER_RATIFIED)",
        "WORKTREE_LOCK   : ISOLATED // CASE != DOYLE ENFORCED",
        "REGISTRY_MODE   : AIRGAP_READY // EMPTY_UPSTREAM_REGISTRY",
        "--------------------------------------------------------------------",
        "AGENT     ROLE                     PHASE       WORKTREE_STATE",
        "TARS      Prime Hub Orchestrator   G->S        LOCKED // HUB_CONTROL",
        "KIPP      Research & Docs Spoke    G.2 / D.2   READY  // SHA256_OK",
        "BRAND     Spec & Architecture      U.1 / A.1   READY  // BUNDLE_SIGNED",
        "ROMILLY   Execution Planner        A.3         READY  // PLAN_VERIFIED",
        "CASE      Implementation Spoke     R.1         ISOLATED // NO_SELF_GRADE",
        "DOYLE     Adversarial Verifier     R.2/D.1/S   ARMED  // CASE != DOYLE"
      ],
      "text-text-primary"
    );
  };

  const runIssueSimulation = (outputEl, issueArg = "42") => {
    clearPendingTimers();

    const steps = [
      {
        chip: "phase-chip-g",
        code: "[G.1]",
        actor: "TARS -> COOPER:",
        detail: `Captured issue #${issueArg} operator constraints and scope invariants.`,
        receipt: "[interview.md]"
      },
      {
        chip: "phase-chip-g",
        code: "[G.2]",
        actor: "KIPP -> PRIME:",
        detail: "Harvested primary codebase facts and empirical reproduction receipt.",
        receipt: "[evidence-generation-6.json // sha256:007dd10e]"
      },
      {
        chip: "phase-chip-u",
        code: "[U.1]",
        actor: "BRAND -> PRIME:",
        detail: "Locked declared file scope and ratified evidence disposition: proceed.",
        receipt: "[spec.md + evidence-disposition.json]"
      },
      {
        chip: "phase-chip-a",
        code: "[A.1]",
        actor: "BRAND -> PRIME:",
        detail: "Synthesized deep-module architecture and interface contracts.",
        receipt: "[design.md]"
      },
      {
        chip: "phase-chip-a",
        code: "[A.2]",
        actor: "COOPER -> GATE:",
        detail: "SINGLE HUMAN GATE RATIFIED (spec.md + design.md + structure.md). Zero idle compute unlocked.",
        receipt: "[GATE_OPEN // YOLO_WAVE]"
      },
      {
        chip: "phase-chip-a",
        code: "[A.3]",
        actor: "ROMILLY -> PRIME:",
        detail: "Sequenced deterministic implementation plan and verification matrix.",
        receipt: "[plan.md]"
      },
      {
        chip: "phase-chip-r",
        code: "[R.1]",
        actor: "CASE -> WORKTREE:",
        detail: "Implemented scoped changes inside isolated git worktree (0 npm deps).",
        receipt: "[implementation-notes.md]"
      },
      {
        chip: "phase-chip-r",
        code: "[R.2]",
        actor: "DOYLE -> VERIFY:",
        detail: "Adversarial verification passed (CASE != DOYLE). CRAP gate and zola check clean.",
        receipt: "[CASE != DOYLE // PASS]"
      },
      {
        chip: "phase-chip-d",
        code: "[D.1]",
        actor: "DOYLE -> TEST:",
        detail: "Executed end-to-end build, Pagefind index, and DOM scenario verification.",
        receipt: "[test-report.md // 0_ERRORS]"
      },
      {
        chip: "phase-chip-d",
        code: "[D.2]",
        actor: "KIPP -> DOCS:",
        detail: "Verified domain glossary and architectural documentation parity.",
        receipt: "[documentation.md]"
      },
      {
        chip: "phase-chip-s",
        code: "[S.1]",
        actor: "DOYLE -> PR:",
        detail: "Assembled pull request with cryptographic SHA-256 artifact lineage.",
        receipt: "[pr-manifest.md]"
      },
      {
        chip: "phase-chip-s",
        code: "[S.2]",
        actor: "DOYLE + KIPP:",
        detail: `Issue #${issueArg} certified against spec and standards.`,
        receipt: "[OUTCOME // GOVERNED_MERGE_READY]"
      }
    ];

    if (isReducedMotion()) {
      steps.forEach((step) => {
        appendPhaseLine(outputEl, step.chip, step.code, step.actor, step.detail, step.receipt);
      });
      return;
    }

    steps.forEach((step, idx) => {
      const timerId = setTimeout(() => {
        appendPhaseLine(outputEl, step.chip, step.code, step.actor, step.detail, step.receipt);
      }, idx * 45);
      activeRunTimerIds.push(timerId);
    });
  };

  const runAuditCommand = (outputEl) => {
    appendPlainLines(
      outputEl,
      [
        "TARS_AUDIT // WORKSPACE_SECURITY_AND_SOVEREIGNTY_REPORT",
        "--------------------------------------------------------------------",
        "[PASS] ADVERSARIAL_GATE   : CASE != DOYLE worktree separation verified",
        "[PASS] NPM_RUNTIME_DEPS   : 0 package.json / 0 node_modules detected",
        "[PASS] UPSTREAM_REGISTRY  : 0 external registry calls (air-gap nominal)",
        "[PASS] CASITA_STORE       : BLAKE3 content-addressed graph verified",
        "[PASS] CRAP_METRIC_GATE   : Cyclomatic complexity & coverage within budget",
        "[PASS] STATIC_INTEGRITY   : zola check: PASS (0 broken links, <50ms)",
        "--------------------------------------------------------------------",
        "AUDIT_VERDICT // SOVEREIGN_COMPLIANCE_CERTIFIED (0 CVEs, 0 WARNINGS)"
      ],
      "text-status-nominal"
    );
  };

  const runHelpCommand = (outputEl) => {
    appendPlainLines(
      outputEl,
      [
        "TARS_PRIME_SHELL // SUPPORTED INTERACTIVE COMMANDS:",
        "  tarsctl status            Display Prime-and-Spokes health and worktree locks",
        "  tars-run-issue --yolo 42  Simulate full GUARDS (G->U->A->R->D->S) issue wave",
        "  tars-audit-workspace      Run zero-registry air-gap, Casita BLAKE3, and CRAP audit",
        "  clear                     Clear terminal output buffer",
        "  help                      Show this command reference table"
      ],
      "text-accent-cyan"
    );
  };

  const executeCommand = (rawInput) => {
    const outputEl = document.getElementById("terminal-output");
    if (!outputEl) return;

    const trimmed = String(rawInput == null ? "" : rawInput).trim();
    if (!trimmed) return;

    COMMAND_HISTORY.push(trimmed);
    historyIndex = COMMAND_HISTORY.length;

    const normalized = trimmed.toLowerCase().replace(/\s+/g, " ");

    if (normalized === "clear") {
      clearTerminal();
      return;
    }

    appendCommandEcho(outputEl, trimmed);

    if (normalized === "tarsctl status" || normalized === "status") {
      runStatusCommand(outputEl);
    } else if (
      normalized === "tars-run-issue --yolo 42" ||
      normalized.startsWith("tars-run-issue")
    ) {
      const match = normalized.match(/(\d+)/);
      const issueNum = match ? match[1] : "42";
      runIssueSimulation(outputEl, issueNum);
    } else if (
      normalized === "tars-audit-workspace" ||
      normalized === "audit"
    ) {
      runAuditCommand(outputEl);
    } else if (normalized === "help" || normalized === "--help" || normalized === "?") {
      runHelpCommand(outputEl);
    } else {
      appendPlainLines(
        outputEl,
        [
          `ERR_UNKNOWN_COMMAND: '${trimmed}' is not a registered TARS_PRIME directive.`,
          "Type 'help' to list available commands (tarsctl status, tars-run-issue --yolo 42, tars-audit-workspace, clear)."
        ],
        "text-accent-amber"
      );
    }
  };

  const initTerminal = () => {
    const asciiEl = document.getElementById("tars-ascii-banner");
    const subtitleEl = document.getElementById("tars-matrix-subtitle");
    const formEl = document.getElementById("terminal-form");
    const inputEl = document.getElementById("terminal-input");

    if (asciiEl) {
      renderAsciiTypewriter(asciiEl);
    }
    if (subtitleEl) {
      scrambleText(subtitleEl);
    }

    if (formEl && inputEl) {
      formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = inputEl.value;
        inputEl.value = "";
        executeCommand(value);
      });

      inputEl.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
          if (COMMAND_HISTORY.length === 0) return;
          event.preventDefault();
          historyIndex = Math.max(0, historyIndex - 1);
          inputEl.value = COMMAND_HISTORY[historyIndex] || "";
        } else if (event.key === "ArrowDown") {
          if (COMMAND_HISTORY.length === 0) return;
          event.preventDefault();
          historyIndex = Math.min(COMMAND_HISTORY.length, historyIndex + 1);
          inputEl.value =
            historyIndex < COMMAND_HISTORY.length ? COMMAND_HISTORY[historyIndex] : "";
        }
      });
    }

    const presetButtons = document.querySelectorAll("[data-terminal-cmd]");
    presetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-terminal-cmd");
        if (!cmd) return;
        if (inputEl) {
          inputEl.value = "";
        }
        executeCommand(cmd);
      });
    });
  };

  if (typeof window !== "undefined") {
    window.TARSTerminal = {
      TARS_LETTERS,
      renderAsciiTypewriter,
      scrambleText,
      executeCommand,
      clearTerminal
    };
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTerminal);
    } else {
      initTerminal();
    }
  }
})();
