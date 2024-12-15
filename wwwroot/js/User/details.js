$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    txtUserName: "#txt-user-name",
    txtPassword: "#txt-password",
    ddlOrganization: "#ddl-organization",
    ddlDivision: "#ddl-division",
    ddlRole: "#ddl-role",
    btCreate: "#bt-create-user",
    btUpdate: "#bt-update-user",
    btDelete: "#bt-delete-user",
   

}

let Control = {
    Init: function () {
        Control.Event();

        Form.Load();
    },
    Event: function () {
        
    },

}

let Api = {
    UrlBase: $('#hdn-web-api-url').val() + "api/User/",

    GetDDLOrganization: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstOrganization",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    GetDDLDivision: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstDivision",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    GetDDLRole: function (divisionId, onSuccess, onFailed) {
        let params = {
            divisionId: divisionId,
        };

        $.ajax({
            url: Api.UrlBase + "GetMstRoleByDivisionId",
            type: "GET",
            data: params,
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    SaveNewUser: function (user, onSuccess, onFailed) {

        $.ajax({
            url: Api.UrlBase + "SaveNewUser",
            type: "POST",
            data: JSON.stringify(user),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },

    GetUserById: function (id, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetUserById/" + id,
            type: "GET",
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(jqXHR.responseText);
            }
        });
    },
    SaveUpdateUser: function (id, user, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveUpdateUser/" + id,
            type: "PUT",
            data: JSON.stringify(user),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(jqXHR.responseText);
            }
        });
    },
    SaveDeleteUser: function (id, user, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveDeleteUser/" + id,
            type: "PUT",
            data: JSON.stringify(user),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(jqXHR.responseText);
            }
        });
    },

}

