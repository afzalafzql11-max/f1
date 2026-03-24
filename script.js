const API = "https://b1-7uce.onrender.com";

let userEmail = "";
let isAdmin = false;

/* ---------------- PAGE SWITCH ---------------- */
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(page).style.display="block";

  if(page==="dashboard") loadChildren();
}
showPage("login");

/* ---------------- SIGNUP ---------------- */
function signup(){

  if(!su_name.value || !su_email.value || !su_pass.value){
    alert("⚠️ Fill all fields");
    return;
  }

  fetch(API+"/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:su_name.value,
      email:su_email.value,
      password:su_pass.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    alert("✅ " + d.message);
    showPage("login");
  })
  .catch(()=>alert("❌ Signup error"));
}

/* ---------------- LOGIN ---------------- */
function login(){

  if(!login_email.value || !login_pass.value){
    alert("⚠️ Enter email & password");
    return;
  }

  fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:login_email.value,
      password:login_pass.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.status==="admin"){
      isAdmin = true;
      userEmail = "";
      alert("👑 Admin Login");
      showPage("dashboard");
    }
    else if(d.status==="user"){
      isAdmin = false;
      userEmail = d.email;
      alert("✅ User Login");
      showPage("dashboard");
    }
    else{
      alert("❌ Login Failed");
    }
  })
  .catch(()=>alert("❌ Server error"));
}

/* ---------------- LOAD CHILDREN ---------------- */
function loadChildren(){
  fetch(API+"/get_children")
  .then(r=>r.json())
  .then(data=>{
    childrenContainer.innerHTML="";

    data.forEach(c=>{
      let card=document.createElement("div");
      card.className="childCard";

      let delBtn = isAdmin
        ? `<button onclick="deleteChild(${c.id})">Delete</button>`
        : "";

      card.innerHTML = `
        <h4>${c.name}</h4>
        <p>Age: ${c.age}</p>
        <p>${c.place}</p>
        ${delBtn}
      `;

      childrenContainer.appendChild(card);
    });
  })
  .catch(()=>alert("❌ Failed to load children"));
}

/* ---------------- DELETE ---------------- */
function deleteChild(id){
  if(!confirm("Delete child?")) return;

  fetch(API+"/delete_child/"+id,{method:"DELETE"})
  .then(()=>loadChildren())
  .catch(()=>alert("❌ Delete failed"));
}

/* ---------------- REGISTER CHILD ---------------- */
function registerChild(){

  if(!child_photo.files[0]){
    alert("⚠️ Upload photo");
    return;
  }

  let f=new FormData();
  f.append("name",child_name.value);
  f.append("age",child_age.value);
  f.append("place",child_place.value);
  f.append("photo",child_photo.files[0]);

  fetch(API+"/register_child",{method:"POST",body:f})
  .then(r=>r.json())
  .then(d=>{
    alert("✅ " + d.message);
    showPage("dashboard");
  })
  .catch(()=>alert("❌ Upload failed"));
}

/* ---------------- IMAGE CHECK ---------------- */
function crossCheck(){

  if(!check_photo.files[0]){
    alert("⚠️ Upload image first");
    return;
  }

  let f=new FormData();
  f.append("photo",check_photo.files[0]);
  f.append("user_email", userEmail);

  fetch(API+"/crosscheck",{method:"POST",body:f})
  .then(r=>r.json())
  .then(d=>{

    // 🔔 POPUP RESULT (MAIN FEATURE)
    if(d.status==="found"){

      let msg = `
✅ MATCH FOUND!

Name: ${d.name}
Age: ${d.age}
Place: ${d.place}
Confidence: ${d.confidence ? d.confidence.toFixed(2) : "N/A"}
`;

      alert(msg);

      result_text.innerHTML = "MATCH FOUND";
      family_details.innerHTML =
        `Name: ${d.name}<br>Age: ${d.age}<br>Place: ${d.place}`;

      showPage("result");
    }

    else if(d.status==="no face"){
      alert("⚠️ No face detected");
      result_text.innerHTML="NO FACE DETECTED";
      family_details.innerHTML="";
      showPage("result");
    }

    else if(d.status==="no data"){
      alert("⚠️ No children registered in system");
    }

    else{
      alert("❌ No Match Found");
      result_text.innerHTML="NOT FOUND";
      family_details.innerHTML="";
      showPage("result");
    }
  })
  .catch(()=>alert("❌ Server error"));
}

/* ---------------- VIDEO DETECTION ---------------- */
function detectVideo(){

  if(!video_file.files[0]){
    alert("⚠️ Upload video");
    return;
  }

  let f=new FormData();
  f.append("video",video_file.files[0]);

  fetch(API+"/detect_video",{method:"POST",body:f})
  .then(r=>r.json())
  .then(d=>{
    if(d.status==="found"){
      alert("🎥 MATCH FOUND IN VIDEO");
    } else {
      alert("❌ No match found in video");
    }
  })
  .catch(()=>alert("❌ Video processing failed"));
}
