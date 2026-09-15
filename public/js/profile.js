const profileData = document.getElementById("profileData");
const logoutBtn = document.getElementById("logoutBtn");
const navProfileLink = document.getElementById("navProfileLink");
const userId = window.location.pathname.split("/").pop();

navProfileLink.href = `/profile/${userId}`;

const loadProfile = async () => {
    let res = await fetch(`/api/sessions/profile/${userId}`);

    if (res.status >= 400) {
        window.location.href = "/login.html"
        return
    }

    let data = await res.json()
    let user = data.user;

    profileData.innerHTML = `
        <div class="info-grid__item">
            <span class="info-grid__label">Name</span>
            <span class="info-grid__value">${user.firstName} ${user.lastName}</span>
        </div>
        <div class="info-grid__item">
            <span class="info-grid__label">Email</span>
            <span class="info-grid__value">${user.email}</span>
        </div>
        <div class="info-grid__item">
            <span class="info-grid__label">Role</span>
            <span class="info-grid__value">${user.role}</span>
        </div>
    `
};

loadProfile();

logoutBtn.addEventListener("click", async(e) => {
    e.preventDefault()
    await fetch("/api/sessions/logout")
    window.location.href = "/login.html"
});
