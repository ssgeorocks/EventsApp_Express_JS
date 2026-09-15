const divMessage=document.getElementById("message")
const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnLogin=document.getElementById("btnLogin")

btnLogin.addEventListener("click", async(e)=>{
    e.preventDefault()

    let email=inputEmail.value
    let password=inputPassword.value

    if (!email || !password){
        divMessage.textContent=`Please enter email and password`
        setTimeout(() => {
            divMessage.textContent=""
        }, 3000);
        return
    }

    let response = await fetch('/api/sessions/login', {

        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({email, password})
    })

    if (response.status >= 400) {
        divMessage.textContent = "Login failed"
        return
    }

    let data = await response.json()
    divMessage.textContent = `Login successful for ${data.user.firstName} ${data.user.lastName}`

    window.location.href = `/profile/${data.user._id}`

})