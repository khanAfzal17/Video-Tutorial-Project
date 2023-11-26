function LoadPage(PageName) {
    $.ajax({
        method: "get",
        url: PageName,
        success: (response) => {
            $("section").html(response);
        }
    })
}
$(function () {
    $("#passwordContainer").hide();
z
    $("#signin").click(() => {
        LoadPage("user-login.html");
    })
    var email = "";
    $("#btnGetStarted").click(() => {
        email = $("#Email").val();
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getusers",
            success: (users) => {
                var user = users.find(item => item.Email === email);
                if (user) {
                    if (user.Email === email) {
                        $("#passwordContainer").show();
                        $("#emailContainer").hide();
                        $("#error").hide();
                    }

                } else {
                    $("#error").html(`<div class="mt-3">User Doesn't Exists <button class="btn btn-light fw-bold" id="lnkRegister">Register</button></div>`);
                }
            }
        })
    })
    $("#btnSignin").click(() => {
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getusers",
            success: (users) => {
                var user = users.find(item => item.Email === email);
                if (user) {
                    if (user.Password === $("#Password").val()) {
                        alert("Login Success");
                        $("#passwordContainer").hide();
                        $("#signin").html(`${user.UserName}-<button class="btn btn-warning">Signout</button>`);
                        LoadVideos();
                    } else {
                        alert("Invalid Password");
                    }
                }
            }
        })
    })
    $(document).on("click", "#lnkRegister", () => {
        LoadPage("user-register.html");
        $("#error").hide();
    })
    $(document).on("click", "#btnRegister", () => {
        var user = {
            "UserId": $("#UserId").val(),
            "UserName": $("#UserName").val(),
            "Password": $("#RPassword").val(), "Email": $("#REmail").val(),
            "Mobile": $("#Mobile").val()
        }
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:6600/adduser", data: user
        })
        alert("Register Successfully....");
        LoadPage('user-login.html');
    })

    function LoadVideos() {
        $("section").html("");
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getvideos",
            success: (videos) => {
                videos.map(video => {
                    $(`
                    <div class="box">
                        <iframe height="200" class="card-img-top" src=${video.Url}</iframe>
                        <div>
                            ${video.Title}   
                        </div>
                    </div>
                    `).appendTo("section");
                })
            }
        })
    }

    $(document).on("click", "#btnLogin", () => {
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getusers",
            success: (users) => {
                var user = users.find(item => item.UserId == $("#LoginUserId").val());
                if (user.UserId === $("#LoginUserId").val() && user.Password == $("#LoginPassword").val()) {
                    //Create a Cookie
                    LoadVideos();
                    $("#signin").html(`${user.UserName} <button class="btn btn-warning">Signout</button>`);
                } else {
                    alert("Invalid UserName or Password");
                }
            }
        })
    })

    $(document).on("click", "#btnSignout", () => {
        location.reload();
        //Delete Cookie and Navigate to login Page
    })
})