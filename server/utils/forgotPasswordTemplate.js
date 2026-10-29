const forgotPasswordTemplate = ({ name, otp })=>{
    return `
<div>
    <p>Dear, ${name}</p>
    <p>you have requested a password reset. The otp for resetting your password is </p>
    <div style="color:white; background:red; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
        ${otp}
    </div>
    <p>This otp is valid for 1 hour only. Enter this otp in GoKart to reset your password</p>
    <br/>
    </br>
    <p>Thanks</p>
    <p>Binkeyit</p>
</div>
    `
}

export default forgotPasswordTemplate