let Form = {
    listUserId: null,

    Load: function () {
        Form.listUserId = GetParameterByName("id")
        if (Form.listUserId == null || Form.listUserId == "") {
            Form.User.CreateUser.Init();

        } else {
            Form.User.UpdateUser.Init();

        }
        
    },

    ShowCreateButton: function () {
        $(Selector.btCreate).show();
    },
    HideCreateButton: function () {
        $(Selector.btCreate).hide();
    },
    ShowUpdateButton: function () {
        $(Selector.btUpdate).show();
    },
    HideUpdateButton: function () {
        $(Selector.btUpdate).hide();
    },
    ShowDeleteButton: function () {
        $(Selector.btDelete).show();
    },
    HideDeleteButton: function () {
        $(Selector.btDelete).hide();
    },


    User: {
        // CREATE 
        CreateUser: {
            Init: function () {
                Form.User.CreateUser.Event();

                Form.User.CreateUser.LoadDDLOrganization();
                Form.User.CreateUser.LoadDDLDivision();
                Form.ShowCreateButton();
                Form.HideUpdateButton();
                Form.HideDeleteButton();

            },
            Event: function () {
                $(Selector.ddlDivision).on('change', function () {
                    let divisionId = $(this).val();
                    if (divisionId) {
                        Form.User.CreateUser.LoadDDLRole(divisionId);
                    }
                    else {
                        $(Selector.ddlRole).html('<option value="">-- Select Division First --</option>').trigger('change');
                    }
                });
                $(Selector.btCreate).off("click").on("click", function () {
                    Form.User.CreateUser.SaveNewUser();
                });

            },

            LoadDDLOrganization: function (onLoad) {
                Api.GetDDLOrganization(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.organization + '</option>';
                        });
                        $(Selector.ddlOrganization).html(html);
                    }
                    $(Selector.ddlOrganization).select2({ placeholder: "-- Select Organization --" });
                    $(Selector.ddlOrganization).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLDivision: function (onLoad) {
                Api.GetDDLDivision(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.division + '</option>';
                        });
                        $(Selector.ddlDivision).html(html);
                    }
                    $(Selector.ddlDivision).select2({ placeholder: "-- Select Division --" });
                    $(Selector.ddlDivision).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLRole: function (divisionId, onLoad) {
                Api.GetDDLRole(divisionId, function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.role + '</option>';
                        });
                    } else {
                        html = '<option value="">-- Select Role --</option>';
                    }
                    $(Selector.ddlRole).html(html);
                    $(Selector.ddlRole).select2({ placeholder: "-- Select Role --" });
                    $(Selector.ddlRole).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(null);
                });
            },
            SaveNewUser: function () {
                if (!Form.User.CreateUser.Validate()) {
                    return; // Stop saving if validation fails
                }

                let user = {
                    UserName: $(Selector.txtUserName).val(),
                    Password: $(Selector.txtPassword).val(),
                    OrganizationId: $(Selector.ddlOrganization).val(),
                    DivisionId: $(Selector.ddlDivision).val(),
                    RoleId: $(Selector.ddlRole).val(),
                    CreatedBy: $(Selector.hdnUserId).val(),
                }
                Api.SaveNewUser(user, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Create User Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/User';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error creating user: " + error);
                });
            },
            Validate: function () {
                let isValid = true; // Assume valid initially
                let userName = $(Selector.txtUserName).val().trim();
                let password = $(Selector.txtPassword).val();
                let organizationId = $(Selector.ddlOrganization).val();
                let divisionId = $(Selector.ddlDivision).val();
                let roleId = $(Selector.ddlRole).val();

                // Function to display error messages
                function displayError(selector, message) {
                    $(selector).addClass('is-invalid');
                    $(selector).next('.invalid-feedback').text(message);
                    $(selector).next('.select2-container').addClass('is-invalid');
                    $(selector).next('.select2-container').next('.invalid-feedback').text(message);
                    isValid = false; // Mark as invalid
                }

                function clearError(selector) {
                    $(selector).removeClass('is-invalid');
                    $(selector).next('.invalid-feedback').text('');
                    $(selector).next('.select2-container').removeClass('is-invalid');
                    $(selector).next('.select2-container').next('.invalid-feedback').text('');
                }

                // Validate User Name
                clearError(Selector.txtUserName);
                if (!userName) {
                    displayError(Selector.txtUserName, 'User Name is required.');
                }

                // Validate Password
                clearError(Selector.txtPassword);
                if (!password) {
                    displayError(Selector.txtPassword, 'Password is required.');
                }

                // Validate Organization 
                clearError(Selector.ddlOrganization)
                if (!organizationId) {
                    displayError(Selector.ddlOrganization, 'Organization is required.');
                }

                //Validate Division
                clearError(Selector.ddlDivision);
                if (!divisionId) {
                    displayError(Selector.ddlDivision, 'Division is required.');
                }

                //Validate Role
                clearError(Selector.ddlRole);
                if (!roleId) {
                    displayError(Selector.ddlRole, 'Role is required.');
                }
                return isValid; // Return true if all validations passed
            },
        },
        // UPDATE
        UpdateUser: {
            Init: function () {
                Form.User.UpdateUser.Event();

                $(Selector.txtUserName).prop('disabled', true);
                Form.HideCreateButton();
                Form.ShowUpdateButton();
                Form.ShowDeleteButton();

                Form.listUserId = GetParameterByName("id")
                Api.GetUserById(Form.listUserId, function (data) {
                    $(Selector.txtUserName).val(data.userName);
                    $(Selector.txtPassword).val(data.password);
                    $(Selector.ddlOrganization).val(data.ddlOrganization);
                    $(Selector.ddlDivision).val(data.ddlDivision);
                    $(Selector.ddlRole).val(data.ddlRole);

                    // Load DDLs ketika data sudah di load
                    Form.User.CreateUser.LoadDDLOrganization(function () {
                        $(Selector.ddlOrganization).val(data.organizationId).trigger('change');
                    });
                    Form.User.CreateUser.LoadDDLDivision(function () {
                        $(Selector.ddlDivision).val(data.divisionId).trigger('change');
                        // Load roles after the division is initially set
                        Form.User.CreateUser.LoadDDLRole(data.divisionId, function () {
                            $(Selector.ddlRole).val(data.roleId).trigger('change');
                        });
                    });
                }, function (error) {
                    // Handle error
                    alert("Error fetching user data: " + error);
                });
            },
            Event: function () {
                $(Selector.ddlDivision).on('change', function () {
                    let divisionId = $(this).val();
                    if (divisionId) {
                        Form.User.CreateUser.LoadDDLRole(divisionId);
                    }
                });
                $(Selector.btUpdate).off("click").on("click", function () {
                    Form.User.UpdateUser.SaveUpdateUser();
                });
                $(Selector.btDelete).off("click").on("click", function () {

                    Form.User.UpdateUser.SaveDeleteUser();
                });
            },

            SaveUpdateUser: function () {
                Form.listUserId = GetParameterByName("id")
                let user = {
                    UserName: $(Selector.txtUserName).val(),
                    Password: $(Selector.txtPassword).val(),
                    OrganizationId: $(Selector.ddlOrganization).val(),
                    DivisionId: $(Selector.ddlDivision).val(),
                    RoleId: $(Selector.ddlRole).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };
                
                Api.SaveUpdateUser(Form.listUserId, user, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Update User Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/User';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error updating user: " + error);
                });
            },
            SaveDeleteUser: function () {
                Form.listUserId = GetParameterByName("id")
                let user = {
                    UserName: $(Selector.txtUserName).val(),
                    Password: $(Selector.txtPassword).val(),
                    OrganizationId: $(Selector.ddlOrganization).val(),
                    DivisionId: $(Selector.ddlDivision).val(),
                    RoleId: $(Selector.ddlRole).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                Api.SaveDeleteUser(Form.listUserId, user, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Delete User Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/User';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error deleting user: " + error);
                });
            },
        },
    },

}

function GetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}