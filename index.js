const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

/* MODAL */
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

/* FORM */
const form = document.getElementById("appointmentForm");
const patient = document.getElementById("patient");
const doctor = document.getElementById("doctor");
const hospital = document.getElementById("hospital");
const specialty = document.getElementById("specialty");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

/* NAVIGATION */
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

/* MONTH DROPDOWN */
const monthBtn = document.getElementById("monthBtn");
const monthList = document.getElementById("monthList");

let currentDate = new Date();
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let editIndex = null;

/* ================= MODAL ================= */
openModal.onclick = () => {
  modal.style.display = "flex";
};

closeModal.onclick = cancelModal.onclick = () => {
  modal.style.display = "none";
  form.reset();
  editIndex = null;
};
// closeModal.onclick = () => {
//   modal.style.display = "none";
//   form.reset();
//   editIndex = null;
// };

/* ================= CALENDAR ================= */
function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent =
    currentDate.toLocaleString("default", { month: "long" }) + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = 35; // ✅ 5 rows × 7 columns

  for (let i = 0; i < totalCells; i++) {
    const box = document.createElement("div");
    box.className = "day";

    let displayDate;
    let displayMonth = month;
    let displayYear = year;

    /* PREVIOUS MONTH */
    if (i < firstDay) {
      displayDate = daysInPrevMonth - firstDay + i + 1;
      displayMonth = month - 1;

      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }

      box.classList.add("other-month");
    }

    /* CURRENT MONTH */
    else if (i < firstDay + daysInMonth) {
      displayDate = i - firstDay + 1;
    }

    /* NEXT MONTH */
    else {
      displayDate = i - (firstDay + daysInMonth) + 1;
      displayMonth = month + 1;

      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }

      box.classList.add("other-month");
    }

    box.innerHTML = `<strong>${displayDate}</strong>`;

    /* APPOINTMENTS */
    appointments.forEach((a, index) => {
      const ad = new Date(a.date);

      if (
        ad.getDate() === displayDate &&
        ad.getMonth() === displayMonth &&
        ad.getFullYear() === displayYear
      ) {
        const card = document.createElement("div");
        card.className = "appointment-card";

        card.innerHTML = `
          <div class="appt-title">${a.patient}</div>
          <div class="appt-time">Arrived  ${a.time}</div>
          <div class="appt-actions">
            <span onclick="editAppointment(${index})"><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33333 11.8751H4.276L10.4853 6.0538L9.54267 5.17005L3.33333 10.9913V11.8751ZM14 13.1251H2V10.4732L10.9567 2.0763C11.0817 1.95913 11.2512 1.89331 11.428 1.89331C11.6048 1.89331 11.7743 1.95913 11.8993 2.0763L13.7853 3.84443C13.9103 3.96163 13.9805 4.12057 13.9805 4.2863C13.9805 4.45203 13.9103 4.61097 13.7853 4.72818L6.162 11.8751H14V13.1251ZM10.4853 4.2863L11.428 5.17005L12.3707 4.2863L11.428 3.40255L10.4853 4.2863Z" fill="#2E2E2E" fill-opacity="0.9"/>
</svg>
</span>
            <span onclick="deleteAppointment(${index})"><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.66669 13.125C4.30002 13.125 3.98624 13.0027 3.72535 12.7581C3.46402 12.5131 3.33335 12.2188 3.33335 11.875V3.75C3.14446 3.75 2.98602 3.69021 2.85802 3.57062C2.73046 3.45062 2.66669 3.30208 2.66669 3.125C2.66669 2.94792 2.73046 2.79938 2.85802 2.67938C2.98602 2.55979 3.14446 2.5 3.33335 2.5H6.00002C6.00002 2.32292 6.06402 2.17437 6.19202 2.05437C6.31958 1.93479 6.4778 1.875 6.66669 1.875H9.33335C9.52224 1.875 9.68069 1.93479 9.80869 2.05437C9.93624 2.17437 10 2.32292 10 2.5H12.6667C12.8556 2.5 13.0138 2.55979 13.1414 2.67938C13.2694 2.79938 13.3334 2.94792 13.3334 3.125C13.3334 3.30208 13.2694 3.45062 13.1414 3.57062C13.0138 3.69021 12.8556 3.75 12.6667 3.75V11.875C12.6667 12.2188 12.5362 12.5131 12.2754 12.7581C12.014 13.0027 11.7 13.125 11.3334 13.125H4.66669ZM4.66669 3.75V11.875H11.3334V3.75H4.66669ZM6.00002 10C6.00002 10.1771 6.06402 10.3254 6.19202 10.445C6.31958 10.565 6.4778 10.625 6.66669 10.625C6.85558 10.625 7.01402 10.565 7.14202 10.445C7.26958 10.3254 7.33335 10.1771 7.33335 10V5.625C7.33335 5.44792 7.26958 5.29937 7.14202 5.17937C7.01402 5.05979 6.85558 5 6.66669 5C6.4778 5 6.31958 5.05979 6.19202 5.17937C6.06402 5.29937 6.00002 5.44792 6.00002 5.625V10ZM8.66669 10C8.66669 10.1771 8.73069 10.3254 8.85869 10.445C8.98624 10.565 9.14447 10.625 9.33335 10.625C9.52224 10.625 9.68069 10.565 9.80869 10.445C9.93624 10.3254 10 10.1771 10 10V5.625C10 5.44792 9.93624 5.29937 9.80869 5.17937C9.68069 5.05979 9.52224 5 9.33335 5C9.14447 5 8.98624 5.05979 8.85869 5.17937C8.73069 5.29937 8.66669 5.44792 8.66669 5.625V10Z" fill="#2E2E2E" fill-opacity="0.9"/>
</svg>
</span>
          </div>
        `;

        box.appendChild(card);
      }
    });

    calendar.appendChild(box);
  }
}

