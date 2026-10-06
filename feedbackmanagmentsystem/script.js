let users =
  JSON.parse(localStorage.getItem("users")) || [];

let feedbacks =
  JSON.parse(localStorage.getItem("feedbacks")) || [];

let currentUser = null;

let selectedRole = "customer";


// SELECT ROLE

function setRole(role) {

  selectedRole = role;

  document.getElementById("customerRole").style.background =
    (role === "customer") ? "green" : "#263c91";

  document.getElementById("adminRole").style.background =
    (role === "admin") ? "green" : "#263c91";
}


// SHOW SIGNUP

function showSignup() {

  document
    .getElementById("loginPage")
    .classList.add("hide");

  document
    .getElementById("signupPage")
    .classList.remove("hide");
}


// SHOW LOGIN

function showLogin() {

  document
    .getElementById("signupPage")
    .classList.add("hide");

  document
    .getElementById("loginPage")
    .classList.remove("hide");
}


// SIGNUP

function signup() {

  let name =
    document.getElementById("signupName").value.trim();

  let email =
    document.getElementById("signupEmail").value.trim();

  let password =
    document.getElementById("signupPassword").value;


  if (!name || !email || !password) {

    alert("Please fill all fields");

    return;
  }


  if (users.some(u => u.email === email)) {

    alert("Email already registered");

    return;
  }


  users.push({
    name: name,
    email: email,
    password: password,
    role: "customer"
  });


  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );


  alert("Signup successful!");

  showLogin();
}


// LOGIN

function login() {

  let email =
    document.getElementById("loginEmail").value.trim();

  let password =
    document.getElementById("loginPassword").value;

  let loginMsg =
    document.getElementById("loginMsg");


  // ADMIN LOGIN

  if (selectedRole === "admin") {

    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {

      currentUser = {
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin"
      };


      document
        .getElementById("loginPage")
        .classList.add("hide");

      document
        .getElementById("adminPage")
        .classList.remove("hide");


      showAllFeedback();

      updateStats();

    } else {

      loginMsg.innerText =
        "Invalid Admin Login";
    }

    return;
  }


  // CUSTOMER LOGIN

  let user = users.find(
    u =>
      u.email === email &&
      u.password === password &&
      u.role === "customer"
  );


  if (!user) {

    loginMsg.innerText =
      "Invalid Customer Login";

    return;
  }


  currentUser = user;


  document
    .getElementById("loginPage")
    .classList.add("hide");

  document
    .getElementById("customerPage")
    .classList.remove("hide");


  document.getElementById("userName").innerText =
    user.name;


  showMyFeedback();
}


// ADD FEEDBACK

function addFeedback() {

  let subject =
    document.getElementById("subject").value.trim();

  let category =
    document.getElementById("category").value;

  let rating =
    document.getElementById("rating").value;

  let message =
    document.getElementById("message").value.trim();


  if (!subject || !category || !message) {

    alert("Please complete the form");

    return;
  }


  let data = {

    id: Date.now(),

    name: currentUser.name,

    email: currentUser.email,

    subject: subject,

    category: category,

    rating: Number(rating),

    message: message,

    date: new Date().toLocaleString()
  };


  feedbacks.push(data);


  localStorage.setItem(
    "feedbacks",
    JSON.stringify(feedbacks)
  );


  alert("Feedback submitted successfully!");


  document.getElementById("subject").value = "";

  document.getElementById("category").value = "";

  document.getElementById("message").value = "";


  showMyFeedback();
}


// SHOW MY FEEDBACK

function showMyFeedback() {

  let search =
    document.getElementById("mySearch").value.toLowerCase();

  let output = "";


  feedbacks

    .filter(
      f => f.email === currentUser.email
    )

    .filter(
      f =>
        f.subject.toLowerCase().includes(search) ||
        f.message.toLowerCase().includes(search)
    )

    .forEach(f => {

      output += `

        <div class="feedback">

          <h3>${f.subject}</h3>

          <span class="badge">
            ${f.category}
          </span>

          <p class="stars">
            ${"★".repeat(f.rating)}
            ${"☆".repeat(5 - f.rating)}
          </p>

          <p>${f.message}</p>

          <small>${f.date}</small>

          <br><br>

          <button
            class="danger"
            onclick="deleteFeedback(${f.id})"
          >
            Delete
          </button>

        </div>

      `;
    });


  document.getElementById("myFeedback").innerHTML =
    output || "<p>No feedback found.</p>";
}


// SHOW ALL FEEDBACK

function showAllFeedback() {

  let search =
    document.getElementById("search").value.toLowerCase();

  let filter =
    document.getElementById("filter").value;


  let data = feedbacks.filter(
    f =>

      (
        f.subject.toLowerCase().includes(search) ||
        f.message.toLowerCase().includes(search) ||
        f.name.toLowerCase().includes(search)
      )

      &&

      (
        filter === "All" ||
        f.category === filter
      )
  );


  let output = "";


  data.slice().reverse().forEach(f => {

    output += `

      <div class="feedback">

        <h3>${f.subject}</h3>

        <p>
          <b>Customer:</b> ${f.name}
        </p>

        <p>
          <b>Email:</b> ${f.email}
        </p>

        <span class="badge">
          ${f.category}
        </span>

        <p class="stars">
          ${"★".repeat(f.rating)}
          ${"☆".repeat(5 - f.rating)}
        </p>

        <p>${f.message}</p>

        <small>${f.date}</small>

        <br><br>

        <button
          class="danger"
          onclick="deleteFeedback(${f.id})"
        >
          Delete
        </button>

      </div>

    `;
  });


  document.getElementById("allFeedback").innerHTML =
    output || "<p>No feedback available.</p>";
}


// UPDATE STATISTICS

function updateStats() {

  let total = feedbacks.length;


  let average =
    total
      ? (
          feedbacks.reduce(
            (a, b) => a + b.rating,
            0
          ) / total
        ).toFixed(1)
      : 0;


  let positive =
    feedbacks.filter(
      f => f.rating >= 4
    ).length;


  let suggestions =
    feedbacks.filter(
      f => f.category === "Suggestion"
    ).length;


  document.getElementById("total").innerText =
    total;

  document.getElementById("average").innerText =
    average;

  document.getElementById("positive").innerText =
    positive;

  document.getElementById("suggestions").innerText =
    suggestions;
}


// DELETE FEEDBACK

function deleteFeedback(id) {

  if (!confirm("Delete this feedback?"))
    return;


  feedbacks =
    feedbacks.filter(
      f => f.id !== id
    );


  localStorage.setItem(
    "feedbacks",
    JSON.stringify(feedbacks)
  );


  if (currentUser.role === "admin") {

    showAllFeedback();

    updateStats();

  } else {

    showMyFeedback();
  }
}


// CLEAR ALL

function clearAll() {

  if (!confirm("Delete all feedback?"))
    return;


  feedbacks = [];


  localStorage.setItem(
    "feedbacks",
    JSON.stringify(feedbacks)
  );


  showAllFeedback();

  updateStats();
}


// LOGOUT

function logout() {

  currentUser = null;


  document
    .getElementById("customerPage")
    .classList.add("hide");

  document
    .getElementById("adminPage")
    .classList.add("hide");

  document
    .getElementById("loginPage")
    .classList.remove("hide");


  document.getElementById("loginEmail").value = "";

  document.getElementById("loginPassword").value = "";

  document.getElementById("loginMsg").innerText = "";
}