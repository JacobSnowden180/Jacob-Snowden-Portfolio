(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var desktopNav = window.matchMedia("(min-width: 900px)");

  function setToggleLabel(open) {
    var label = toggle.querySelector(".nav-toggle-text");
    if (label) label.textContent = open ? "Close" : "Menu";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeNav(restoreFocus) {
    if (!nav || !toggle) return;
    var wasOpen = toggle.getAttribute("aria-expanded") === "true";
    nav.classList.remove("is-open");
    setToggleLabel(false);
    if (restoreFocus && wasOpen) toggle.focus();
  }

  function openNav() {
    nav.classList.add("is-open");
    setToggleLabel(true);
    var first = nav.querySelector("a");
    if (first) first.focus();
  }

  if (toggle && nav && header) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeNav(false);
      else openNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav(true);
      }
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeNav(false);
    });

    function onBreakpoint(event) {
      if (event.matches) closeNav(false);
    }
    if (desktopNav.addEventListener) desktopNav.addEventListener("change", onBreakpoint);
    else if (desktopNav.addListener) desktopNav.addListener(onBreakpoint);
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var linkById = {};
    navLinks.forEach(function (link) {
      linkById[link.getAttribute("href").slice(1)] = link;
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.removeAttribute("aria-current");
          });
          var current = linkById[entry.target.id];
          if (current) current.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  var form = document.getElementById("resume-form");
  if (!form) return;

  var endpoint = (form.getAttribute("data-endpoint") || "").trim();
  var alertBox = form.querySelector(".form-alert");
  var statusBox = form.querySelector(".form-status");
  var successBox = form.querySelector(".form-success");
  var successLead = form.querySelector(".success-lead");
  var grid = form.querySelector(".form-grid");
  var actions = form.querySelector(".form-actions");
  var note = form.querySelector(".form-note");
  var submitBtn = form.querySelector('[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.textContent : "Send request";

  var rules = {
    name: function (value) {
      if (!value) return "Enter your name.";
      if (value.length < 2) return "Enter your full name.";
      return "";
    },
    company: function (value) {
      if (!value) return "Enter your company.";
      if (value.length < 2) return "Enter your company name.";
      return "";
    },
    email: function (value) {
      if (!value) return "Enter your work email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email address.";
      return "";
    },
    phone: function (value) {
      if (!value) return "";
      var digits = value.replace(/\D/g, "");
      if (!/^[0-9+().\-\s]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        return "Enter a valid phone number, or leave this blank.";
      }
      return "";
    },
    role: function (value) {
      if (!value) return "Enter the role you are hiring for.";
      if (value.length < 2) return "Enter the role you are hiring for.";
      return "";
    },
    message: function (value) {
      if (!value) return "Add a short message.";
      if (value.length < 8) return "Add a short message so I know how to follow up.";
      if (value.length > 2000) return "Please keep the message under 2,000 characters.";
      return "";
    }
  };

  var fieldOrder = ["name", "company", "email", "phone", "role", "message"];

  function inputFor(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function setFieldError(name, message) {
    var input = inputFor(name);
    var error = document.getElementById(name + "-error");
    var field = input.closest(".field");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", name + "-error");
      error.hidden = false;
      error.textContent = message;
      field.classList.add("is-invalid");
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      error.hidden = true;
      error.textContent = "";
      field.classList.remove("is-invalid");
    }
  }

  function validateField(name) {
    var message = rules[name](inputFor(name).value.trim());
    setFieldError(name, message);
    return !message;
  }

  function clearBanners() {
    alertBox.textContent = "";
    statusBox.textContent = "";
  }

  function showError(message) {
    statusBox.textContent = "";
    alertBox.textContent = message;
  }

  fieldOrder.forEach(function (name) {
    var input = inputFor(name);
    input.addEventListener("blur", function () {
      if (input.getAttribute("data-touched") === "true" || form.getAttribute("data-submitted") === "true") {
        validateField(name);
      }
    });
    input.addEventListener("input", function () {
      input.setAttribute("data-touched", "true");
      if (form.getAttribute("data-submitted") === "true" || input.getAttribute("aria-invalid") === "true") {
        validateField(name);
        if (form.getAttribute("data-submitted") === "true") {
          var stillInvalid = fieldOrder.some(function (fieldName) {
            return rules[fieldName](inputFor(fieldName).value.trim());
          });
          if (!stillInvalid) clearBanners();
        }
      }
    });
  });

  function scrollToElement(el) {
    if (!el || typeof el.scrollIntoView !== "function") return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }

  function greetingName(fullName) {
    var first = (fullName || "").trim().split(/\s+/)[0] || "";
    if (!/^[A-Za-z][A-Za-z'’-]{0,39}$/.test(first)) return "";
    return first;
  }

  function revealSuccess(fullName) {
    form.removeAttribute("aria-busy");
    clearBanners();
    if (grid) grid.hidden = true;
    if (actions) actions.hidden = true;
    if (note) note.hidden = true;
    var name = greetingName(fullName);
    if (successLead) {
      successLead.textContent = name
        ? "Thank you, " + name + ". Your request was sent. Jacob will reply personally with his resume."
        : "Your request was sent. Jacob will reply personally with his resume.";
    }
    successBox.hidden = false;
    var heading = successBox.querySelector("h3");
    window.requestAnimationFrame(function () {
      scrollToElement(successBox);
      if (heading) {
        try {
          heading.focus({ preventScroll: true });
        } catch (err) {
          heading.focus();
        }
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.setAttribute("data-submitted", "true");

    var firstInvalid = null;
    fieldOrder.forEach(function (name) {
      var ok = validateField(name);
      if (!ok && !firstInvalid) firstInvalid = inputFor(name);
    });

    if (firstInvalid) {
      showError("Please fix the highlighted fields.");
      scrollToElement(firstInvalid);
      try {
        firstInvalid.focus({ preventScroll: true });
      } catch (err) {
        firstInvalid.focus();
      }
      return;
    }

    var honey = (form.querySelector('[name="_honey"]').value || "").trim();
    if (honey) {
      revealSuccess(inputFor("name").value);
      return;
    }

    if (!endpoint || endpoint.indexOf("https://") !== 0) {
      showError("The form is not configured. Email jacobsnowden180@gmail.com instead.");
      return;
    }

    var name = inputFor("name").value.trim();
    var company = inputFor("company").value.trim();
    var email = inputFor("email").value.trim();
    var phone = inputFor("phone").value.trim();
    var role = inputFor("role").value.trim();
    var message = inputFor("message").value.trim();

    var payload = {
      name: name,
      company: company,
      email: email,
      phone: phone || "Not provided",
      role: role,
      message: message,
      _honey: "",
      _subject: "Resume request from " + name + " (" + company + ")",
      _template: "table",
      _captcha: "false",
      _replyto: email
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    alertBox.textContent = "";
    statusBox.textContent = "Sending your request…";

    var fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    };
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
      fetchOptions.signal = AbortSignal.timeout(20000);
    }

    fetch(endpoint, fetchOptions)
      .then(function (response) {
        return response.text().then(function (text) {
          var data = null;
          try {
            data = JSON.parse(text);
          } catch (err) {
            data = null;
          }
          var accepted = response.ok && data && (data.success === true || data.success === "true");
          if (!accepted) {
            throw new Error("The form service did not accept the request.");
          }
          revealSuccess(name);
        });
      })
      .catch(function () {
        form.removeAttribute("aria-busy");
        statusBox.textContent = "";
        showError("The request could not be sent. Please try again, or email jacobsnowden180@gmail.com.");
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      });
  });
})();
