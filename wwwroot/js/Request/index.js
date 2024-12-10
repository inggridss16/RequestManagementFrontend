$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    tblRequestsTable: "#tbl-requests-table",
    btNewReq: "#bt-new-request",
    btExport: "#bt-export",
}

let Control = {
    Init: function () {
        Control.Event();
        TableRequestsTable.Init();
    },
    Event: function () {
        // Enable export button and hide New Request for Non-division Manager
        if ($(Selector.hdnRoleId).val() == 1) {
            Control.HideNewRequestButton();
            Control.ShowExportButton();
        }
        // Hide New Request & Export button for Sales Manager & Support Manager
        else if ($(Selector.hdnRoleId).val() == 3 || $(Selector.hdnRoleId).val() == 5){
            Control.HideNewRequestButton();
            Control.HideExportButton();
        }
        // for all user
        else {
            Control.ShowNewRequestButton();
            Control.HideExportButton();
        }

        $(Selector.btNewReq).off("click").on("click", function () {
            window.location.href = 'Request/Details'
        });

    },

    ShowExportButton: function () {
        $(Selector.btExport).show();
    },
    HideExportButton: function () {
        $(Selector.btExport).hide();
    },
    ShowNewRequestButton: function () {
        $(Selector.btNewReq).show();
    },
    HideNewRequestButton: function () {
        $(Selector.btNewReq).hide();
    }
}

let Api = {
    UrlBase: $('#hdn-web-api-url').val() + "api/Request/",

    TableTrxRequests: function (createdBy, divisionId, roleId, page, pageSize, onSuccess, onFailed) {
        let params = {
            createdBy: createdBy,
            divisionId: divisionId,
            roleId: roleId, 
            page: page,
            pageSize: pageSize,
        };

        $.ajax({
            url: Api.UrlBase + "GetVwRequestsManagement",
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

let TableRequestsTable = {
    Table: {},

    Init: function () {
        TableRequestsTable.Table = $(Selector.tblRequestsTable).DataTable({
            "processing": true,
            "serverSide": true,
            "language": {
                "emptyTable": "No data available in table",
            },
            "ajax": function (data, callback, settings) {
                let createdBy = $(Selector.hdnUserId).val();
                let divisionId = $(Selector.hdnDivisionId).val();
                let roleId = $(Selector.hdnRoleId).val(); 
                let page = data.start / data.length + 1;
                let pageSize = data.length;

                Api.TableTrxRequests(
                    createdBy,
                    divisionId,
                    roleId, 
                    page,
                    pageSize,
                    function (response) {
                        if (response) {
                            callback({
                                draw: data.draw,
                                recordsTotal: response.totalCount,
                                recordsFiltered: response.totalCount,
                                data: response.data
                            });
                        } else {
                            console.error("API error:", response);
                        }
                    }
                );
            },
            "filter": false,
            "ordering": false,
            //"order": [[3, 'asc']],
            "destroy": true,
            "scrollX": true,
            "autoWidth": false,
            "columns": [
                {
                    data: "number",
                    width: "5%",
                    render: function (data, type, row) {
                        return '<a href="Request/Details?idValue=' + row.id + '">' + data + '</a>';
                    }
                },
                { data: "description", width: "15%" },
                { data: "userName", width: "5%" },
                { data: "owner", width: "5%" },
                { data: "categoryName", width: "15%" },
                { data: "subCategoryName", width: "10%" },
                { data: "statusName", width: "8%" },
                { data: "expenses", width: "8%" },
                {
                    data: "createdByUser",
                    width: "10%"
                },
                {
                    data: "createdDate",
                    width: "12%",
                    render: function (data, type, row) {
                        if (type === 'display' && data) {
                            return moment(data).format('D MMM YYYY'); // "20 Dec 2024" format
                        }
                        return data;
                    }
                },
            ],
        });

        TableRequestsTable.Event();
    },
    Reload: function () {
        TableRequestsTable.Table.ajax.reload(null, false);
    },
    Export: function () {
        window.location.href = Api.UrlBase + "ExportRequestsToExcel";
    },
    Event: function () {
        $(Selector.btExport).off("click").on("click", function () {
            TableRequestsTable.Export();
        });
    }
}