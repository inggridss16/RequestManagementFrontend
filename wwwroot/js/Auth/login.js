$(function () {
    Control.Init();
});

let Selector = {
    txtUserName: "#txt-username",
    txtPassword: "#txt-password",
    btLogin: "#bt-login",
    divError: "#div-error" // Add a div for error messages
}

let Control = {
    Init: function () {
        Control.Event();
    },
    Event: function () {
        $(Selector.btLogin).off("click").on("click", function () {
            const username = $(Selector.txtUserName).val();
            const password = $(Selector.txtPassword).val();

            if (username.trim() === "" || password.trim() === "") {
                $(Selector.divError).text("Username and Password are required.").show();
                return;
            }

            $(Selector.divError).text("").hide();

            Api.CheckLogin(username, password,
                function () { // Success callback
                    window.location.href = '/Request';
                },
                function (errorMessage) { // Failure callback
                    $(Selector.divError).text(errorMessage).show();
                });
        });

        $(Selector.txtUserName).on("input", function () { $(Selector.divError).text("").hide(); });
        $(Selector.txtPassword).on("input", function () { $(Selector.divError).text("").hide(); });
    },


}

let Api = {
    UrlBase: "/Auth/",

    CheckLogin: function (username, password, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "CheckLogin", 
            type: "POST",                
            data: JSON.stringify({ UserName: username, Password: password }), // Send data in the body
            contentType: "application/json" 
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            var errorMessage = "Login failed.";
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                errorMessage = jqXHR.responseJSON.message;  // Get error message from server if available.
            } else if (errorThrown) {
                errorMessage = errorThrown;
            }
            if (typeof onFailed === 'function') {
                onFailed(errorMessage);
            }
        });
    },
}