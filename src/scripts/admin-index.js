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
    $("#btnSignIn").click(() => {
        LoadPage("user-login.html");
    })

    function LoadVideos() {
        $("section").html("");
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getvideos",
            success: (videos) => {
                videos.map(video => {
                    $(`
                    <tr>
                       <td>${video.Title}</td>
                       <td><iframe src=${video.Url} width="200" height="100"></iframe></td>
                        <td>
                            <button name="${video.VideoId}" id="btnEdit" class="btn btn-warning bi bi-pen-fill"></button>
                            <button name="${video.VideoId}" id="btnDelete" class="btn btn-danger bi bi-trash-fill"></button>
                        </td>
                    </tr>
                    `).appendTo("tbody");
                })
            }
        })
    }

    $(document).on("click", "#btnLogin", () => {
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getadmin",
            success: (users) => {
                var user = users.find(admin => admin.UserId == $("#LoginUserId").val());
                if (user.UserId == $("#LoginUserId").val() && user.Password == $("#LoginPassword").val()) {
                    LoadPage("admin-dashboard.html");
                    $("#btnSignIn").html(`${user.UserName}-Signout`);
                    LoadVideos();

                } else {
                    alert("Invalid Admin Credentials")
                }
            }
        })
    })

    function LoadCategories() {
        $.ajax({
            method: "get",
            url: "http://127.0.0.1:6600/getcategories",
            success: (categories) => {
                categories.map(category => {
                    $(`<option value=${category.CategoryId}>${category.CategoryName}</option>`).appendTo("#lstCategories");
                })
            }
        })
    }
    $(document).on("click", "#btnAddNew", () => {
        LoadPage(`admin-add-video.html`);
        LoadCategories();
    })
    $(document).on("click", "#btnAddVideo", () => {
        var video = {
            VideoId: $("#VideoId").val(),
            Title: $("#Title").val(),
            Url: $("#Url").val(),
            Likes: $("#Likes").val(),
            Views: $("#Views").val(),
            CategoryId: $("#lstCategories").val()
        };
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:6600/addvideo",
            data: video
        })
        alert("Video added successfully....");
        LoadPage('admin-dashboard.html');
        LoadVideos();
    })
    var id;
    $(document).on("click", "#btnEdit", (e) => {
        LoadPage('admin-edit-video.html')
        LoadCategories();
        id = parseInt(e.target.name);
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:6600/getvideo/${id}`,
            success: (video) => {
                $("#VideoId").val(video[0].VideoId);
                $("#Title").val(video[0].Title);
                $("#Url").val(video[0].Url);
                $("#Likes").val(video[0].Likes);
                $("#Views").val(video[0].Views);
                $("#lstCategories").val(video[0].CategoryId);
            }
        })
    })
    $(document).on("click", "#btnCancel", () => {
        LoadPage("admin-dashboard.html");
        LoadVideos();
    })
    $(document).on("click", "#btnUpdateVideo", () => {
        var video = {
            VideoId: $("#VideoId").val(),
            Title: $("#Title").val(),
            Url: $("#Url").val(),
            Likes: $("#Likes").val(),
            Views: $("#Views").val(),
            CategoryId: $("#lstCategories").val()
        };
        $.ajax({
            method: "put",
            url: `http://127.0.0.1:6600/updatevideo/${id}`,
            data: video
        })
        alert("Video Updated....");
        LoadPage("admin-dashboard.html");
        LoadVideos();
    })
    $(document).on("click", "#btnDelete", (e) => {
        var id = parseInt(e.target.name);
        var flag = confirm("Are your sure?\n Want to Delete?");
        if (flag == true) {
            $.ajax({
                method: "delete",
                url: `http://127.0.0.1:6600/deletevideo/${id}`,
            })
            alert("Video Deleted Successfully");
            LoadPage("admin-dashboard.html");
            LoadVideos();
        }
    })
})
