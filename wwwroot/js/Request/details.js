$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    taDescription: "#ta-description",
    mandatoryDescription: "#mandatory-description",
    ddlApplicant: "#ddl-applicant",
    ddlOwner : "#ddl-owner",
    ddlCategory : "#ddl-category",
    ddlSubCategory : "#ddl-sub-category",
    ddlStatus: "#ddl-status",
    txtReqNumber: "#txt-req-number",
    txtExpenses: "#txt-expenses",
    btCreateReq: "#bt-create-request",
    btUpdateReq: "#bt-update-request",
    btDeleteReq: "#bt-delete-request",
    btNewExpense: "#bt-new-expense",
    btApproveReq: "#bt-approve-request",
    btRejectReq: "#bt-reject-request",

    tabDetails: "#tab-details",
    tabRequestDetail: "#tab-request-detail",
    tableExpenses: "#tbl-expenses",
    tabExpensesList: "#tab-expenses-list",
    tabExpensesListLink: "#tab-expenses-list a", // Selector untuk link tab Expenses List
    expensesListTabContent: "#expenses-list" // Selector untuk konten tab Expenses List
}

let Control = {
    Init: function () {
        Control.Event();

        Form.Load();
    },
    Event: function () {
        $(Selector.tabDetails).on('click', 'a[data-toggle="tab"]', function (event) {
            event.preventDefault();
            var target = $(this).attr('href');

            // Remove active classes from all tab links and tab panes
            $(Selector.tabDetails + ' a.nav-link').removeClass('active');
            $('.tab-pane').removeClass('active show');

            // Add active classes to the new tab link and tab pane
            $(this).addClass('active');
            $(target).addClass('active show');

            // Check if the Expenses List tab is being shown
            if (target === '#expenses-list') {
                // Initialize or reload the table if it hasn't been initialized yet or if the tab is clicked again
                if (!$.fn.DataTable.isDataTable(Selector.tableExpenses)) {
                    TableExpenses.Init();
                } else {
                    TableExpenses.Reload(); // Reload data if already initialized
                }

                Form.Expense.CreateExpense.Init();
            }
        });
    },

}

let Api = {
    UrlBase: $('#hdn-web-api-url').val() + "api/Request/",

    GetDDLApplicant: function (id, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetMstUserById/" + id, 
            type: "GET"
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(errorThrown);
            }
        });
    },
    GetDDLApplicantExisting: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstUser",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(errorThrown);
        });
    },
    GetDDLCategory: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstCategoryRequestManagement",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(errorThrown);
        });
    },
    GetDDLSubCategory: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstSubCategoryRequestManagement",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(errorThrown);
        });
    },
    GetDDLStatus: function (onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "GetAllMstStatusRequestManagement",
            type: "GET",
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(errorThrown);
        });
    },
    SaveNewRequest: function (request, onSuccess, onFailed) {
        
        $.ajax({
            url: Api.UrlBase + "SaveNewRequest",
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data, datatextStatus, jqXHR) {
            if (typeof onSuccess === 'function')
                onSuccess(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function')
                onFailed(errorThrown);
        });
    },

    // UPDATE
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
                onFailed(errorThrown);
            }
        });
    },
    SaveUpdateRequest: function (id, request, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveUpdateRequest/" + id,
            type: "PUT",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(errorThrown);
            }
        });
    },
    SaveDeleteRequest: function (id, request, onSuccess, onFailed) {
        $.ajax({
            url: Api.UrlBase + "SaveDeleteRequest/" + id,
            type: "PUT",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json"
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(errorThrown);
            }
        });
    },

    GetTableExpenses: function (createdBy, idValue, page, pageSize, onSuccess, onFailed) {
        let params = {
            createdBy: createdBy,
            idRequest: idValue,
            page: page,
            pageSize: pageSize,
        };

        $.ajax({
            url: Api.UrlBase + "GetVwExpensesRequestsManagement",
            type: "GET",
            data: params,
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(errorThrown);
            }
        });
    },

}