/* ================= FORM SUBMIT ================= */
form.onsubmit = e => {
  e.preventDefault();

  const data = {
    patient: patient.value,
    doctor: doctor.value,
    hospital: hospital.value,
    specialty: specialty.value,
    date: dateInput.value,
    time: timeInput.value
  };

  if (editIndex !== null) {
    appointments[editIndex] = data;
  } else {
    appointments.push(data);
  }

  localStorage.setItem("appointments", JSON.stringify(appointments));
  modal.style.display = "none";
  form.reset();
  editIndex = null;
  renderCalendar();
};

/* ================= EDIT ================= */
function editAppointment(index) {
  const a = appointments[index];

  patient.value = a.patient;
  doctor.value = a.doctor;
  hospital.value = a.hospital;
  specialty.value = a.specialty;
  dateInput.value = a.date;
  timeInput.value = a.time;

  editIndex = index;
  modal.style.display = "flex";
}

/* ================= DELETE ================= */
function deleteAppointment(index) {
  if (confirm("Delete this appointment?")) {
    appointments.splice(index, 1);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    renderCalendar();
  }
}

/* ================= NAVIGATION ================= */
prevMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

todayBtn.onclick = () => {
  currentDate = new Date();
  renderCalendar();
};

/* ================= MONTH DROPDOWN ================= */
monthBtn.onclick = () => {
  monthList.style.display =
    monthList.style.display === "block" ? "none" : "block";
};

monthList.querySelectorAll("div").forEach(item => {
  item.onclick = () => {
    currentDate.setMonth(item.dataset.month);
    monthBtn.textContent = item.textContent + " ▼";
    monthList.style.display = "none";
    renderCalendar();
  };
});

document.addEventListener("click", e => {
  if (!monthBtn.contains(e.target) && !monthList.contains(e.target)) {
    monthList.style.display = "none";
  }
});

/* ================= INIT ================= */
renderCalendar();





document.querySelectorAll(".custom-select").forEach(select => {
  const targetId = select.dataset.target;
  const hiddenInput = document.getElementById(targetId);

  select.querySelectorAll("li").forEach(li => {
    li.onclick = () => {
      select.querySelector(".selected-text").textContent = li.textContent;
      hiddenInput.value = li.textContent; // 🔥 ORIGINAL ID VALUE SET
      select.querySelector(".options").style.display = "none";
    };
  });

  select.querySelector(".select-box").onclick = () => {
    const opt = select.querySelector(".options");
    opt.style.display = opt.style.display === "block" ? "none" : "block";
  };
});
