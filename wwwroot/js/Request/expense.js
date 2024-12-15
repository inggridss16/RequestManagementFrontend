$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    txtReqId: "#txt-request-id",
    txtReqNumber: "#txt-request-number",
    txtAmount: "#txt-amount",
    ddlType: "#ddl-type",
    taComment: "#ta-comment",
    ddlImported: "#ddl-imported",
    btCreateExpense: "#bt-create-expense",
    btUpdateExpense: "#bt-update-expense",
    btDeleteExpense: "#bt-delete-expense",
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
    UrlBase: $('#hdn-web-api-url').val() + "api/Request/",

    GetDDLType: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstTypeRequestManagement",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(jqXHR.responseText);
        });
    },
    SaveNewExpense: function (expense, onSuccess, onFailed) {

        $.ajax({
            url: Api.UrlBase + "SaveNewExpense",
            type: "POST",
            data: JSON.stringify(expense),
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

    // UPDATE
    GetTrxExpensesRequestsManagementById: function (id, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetTrxExpensesRequestsManagementById/" + id,
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
    GetTrxRequestsManagementById: function (id, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetTrxRequestsManagementById/" + id,
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
    SaveUpdateExpense: function (id, expense, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveUpdateExpense/" + id,
            type: "PUT",
            data: JSON.stringify(expense),
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

    SaveDeleteExpense: function (id, expense, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveDeleteExpense/" + id,
            type: "PUT",
            data: JSON.stringify(expense),
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
    idRequest: null,
    reqNumber: null,
    idExpense: null,
    Load: function () {
        Form.idRequest = GetParameterByName("idRequest");
        Form.reqNumber = GetParameterByName("reqNumber");
        Form.idExpense = GetParameterByName("idExpense");
        if (Form.idExpense == null || Form.idExpense == "") {
            Form.Expense.CreateExpense.Init();
            Form.ShowCreateButton();
            Form.HideUpdateButton();
            Form.HideDeleteButton();
        }
        else {
            Form.Expense.UpdateExpense.Init();
            Form.HideCreateButton();
            Form.ShowUpdateButton();
            if ($(Selector.hdnRoleId).val() != "6") {
                Form.ShowDeleteButton();
            } else {
                Form.HideDeleteButton();
            }
        }
    },

    ShowCreateButton: function () {
        $(Selector.btCreateExpense).show();
    },
    HideCreateButton: function () {
        $(Selector.btCreateExpense).hide();
    },
    ShowUpdateButton: function () {
        $(Selector.btUpdateExpense).show();
    },
    HideUpdateButton: function () {
        $(Selector.btUpdateExpense).hide();
    },
    ShowDeleteButton: function () {
        $(Selector.btDeleteExpense).show();
    },
    HideDeleteButton: function () {
        $(Selector.btDeleteExpense).hide();
    },

    Expense: {

        CreateExpense: {
            Init: function () {
                Form.Expense.CreateExpense.Event();

                Form.Expense.CreateExpense.SetReqNumber();
                Form.Expense.CreateExpense.LoadDDLType();
            },
            Event: function () {
                $(Selector.btCreateExpense).off("click").on("click", function () {
                    Form.Expense.CreateExpense.SaveNewExpense();
                })
            },

            SetReqNumber: function () {
                $(Selector.txtReqId).val(Form.idRequest);
                $(Selector.txtReqNumber).val(Form.reqNumber);
                $(Selector.txtReqNumber).prop('disabled', true);
                //$(Selector.ddlType).prop('disabled', true);
            },
            LoadDDLType: function (onLoad) {
                Api.GetDDLType(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.typeName + '</option>';
                        });
                        $(Selector.ddlType).html(html);
                    }
                    $(Selector.ddlType).select2({ placeholder: "-- Select Type --" });
                    $(Selector.ddlType).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            SaveNewExpense: function () {
                let expense = {
                    RequestId: Form.idRequest,
                    Amount: $(Selector.txtAmount).val(),
                    Type: $(Selector.ddlType).val(),
                    Comment: $(Selector.taComment).val(),
                    Imported: $(Selector.ddlImported).val() == "True" ? true : false,
                    CreatedBy: $(Selector.hdnUserId).val(),
                }
                Api.SaveNewExpense(expense, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Create Expense Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request/Details?idValue=' + data.requestId;
                        });
                    }, 600);
                }, function (error) {
                    alert("Error creating expense: " + error);
                });
            },
        },

        UpdateExpense: {
            Init: function () {
                Form.Expense.UpdateExpense.Event();

                Form.Expense.UpdateExpense.GetTrxExpensesRequestsManagementById();
                
            },
            Event: function () {
                $(Selector.btUpdateExpense).off("click").on("click", function () {
                    Form.Expense.UpdateExpense.SaveUpdateExpense();
                });
                $(Selector.btDeleteExpense).off("click").on("click", function () {
                    Form.Expense.UpdateExpense.SaveDeleteExpense();
                });

            },

            GetTrxExpensesRequestsManagementById: function () {
                Api.GetTrxExpensesRequestsManagementById(Form.idExpense, function (data) {
                    Api.GetTrxRequestsManagementById(data.requestId, function (data) {
                        $(Selector.txtReqNumber).val(data.number);
                        $(Selector.txtReqNumber).prop('disabled', true);
                    })

                    let typeConvert = data.imported == "1" ? "True" : "False"

                    $(Selector.txtAmount).val(data.amount);
                    $(Selector.taComment).val(data.comment);
                    $(Selector.ddlImported).val(typeConvert).trigger('change');

                    // Load DDLs ketika data sudah di load
                    Form.Expense.CreateExpense.LoadDDLType(function () {
                        $(Selector.ddlType).val(data.type).trigger('change');
                    });
                }, function (error) {
                    // Handle error
                    alert("Error fetching expense data: " + error);
                });
            },
            SaveUpdateExpense: function () {

                let expense = {
                    Amount: $(Selector.txtAmount).val(),
                    Comment: $(Selector.taComment).val(),
                    Imported: $(Selector.ddlImported).val() == "True" ? true : false,
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };
                Api.SaveUpdateExpense(Form.idExpense, expense, function (data) {
                    setTimeout(function () {
                        //Common.Alert.Success("Update Request Success!");
                        Swal.fire({
                            title: 'Success',
                            text: 'Update Expense Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request/Details?idValue=' + data.requestId;
                        });
                    }, 600);
                }, function (error) {
                    alert("Error updating expense: " + error);
                });
            },
            SaveDeleteExpense: function () {
                let expense = {
                    Amount: $(Selector.txtAmount).val(),
                    Comment: $(Selector.taComment).val(),
                    Imported: $(Selector.ddlImported).val() == "True" ? true : false,
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };
                Api.SaveDeleteExpense(Form.idExpense, expense, function (data) {
                    setTimeout(function () {
                        //Common.Alert.Success("Update Request Success!");
                        Swal.fire({
                            title: 'Success',
                            text: 'Delete Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request/Details?idValue=' + data.requestId;
                        });
                        //Form.UpdateRequest.Init();
                        //window.location.href = 'Request'
                    }, 600);
                }, function (error) {
                    alert("Error deleting request: " + error);
                });
            },
            DisableExpenseFields: function () {
                $(Selector.txtAmount).prop('disabled', true);
                $(Selector.ddlType).prop('disabled', true);
                $(Selector.taComment).prop('disabled', true);
                $(Selector.ddlImported).prop('disabled', true);
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