let Form = {
    reqNumber: null,
    statusRequestExpense: null,
    Load: function () {
        let idValue = GetParameterByName("idValue");
        let userId = $(Selector.hdnUserId).val();
        let roleId = $(Selector.hdnRoleId).val();

        $(Selector.mandatoryDescription).hide(); // Hide mandatory indicator
        if (idValue == null || idValue == "") {
            Form.Request.CreateRequest.Init();
            Form.HideExpensesTab(); // Sembunyikan tab Expenses List
            Form.HideExpensesField(); //Hide Expenses Field
            Form.ShowCreateButton();
            Form.HideUpdateButton();
            Form.HideDeleteButton();
            // Fetch and set applicant name
            Api.GetDDLApplicant(userId, function (data) {
                if (data && data.userName) { // Assuming the API returns an object with applicantName property
                    $(Selector.ddlApplicant).append($('<option>', {
                        value: userId,
                        text: data.userName
                    }));
                    $(Selector.ddlApplicant).val(userId).trigger('change');
                    $(Selector.ddlApplicant).prop('disabled', true);
                }
            }, function (error) {
                console.error("Error fetching applicant name:", error);
                // Handle error, maybe set a default value or show an error message
                $(Selector.ddlApplicant).val(userId).trigger('change'); // Still set the value even if name fetch fails
                $(Selector.ddlApplicant).prop('disabled', true);
            });
        }
        else {
            Form.Request.UpdateRequest.Init();
            Api.GetTrxRequestsManagementById(idValue, function (data) {
                if (data) {
                    // btn update only show when status "New"
                    if (data.status != 1) {
                        Form.HideUpdateButton();
                    }

                    // Check for specific subcategories to hide Expenses tab
                    if (data.subCategory == "1" || data.subCategory === "2" || data.subCategory === "3") {
                        Form.HideExpensesTab(); // Sembunyikan tab Expenses List
                        Form.HideExpensesField(); //Hide Expenses Field
                    } else {
                        Form.ShowExpensesTab(); // Tampilkan tab Expenses List
                        Form.ShowExpensesField(); // Tampilkan Expenses Field
                    }

                    // Check if the user is a Non-division User Manager and approval is them
                    if ($(Selector.hdnRoleId).val() == 1 && data.parentRoleIdupdatedBy != 1) {
                        Form.HideApproveButton();
                        Form.HideRejectButton();
                    }

                    // Check if the user is a Non-division User and the request was not created by them
                    if ($(Selector.hdnRoleId).val() == "1" && data.createdBy != $(Selector.hdnUserId).val()) {
                        Form.DisableRequestFields();
                        Form.HideUpdateButton();
                        Form.HideDeleteButton();
                        //$(Selector.tabExpensesList).hide(); // Hide Expenses Tab
                        //$(Selector.expensesListTabContent).hide(); // Hide Expenses Tab Content
                    } else {
                        // Existing logic for other users or own requests
                        if ($(Selector.hdnRoleId).val() == 6) 
                            Form.HideDeleteButton();

                        // Sembunyikan btUpdateReq dan btDeleteReq untuk roleId 1, 3, dan 5
                        if (roleId == "1" || roleId == "3" || roleId == "5") {
                            Form.HideUpdateButton();
                            Form.HideDeleteButton();
                        }
                    }
                }
            });
            Form.HideCreateButton();
            Form.ShowUpdateButton();
            Form.ShowDeleteButton();

            // Sembunyikan btUpdateReq dan btDeleteReq untuk roleId 1, 3, dan 5
            if (roleId == "1" || roleId == "3" || roleId == "5") {
                Form.HideUpdateButton();
                Form.HideDeleteButton();
            }
        }
        // Check Role ID and hide buttons accordingly
        if (roleId == "2" || roleId == "4" || roleId == "6") {
            $(Selector.btApproveReq).hide();
            $(Selector.btRejectReq).hide();
        }

        
    },
    HideExpensesTab: function () {
        $(Selector.tabExpensesList).hide(); // Sembunyikan seluruh tab list
        $(Selector.expensesListTabContent).hide(); // Sembunyikan konten tab
        // Pastikan tab Request Detail aktif
        $(Selector.tabRequestDetail).addClass('active show');
        $('#request-detail').addClass('active show');

        // Set tab aktif ke tab Request Detail jika sebelumnya Expenses List aktif
        if ($(Selector.tabExpensesListLink).hasClass('active')) {
            $(Selector.tabExpensesListLink).removeClass('active');
            $(Selector.tabRequestDetail + " a").addClass('active');
            $(Selector.expensesListTabContent).removeClass('active show');
            $('#request-detail').addClass('active show');
        }
    },
    ShowExpensesTab: function () {
        $(Selector.tabExpensesList).show(); // Tampilkan tab list
        $(Selector.expensesListTabContent).show(); // Tampilkan konten tab
    },
    HideExpensesField: function () {
        $(Selector.txtExpenses).hide(); // Sembunyikan Expenses Field
        $(Selector.txtExpenses).closest('.form-group').hide();
    },
    ShowExpensesField: function () {
        $(Selector.txtExpenses).show(); // Tampilkan Expenses Field
        $(Selector.txtExpenses).closest('.form-group').show();
    },
    ShowCreateButton: function () {
        $(Selector.btCreateReq).show();
    },
    HideCreateButton: function () {
        $(Selector.btCreateReq).hide();
    },
    ShowUpdateButton: function () {
        $(Selector.btUpdateReq).show();
    },
    HideUpdateButton: function () {
        $(Selector.btUpdateReq).hide();
    },
    ShowDeleteButton: function () {
        $(Selector.btDeleteReq).show();
    },
    HideDeleteButton: function () {
        $(Selector.btDeleteReq).hide();
    },
    ShowApproveButton: function () {
        $(Selector.btApproveReq).show();
    },
    HideApproveButton: function () {
        $(Selector.btApproveReq).hide();
    },
    ShowRejectButton: function () {
        $(Selector.btRejectReq).show();
    },
    HideRejectButton: function () {
        $(Selector.btRejectReq).hide();
    },
    DisableRequestFields: function () {
        $(Selector.taDescription).prop('disabled', true);
        $(Selector.ddlApplicant).prop('disabled', true);
        $(Selector.ddlOwner).prop('disabled', true);
        $(Selector.ddlCategory).prop('disabled', true);
        $(Selector.ddlSubCategory).prop('disabled', true);
        $(Selector.ddlStatus).prop('disabled', true);
        $(Selector.txtExpenses).prop('disabled', true);
    },

    Request: {
        // CREATE NEW REQUEST
        CreateRequest: {
            Init: function () {
                Form.Request.CreateRequest.Event();

                Form.Request.CreateRequest.LoadDDLCategory();
                Form.Request.CreateRequest.LoadDDLSubCategory();
                Form.Request.CreateRequest.LoadDDLStatus();

                $(Selector.txtExpenses).prop('disabled', true);
                $(Selector.ddlStatus).prop('disabled', true);
                /*$(Selector.ddlCategory).prop('disabled', true);
                $(Selector.ddlSubCategory).prop('disabled', true);*/
            },
            Event: function () {
                $(Selector.btCreateReq).off("click").on("click", function () {
                    Form.Request.CreateRequest.SaveNewRequest();
                });

                // Add an event listener to the status dropdown
                $(Selector.ddlStatus).on('change', function () {
                    Form.Request.CreateRequest.ValidateDescription();
                });

                // Add an event listener to the description textarea to validate on input
                $(Selector.taDescription).on('input', function () {
                    Form.Request.CreateRequest.ValidateDescription();
                });
            },

            LoadDDLApplicant: function (onLoad) {
                let userId = $(Selector.hdnUserId).val();
                Api.GetDDLApplicant(userId, function (data) {
                    if (data && data.userName) { // Assuming the API returns an object with applicantName property
                        $(Selector.ddlApplicant).append($('<option>', {
                            value: userId,
                            text: data.userName
                        }));
                        $(Selector.ddlApplicant).val(userId).trigger('change');
                        $(Selector.ddlApplicant).prop('disabled', true);
                    }
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLCategory: function (onLoad) {
                Api.GetDDLCategory(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.categoryName + '</option>';
                        });
                        $(Selector.ddlCategory).html(html);
                    }
                    $(Selector.ddlCategory).select2({ placeholder: "-- Select Category --" });
                    $(Selector.ddlCategory).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLSubCategory: function (onLoad) {
                Api.GetDDLSubCategory(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.subCategoryName + '</option>';
                        });
                        $(Selector.ddlSubCategory).html(html);
                    }
                    $(Selector.ddlSubCategory).select2({ placeholder: "-- Select Sub Category --" });
                    $(Selector.ddlSubCategory).val(null).trigger('change');

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            LoadDDLStatus: function (onLoad) {
                Api.GetDDLStatus(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.statusName + '</option>';
                        });
                        $(Selector.ddlStatus).html(html);
                    }
                    $(Selector.ddlStatus).select2({ placeholder: "-- Select Status --" });
                    //$(Selector.ddlStatus).trigger('change');
                    $(Selector.ddlStatus).val("1").trigger('change')

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            SaveNewRequest: function () {
                if (!Form.Request.CreateRequest.ValidateDescription()) {
                    return; // Stop saving if validation fails
                }

                let request = {
                    Number: "",
                    Description: $(Selector.taDescription).val(),
                    Applicant: $(Selector.ddlApplicant).val(),
                    Owner: $(Selector.ddlOwner).val(),
                    Category: $(Selector.ddlCategory).val(),
                    SubCategory: $(Selector.ddlSubCategory).val(),
                    Status: $(Selector.ddlStatus).val(),
                    CreatedBy: $(Selector.hdnUserId).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                    //Expenses: $(Selector.txtExpenses).val(),
                }
                Api.SaveNewRequest(request, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Create Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request';
                        });
                    }, 600);
                }, function (error) {
                    alert("Error creating request: " + error);
                });
            },
            ValidateDescription: function () {
                let selectedStatus = $(Selector.ddlStatus).val(); // Get selected status value
                let description = $(Selector.taDescription).val().trim();
                let isValid = true;

                if (selectedStatus === "1" && description === "") {
                    isValid = false;
                    $(Selector.taDescription).addClass('is-invalid');
                    $(Selector.mandatoryDescription).show(); // Show mandatory indicator
                    if ($('#description-error').length === 0) {
                        $(Selector.taDescription).after('<div id="description-error" class="invalid-feedback">Description is required for New status.</div>');
                    }
                } else {
                    $(Selector.taDescription).removeClass('is-invalid');
                    //$(Selector.mandatoryDescription).hide(); // Hide mandatory indicator
                    $('#description-error').remove();
                }
                return isValid;
            },
        },

        UpdateRequest: {
            Init: function () {
                $(Selector.ddlStatus).prop('disabled', true);
                $(Selector.txtExpenses).prop('disabled', true);
                Form.Request.UpdateRequest.Event();

                let idValue = GetParameterByName("idValue");
                let roleId = $(Selector.hdnRoleId).val(); 

                if (idValue) {
                    Api.GetTrxRequestsManagementById(idValue, function (data) {
                        // Populate form fields with data
                        $(Selector.txtReqNumber).val(data.number);
                        $(Selector.taDescription).val(data.description);
                        //$(Selector.ddlApplicant).val(data.applicant).trigger('change');
                        $(Selector.ddlOwner).val(data.owner).trigger('change');
                        $(Selector.txtExpenses).val(data.expenses);

                        // Load DDLs ketika data sudah di load
                        Form.Request.UpdateRequest.LoadDDLApplicant(function () {
                            $(Selector.ddlApplicant).val(data.applicant).trigger('change');
                        });
                        Form.Request.CreateRequest.LoadDDLCategory(function () {
                            $(Selector.ddlCategory).val(data.category).trigger('change');
                        });
                        Form.Request.CreateRequest.LoadDDLSubCategory(function () {
                            $(Selector.ddlSubCategory).val(data.subCategory).trigger('change');
                            if (data.subCategory === "1" || data.subCategory === "2" || data.subCategory === "3") {
                                Form.HideExpensesTab();
                                Form.HideExpensesField();
                            } else {
                                Form.ShowExpensesTab();
                                Form.ShowExpensesField();
                            }
                            $(Selector.ddlSubCategory).on('change', function () {
                                let selectedSubCategory = $(this).val();
                                if (selectedSubCategory === "1" || selectedSubCategory === "2" || selectedSubCategory === "3") {
                                    Form.HideExpensesTab();
                                    Form.HideExpensesField();
                                } else {
                                    Form.ShowExpensesTab();
                                    Form.ShowExpensesField();
                                }
                            });
                        });
                        Form.Request.CreateRequest.LoadDDLStatus(function () {
                            $(Selector.ddlStatus).val(data.status).trigger('change');
                        });

                        Form.reqNumber = data.number;
                        Form.statusRequestExpense = data.status;

                        // Hide delete button if roleId is 6
                        if (roleId == 6) {
                            Form.HideDeleteButton();
                        } else {
                            Form.ShowDeleteButton();
                        }

                        //jika status "Approved" or "Denied" 
                        if (Form.statusRequestExpense == 4 || Form.statusRequestExpense == 6) {
                            $(Selector.btNewExpense).hide();
                            Form.HideDeleteButton();
                        }
                    }, function (error) {
                        // Handle error
                        alert("Error fetching request data: " + error);
                    });
                    
                }

            },
            Event: function () {
                $(Selector.btUpdateReq).off("click").on("click", function () {
                    Form.Request.UpdateRequest.SaveUpdateRequest();
                });
                $(Selector.btDeleteReq).off("click").on("click", function () {
                    Form.Request.UpdateRequest.SaveDeleteRequest();
                });
                $(Selector.btApproveReq).off("click").on("click", function () {
                    Form.Request.UpdateRequest.SaveApproveRequest();
                });
                $(Selector.btRejectReq).off("click").on("click", function () {
                    Form.Request.UpdateRequest.SaveRejectRequest();
                });

            },

            LoadDDLApplicant: function (onLoad) {
                Api.GetDDLApplicantExisting(function (data) {
                    let html = "";
                    if (data && data.length > 0) {
                        $.each(data, function (i, item) {
                            html += '<option value="' + item.id + '">' + item.userName + '</option>';
                        });
                        $(Selector.ddlApplicant).html(html);
                    }
                    $(Selector.ddlApplicant).select2({ placeholder: "-- Select Applicant --" });
                    $(Selector.ddlApplicant).val(null).trigger('change');
                    $(Selector.ddlApplicant).prop('disabled', true);

                    if (typeof onLoad === 'function')
                        onLoad(data);
                }, function (errorThrown) {
                    if (typeof onLoad === 'function')
                        onLoad(data);
                });
            },
            SaveUpdateRequest: function () {
                let idValue = GetParameterByName("idValue");
                let request = {
                    Number: $(Selector.txtReqNumber).val(),
                    Description: $(Selector.taDescription).val(),
                    Applicant: $(Selector.ddlApplicant).val(),
                    Owner: $(Selector.ddlOwner).val(),
                    Category: $(Selector.ddlCategory).val(),
                    SubCategory: $(Selector.ddlSubCategory).val(),
                    Status: $(Selector.ddlStatus).val(),
                    Expenses: $(Selector.txtExpenses).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                /*if (!request.Description || !request.Applicant || !request.Owner) {
                    alert("Please fill in all required fields.");
                    return;
                }*/
                Api.SaveUpdateRequest(idValue, request, function (data) {
                    setTimeout(function () {
                        //Common.Alert.Success("Update Request Success!");
                        Swal.fire({
                            title: 'Success',
                            text: 'Update Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request';
                        });
                        //Form.UpdateRequest.Init();
                        //window.location.href = 'Request'
                    }, 600);
                }, function (error) {
                    alert("Error updating request: " + error);
                });
            },
            SaveDeleteRequest: function () {
                let idValue = GetParameterByName("idValue");
                let request = {
                    Number: $(Selector.txtReqNumber).val(),
                    Description: $(Selector.taDescription).val(),
                    Applicant: $(Selector.ddlApplicant).val(),
                    Owner: $(Selector.ddlOwner).val(),
                    Category: $(Selector.ddlCategory).val(),
                    SubCategory: $(Selector.ddlSubCategory).val(),
                    Status: $(Selector.ddlStatus).val(),
                    Expenses: $(Selector.txtExpenses).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                Api.SaveDeleteRequest(idValue, request, function (data) {
                    setTimeout(function () {
                        //Common.Alert.Success("Update Request Success!");
                        Swal.fire({
                            title: 'Success',
                            text: 'Delete Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request';
                        });
                        //Form.UpdateRequest.Init();
                        //window.location.href = 'Request'
                    }, 600);
                }, function (error) {
                    alert("Error deleting request: " + error);
                });
            },

            //APPROVAL
            SaveApproveRequest: function () {
                let idValue = GetParameterByName("idValue");
                let roleId = $(Selector.hdnRoleId).val();

                let request = {
                    Number: $(Selector.txtReqNumber).val(),
                    Description: $(Selector.taDescription).val(),
                    Applicant: $(Selector.ddlApplicant).val(),
                    Owner: $(Selector.ddlOwner).val(),
                    Category: $(Selector.ddlCategory).val(),
                    SubCategory: $(Selector.ddlSubCategory).val(),
                    Status: roleId == 1 ? 4 : 2,
                    Expenses: $(Selector.txtExpenses).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                Api.SaveUpdateRequest(idValue, request, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Approve Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request';
                        });
                        
                    }, 600);
                }, function (error) {
                    alert("Error updating request: " + error);
                });
            },
            SaveRejectRequest: function () {
                let idValue = GetParameterByName("idValue");
                let request = {
                    Number: $(Selector.txtReqNumber).val(),
                    Description: $(Selector.taDescription).val(),
                    Applicant: $(Selector.ddlApplicant).val(),
                    Owner: $(Selector.ddlOwner).val(),
                    Category: $(Selector.ddlCategory).val(),
                    SubCategory: $(Selector.ddlSubCategory).val(),
                    Status: 6, //Denied
                    Expenses: $(Selector.txtExpenses).val(),
                    UpdatedBy: $(Selector.hdnUserId).val(),
                };

                Api.SaveUpdateRequest(idValue, request, function (data) {
                    setTimeout(function () {
                        Swal.fire({
                            title: 'Success',
                            text: 'Reject Request Success!',
                            icon: 'success'
                        }).then(function () {
                            window.location.href = '/Request';
                        });
                        
                    }, 600);
                }, function (error) {
                    alert("Error updating request: " + error);
                });
            },

        },
    },

    Expense: {

        CreateExpense: {
            Init: function () {
                Form.Expense.CreateExpense.Event();
                let roleId = $(Selector.hdnRoleId).val();

                if (roleId == "1" || roleId == "3" || roleId == "5") {
                    $(Selector.btNewExpense).hide();
                } else {
                    let idValue = GetParameterByName("idValue");
                    // Check if user is Non-division User and disable button if necessary
                    Api.GetTrxRequestsManagementById(idValue, function (data) {
                        if (roleId == "1" && data.createdBy != $(Selector.hdnUserId).val()) {
                            $(Selector.btNewExpense).hide(); // Hide the button instead of disabling
                        }
                    });
                }
            },
            Event: function () {
                $(Selector.btNewExpense).off("click").on("click", function () {
                    let idValue = GetParameterByName("idValue");
                    window.location.href = 'Expense?idRequest=' + idValue + '&reqNumber=' + Form.reqNumber
                })
            },

        },


    },
    
}

