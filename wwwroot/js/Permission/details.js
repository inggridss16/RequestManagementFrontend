$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    ddlRole: "#ddl-role",
    ddlMenu: "#ddl-menu",
    ddlCreate: "#ddl-create",
    ddlRead: "#ddl-read",
    ddlUpdate: "#ddl-update",
    ddlDelete: "#ddl-delete",
    btCreate: "#bt-create-permission",
    btUpdate: "#bt-update-permission",
   

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
    UrlBase: $('#hdn-web-api-url').val() + "api/Permission/",

   
    GetDDLRole: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetMstRole",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    GetDDLMenu: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetMstMenu",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    SaveNewPermission: function (permission, onSuccess, onFailed) {

        $.ajax({
            url: Api.UrlBase + "SaveNewPermission",
            type: "POST",
            data: JSON.stringify(permission),
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

    GetPermissionById: function (id, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetPermissionById/" + id,
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
    SaveUpdatePermission: function (id, permission, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveUpdatePermission/" + id,
            type: "PUT",
            data: JSON.stringify(permission),
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
    permissionId: null,

    Load: function () {
        Form.permissionId = GetParameterByName("id")
        if (Form.permissionId == null || Form.permissionId == "") {
            Form.Permission.CreatePermission.Init();

        } else {
            Form.Permission.UpdatePermission.Init();

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


    Permission: {
        // CREATE 
        CreatePermission: {
            Init: function () {
                Form.Permission.CreatePermission.Event();

                Form.Permission.CreatePermission.LoadDDLRole();
                Form.Permission.CreatePermission.LoadDDLMenu();
                Form.ShowCreateButton();
                Form.HideUpdateButton();

            },
            Event: function () {
                $(Selector.btCreate).off("click").on("click", function () {
                    Form.Permission.CreatePermission.SaveNewPermission();
                });

            },

            LoadDDLRole: function (onLoad) {
                Api.GetDDLRole(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.role + '</option>';
                        });
                        $(Selector.ddlRole).html(html);
                    }
                    $(Selector.ddlRole).select2({ placeholder: "-- Select Role --" });
                    $(Selector.ddlRole).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLMenu: function (onLoad) {
                Api.GetDDLMenu(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.menu + '</option>';
                        });
                        $(Selector.ddlMenu).html(html);
                    }
                    $(Selector.ddlMenu).select2({ placeholder: "-- Select Menu --" });
                    $(Selector.ddlMenu).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },

            SaveNewPermission: function () {
                if (!Form.Permission.CreatePermission.Validate()) {
                    return; // Stop saving if validation fails
                }

                let permission = {
                    RoleId: $(Selector.ddlRole).val(),
                    MenuId: $(Selector.ddlMenu).val(),
                    IsCreate: $(Selector.ddlCreate).val() == 1 ? true : false,
                    IsRead: $(Selector.ddlRead).val() == 1 ? true : false,
                    IsUpdate: $(Selector.ddlUpdate).val() == 1 ? true : false,
                    IsDelete: $(Selector.ddlDelete).val() == 1 ? true : false,
                    CreatedBy: $(Selector.hdnUserId).val(),
                }
                Api.SaveNewPermission(permission, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Create Permission Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Permission';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error creating permission: " + error);
                });
            },
            Validate: function () {
                let isValid = true; // Assume valid initially
                let roleId = $(Selector.ddlRole).val();
                let menuId = $(Selector.ddlMenu).val();

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
                clearError(Selector.ddlRole);
                if (!roleId) {
                    displayError(Selector.ddlRole, 'Role is required.');
                }

                // Validate Password
                clearError(Selector.ddlMenu);
                if (!menuId) {
                    displayError(Selector.ddlMenu, 'Menu is required.');
                }

                return isValid; // Return true if all validations passed
            },
        },
        // UPDATE
        UpdatePermission: {
            Init: function () {
                Form.Permission.UpdatePermission.Event();

                Form.HideCreateButton();
                Form.ShowUpdateButton();
                $(Selector.ddlRole).prop('disabled', true);
                $(Selector.ddlMenu).prop('disabled', true);

                Form.permissionId = GetParameterByName("id")
                Api.GetPermissionById(Form.permissionId, function (data) {
                    $(Selector.ddlRole).val(data.roleId);
                    $(Selector.ddlMenu).val(data.menuId);
                    $(Selector.ddlCreate).val(data.isCreate == true ? "1" : "0");
                    $(Selector.ddlRead).val(data.isRead == true ? "1" : "0");
                    $(Selector.ddlUpdate).val(data.isUpdate == true ? "1" : "0");
                    $(Selector.ddlDelete).val(data.isDelete == true ? "1" : "0");

                    // Load DDLs ketika data sudah di load
                    Form.Permission.CreatePermission.LoadDDLRole(function () {
                        $(Selector.ddlRole).val(data.roleId).trigger('change');
                    });
                    Form.Permission.CreatePermission.LoadDDLMenu(function () {
                        $(Selector.ddlMenu).val(data.menuId).trigger('change');
                    });


                }, function (error) {
                    // Handle error
                    alert("Error fetching permission data: " + error);
                });
            },
            Event: function () {
                $(Selector.btUpdate).off("click").on("click", function () {
                    Form.Permission.UpdatePermission.SaveUpdatePermission();
                });
            },

            SaveUpdatePermission: function () {
                Form.permissionId = GetParameterByName("id")
                let permission = {
                    RoleId: $(Selector.ddlRole).val(),
                    MenuId: $(Selector.ddlMenu).val(),
                    IsCreate: $(Selector.ddlCreate).val() == 1 ? true : false,
                    IsRead: $(Selector.ddlRead).val() == 1 ? true : false,
                    IsUpdate: $(Selector.ddlUpdate).val() == 1 ? true : false,
                    IsDelete: $(Selector.ddlDelete).val() == 1 ? true : false,
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                Api.SaveUpdatePermission(Form.permissionId, permission, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Update Permission Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Permission';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error updating permission: " + error);
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