
const tableBody = document.getElementById("appointmentBody");
const searchPatient = document.getElementById("searchPatient");
const searchDoctor = document.getElementById("searchDoctor");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const cancelModal = document.getElementById("cancelModal");
const form = document.getElementById("appointmentForm");
const updateBtn = document.querySelector(".btn-update");
const closeModal = document.getElementById("closeModal");
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let editIndex = null;


openModal.addEventListener("click", () => {
  modal.style.display = "flex";
  form.reset();
  editIndex = null;
});

cancelModal.addEventListener("click", () => {
  modal.style.display = "none";
  form.reset();
});

closeModal.onclick = closeModal.onclick = () => {
  modal.style.display = "none";
  form.reset();
  editIndex = null;
};
modal.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });


form.addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    patient: document.getElementById("patient").value,
    doctor: document.getElementById("doctor").value,
    hospital: document.getElementById("hospital").value,
    specialty: document.getElementById("specialty").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    reason: document.getElementById("reason").value
  };

  if(editIndex === null){
    appointments.push(data); // Add
  } else {
    appointments[editIndex] = data; // Edit
    editIndex = null;
  }

  localStorage.setItem("appointments", JSON.stringify(appointments));
  modal.style.display = "none";
  form.reset();
  displayAppointments(appointments);
});

// Display appointments
function displayAppointments(list){
  tableBody.innerHTML = "";
  if(list.length === 0) { 
    tableBody.innerHTML = `<tr><td colspan="7">No records found</td></tr>`; 
    return; 
  }

  list.forEach(a => {
    const index = appointments.indexOf(a);
    tableBody.innerHTML += `
      <tr>
        <td  style="color:#2C7BE5;">${a.patient}</td>
        <td style="color:#2C7BE5;">${a.doctor}</td>
        <td>${a.hospital}</td>
        <td>${a.specialty}</td>
        <td>${a.date}</td>
        <td style="color:#2C7BE5;">${a.time}</td>
        <td>
          <button class="btn-edit" data-index="${index}"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 16.25H18.75V17.5H1.25V16.25ZM15.875 5.625C16.375 5.125 16.375 4.375 15.875 3.875L13.625 1.625C13.125 1.125 12.375 1.125 11.875 1.625L2.5 11V15H6.5L15.875 5.625ZM12.75 2.5L15 4.75L13.125 6.625L10.875 4.375L12.75 2.5ZM3.75 13.75V11.5L10 5.25L12.25 7.5L6 13.75H3.75Z" fill="#2C7BE5"/>
</svg>
</button>
          <button class="btn-delete" data-index="${index}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 21C6.45 21 5.979 20.804 5.587 20.412C5.195 20.02 4.99933 19.5493 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.804 20.021 18.412 20.413C18.02 20.805 17.5493 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#E23D28"/>
</svg>
</button>
        </td>
      </tr>
    `;
  });

  attachRowEvents();
}

// Attach edit/delete events
function attachRowEvents(){
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.index));
  });

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteAppointment(btn.dataset.index));
  });
}

// Edit modal
function openEditModal(index){
  editIndex = Number(index);
  const a = appointments[editIndex];
  if(!a) return;

  document.getElementById("patient").value = a.patient;
  document.getElementById("doctor").value = a.doctor;
  document.getElementById("hospital").value = a.hospital;
  document.getElementById("specialty").value = a.specialty;
  document.getElementById("date").value = a.date;
  document.getElementById("time").value = a.time;
  document.getElementById("reason").value = a.reason || "";

  modal.style.display = "flex";
}

// Delete appointment
function deleteAppointment(index){
  if(confirm("Delete this appointment?")){
    appointments.splice(index, 1);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    displayAppointments(appointments);
  }
}

// Filters
updateBtn.addEventListener("click", applyFilters);

function applyFilters(){
  const p = searchPatient.value.toLowerCase();
  const d = searchDoctor.value.toLowerCase();
  const from = fromDate.value;
  const to = toDate.value;

  const filtered = appointments.filter(a => {
    const matchesPatient = !p || a.patient.toLowerCase().includes(p);
    const matchesDoctor = !d || a.doctor.toLowerCase().includes(d);
    const matchesFrom = !from || a.date >= from;
    const matchesTo = !to || a.date <= to;
    return matchesPatient && matchesDoctor && matchesFrom && matchesTo;
  });

  displayAppointments(filtered);
}

// Initial display
displayAppointments(appointments);