let TableExpenses = {
    Table: {},

    Init: function () {
        let roleId = $(Selector.hdnRoleId).val();

        TableExpenses.Table = $(Selector.tableExpenses).DataTable({
            "processing": true,
            "serverSide": true,
            "language": {
                "emptyTable": "No data available in table",
            },
            "ajax": function (data, callback, settings) {
                let createdBy = $(Selector.hdnUserId).val();
                let idValue = GetParameterByName("idValue");
                let page = data.start / data.length + 1; // Calculate page number
                let pageSize = data.length;

                Api.GetTableExpenses(
                    // nilai param dari field
                    createdBy,
                    idValue,
                    page,
                    pageSize,
                    function (response) { // Use 'response' to be consistent
                        // Check for errors from the API 
                        if (response) {
                            callback({
                                draw: data.draw,
                                recordsTotal: response.totalCount, // Use TotalCount from API
                                recordsFiltered: response.totalCount, // Total count also for filtered (server-side)
                                data: response.data // Data array from API
                            });
                        } else {
                            // Handle errors, e.g., show an error message
                            console.error("API error:", response);
                        }
                    })
            },
            "filter": false,
            "order": [[1, 'asc']],
            "destroy": true,
            "scrollX": true,
            "autoWidth": false,
            "columns": [
                {
                    data: "reqNumber",
                    width: "20%",
                    render: function (data, type, row) {
                        if (roleId == "1" || roleId == "3" || roleId == "5") {
                            return data; // Tampilkan data saja, tanpa tautan
                        } else if (Form.statusRequestExpense == 4 || Form.statusRequestExpense == 6) {
                            return data; // Tampilkan data saja, tanpa tautan
                        }
                        else {
                            return '<a href="Expense?idExpense=' + row.id + '">' + data + '</a>';
                        }
                    }
                },
                { data: "amount", width: "20%" },
                { data: "typeName", width: "20%" },
                { data: "comment", width: "20%" },
                {
                    data: "imported",
                    width: "20%",
                    render: function (data, type, row) {
                        return data ? "Yes" : "No";
                    }
                },
            ],
        });

        TableExpenses.Event();
    },
    Reload: function () {
        TableExpenses.Table.ajax.reload(null, false);
    },
    Export: function () {

    },
    Event: function () {

    }
}

function GetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}